import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, stagger, useAnimate, useReducedMotion } from 'motion/react';
import { Star } from 'lucide-react';

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const join = (...classes) => classes.filter(Boolean).join(' ');

const DEFAULT_LABELS = ['Hated it', 'Disliked it', "It's okay", 'Liked it', 'Loved it!'];
const SPARK_ANGLES = [0, 60, 120, 180, 240, 300];

// Six dots that fly outward once when a rating is committed — the little
// celebratory burst that makes a rating feel earned.
function Sparkles({ size, color }) {
  const radius = size * 0.7;
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden="true">
      {SPARK_ANGLES.map((deg, idx) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <motion.span
            key={idx}
            className="absolute left-1/2 top-1/2 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full will-change-transform"
            style={{ background: color }}
            initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
            animate={{ x: Math.cos(rad) * radius, y: Math.sin(rad) * radius, scale: [0, 1, 0.4], opacity: [1, 1, 0] }}
            transition={{ duration: 0.55, ease: 'easeOut', delay: idx * 0.012 }}
          />
        );
      })}
    </span>
  );
}

// A row of stars that fills on hover, springs when you commit a rating, and
// bursts with sparkles plus a pop-in label. Inspired by the celebratory
// "Love this!" rating reveal on Netflix documented on designspells.com.
export default function StarRating({
  count = 5,
  defaultValue = 0,
  size = 40,
  color = '#fbbf24',
  emptyColor = 'rgba(255, 255, 255, 0.18)',
  labels = DEFAULT_LABELS,
  showLabel = true,
  readOnly = false,
  onChange,
  className = '',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const [scope, animate] = useAnimate();
  const starRefs = useRef([]);

  const [value, setValue] = useState(() => clamp(Math.round(defaultValue), 0, count));
  const [hover, setHover] = useState(0);
  const [burstId, setBurstId] = useState(0);

  // Keep the committed value inside the available range when count shrinks.
  useEffect(() => {
    setValue(prev => clamp(prev, 0, count));
  }, [count]);

  // Replay the staggered bounce across the filled stars on every commit.
  useEffect(() => {
    if (!burstId || prefersReduced) return;
    animate(
      '[data-filled="true"]',
      { scale: [1, 1.35, 1] },
      { duration: 0.45, delay: stagger(0.06), ease: [0.34, 1.56, 0.64, 1] }
    );
  }, [burstId, animate, prefersReduced]);

  const displayValue = hover || value;
  const currentLabel = value > 0 ? labels[value - 1] : '';

  const commit = next => {
    if (readOnly) return;
    const clamped = clamp(next, 0, count);
    if (onChange && clamped !== value) onChange(clamped);
    setValue(clamped);
    setBurstId(id => id + 1);
    starRefs.current[clamped - 1]?.focus();
  };

  const handleKeyDown = e => {
    if (readOnly) return;
    let next;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(count, (value || 0) + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(1, (value || 1) - 1);
    else if (e.key === 'Home') next = 1;
    else if (e.key === 'End') next = count;
    else return;
    e.preventDefault();
    commit(next);
  };

  return (
    <div
      className={join('inline-flex select-none flex-col items-center gap-[0.85rem] text-white', className)}
      ref={scope}
      {...rest}
    >
      <div
        className="flex items-center gap-[0.3rem]"
        role="radiogroup"
        aria-label="Rating"
        onMouseLeave={() => setHover(0)}
        style={{ pointerEvents: readOnly ? 'none' : undefined }}
      >
        {Array.from({ length: count }, (_, i) => i + 1).map(i => {
          const filled = i <= displayValue;
          const tabbable = !readOnly && (value === 0 ? i === 1 : i === value);
          return (
            <motion.button
              key={i}
              type="button"
              role="radio"
              aria-checked={i === value}
              aria-label={`${i} ${i === 1 ? 'star' : 'stars'}`}
              tabIndex={tabbable ? 0 : -1}
              disabled={readOnly}
              className="relative grid cursor-pointer place-items-center rounded-lg border-none bg-none p-0 outline-none [-webkit-tap-highlight-color:transparent] will-change-transform focus-visible:shadow-[0_0_0_3px_rgba(255,255,255,0.35)] disabled:cursor-default"
              data-filled={filled}
              ref={el => {
                starRefs.current[i - 1] = el;
              }}
              style={{ width: size, height: size }}
              onClick={() => commit(i)}
              onMouseEnter={() => !readOnly && setHover(i)}
              onKeyDown={handleKeyDown}
              whileHover={!readOnly && !prefersReduced ? { scale: 1.15 } : undefined}
              whileTap={!readOnly && !prefersReduced ? { scale: 0.88 } : undefined}
            >
              <Star size={size} strokeWidth={1.5} color={filled ? color : emptyColor} fill={filled ? color : 'none'} />
              {burstId > 0 && i === value && !prefersReduced && <Sparkles key={burstId} size={size} color={color} />}
            </motion.button>
          );
        })}
      </div>

      {showLabel && (
        <div className="flex min-h-[1.4em] items-center justify-center" aria-live="polite">
          <AnimatePresence mode="wait">
            {currentLabel && (
              <motion.span
                key={value}
                className="text-[0.95rem] font-bold tracking-[-0.01em]"
                style={{ color }}
                initial={{ y: 6, scale: 0.9, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                exit={{ y: -6, scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 24 }}
              >
                {currentLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
