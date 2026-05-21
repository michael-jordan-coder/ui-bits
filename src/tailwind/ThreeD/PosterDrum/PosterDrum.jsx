import { useCallback, useEffect, useRef, useState } from 'react';

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
const MAX_VELOCITY = 1.4;

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
  const metaText = activeItem
    ? [activeItem.year, activeItem.tag].filter(Boolean).join(' · ')
    : '';

  return (
    <section
      ref={sectionRef}
      role="region"
      aria-roledescription="3D carousel"
      aria-label="Poster drum"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={[
        'relative w-full h-full overflow-hidden isolate select-none cursor-grab active:cursor-grabbing',
        'bg-[#0a0a0c] text-[#f4f1ea] font-sans outline-none',
        'focus-visible:[outline:1px_solid_rgba(244,241,234,0.3)] focus-visible:[outline-offset:-8px]',
        className
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {showHud && (
        <div
          aria-hidden="true"
          className="absolute top-[18px] right-[18px] z-[6] text-[11px] font-medium text-[rgba(244,241,234,0.55)] tabular-nums pointer-events-none"
        >
          <span className="text-[#f4f1ea]">{pad2(active + 1)}</span>
          <span className="mx-[3px] text-[rgba(244,241,234,0.3)]">/</span>
          {pad2(N)}
        </div>
      )}

      <div
        className="absolute inset-0 z-[1]"
        style={{ perspective: '1500px', perspectiveOrigin: '50% 50%' }}
      >
        <div
          ref={sceneRef}
          className="absolute top-1/2 left-1/2 w-0 h-0"
          style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          {safeItems.map((item, i) => {
            const isActive = i === active;
            const z = isActive ? R + 70 : R;
            const itemStyle = {
              width: `${itemWidth}px`,
              height: `${itemHeight}px`,
              marginLeft: `${-itemWidth / 2}px`,
              marginTop: `${-itemHeight / 2}px`,
              transform: `rotateY(${i * step}deg) translateZ(${z}px)`,
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden'
            };
            const borderClass = isActive ? 'border-[#ff4d2e]' : 'border-[rgba(244,241,234,0.08)]';
            const itemMeta = [item.year, item.tag].filter(Boolean).join(' · ');
            return (
              <div
                key={item.id}
                className={`absolute top-0 left-0 transition-transform duration-[600ms] ease-[cubic-bezier(0.2,0.7,0.3,1)] motion-reduce:transition-none ${
                  isActive ? 'opacity-100' : 'opacity-50'
                }`}
                style={itemStyle}
                aria-hidden={!isActive}
              >
                {renderItem ? (
                  renderItem(item, isActive, i)
                ) : (
                  <div
                    className={`relative w-full h-full rounded-md overflow-hidden bg-[#15131a] border ${borderClass} flex flex-col justify-between p-[16px_18px]`}
                  >
                    {item.src && (
                      <div
                        className="absolute inset-0 bg-cover bg-center z-0"
                        style={{ backgroundImage: `url("${item.src}")` }}
                      />
                    )}
                    <div className="relative z-[1] text-[11px] font-medium text-[rgba(244,241,234,0.3)] tabular-nums">
                      {item.id}
                    </div>
                    <div className="relative z-[1] flex flex-col gap-1">
                      <div className="text-[18px] font-semibold leading-tight tracking-[-0.01em] text-[#f4f1ea]">
                        {item.title}
                      </div>
                      {itemMeta && (
                        <div className="text-[11px] font-medium text-[rgba(244,241,234,0.55)] tabular-nums">
                          {itemMeta}
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

      <div
        aria-live="polite"
        aria-atomic="true"
        className="absolute w-px h-px -m-px p-0 overflow-hidden whitespace-nowrap [clip:rect(0,0,0,0)] border-0"
      >
        {activeItem?.title}
      </div>

      {showHud && activeItem && (
        <div
          aria-hidden="true"
          className="absolute bottom-[18px] left-[18px] z-[6] flex flex-col gap-0.5 pointer-events-none"
        >
          <div className="text-[18px] font-semibold leading-tight tracking-[-0.01em] text-[#f4f1ea]">
            {activeItem.title}
          </div>
          {metaText && (
            <div className="text-[11px] font-medium text-[rgba(244,241,234,0.55)] tabular-nums">
              {metaText}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
