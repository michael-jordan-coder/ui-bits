import { useEffect, useMemo, useRef, useState } from 'react';
import './CubeShowcase.css';

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
    ...(accentColor ? { '--cube-showcase-accent': accentColor } : null),
    ...style
  };

  return (
    <section
      ref={sectionRef}
      className={`cube-showcase${dragging ? ' is-dragging' : ''}${className ? ` ${className}` : ''}`}
      style={rootStyle}
      role="group"
      aria-roledescription="3D cube carousel"
      aria-label={current ? `Showing ${current.title}` : 'Cube showcase'}
      tabIndex={0}
    >
      <div className="cube-showcase-vignette" aria-hidden />

      <div className="cube-showcase-stage">
        <div className="cube-showcase-perspective" style={{ perspective: `${size * 4}px` }}>
          <div
            className="cube-showcase-cube"
            ref={cubeRef}
            style={{ width: `${size}px`, height: `${size}px` }}
          >
            {visibleFaces.map((face, i) => {
              const slot = FACE_SLOTS[i];
              const isActive = i === active;
              return (
                <div
                  className={`cube-showcase-face${isActive ? ' is-active' : ''}`}
                  key={face.id}
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    transform: `rotateX(${slot.rotX}deg) rotateY(${slot.rotY}deg) translateZ(${half}px)`,
                    ...(face.color ? { '--cube-showcase-face-color': face.color } : null)
                  }}
                >
                  <div className={`cube-showcase-panel${face.image ? '' : ' is-flat'}`}>
                    {face.image && <img src={face.image} alt={face.title || ''} loading="eager" draggable={false} />}
                    <div className="cube-showcase-panel-scrim" aria-hidden />
                    <div className="cube-showcase-panel-body">
                      <span className="cube-showcase-panel-index" aria-hidden>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="cube-showcase-panel-title">{face.title}</span>
                      {face.meta && <span className="cube-showcase-panel-meta">{face.meta}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="cube-showcase-hud">
        <div className="cube-showcase-hud-left" aria-live="polite">
          {current && (
            <div className="cube-showcase-hud-meta" key={current.id}>
              <h2 className="cube-showcase-hud-title">{current.title}</h2>
              {current.meta && <span className="cube-showcase-hud-sub">{current.meta}</span>}
            </div>
          )}
        </div>
        <div className="cube-showcase-hud-right">
          {showCounter && <div className="cube-showcase-counter">{counterLabel}</div>}
          {showHint && hint && <div className="cube-showcase-hint">{hint}</div>}
        </div>
      </div>
    </section>
  );
}
