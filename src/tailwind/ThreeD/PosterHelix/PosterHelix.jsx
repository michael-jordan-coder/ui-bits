import { useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_RADIUS = 360;
const DEFAULT_Y_STEP = 56;
const DEFAULT_TURN_DEG = 50;
const DEFAULT_IDLE_SPEED = 0.05;
const DEFAULT_DRAG_SENSITIVITY = 0.18;
const DEFAULT_EASE = 0.085;

const STYLE_BLOCK = `
.phx-grain-bg {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.95' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
  background-size: 200px 200px;
  animation: phx-grain 1.4s steps(5) infinite;
}
@keyframes phx-grain {
  0% { transform: translate(0, 0); }
  20% { transform: translate(-2%, 1%); }
  40% { transform: translate(1%, -2%); }
  60% { transform: translate(-1%, 2%); }
  80% { transform: translate(2%, -1%); }
  100% { transform: translate(0, 0); }
}
.phx-meta-in { animation: phx-meta-in 0.45s cubic-bezier(0.2, 0.7, 0.3, 1); }
@keyframes phx-meta-in {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: none; }
}
.phx-poster.is-active .phx-poster-frame {
  box-shadow:
    0 30px 60px -10px rgba(0, 0, 0, 0.7),
    0 0 0 1px color-mix(in srgb, var(--phx-accent, #ff4d2e) 40%, transparent),
    0 0 50px -10px color-mix(in srgb, var(--phx-accent, #ff4d2e) 50%, transparent);
}
@media (prefers-reduced-motion: reduce) {
  .phx-grain-bg, .phx-meta-in { animation: none; }
}
`;

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
    background: 'radial-gradient(120% 90% at 50% 30%, #14101a 0%, #08080c 60%, #040406 100%)',
    ...(accentColor ? { '--phx-accent': accentColor } : null),
    ...style
  };

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden isolate select-none touch-none text-[#f4f1ea] ${dragging ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
      style={rootStyle}
    >
      <style>{STYLE_BLOCK}</style>

      {showGrain && (
        <div
          className="phx-grain-bg pointer-events-none absolute z-[12] mix-blend-overlay opacity-[0.32]"
          style={{ inset: '-10%' }}
          aria-hidden
        />
      )}
      {showVignette && (
        <div
          className="pointer-events-none absolute inset-0 z-[11]"
          style={{
            background:
              'radial-gradient(80% 60% at 50% 50%, transparent 0%, transparent 30%, rgba(4,4,6,0.65) 80%, rgba(4,4,6,0.95) 100%), linear-gradient(180deg, rgba(4,4,6,0.55) 0%, transparent 22%, transparent 78%, rgba(4,4,6,0.7) 100%)'
          }}
          aria-hidden
        />
      )}

      {showAxis && (
        <div
          className="absolute z-[4] left-1/2 w-px flex flex-col justify-between items-center"
          style={{
            top: '12%',
            bottom: '18%',
            background:
              'linear-gradient(180deg, transparent, rgba(244,241,234,0.18) 18%, rgba(244,241,234,0.18) 82%, transparent)'
          }}
          aria-hidden
        >
          <span className="block w-3 h-px bg-[rgba(244,241,234,0.28)]" />
          <span className="block w-3 h-px bg-[rgba(244,241,234,0.28)]" />
          <span className="block w-3 h-px bg-[rgba(244,241,234,0.28)]" />
          <span className="block w-3 h-px bg-[rgba(244,241,234,0.28)]" />
          <span className="block w-3 h-px bg-[rgba(244,241,234,0.28)]" />
        </div>
      )}

      <div className="absolute inset-0 z-[5]">
        <div className="absolute inset-0" style={{ perspective: '1500px', perspectiveOrigin: '50% 50%' }}>
          <div
            ref={trackRef}
            className="absolute top-1/2 left-1/2 w-0 h-0 will-change-transform"
            style={{ transformStyle: 'preserve-3d', transform: 'translate(-50%, -50%) rotateY(0deg)' }}
          >
            {posters.map((p, i) => {
              const angle = i * turnDeg;
              const y = i * yStep - yMid;
              const isActive = i === active;
              return (
                <div
                  key={p.id}
                  className={`phx-poster absolute top-0 left-0 w-60 h-80 -ml-[120px] -mt-[160px] transition-[filter] duration-500 ease-out ${isActive ? 'is-active z-[2]' : ''}`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${angle}deg) translateZ(${radius}px) translateY(${y.toFixed(1)}px)`,
                    filter: isActive ? 'brightness(1.1) saturate(1.05)' : 'brightness(0.55) saturate(0.7)'
                  }}
                >
                  <div
                    className="phx-poster-frame relative w-full h-full overflow-hidden bg-[#1b1722]"
                    style={{
                      borderRadius: '2px',
                      boxShadow:
                        '0 24px 50px -12px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(244, 241, 234, 0.06)',
                      backfaceVisibility: 'hidden'
                    }}
                  >
                    {p.image && (
                      <img
                        src={p.image}
                        alt={p.title || ''}
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
                      {String(N - i).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <footer className="absolute bottom-0 left-0 right-0 z-30 px-8 pt-[22px] pb-[26px] grid grid-cols-[1fr_auto] gap-8 items-end max-[720px]:px-[18px] max-[720px]:pb-[22px] max-[720px]:pt-[18px] max-[720px]:grid-cols-1 max-[720px]:gap-3.5">
        <div className="min-w-0 max-w-[60%] max-[720px]:max-w-full">
          {current && (
            <div key={current.id} className="phx-meta-in flex flex-col gap-1.5">
              <h2
                className="m-0 font-semibold leading-[1.1] text-[#f4f1ea]"
                style={{ fontSize: 'clamp(20px, 2.4vw, 32px)', letterSpacing: '-0.015em' }}
              >
                {current.title}
              </h2>
              {current.meta && (
                <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium text-[rgba(244,241,234,0.7)]">
                  {(Array.isArray(current.meta) ? current.meta : [current.meta]).map((item, i, arr) => (
                    <span key={i} className="inline-flex items-center gap-2.5">
                      <span>{item}</span>
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
