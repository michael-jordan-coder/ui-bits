import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import './CardDeck.css';

export interface CardDeckItem {
  id: string | number;
  image?: string;
  title: string;
  meta?: string;
}

export interface CardDeckProps {
  items?: CardDeckItem[];
  visibleCards?: number;
  depth?: number;
  offsetY?: number;
  scaleStep?: number;
  idleSpeed?: number;
  swipeThreshold?: number;
  showHint?: boolean;
  hint?: string;
  accentColor?: string;
  height?: number | string;
  className?: string;
  style?: CSSProperties;
}

const DEFAULT_ITEMS: CardDeckItem[] = [];

const EASE = 0.1;
const THROW_FADE = 1; // slot value at which a thrown card is fully gone
const DRAG_THROW_DEG = 14; // rotateZ at full drag travel

function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

function pad2(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

export default function CardDeck({
  items = DEFAULT_ITEMS,
  visibleCards = 4,
  depth = 60,
  offsetY = 18,
  scaleStep = 0.06,
  idleSpeed = 0,
  swipeThreshold = 90,
  showHint = true,
  hint = 'Drag, swipe or use ←/→',
  accentColor,
  height = 520,
  className = '',
  style
}: CardDeckProps) {
  const safeItems = items;
  const N = safeItems.length;

  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);

  const valueRef = useRef(0);
  const targetRef = useRef(0);
  const dirRef = useRef(1);
  const dragRef = useRef(0);
  const draggingRef = useRef(false);
  const downXRef = useRef(0);
  const inViewRef = useRef(false);
  const visibleRef = useRef(typeof document === 'undefined' ? true : document.visibilityState === 'visible');
  const reducedRef = useRef(false);
  const idleAccRef = useRef(0);
  const frontRef = useRef(0);

  const [front, setFront] = useState(0);

  cardRefs.current.length = N;

  const paint = useCallback(() => {
    const value = valueRef.current;
    const frac = value - Math.floor(value);
    const baseFront = ((Math.floor(value) % N) + N) % N;
    const dir = dirRef.current;
    const dragPx = dragRef.current;
    const dragNorm = clamp(dragPx / (swipeThreshold * 2.2), -1, 1);

    for (let i = 0; i < N; i++) {
      const node = cardRefs.current[i];
      if (!node) continue;

      let slot = (((i - baseFront) % N) + N) % N;
      slot -= frac;

      if (slot < -THROW_FADE) {
        node.style.opacity = '0';
        node.style.visibility = 'hidden';
        continue;
      }
      node.style.visibility = 'visible';

      if (slot < 0) {
        const t = -slot;
        const x = dir * (220 + t * 320);
        const y = -t * 40;
        const rot = dir * (DRAG_THROW_DEG + t * 16);
        const ry = dir * -t * 26;
        node.style.zIndex = String(N + 2);
        node.style.opacity = String(clamp(1 - t * 1.15, 0, 1));
        node.style.transform =
          `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${(40).toFixed(1)}px) ` +
          `rotateY(${ry.toFixed(2)}deg) rotateZ(${rot.toFixed(2)}deg)`;
        continue;
      }

      const z = -slot * depth;
      const yOff = slot * offsetY;
      const scale = Math.max(0, 1 - slot * scaleStep);
      const beyond = clamp(slot - (visibleCards - 1), 0, 1);
      const opacity = clamp(1 - beyond, 0, 1);
      const dim = clamp(slot / visibleCards, 0, 1);

      const isFront = slot < 0.5;
      const dx = isFront ? dragPx : 0;
      const dragRot = isFront ? dragNorm * DRAG_THROW_DEG : 0;

      node.style.zIndex = String(N - Math.round(slot));
      node.style.opacity = String(opacity);
      node.style.transform =
        `translate3d(${dx.toFixed(1)}px, ${yOff.toFixed(1)}px, ${z.toFixed(1)}px) ` +
        `rotateZ(${dragRot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      node.style.filter = `brightness(${(1 - dim * 0.45).toFixed(3)})`;
      node.setAttribute('aria-hidden', isFront ? 'false' : 'true');
    }
  }, [N, depth, offsetY, scaleStep, visibleCards, swipeThreshold]);

  useEffect(() => {
    const mq = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    reducedRef.current = mq?.matches ?? false;
    const handler = (e: MediaQueryListEvent) => {
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
    if (N === 0) return undefined;
    let raf = 0;
    let lastT = performance.now();
    let alive = true;

    const tick = (now: number) => {
      if (!alive) return;
      const dt = Math.min(64, now - lastT);
      lastT = now;
      const dtScale = dt / 16.67;

      if (
        idleSpeed > 0 &&
        visibleRef.current &&
        inViewRef.current &&
        !draggingRef.current &&
        !reducedRef.current
      ) {
        idleAccRef.current += idleSpeed * dtScale;
        if (idleAccRef.current >= 1) {
          idleAccRef.current = 0;
          dirRef.current = 1;
          targetRef.current += 1;
        }
      }

      const easing = reducedRef.current ? 1 : EASE;
      valueRef.current += (targetRef.current - valueRef.current) * easing;
      if (Math.abs(targetRef.current - valueRef.current) < 0.0005) {
        valueRef.current = targetRef.current;
      }

      paint();

      const f = ((Math.round(valueRef.current) % N) + N) % N;
      if (f !== frontRef.current) {
        frontRef.current = f;
        setFront(f);
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [N, idleSpeed, paint]);

  const advance = useCallback((dir: number) => {
    dirRef.current = dir;
    targetRef.current = Math.round(valueRef.current) + 1;
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || N === 0) return undefined;

    const onDown = (e: PointerEvent) => {
      if (e.button != null && e.button !== 0) return;
      draggingRef.current = true;
      downXRef.current = e.clientX;
      dragRef.current = 0;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        // pointer capture can throw on some browsers; safe to ignore
      }
      el.classList.add('is-dragging');
    };

    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      dragRef.current = e.clientX - downXRef.current;
    };

    const onUp = (e: PointerEvent) => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        // releasing a capture we never owned isn't fatal
      }
      el.classList.remove('is-dragging');
      const travel = dragRef.current;
      dragRef.current = 0;
      if (Math.abs(travel) >= swipeThreshold) {
        advance(travel < 0 ? -1 : 1);
      }
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
  }, [N, swipeThreshold, advance]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        advance(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        advance(-1);
      }
    },
    [advance]
  );

  const rootStyle: CSSProperties = {
    height: typeof height === 'number' ? `${height}px` : height,
    ...(accentColor ? ({ '--card-deck-accent': accentColor } as CSSProperties) : null),
    ...style
  };

  const rootClass = ['card-deck', className].filter(Boolean).join(' ');
  const frontItem = N > 0 ? safeItems[front] : null;

  return (
    <section
      ref={sectionRef}
      className={rootClass}
      style={rootStyle}
      role="group"
      aria-roledescription="card deck"
      aria-label="Card deck"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      <div className="card-deck-vignette" aria-hidden="true" />

      <div className="card-deck-stage" ref={stageRef}>
        <div className="card-deck-scene">
          {safeItems.map((item, i) => (
            <article
              key={item.id}
              ref={node => {
                cardRefs.current[i] = node;
              }}
              className="card-deck-card"
            >
              <div className="card-deck-card-inner">
                {item.image && (
                  <img
                    className="card-deck-card-img"
                    src={item.image}
                    alt={item.title || ''}
                    loading="eager"
                    draggable={false}
                  />
                )}
                <div className="card-deck-card-scrim" aria-hidden="true" />
                <div className="card-deck-card-body">
                  <h3 className="card-deck-card-title">{item.title}</h3>
                  {item.meta && <p className="card-deck-card-meta">{item.meta}</p>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="card-deck-live" aria-live="polite" aria-atomic="true">
        {frontItem?.title}
      </div>

      <footer className="card-deck-hud">
        <div className="card-deck-counter">
          <span className="card-deck-counter-num">{pad2(front + 1)}</span>
          <span className="card-deck-counter-sep">/</span>
          <span className="card-deck-counter-total">{pad2(N)}</span>
        </div>
        {showHint && hint && <p className="card-deck-hint">{hint}</p>}
      </footer>
    </section>
  );
}
