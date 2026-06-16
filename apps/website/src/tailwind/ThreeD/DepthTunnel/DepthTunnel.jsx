import { useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_SPACING = 360;
const DEFAULT_PERSPECTIVE = 1400;
const DEFAULT_IDLE_SPEED = 0.16;
const DEFAULT_DRAG_SENSITIVITY = 1.1;
const DEFAULT_WHEEL_SENSITIVITY = 0.7;
const DEFAULT_EASE = 0.08;

// Smallest depth at which a panel sits in front of the camera. Panels nearer
// than this are wrapped back to the far end so the tunnel never terminates.
const NEAR = 0.5;

const STYLE_BLOCK = `
.dtl-meta-in { animation: dtl-meta-in 0.45s cubic-bezier(0.2, 0.7, 0.3, 1); }
@keyframes dtl-meta-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}
.dtl-panel.is-active .dtl-frame {
  box-shadow:
    0 36px 70px -12px rgba(0, 0, 0, 0.75),
    0 0 0 1px color-mix(in srgb, var(--dtl-accent, #ff4d2e) 45%, transparent),
    0 0 60px -8px color-mix(in srgb, var(--dtl-accent, #ff4d2e) 50%, transparent);
}
.dtl-panel.is-active { z-index: 9999 !important; }
.dtl-root:focus-visible {
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--dtl-accent, #ff4d2e) 60%, transparent);
}
@media (prefers-reduced-motion: reduce) {
  .dtl-meta-in { animation: none; }
}
`;

export default function DepthTunnel({
  items = [],
  spacing = DEFAULT_SPACING,
  perspective = DEFAULT_PERSPECTIVE,
  idleSpeed = DEFAULT_IDLE_SPEED,
  dragSensitivity = DEFAULT_DRAG_SENSITIVITY,
  wheelSensitivity = DEFAULT_WHEEL_SENSITIVITY,
  ease = DEFAULT_EASE,
  fog = true,
  showHint = true,
  showCounter = true,
  hint = 'Scroll or drag · ↑/↓',
  accentColor,
  height = 600,
  className = '',
  style
}) {
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);

  const sectionRef = useRef(null);
  const panelRefs = useRef([]);

  const progressRef = useRef(0);
  const targetRef = useRef(0);
  const draggingRef = useRef(false);
  const lastYRef = useRef(0);
  const velocityRef = useRef(0);
  const activeRef = useRef(0);
  const inViewRef = useRef(false);
  const hoverRef = useRef(false);

  const N = items.length;

  // Lateral drift winds the corridor so it reads as a path, not a flat stack.
  const layout = useMemo(
    () =>
      items.map((_, i) => ({
        x: Math.sin(i * 1.1) * 64,
        y: Math.cos(i * 0.8) * 46
      })),
    [items]
  );

  useEffect(() => {
    panelRefs.current = panelRefs.current.slice(0, N);
  }, [N]);

  useEffect(() => {
    if (N === 0) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced) {
      panelRefs.current.forEach((el, i) => {
        if (!el) return;
        paintPanel(el, NEAR + i, layout[i], spacing, fog, N);
      });
      setActive(0);
      return undefined;
    }

    let raf = 0;
    let lastT = performance.now();

    const tick = now => {
      const dt = Math.min(64, now - lastT);
      lastT = now;
      const dtScale = dt / 16.67;

      if (!draggingRef.current) {
        if (inViewRef.current) {
          targetRef.current += idleSpeed * 0.01 * dtScale;
        }
        if (Math.abs(velocityRef.current) > 0.0001) {
          targetRef.current += velocityRef.current * dtScale;
          velocityRef.current *= 0.9;
        }
      }

      progressRef.current += (targetRef.current - progressRef.current) * ease;
      const p = progressRef.current;

      let nearestIdx = 0;
      let nearestDepth = Infinity;

      for (let i = 0; i < N; i++) {
        const el = panelRefs.current[i];
        if (!el) continue;
        const depth = NEAR + (((i - p) % N) + N) % N;
        paintPanel(el, depth, layout[i], spacing, fog, N);
        if (depth < nearestDepth) {
          nearestDepth = depth;
          nearestIdx = i;
        }
      }

      if (nearestIdx !== activeRef.current) {
        activeRef.current = nearestIdx;
        setActive(nearestIdx);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [N, ease, idleSpeed, spacing, fog, layout]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    const onDown = e => {
      draggingRef.current = true;
      setDragging(true);
      lastYRef.current = e.clientY;
      velocityRef.current = 0;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = e => {
      if (!draggingRef.current) return;
      const dy = e.clientY - lastYRef.current;
      lastYRef.current = e.clientY;
      const delta = (dy / spacing) * dragSensitivity;
      targetRef.current += delta;
      velocityRef.current = delta;
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
    const onEnter = () => {
      hoverRef.current = true;
    };
    const onLeave = () => {
      hoverRef.current = false;
    };
    // Scope wheel capture to hover so the demo page can still scroll past us.
    const onWheel = e => {
      if (!hoverRef.current) return;
      e.preventDefault();
      targetRef.current += (e.deltaY / spacing) * wheelSensitivity;
    };
    const onKey = e => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        targetRef.current -= 1;
      }
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        targetRef.current += 1;
      }
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('keydown', onKey);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('keydown', onKey);
    };
  }, [dragSensitivity, wheelSensitivity, spacing]);

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

  const current = items[active];
  const counterLabel = N > 0 ? `${String(active + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}` : '00 / 00';

  const rootStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
    background: 'radial-gradient(120% 90% at 50% 42%, #14101a 0%, #08080c 58%, #040406 100%)',
    ...(accentColor ? { '--dtl-accent': accentColor } : null),
    ...style
  };

  return (
    <section
      ref={sectionRef}
      tabIndex={0}
      role="group"
      aria-roledescription="Depth tunnel"
      aria-label={current ? `Tunnel, showing ${current.title}` : 'Tunnel'}
      className={`dtl-root relative w-full overflow-hidden isolate select-none touch-none outline-none text-[#f4f1ea] ${dragging ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
      style={rootStyle}
    >
      <style>{STYLE_BLOCK}</style>

      {fog && (
        <div
          className="pointer-events-none absolute inset-0 z-[6]"
          style={{
            background: 'radial-gradient(60% 50% at 50% 46%, transparent 0%, transparent 38%, #040406 96%)'
          }}
          aria-hidden
        />
      )}
      <div
        className="pointer-events-none absolute inset-0 z-[11]"
        style={{
          background:
            'radial-gradient(85% 70% at 50% 48%, transparent 0%, transparent 36%, rgba(4,4,6,0.55) 82%, rgba(4,4,6,0.9) 100%), linear-gradient(180deg, rgba(4,4,6,0.5) 0%, transparent 20%, transparent 76%, rgba(4,4,6,0.72) 100%)'
        }}
        aria-hidden
      />

      <div
        className="absolute inset-0 z-[5]"
        style={{ perspective: `${perspective}px`, perspectiveOrigin: '50% 46%' }}
      >
        <div
          className="absolute left-1/2 w-0 h-0"
          style={{ top: '46%', transformStyle: 'preserve-3d' }}
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              ref={el => {
                panelRefs.current[i] = el;
              }}
              className={`dtl-panel absolute top-0 left-0 w-[300px] h-[200px] -ml-[150px] -mt-[100px] will-change-transform max-[720px]:w-[240px] max-[720px]:h-[160px] max-[720px]:-ml-[120px] max-[720px]:-mt-[80px] ${i === active ? 'is-active' : ''}`}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className="dtl-frame relative w-full h-full overflow-hidden bg-[#1b1722]"
                style={{
                  borderRadius: '3px',
                  boxShadow: '0 24px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(244, 241, 234, 0.06)',
                  backfaceVisibility: 'hidden'
                }}
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.title || ''}
                    loading="eager"
                    draggable={false}
                    className="w-full h-full object-cover pointer-events-none"
                  />
                )}
                <span
                  className="absolute top-2.5 left-3 text-[10px] font-medium tabular-nums text-[#f4f1ea] bg-black/50 px-1.5 py-1 rounded-full backdrop-blur-md"
                  style={{ letterSpacing: '0.05em' }}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="pointer-events-none absolute top-[46%] left-1/2 z-[9] w-[22px] h-[22px] rounded-full"
        style={{
          transform: 'translate(-50%, -50%)',
          border: '1px solid color-mix(in srgb, var(--dtl-accent, #ff4d2e) 35%, transparent)'
        }}
        aria-hidden
      >
        <span
          className="absolute inset-0 m-auto w-0.5 h-0.5 rounded-full"
          style={{ background: 'var(--dtl-accent, #ff4d2e)' }}
        />
      </div>

      <footer className="absolute bottom-0 left-0 right-0 z-30 px-8 pt-[22px] pb-[26px] grid grid-cols-[1fr_auto] gap-8 items-end max-[720px]:px-[18px] max-[720px]:pb-[22px] max-[720px]:pt-[18px] max-[720px]:grid-cols-1 max-[720px]:gap-3.5">
        <div className="min-w-0 max-w-[60%] max-[720px]:max-w-full" aria-live="polite">
          {current && (
            <div key={current.id} className="dtl-meta-in flex flex-col gap-1.5">
              <h2
                className="m-0 font-semibold leading-[1.1] text-[#f4f1ea]"
                style={{ fontSize: 'clamp(20px, 2.4vw, 32px)', letterSpacing: '-0.015em' }}
              >
                {current.title}
              </h2>
              {current.meta && (
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-[rgba(244,241,234,0.7)]">
                  {(Array.isArray(current.meta) ? current.meta : [current.meta]).map((entry, i, arr) => (
                    <span key={i} className="inline-flex items-center gap-2.5">
                      <span>{entry}</span>
                      {i < arr.length - 1 && (
                        <i className="inline-block w-1 h-1 rounded-full bg-[rgba(244,241,234,0.35)]" aria-hidden />
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 min-w-[140px] max-[720px]:items-start">
          {showCounter && (
            <div
              className="font-semibold leading-none tabular-nums text-[#f4f1ea] text-[44px] max-[720px]:text-[32px]"
              style={{ letterSpacing: '-0.03em' }}
            >
              {counterLabel}
            </div>
          )}
          {showHint && hint && (
            <div
              className="text-[11px] font-medium text-[rgba(244,241,234,0.35)]"
              style={{ letterSpacing: '0.02em' }}
            >
              {hint}
            </div>
          )}
        </div>
      </footer>
    </section>
  );
}

function paintPanel(el, depth, item, spacing, fog, total) {
  const z = -(depth - NEAR) * spacing;
  // Near panels large/clear; far panels fade into depth fog.
  const norm = total > 1 ? Math.min(1, (depth - NEAR) / (total - 1)) : 0;
  const opacity = fog ? Math.max(0, 1 - norm * 1.1) : 1;
  el.style.transform = `translate3d(${item.x}px, ${item.y}px, ${z.toFixed(1)}px)`;
  el.style.opacity = opacity.toFixed(3);
  el.style.zIndex = String(10000 - Math.round(depth * 100));
}
