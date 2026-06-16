import { useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_RADIUS = 150;
const DEFAULT_IDLE_SPEED = 0.0022;
const DEFAULT_DRAG_SENSITIVITY = 0.18;
const DEFAULT_FRICTION = 0.94;
const DEFAULT_MAX_FONT = 22;
const DEFAULT_MIN_FONT = 11;
const DEFAULT_HEIGHT = 420;

const DEG = Math.PI / 180;

const STYLE_BLOCK = `
.tag-sphere-tw-scene:focus-visible {
  box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--tag-sphere-accent, #ff4d2e) 60%, transparent);
}
.tag-sphere-tw-tag:hover,
.tag-sphere-tw-tag:focus-visible {
  color: var(--tag-sphere-accent, #ff4d2e);
  outline: none;
}
.tag-sphere-tw-tag:focus-visible {
  text-decoration: underline;
  text-underline-offset: 4px;
}
@media (prefers-reduced-motion: reduce) {
  .tag-sphere-tw-tag { transition: none; }
}
`;

function normalizeTags(tags) {
  return tags.map((tag, i) => {
    if (typeof tag === 'string') return { label: tag, value: tag, key: `${tag}-${i}` };
    const label = tag.label;
    const value = tag.value ?? tag.label;
    return { label, value, href: tag.href, key: `${label}-${i}` };
  });
}

// Fibonacci sphere: even point distribution over a unit sphere.
function fibonacciSphere(count) {
  const points = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = count === 1 ? 0 : 1 - (i / (count - 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = golden * i;
    points.push([Math.cos(theta) * radiusAtY, y, Math.sin(theta) * radiusAtY]);
  }
  return points;
}

export default function TagSphere({
  tags = [],
  radius = DEFAULT_RADIUS,
  idleSpeed = DEFAULT_IDLE_SPEED,
  dragSensitivity = DEFAULT_DRAG_SENSITIVITY,
  friction = DEFAULT_FRICTION,
  maxFontSize = DEFAULT_MAX_FONT,
  minFontSize = DEFAULT_MIN_FONT,
  accentColor,
  height = DEFAULT_HEIGHT,
  className = '',
  style,
  ariaLabel = 'Tag cloud'
}) {
  const items = useMemo(() => normalizeTags(tags), [tags]);
  const basePoints = useMemo(() => fibonacciSphere(items.length), [items.length]);

  const [dragging, setDragging] = useState(false);
  const [reduced, setReduced] = useState(false);

  const sceneRef = useRef(null);
  const tagRefs = useRef([]);

  const yawRef = useRef(0);
  const pitchRef = useRef(0);
  const velYawRef = useRef(idleSpeed);
  const velPitchRef = useRef(0);

  const draggingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });
  const inViewRef = useRef(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      reducedRef.current = mq.matches;
      setReduced(mq.matches);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    const N = items.length;
    if (N === 0) return undefined;

    let raf = 0;
    let visible = !document.hidden;
    const onVisibility = () => {
      visible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibility);

    const fontSpan = maxFontSize - minFontSize;

    const tick = () => {
      if (!visible) {
        raf = requestAnimationFrame(tick);
        return;
      }

      if (reducedRef.current) {
        velYawRef.current = 0;
        velPitchRef.current = 0;
      } else if (draggingRef.current) {
        // velocity written by pointer handlers
      } else {
        velYawRef.current *= friction;
        velPitchRef.current *= friction;
        if (inViewRef.current && Math.abs(velYawRef.current) < idleSpeed) {
          velYawRef.current = idleSpeed;
        }
      }

      yawRef.current += velYawRef.current;
      pitchRef.current += velPitchRef.current;
      const maxPitch = 1.2;
      if (pitchRef.current > maxPitch) pitchRef.current = maxPitch;
      if (pitchRef.current < -maxPitch) pitchRef.current = -maxPitch;

      const cosY = Math.cos(yawRef.current);
      const sinY = Math.sin(yawRef.current);
      const cosX = Math.cos(pitchRef.current);
      const sinX = Math.sin(pitchRef.current);

      for (let i = 0; i < N; i++) {
        const el = tagRefs.current[i];
        if (!el) continue;
        const [bx, by, bz] = basePoints[i];

        const x1 = bx * cosY + bz * sinY;
        const z1 = -bx * sinY + bz * cosY;
        const y2 = by * cosX - z1 * sinX;
        const z2 = by * sinX + z1 * cosX;

        const px = x1 * radius;
        const py = y2 * radius;

        if (reducedRef.current) {
          el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`;
          el.style.fontSize = `${(minFontSize + fontSpan * 0.6).toFixed(1)}px`;
          el.style.opacity = '1';
          el.style.zIndex = '1';
          continue;
        }

        const depth01 = (z2 + 1) / 2;
        const scale = 0.6 + depth01 * 0.7;
        const opacity = 0.28 + depth01 * 0.72;
        const fontSize = minFontSize + fontSpan * depth01;

        el.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
        el.style.fontSize = `${fontSize.toFixed(1)}px`;
        el.style.opacity = opacity.toFixed(3);
        el.style.zIndex = String(Math.round(depth01 * 100));
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [items.length, basePoints, radius, idleSpeed, friction, maxFontSize, minFontSize]);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return undefined;

    const onDown = e => {
      draggingRef.current = true;
      setDragging(true);
      lastRef.current = { x: e.clientX, y: e.clientY };
      el.setPointerCapture(e.pointerId);
    };
    const onMove = e => {
      if (!draggingRef.current) return;
      const dx = e.clientX - lastRef.current.x;
      const dy = e.clientY - lastRef.current.y;
      lastRef.current = { x: e.clientX, y: e.clientY };
      velYawRef.current = dx * dragSensitivity * DEG;
      velPitchRef.current = -dy * dragSensitivity * DEG;
    };
    const onUp = e => {
      if (!draggingRef.current) return;
      draggingRef.current = false;
      setDragging(false);
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        /* pointer already released */
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
  }, [dragSensitivity]);

  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting && entry.intersectionRatio > 0.2;
      },
      { threshold: [0, 0.2, 0.5, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onKeyDown = e => {
    const nudge = 0.16;
    if (e.key === 'ArrowLeft') velYawRef.current = -nudge;
    else if (e.key === 'ArrowRight') velYawRef.current = nudge;
    else if (e.key === 'ArrowUp') velPitchRef.current = nudge;
    else if (e.key === 'ArrowDown') velPitchRef.current = -nudge;
    else return;
    e.preventDefault();
  };

  const rootStyle = {
    height: typeof height === 'number' ? `${height}px` : height,
    background: 'radial-gradient(120% 100% at 50% 38%, #14101a 0%, #050508 100%)',
    ...(accentColor ? { '--tag-sphere-accent': accentColor } : null),
    ...style
  };

  return (
    <div
      className={`relative w-full overflow-hidden font-[inherit] text-[#f4f1ea] isolate${className ? ` ${className}` : ''}`}
      style={rootStyle}
    >
      <style>{STYLE_BLOCK}</style>
      <div
        ref={sceneRef}
        className={`tag-sphere-tw-scene absolute inset-0 grid place-items-center touch-none select-none outline-none ${
          dragging ? 'cursor-grabbing' : reduced ? 'cursor-default' : 'cursor-grab'
        }`}
        role="group"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <ul className="relative m-0 h-0 w-0 list-none p-0 [transform-style:preserve-3d]">
          {items.map((item, i) => {
            const Tag = item.href ? 'a' : 'button';
            return (
              <li
                key={item.key}
                className="absolute left-0 top-0 [will-change:transform,opacity]"
                style={{ transform: 'translate3d(0,0,0)' }}
                ref={el => {
                  tagRefs.current[i] = el;
                }}
              >
                <Tag
                  className="tag-sphere-tw-tag block -mt-[0.6em] -translate-x-1/2 cursor-pointer whitespace-nowrap border-0 bg-transparent p-0 font-medium leading-[1.2] tracking-[-0.01em] text-[#f4f1ea] no-underline transition-colors duration-150"
                  {...(item.href ? { href: item.href } : { type: 'button' })}
                  aria-label={item.label}
                  data-value={item.value}
                  draggable={false}
                >
                  {item.label}
                </Tag>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
