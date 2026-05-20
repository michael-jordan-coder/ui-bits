import { useCallback, useEffect, useRef, useState } from 'react';
import './PosterDrum.css';

const DEFAULT_ITEMS = [
  { id: '01', title: 'Solaris', year: '1972', tag: 'Drama' },
  { id: '02', title: 'Blade Runner', year: '1982', tag: 'Sci-fi' },
  { id: '03', title: 'Stalker', year: '1979', tag: 'Drama' },
  { id: '04', title: 'Mulholland Drive', year: '2001', tag: 'Thriller' },
  { id: '05', title: 'In the Mood for Love', year: '2000', tag: 'Romance' },
  { id: '06', title: 'Drive', year: '2011', tag: 'Neo-noir' },
  { id: '07', title: 'Arrival', year: '2016', tag: 'Sci-fi' },
  { id: '08', title: 'There Will Be Blood', year: '2007', tag: 'Drama' },
  { id: '09', title: 'Heat', year: '1995', tag: 'Crime' },
  { id: '10', title: 'Lost in Translation', year: '2003', tag: 'Drama' }
];

const EASE = 0.085;
const INERTIA_DECAY = 0.92;
const INERTIA_THRESHOLD = 0.005;
const MAX_VELOCITY = 1.4; // deg/ms

function pad2(n) {
  return n < 10 ? `0${n}` : `${n}`;
}

function computeRadius(itemWidth, itemCount, requested) {
  const minR = itemWidth / (2 * Math.sin(Math.PI / itemCount)) + 8;
  return Math.max(requested, minR);
}

