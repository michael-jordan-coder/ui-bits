import { useEffect, useRef, useState } from 'react';
import './CoverFlow.css';

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
    ...(accentColor ? { '--cf-accent': accentColor } : null),
    ...style
  };

  return (
    <section
      ref={sectionRef}
      className={`cover-flow${dragging ? ' is-dragging' : ''}${className ? ` ${className}` : ''}`}
      style={rootStyle}
      role="listbox"
      aria-label="Cover flow"
      aria-activedescendant={current ? `cover-flow-item-${current.id}` : undefined}
      tabIndex={0}
    >
      <div className="cover-flow-vignette" aria-hidden />

      <div className="cover-flow-stage">
        <div className="cover-flow-track">
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
              className={`cover-flow-cover${i === active ? ' is-active' : ''}`}
              onClick={() => onCoverClick(i)}
            >
              <div className="cover-flow-card">
                <img src={item.image} alt={item.title || ''} loading="eager" draggable={false} />
              </div>
              {showReflection && (
                <div className="cover-flow-reflection" aria-hidden>
                  <img src={item.image} alt="" loading="eager" draggable={false} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <footer className="cover-flow-hud">
        <div className="cover-flow-hud-left">
          {showCaption && current && (
            <div className="cover-flow-caption" key={current.id} aria-live="polite">
              <h2 className="cover-flow-title">{current.title}</h2>
              {current.meta && <div className="cover-flow-meta">{current.meta}</div>}
            </div>
          )}
        </div>
        <div className="cover-flow-hud-right">
          <div className="cover-flow-counter">{counterLabel}</div>
          {showHint && hint && <div className="cover-flow-hint">{hint}</div>}
        </div>
      </footer>
    </section>
  );
}
