import { useEffect, useMemo, useRef, useState } from 'react';
import './PosterHelix.css';

const DEFAULT_RADIUS = 360;
const DEFAULT_Y_STEP = 56;
const DEFAULT_TURN_DEG = 50;
const DEFAULT_IDLE_SPEED = 0.05;
const DEFAULT_DRAG_SENSITIVITY = 0.18;
const DEFAULT_EASE = 0.085;

export default function PosterHelix({
  posters = [],
  radius = DEFAULT_RADIUS,
  yStep = DEFAULT_Y_STEP,
  turnDeg = DEFAULT_TURN_DEG,
  idleSpeed = DEFAULT_IDLE_SPEED,
  dragSensitivity = DEFAULT_DRAG_SENSITIVITY,
  ease = DEFAULT_EASE,
  showGrain = true,
  showVignette = true,
  showAxis = true,
  showCounter = true,
  showHint = true,
  hint = 'Drag to twist · ←/→',
  accentColor,
  height = 600,
  className = '',
  style
}) {
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);

  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  const angleRef = useRef(0);
  const targetRef = useRef(0);
  const draggingRef = useRef(false);
  const lastXRef = useRef(0);
  const activeRef = useRef(0);
  const inViewRef = useRef(false);

  const N = posters.length;
  const helixHeight = (N - 1) * yStep;
  const yMid = helixHeight / 2;

  const findActive = useMemo(
    () => currentDeg => {
      const norm = ((currentDeg % 360) + 360) % 360;
      let bestI = 0;
      let bestDiff = Infinity;
      for (let i = 0; i < N; i++) {
        const posterAngle = (((i * turnDeg) % 360) + 360) % 360;
        const world = (posterAngle + norm) % 360;
        const diff = Math.min(world, 360 - world);
        if (diff < bestDiff) {
          bestDiff = diff;
          bestI = i;
        }
      }
      return bestI;
    },
    [N, turnDeg]
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
        targetRef.current += idleSpeed * dtScale;
      }

      angleRef.current += (targetRef.current - angleRef.current) * ease;

      if (trackRef.current) {
        trackRef.current.style.transform = `translate(-50%, -50%) rotateY(${angleRef.current.toFixed(3)}deg)`;
      }

      const idx = findActive(angleRef.current);
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [N, ease, idleSpeed, findActive]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const onDown = e => {
      draggingRef.current = true;
      setDragging(true);
      lastXRef.current = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = e => {
      if (!draggingRef.current) return;
      const dx = e.clientX - lastXRef.current;
      lastXRef.current = e.clientX;
      targetRef.current += dx * dragSensitivity;
    };
    const onUp = e => {
      draggingRef.current = false;
      setDragging(false);
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
      }
    };
    const onKey = e => {
      if (!inViewRef.current) return;
      if (e.key === 'ArrowLeft') targetRef.current -= turnDeg;
      if (e.key === 'ArrowRight') targetRef.current += turnDeg;
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
  }, [dragSensitivity, turnDeg]);

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

  const current = posters[active];
  const counterLabel = N > 0 ? `${String(active + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}` : '00 / 00';

  const rootStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
    ...(accentColor ? { '--phx-accent': accentColor } : null),
    ...style
  };

  return (
    <section
      ref={sectionRef}
      className={`poster-helix${dragging ? ' is-dragging' : ''}${className ? ` ${className}` : ''}`}
      style={rootStyle}
    >
      {showGrain && <div className="poster-helix-grain" aria-hidden />}
      {showVignette && <div className="poster-helix-vignette" aria-hidden />}

      {showAxis && (
        <div className="poster-helix-axis" aria-hidden>
          <span className="poster-helix-axis-tick" />
          <span className="poster-helix-axis-tick" />
          <span className="poster-helix-axis-tick" />
          <span className="poster-helix-axis-tick" />
          <span className="poster-helix-axis-tick" />
        </div>
      )}

      <div className="poster-helix-stage">
        <div className="poster-helix-perspective">
          <div className="poster-helix-track" ref={trackRef}>
            {posters.map((p, i) => {
              const angle = i * turnDeg;
              const y = i * yStep - yMid;
              const isActive = i === active;
              return (
                <div
                  className={`poster-helix-poster${isActive ? ' is-active' : ''}`}
                  key={p.id}
                  style={{
                    transform: `rotateY(${angle}deg) translateZ(${radius}px) translateY(${y.toFixed(1)}px)`
                  }}
                >
                  <div className="poster-helix-poster-frame">
                    {p.image && <img src={p.image} alt={p.title || ''} loading="eager" draggable={false} />}
                    <span className="poster-helix-poster-id" aria-hidden>
                      {String(N - i).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <footer className="poster-helix-hud">
        <div className="poster-helix-hud-left">
          {current && (
            <div className="poster-helix-hud-meta" key={current.id}>
              <h2 className="poster-helix-hud-title">{current.title}</h2>
              {current.meta && (
                <div className="poster-helix-hud-row">
                  {(Array.isArray(current.meta) ? current.meta : [current.meta]).map((item, i, arr) => (
                    <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      <span>{item}</span>
                      {i < arr.length - 1 && <i className="poster-helix-sep" aria-hidden />}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="poster-helix-hud-right">
          {showCounter && <div className="poster-helix-counter">{counterLabel}</div>}
          {showHint && hint && <div className="poster-helix-hint">{hint}</div>}
        </div>
      </footer>
    </section>
  );
}