export default function PosterDrum({
  items = DEFAULT_ITEMS,
  radius = 410,
  itemWidth = 240,
  itemHeight = 340,
  idleSpeed = 0.045,
  dragSensitivity = 0.18,
  enableInertia = true,
  showHud = true,
  activeIndex,
  onActiveChange,
  renderItem,
  className = ''
}) {
  const safeItems = items.length > 0 ? items : DEFAULT_ITEMS;
  const N = safeItems.length;
  const step = 360 / N;
  const R = computeRadius(itemWidth, N, radius);

  const sectionRef = useRef(null);
  const sceneRef = useRef(null);
  const targetRef = useRef(0);
  const valueRef = useRef(0);
  const velRef = useRef(0);
  const draggingRef = useRef(false);
  const inViewRef = useRef(false);
  const visibleRef = useRef(typeof document === 'undefined' ? true : document.visibilityState === 'visible');
  const activeRef = useRef(0);
  const reducedRef = useRef(false);

  const [active, setActive] = useState(typeof activeIndex === 'number' ? activeIndex : 0);
  const isControlled = typeof activeIndex === 'number';

  useEffect(() => {
    if (isControlled) {
      const snapped = ((activeIndex % N) + N) % N;
      targetRef.current = -snapped * step;
      activeRef.current = snapped;
      setActive(snapped);
    }
  }, [activeIndex, isControlled, N, step]);

  useEffect(() => {
    const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    reducedRef.current = mq?.matches ?? false;
    const handler = e => {
      reducedRef.current = e.matches;
    };
    mq?.addEventListener?.('change', handler);
    return () => mq?.removeEventListener?.('change', handler);
  }, []);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      inViewRef.current = true;
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting && entry.intersectionRatio > 0.25;
      },
      { threshold: [0, 0.25, 0.5, 1] }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      visibleRef.current = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    let raf = 0;
    let lastT = performance.now();
    let alive = true;

    const tick = now => {
      if (!alive) return;
      const dt = Math.min(64, now - lastT);
      lastT = now;
      const dtScale = dt / 16.67;

      if (visibleRef.current && inViewRef.current && !draggingRef.current && !reducedRef.current) {
        if (Math.abs(velRef.current) > INERTIA_THRESHOLD) {
          targetRef.current += velRef.current * dtScale;
          velRef.current *= INERTIA_DECAY;
        } else if (idleSpeed > 0 && !isControlled) {
          targetRef.current += idleSpeed * dtScale;
        }
      }

      const easing = reducedRef.current ? 1 : EASE;
      valueRef.current += (targetRef.current - valueRef.current) * easing;

      if (sceneRef.current) {
        sceneRef.current.style.transform = `rotateY(${valueRef.current.toFixed(3)}deg)`;
      }

      const norm = (((-valueRef.current % 360) + 360) % 360);
      const idx = Math.round(norm / step) % N;
      if (idx !== activeRef.current && !isControlled) {
        activeRef.current = idx;
        setActive(idx);
        onActiveChange?.(safeItems[idx], idx);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [idleSpeed, isControlled, N, step, safeItems, onActiveChange]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;

    let lastX = 0;
    let lastT = 0;

    const onDown = e => {
      if (isControlled) return;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        // pointer capture can throw on some browsers; safe to ignore
      }
      draggingRef.current = true;
      lastX = e.clientX;
      lastT = performance.now();
      velRef.current = 0;
      el.classList.add('is-dragging');
    };

    const onMove = e => {
      if (!draggingRef.current) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dt = Math.max(1, now - lastT);
      const deltaDeg = dx * dragSensitivity;
      targetRef.current += deltaDeg;
      const instantVel = deltaDeg / dt;
      const clamped = Math.max(-MAX_VELOCITY, Math.min(MAX_VELOCITY, instantVel));
      velRef.current = velRef.current * 0.7 + clamped * 0.3;
      lastX = e.clientX;
      lastT = now;
    };

    const onUp = e => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        // releasing a capture we never owned isn't fatal
      }
      el.classList.remove('is-dragging');
      if (!enableInertia || reducedRef.current) velRef.current = 0;
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);

    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, [dragSensitivity, enableInertia, isControlled]);

  const stepTo = useCallback(
    direction => {
      if (isControlled) return;
      velRef.current = 0;
      targetRef.current = -((activeRef.current + direction) * step);
    },
    [isControlled, step]
  );

  const onKeyDown = useCallback(
    e => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        stepTo(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        stepTo(-1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        targetRef.current = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        targetRef.current = -(N - 1) * step;
      }
    },
    [stepTo, N, step]
  );

  const activeItem = safeItems[active] ?? safeItems[0];

  const rootClass = ['poster-drum-frame', className].filter(Boolean).join(' ');

  return (
    <section
      ref={sectionRef}
      className={rootClass}
      role="region"
      aria-roledescription="3D carousel"
      aria-label="Poster drum"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {showHud && (
        <div className="poster-drum-counter" aria-hidden="true">
          <span className="poster-drum-counter-num">{pad2(active + 1)}</span>
          <span className="poster-drum-counter-sep">/</span>
          {pad2(N)}
        </div>
      )}

      <div className="poster-drum-stage">
        <div className="poster-drum-scene" ref={sceneRef} style={{ willChange: 'transform' }}>
          {safeItems.map((item, i) => {
            const isActive = i === active;
            const z = isActive ? R + 70 : R;
            const itemStyle = {
              width: `${itemWidth}px`,
              height: `${itemHeight}px`,
              marginLeft: `${-itemWidth / 2}px`,
              marginTop: `${-itemHeight / 2}px`,
              transform: `rotateY(${i * step}deg) translateZ(${z}px)`
            };
            return (
              <div
                key={item.id}
                className={`poster-drum-item${isActive ? ' is-active' : ''}`}
                style={itemStyle}
                aria-hidden={!isActive}
              >
                {renderItem ? (
                  renderItem(item, isActive, i)
                ) : (
                  <div className="poster-drum-card">
                    {item.src && (
                      <div
                        className="poster-drum-card-art"
                        style={{ backgroundImage: `url("${item.src}")` }}
                      />
                    )}
                    <div className="poster-drum-card-id">{item.id}</div>
                    <div className="poster-drum-card-foot">
                      <div className="poster-drum-card-title">{item.title}</div>
                      {(item.year || item.tag) && (
                        <div className="poster-drum-card-meta">
                          {[item.year, item.tag].filter(Boolean).join(' · ')}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="poster-drum-live" aria-live="polite" aria-atomic="true">
        {activeItem?.title}
      </div>

      {showHud && activeItem && (
        <div className="poster-drum-now" aria-hidden="true">
          <div className="poster-drum-now-title">{activeItem.title}</div>
          {(activeItem.year || activeItem.tag) && (
            <div className="poster-drum-now-meta">
              {[activeItem.year, activeItem.tag].filter(Boolean).join(' · ')}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
