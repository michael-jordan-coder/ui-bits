import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import './DepthTunnel.css';

export interface DepthTunnelItem {
  id: string | number;
  image: string;
  title: string;
  meta?: string | string[];
}

export interface DepthTunnelProps {
  items: DepthTunnelItem[];
  spacing?: number;
  perspective?: number;
  idleSpeed?: number;
  dragSensitivity?: number;
  wheelSensitivity?: number;
  ease?: number;
  fog?: boolean;
  showHint?: boolean;
  showCounter?: boolean;
  hint?: string;
  accentColor?: string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
}

interface PanelLayout {
  x: number;
  y: number;
}

const DEFAULT_SPACING = 360;
const DEFAULT_PERSPECTIVE = 1400;
const DEFAULT_IDLE_SPEED = 0.16;
const DEFAULT_DRAG_SENSITIVITY = 1.1;
const DEFAULT_WHEEL_SENSITIVITY = 0.7;
const DEFAULT_EASE = 0.08;

// Smallest depth at which a panel sits in front of the camera. Panels nearer
// than this are wrapped back to the far end so the tunnel never terminates.
const NEAR = 0.5;

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
}: DepthTunnelProps) {
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

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
  const layout = useMemo<PanelLayout[]>(
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
      // Static receding panels — no auto-fly, no rAF.
      panelRefs.current.forEach((el, i) => {
        if (!el) return;
        paintPanel(el, NEAR + i, layout[i], spacing, fog, N);
      });
      setActive(0);
      return undefined;
    }

    let raf = 0;
    let lastT = performance.now();

    const tick = (now: number) => {
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
        // Wrap depth into [NEAR, NEAR + N): an endless loop of panels ahead.
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

    const onDown = (e: PointerEvent) => {
      draggingRef.current = true;
      setDragging(true);
      lastYRef.current = e.clientY;
      velocityRef.current = 0;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      const dy = e.clientY - lastYRef.current;
      lastYRef.current = e.clientY;
      const delta = (dy / spacing) * dragSensitivity;
      targetRef.current += delta;
      velocityRef.current = delta;
    };
    const onUp = (e: PointerEvent) => {
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
    const onWheel = (e: WheelEvent) => {
      if (!hoverRef.current) return;
      e.preventDefault();
      targetRef.current += (e.deltaY / spacing) * wheelSensitivity;
    };
    const onKey = (e: KeyboardEvent) => {
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

  const rootStyle: CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
    ...(accentColor ? ({ '--dtl-accent': accentColor } as CSSProperties) : null),
    ...style
  };

  return (
    <section
      ref={sectionRef}
      tabIndex={0}
      role="group"
      aria-roledescription="Depth tunnel"
      aria-label={current ? `Tunnel, showing ${current.title}` : 'Tunnel'}
      className={`depth-tunnel${dragging ? ' is-dragging' : ''}${className ? ` ${className}` : ''}`}
      style={rootStyle}
    >
      {fog && <div className="depth-tunnel-fog" aria-hidden />}
      <div className="depth-tunnel-vignette" aria-hidden />

      <div className="depth-tunnel-stage" style={{ perspective: `${perspective}px` }}>
        <div className="depth-tunnel-track">
          {items.map((item, i) => (
            <div
              className={`depth-tunnel-panel${i === active ? ' is-active' : ''}`}
              key={item.id}
              ref={el => {
                panelRefs.current[i] = el;
              }}
            >
              <div className="depth-tunnel-frame">
                {item.image && <img src={item.image} alt={item.title || ''} loading="eager" draggable={false} />}
                <span className="depth-tunnel-panel-id" aria-hidden>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="depth-tunnel-aim" aria-hidden />

      <footer className="depth-tunnel-hud">
        <div className="depth-tunnel-hud-left" aria-live="polite">
          {current && (
            <div className="depth-tunnel-hud-meta" key={current.id}>
              <h2 className="depth-tunnel-hud-title">{current.title}</h2>
              {current.meta && (
                <div className="depth-tunnel-hud-row">
                  {(Array.isArray(current.meta) ? current.meta : [current.meta]).map((entry, i, arr) => (
                    <span key={i} className="depth-tunnel-hud-cell">
                      <span>{entry}</span>
                      {i < arr.length - 1 && <i className="depth-tunnel-sep" aria-hidden />}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="depth-tunnel-hud-right">
          {showCounter && <div className="depth-tunnel-counter">{counterLabel}</div>}
          {showHint && hint && <div className="depth-tunnel-hint">{hint}</div>}
        </div>
      </footer>
    </section>
  );
}

function paintPanel(
  el: HTMLDivElement,
  depth: number,
  item: PanelLayout,
  spacing: number,
  fog: boolean,
  total: number
) {
  const z = -(depth - NEAR) * spacing;
  // Near panels large/clear; far panels fade into depth fog.
  const norm = total > 1 ? Math.min(1, (depth - NEAR) / (total - 1)) : 0;
  const opacity = fog ? Math.max(0, 1 - norm * 1.1) : 1;
  el.style.transform = `translate3d(${item.x}px, ${item.y}px, ${z.toFixed(1)}px)`;
  el.style.opacity = opacity.toFixed(3);
  el.style.zIndex = String(10000 - Math.round(depth * 100));
}
