import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, stagger, useAnimate, useReducedMotion } from 'motion/react';
import { Star } from 'lucide-react';
import './StarRating.css';

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

const DEFAULT_LABELS = ['Hated it', 'Disliked it', "It's okay", 'Liked it', 'Loved it!'];
const SPARK_ANGLES = [0, 60, 120, 180, 240, 300];

export interface StarRatingProps {
  count?: number;
  defaultValue?: number;
  size?: number;
  color?: string;
  emptyColor?: string;
  labels?: string[];
  showLabel?: boolean;
  readOnly?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}

// Six dots that fly outward once when a rating is committed — the little
// celebratory burst that makes a rating feel earned.
function Sparkles({ size, color }: { size: number; color: string }) {
  const radius = size * 0.7;
  return (
    <span className="star-rating-sparks" aria-hidden="true">
      {SPARK_ANGLES.map((deg, idx) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <motion.span
            key={idx}
            className="star-rating-spark"
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
}: StarRatingProps) {
  const prefersReduced = useReducedMotion();
  const [scope, animate] = useAnimate();
  const starRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  const commit = (next: number) => {
    if (readOnly) return;
    const clamped = clamp(next, 0, count);
    if (onChange && clamped !== value) onChange(clamped);
    setValue(clamped);
    setBurstId(id => id + 1);
    starRefs.current[clamped - 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (readOnly) return;
    let next: number;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = Math.min(count, (value || 0) + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = Math.max(1, (value || 1) - 1);
    else if (e.key === 'Home') next = 1;
    else if (e.key === 'End') next = count;
    else return;
    e.preventDefault();
    commit(next);
  };

  return (
    <div className={join('star-rating-root', className)} ref={scope} {...rest}>
      <div
        className="star-rating-stars"
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
              className="star-rating-star"
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
        <div className="star-rating-label-wrap" aria-live="polite">
          <AnimatePresence mode="wait">
            {currentLabel && (
              <motion.span
                key={value}
                className="star-rating-label"
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
