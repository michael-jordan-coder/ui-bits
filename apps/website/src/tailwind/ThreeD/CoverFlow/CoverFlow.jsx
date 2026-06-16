import { useEffect, useRef, useState } from 'react';

const DEFAULT_ROTATION = 55;
const DEFAULT_SPACING = 120;
const DEFAULT_DEPTH = 180;
const DEFAULT_IDLE_SPEED = 0;
const DEFAULT_DRAG_SENSITIVITY = 0.012;
const DEFAULT_EASE = 0.12;
const SIDE_VISIBLE = 4;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

function coverTransform(d, rotation, spacing, depth) {
  const lean = clamp(d, -1, 1);
  const dist = Math.abs(d);
  const x = d * spacing - lean * spacing * 0.35;
  const z = -Math.min(dist, SIDE_VISIBLE) * depth;
  const ry = -lean * rotation;
  const scale = Math.max(0.62, 1 - Math.min(dist, SIDE_VISIBLE) * 0.08);
  return `translate3d(${x.toFixed(2)}px, 0, ${z.toFixed(2)}px) rotateY(${ry.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
}

function coverOpacity(d) {
  const dist = Math.abs(d);
  if (dist <= 1) return 1;
  return Math.max(0.12, 1 - (dist - 1) * 0.26);
}

const STYLE_BLOCK = `
.cf-caption-in { animation: cf-caption-in 0.45s cubic-bezier(0.2, 0.7, 0.3, 1); }
@keyframes cf-caption-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}
.cf-card { box-shadow: 0 24px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(244, 241, 234, 0.06); transition: box-shadow 0.4s ease; }
.cf-cover.is-active .cf-card {
  box-shadow:
    0 34px 70px -10px rgba(0, 0, 0, 0.78),
    0 0 0 1px color-mix(in srgb, var(--cf-accent, #ff4d2e) 42%, transparent),
    0 0 60px -12px color-mix(in srgb, var(--cf-accent, #ff4d2e) 50%, transparent);
}
.cf-reflection {
  -webkit-mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.85) 0%, transparent 78%);
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0.85) 0%, transparent 78%);
}
@media (prefers-reduced-motion: reduce) {
  .cf-caption-in { animation: none; }
}
`;

export default function CoverFlow({
  items = [],
  rotation = DEFAULT_ROTATION,
  spacing = DEFAULT_SPACING,
  depth = DEFAULT_DEPTH,
  idleSpeed = DEFAULT_IDLE_SPEED,
  dragSensitivity = DEFAULT_DRAG_SENSITIVITY,
  ease = DEFAULT_EASE,
  showReflection = true,
  showCaption = true,
  showHint = true,
  hint = 'Drag or ←/→',
  accentColor,
  height = 560,
  className = '',
  style
}) {
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);

  const sectionRef = useRef(null);
  const coverRefs = useRef([]);

  const offsetRef = useRef(0);
  const targetRef = useRef(0);
  const draggingRef = useRef(false);
  const movedRef = useRef(false);
  const lastXRef = useRef(0);
  const activeRef = useRef(0);
  const inViewRef = useRef(false);
  const idleDirRef = useRef(1);

  const N = items.length;
  const maxIndex = Math.max(0, N - 1);

  useEffect(() => {
    if (N === 0) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let lastT = performance.now();

    const tick = now => {
      const dt = Math.min(64, now - lastT);
      lastT = now;
      const dtScale = dt / 16.67;

      if (!draggingRef.current && inViewRef.current && !reduced && idleSpeed > 0) {
        let next = targetRef.current + idleSpeed * idleDirRef.current * dtScale;
        if (next >= maxIndex) {
          next = maxIndex;
          idleDirRef.current = -1;
        } else if (next <= 0) {
          next = 0;
          idleDirRef.current = 1;
        }
        targetRef.current = next;
      }

      offsetRef.current += (targetRef.current - offsetRef.current) * ease;

      const offset = offsetRef.current;
      for (let i = 0; i < N; i++) {
        const el = coverRefs.current[i];
        if (!el) continue;
        const d = i - offset;
        el.style.transform = coverTransform(d, rotation, spacing, depth);
        el.style.opacity = String(coverOpacity(d));
        el.style.zIndex = String(1000 - Math.round(Math.abs(d) * 10));
      }

      const idx = clamp(Math.round(offset), 0, maxIndex);
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [N, ease, idleSpeed, rotation, spacing, depth, maxIndex]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const onDown = e => {
      draggingRef.current = true;
      movedRef.current = false;
      setDragging(true);
      lastXRef.current = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = e => {
      if (!draggingRef.current) return;
      const dx = e.clientX - lastXRef.current;
      if (Math.abs(dx) > 2) movedRef.current = true;
      lastXRef.current = e.clientX;
      targetRef.current = clamp(targetRef.current - dx * dragSensitivity * spacing * 0.05, 0, maxIndex);
    };
    const onUp = e => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setDragging(false);
      targetRef.current = clamp(Math.round(targetRef.current), 0, maxIndex);
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
    };
    const onKey = e => {
      if (!inViewRef.current) return;
      if (e.key === 'ArrowLeft') targetRef.current = clamp(Math.round(targetRef.current) - 1, 0, maxIndex);
      if (e.key === 'ArrowRight') targetRef.current = clamp(Math.round(targetRef.current) + 1, 0, maxIndex);
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    window.addEventListener('keydown', onKey);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      window.removeEventListener('keydown', onKey);
    };
  }, [dragSensitivity, spacing, maxIndex]);

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

  const onCoverClick = i => {
    if (movedRef.current) return;
    targetRef.current = clamp(i, 0, maxIndex);
  };

  const current = items[active];
  const counterLabel =
    N > 0 ? `${String(active + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}` : '00 / 00';

  const rootStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
    background: 'radial-gradient(120% 90% at 50% 35%, #14101a 0%, #08080c 60%, #040406 100%)',
    ...(accentColor ? { '--cf-accent': accentColor } : null),
    ...style
  };

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden isolate select-none touch-none outline-none text-[#f4f1ea] ${className}`}
      style={rootStyle}
      role="listbox"
      aria-label="Cover flow"
      aria-activedescendant={current ? `cover-flow-item-${current.id}` : undefined}
      tabIndex={0}
    >
      <style>{STYLE_BLOCK}</style>

      <div
        className="pointer-events-none absolute inset-0 z-[11]"
        style={{
          background:
            'radial-gradient(80% 70% at 50% 46%, transparent 0%, transparent 38%, rgba(4,4,6,0.6) 82%, rgba(4,4,6,0.92) 100%), linear-gradient(180deg, rgba(4,4,6,0.45) 0%, transparent 20%, transparent 70%, rgba(4,4,6,0.75) 100%)'
        }}
        aria-hidden
      />

      <div
        className={`absolute inset-0 z-[5] ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ perspective: '1200px', perspectiveOrigin: '50% 46%' }}
      >
        <div className="absolute top-[46%] left-1/2 w-0 h-0" style={{ transformStyle: 'preserve-3d' }}>
          {items.map((item, i) => (
            <div
              id={`cover-flow-item-${item.id}`}
              role="option"
              aria-selected={i === active}
              aria-label={item.title}
              key={item.id}
              ref={el => {
                coverRefs.current[i] = el;
              }}
              className={`cf-cover absolute top-0 left-0 w-[220px] h-[300px] -ml-[110px] -mt-[150px] cursor-pointer max-[45rem]:w-[168px] max-[45rem]:h-[228px] max-[45rem]:-ml-[84px] max-[45rem]:-mt-[114px] ${i === active ? 'is-active' : ''}`}
              style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity' }}
              onClick={() => onCoverClick(i)}
            >
              <div
                className="cf-card relative w-full h-full overflow-hidden bg-[#1b1722]"
                style={{ borderRadius: '3px', backfaceVisibility: 'hidden' }}
              >
                <img
                  src={item.image}
                  alt={item.title || ''}
                  loading="eager"
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
              {showReflection && (
                <div
                  className="cf-reflection absolute top-full left-0 w-full h-[55%] mt-[3px] overflow-hidden pointer-events-none opacity-[0.32]"
                  style={{
                    borderRadius: '3px',
                    transform: 'scaleY(-1)',
                    transformOrigin: 'top',
                    backfaceVisibility: 'hidden'
                  }}
                  aria-hidden
                >
                  <img
                    src={item.image}
                    alt=""
                    loading="eager"
                    draggable={false}
                    className="w-full h-[182%] object-cover pointer-events-none"
                    style={{ objectPosition: 'top' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <footer className="absolute bottom-0 left-0 right-0 z-30 px-8 pt-[22px] pb-[26px] grid grid-cols-[1fr_auto] gap-8 items-end max-[45rem]:px-[18px] max-[45rem]:pb-[22px] max-[45rem]:pt-[18px] max-[45rem]:grid-cols-1 max-[45rem]:gap-3.5">
        <div className="min-w-0 max-w-[60%] max-[45rem]:max-w-full">
          {showCaption && current && (
            <div key={current.id} className="cf-caption-in flex flex-col gap-1.5" aria-live="polite">
              <h2
                className="m-0 font-semibold leading-[1.1] text-[#f4f1ea]"
                style={{ fontSize: 'clamp(20px, 2.4vw, 32px)', letterSpacing: '-0.015em' }}
              >
                {current.title}
              </h2>
              {current.meta && (
                <div className="text-xs font-medium text-[rgba(244,241,234,0.7)]">{current.meta}</div>
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-2 min-w-[140px] max-[45rem]:items-start">
          <div
            className="font-semibold leading-none tabular-nums text-[#f4f1ea] text-[44px] max-[45rem]:text-[32px]"
            style={{ letterSpacing: '-0.03em' }}
          >
            {counterLabel}
          </div>
          {showHint && hint && (
            <div className="text-[11px] font-medium text-[rgba(244,241,234,0.35)]" style={{ letterSpacing: '0.02em' }}>
              {hint}
            </div>
          )}
        </div>
      </footer>
    </section>
  );
}
