import { useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_SIZE = 280;
const DEFAULT_IDLE_SPEED = 0.08;
const DEFAULT_DRAG_SENSITIVITY = 0.32;
const DEFAULT_EASE = 0.1;
const MAX_TILT = 60;

// Face slots in render order. Side faces ring the Y axis; top/bottom cap the X axis.
const FACE_SLOTS = [
  { rotX: 0, rotY: 0 },
  { rotX: 0, rotY: 90 },
  { rotX: 0, rotY: 180 },
  { rotX: 0, rotY: 270 },
  { rotX: -90, rotY: 0 },
  { rotX: 90, rotY: 0 }
];

const STYLE_BLOCK = `
.cube-tw-meta-in { animation: cube-tw-meta-in 0.45s cubic-bezier(0.2, 0.7, 0.3, 1); }
@keyframes cube-tw-meta-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}
.cube-tw-panel {
  box-shadow: 0 24px 60px -18px rgba(0, 0, 0, 0.75), inset 0 0 0 1px rgba(244, 241, 234, 0.06);
  transition: box-shadow 0.4s cubic-bezier(0.2, 0.7, 0.3, 1);
}
.cube-tw-face.is-active .cube-tw-panel {
  box-shadow:
    0 30px 70px -16px rgba(0, 0, 0, 0.8),
    inset 0 0 0 1px color-mix(in srgb, var(--cube-tw-accent, #ff4d2e) 45%, transparent),
    0 0 60px -16px color-mix(in srgb, var(--cube-tw-accent, #ff4d2e) 55%, transparent);
}
.cube-tw-root:focus-visible {
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--cube-tw-accent, #ff4d2e) 60%, transparent);
}
@media (prefers-reduced-motion: reduce) {
  .cube-tw-meta-in { animation: none; }
}
`;

function normalizeDeg(deg) {
  return ((deg % 360) + 360) % 360;
}

function shortestDelta(from, to) {
  const diff = normalizeDeg(to - from);
  return diff > 180 ? diff - 360 : diff;
}

export default function CubeShowcase({
  faces = [],
  size = DEFAULT_SIZE,
  idleSpeed = DEFAULT_IDLE_SPEED,
  dragSensitivity = DEFAULT_DRAG_SENSITIVITY,
  ease = DEFAULT_EASE,
  showTopBottom = false,
  showHint = true,
  showCounter = true,
  hint = 'Drag to spin · ←/→',
  accentColor,
  height = 520,
  className = '',
  style
}) {
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);

  const sectionRef = useRef(null);
  const cubeRef = useRef(null);

  const rotXRef = useRef(0);
  const rotYRef = useRef(0);
  const targetXRef = useRef(0);
  const targetYRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const lastYRef = useRef(0);
  const activeRef = useRef(0);
  const inViewRef = useRef(false);

  const faceCount = showTopBottom ? 6 : 4;
  const visibleFaces = useMemo(() => faces.slice(0, faceCount), [faces, faceCount]);
  const N = visibleFaces.length;
  const half = size / 2;

  // Pick the face whose orientation is closest to facing the camera.
  const findActive = useMemo(
    () => (currentX, currentY) => {
      let bestI = 0;
      let bestDiff = Infinity;
      for (let i = 0; i < N; i++) {
        const slot = FACE_SLOTS[i];
        const dx = Math.abs(shortestDelta(currentX, -slot.rotX));
        const dy = Math.abs(shortestDelta(currentY, -slot.rotY));
        const diff = dx + dy;
        if (diff < bestDiff) {
          bestDiff = diff;
          bestI = i;
        }
      }
      return bestI;
    },
    [N]
  );

  // Ease toward the slot that brings the nearest face to the front.
  const snapToNearest = useMemo(
    () => () => {
      const idx = findActive(rotXRef.current, rotYRef.current);
      const slot = FACE_SLOTS[idx];
      targetXRef.current = rotXRef.current + shortestDelta(rotXRef.current, -slot.rotX);
      targetYRef.current = rotYRef.current + shortestDelta(rotYRef.current, -slot.rotY);
    },
    [findActive]
  );

  useEffect(() => {
    if (N === 0) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let lastT = performance.now();

    const tick = now => {
      const dt = Math.min(64, now - lastT);
      lastT = now;
      const dtScale = dt / 16.67;

      if (!draggingRef.current && inViewRef.current && !reduced) {
        targetYRef.current += idleSpeed * dtScale;
      }

      rotXRef.current += (targetXRef.current - rotXRef.current) * ease;
      rotYRef.current += (targetYRef.current - rotYRef.current) * ease;

      if (cubeRef.current) {
        cubeRef.current.style.transform = `translateZ(${(-half).toFixed(2)}px) rotateX(${rotXRef.current.toFixed(3)}deg) rotateY(${rotYRef.current.toFixed(3)}deg)`;
      }

      const idx = findActive(rotXRef.current, rotYRef.current);
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [N, ease, idleSpeed, half, findActive]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const onDown = e => {
      draggingRef.current = true;
      setDragging(true);
      lastXRef.current = e.clientX;
      lastYRef.current = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = e => {
      if (!draggingRef.current) return;
      const dx = e.clientX - lastXRef.current;
      const dy = e.clientY - lastYRef.current;
      lastXRef.current = e.clientX;
      lastYRef.current = e.clientY;
      targetYRef.current += dx * dragSensitivity;
      targetXRef.current = Math.max(-MAX_TILT, Math.min(MAX_TILT, targetXRef.current - dy * dragSensitivity));
    };
    const onUp = e => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setDragging(false);
      snapToNearest();
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
    };
    const onKey = e => {
      if (!inViewRef.current) return;
      if (e.key === 'ArrowLeft') {
        targetYRef.current -= 90;
        snapToNearest();
      }
      if (e.key === 'ArrowRight') {
        targetYRef.current += 90;
        snapToNearest();
      }
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('keydown', onKey);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('keydown', onKey);
    };
  }, [dragSensitivity, snapToNearest]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting && entry.intersectionRatio > 0.25;
      },
      { threshold: [0, 0.25, 0.5, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const current = visibleFaces[active];
  const counterLabel = N > 0 ? `${String(active + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}` : '00 / 00';

  const rootStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
    background: 'radial-gradient(120% 90% at 50% 32%, #14101a 0%, #08080c 60%, #040406 100%)',
    ...(accentColor ? { '--cube-tw-accent': accentColor } : null),
    ...style
  };

  return (
    <section
      ref={sectionRef}
      className={`cube-tw-root relative w-full overflow-hidden isolate select-none touch-none outline-none text-[#f4f1ea] ${dragging ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
      style={rootStyle}
      role="group"
      aria-roledescription="3D cube carousel"
      aria-label={current ? `Showing ${current.title}` : 'Cube showcase'}
      tabIndex={0}
    >
      <style>{STYLE_BLOCK}</style>

      <div
        className="pointer-events-none absolute inset-0 z-[11]"
        style={{
          background:
            'radial-gradient(80% 60% at 50% 48%, transparent 0%, transparent 32%, rgba(4,4,6,0.6) 82%, rgba(4,4,6,0.92) 100%), linear-gradient(180deg, rgba(4,4,6,0.5) 0%, transparent 24%, transparent 74%, rgba(4,4,6,0.72) 100%)'
        }}
        aria-hidden
      />

      <div className={`absolute inset-0 z-[5] flex items-center justify-center ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}>
        <div style={{ perspective: `${size * 4}px`, perspectiveOrigin: '50% 50%' }}>
          <div
            ref={cubeRef}
            className="relative will-change-transform"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              transformStyle: 'preserve-3d',
              transform: 'translateZ(0) rotateX(0deg) rotateY(0deg)'
            }}
          >
            {visibleFaces.map((face, i) => {
              const slot = FACE_SLOTS[i];
              const isActive = i === active;
              return (
                <div
                  key={face.id}
                  className={`cube-tw-face absolute top-0 left-0 ${isActive ? 'is-active' : ''}`}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    transformStyle: 'preserve-3d',
                    backfaceVisibility: 'hidden',
                    transform: `rotateX(${slot.rotX}deg) rotateY(${slot.rotY}deg) translateZ(${half}px)`
                  }}
                >
                  <div
                    className="cube-tw-panel relative w-full h-full overflow-hidden rounded"
                    style={{ background: face.image ? '#1b1722' : face.color || '#221c2c' }}
                  >
                    {face.image && (
                      <img
                        src={face.image}
                        alt={face.title || ''}
                        loading="eager"
                        draggable={false}
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                      />
                    )}
                    <div
                      className="absolute inset-0"
                      style={{
                        background: face.image
                          ? 'linear-gradient(180deg, rgba(4,4,6,0) 38%, rgba(4,4,6,0.78) 100%)'
                          : 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.28) 100%)'
                      }}
                      aria-hidden
                    />
                    <div className="absolute inset-x-0 bottom-0 px-5 pt-[18px] pb-5 flex flex-col gap-1">
                      <span
                        className="text-[11px] font-semibold tabular-nums text-[rgba(244,241,234,0.7)]"
                        style={{ letterSpacing: '0.04em' }}
                        aria-hidden
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        className="text-[18px] font-semibold leading-[1.15] text-[#f4f1ea]"
                        style={{ letterSpacing: '-0.015em' }}
                      >
                        {face.title}
                      </span>
                      {face.meta && (
                        <span className="text-xs font-medium text-[rgba(244,241,234,0.7)]">{face.meta}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-30 px-8 pt-[22px] pb-[26px] grid grid-cols-[1fr_auto] gap-8 items-end pointer-events-none max-[720px]:px-[18px] max-[720px]:pb-[22px] max-[720px]:pt-[18px] max-[720px]:grid-cols-1 max-[720px]:gap-3.5">
        <div className="min-w-0 max-w-[60%] max-[720px]:max-w-full" aria-live="polite">
          {current && (
            <div key={current.id} className="cube-tw-meta-in flex flex-col gap-[5px]">
              <h2
                className="m-0 font-semibold leading-[1.15] text-[#f4f1ea]"
                style={{ fontSize: 'clamp(20px, 2.4vw, 30px)', letterSpacing: '-0.02em' }}
              >
                {current.title}
              </h2>
              {current.meta && (
                <span className="text-xs font-medium text-[rgba(244,241,234,0.7)]">{current.meta}</span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 min-w-[130px] max-[720px]:items-start">
          {showCounter && (
            <div
              className="font-semibold leading-none tabular-nums text-[#f4f1ea] text-[40px] max-[720px]:text-[30px]"
              style={{ letterSpacing: '-0.03em' }}
            >
              {counterLabel}
            </div>
          )}
          {showHint && hint && (
            <div className="text-[11px] font-medium text-[rgba(244,241,234,0.35)]" style={{ letterSpacing: '0.02em' }}>
              {hint}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
