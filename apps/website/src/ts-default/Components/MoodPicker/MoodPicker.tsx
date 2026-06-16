import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useAnimate, useReducedMotion } from 'motion/react';
import './MoodPicker.css';

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

export interface Mood {
  id: string;
  label: string;
  color: string;
  shape: string;
}

export interface MoodPickerProps {
  moods?: Mood[];
  defaultValue?: string | null;
  size?: number;
  gap?: number;
  showHero?: boolean;
  showLabel?: boolean;
  readOnly?: boolean;
  onChange?: (id: string) => void;
  className?: string;
}

// Each mood owns a unique organic silhouette (an 8-value border-radius) and a
// flat color. The hero blob tweens between these silhouettes with a CSS paint
// transition, so picking a mood literally morphs one shape into the next.
const DEFAULT_MOODS: Mood[] = [
  { id: 'awful', label: 'Awful', color: '#6b7280', shape: '46% 54% 43% 57% / 58% 44% 56% 42%' },
  { id: 'bad', label: 'Bad', color: '#6366f1', shape: '62% 38% 54% 46% / 49% 57% 43% 51%' },
  { id: 'okay', label: 'Okay', color: '#14b8a6', shape: '50% 50% 50% 50% / 50% 50% 50% 50%' },
  { id: 'good', label: 'Good', color: '#f59e0b', shape: '57% 43% 47% 53% / 44% 56% 44% 56%' },
  { id: 'great', label: 'Great', color: '#f43f5e', shape: '38% 62% 63% 37% / 62% 39% 61% 38%' }
];

const NEUTRAL_SHAPE = '50% 50% 50% 50% / 50% 50% 50% 50%';
const NEUTRAL_COLOR = 'rgba(255, 255, 255, 0.14)';

// Mood colors default to hex; soften one into an rgba glow without a dependency.
const withAlpha = (color: string, alpha: number) => {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color);
  if (!match) return color;
  let hex = match[1];
  if (hex.length === 3)
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  const n = parseInt(hex, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

// A row of mood blobs whose hero shape morphs as you hover and commit a choice.
// Inspired by the emotion picker in How We Feel, where each feeling morphs into
// its own unique shape — documented on designspells.com.
export default function MoodPicker({
  moods = DEFAULT_MOODS,
  defaultValue = 'okay',
  size = 56,
  gap = 14,
  showHero = true,
  showLabel = true,
  readOnly = false,
  onChange,
  className = '',
  ...rest
}: MoodPickerProps) {
  const prefersReduced = useReducedMotion();
  const [scope, animate] = useAnimate();
  const heroRef = useRef<HTMLDivElement | null>(null);
  const blobRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [value, setValue] = useState<string | null>(() =>
    moods.some(m => m.id === defaultValue) ? (defaultValue ?? null) : null
  );
  const [hover, setHover] = useState<string | null>(null);

  // Drop the selection if the mood it pointed at is no longer offered.
  useEffect(() => {
    setValue(prev => (prev != null && moods.some(m => m.id === prev) ? prev : null));
  }, [moods]);

  const displayMood = moods.find(m => m.id === (hover || value)) || null;
  const heroColor = displayMood ? displayMood.color : NEUTRAL_COLOR;
  const heroShape = displayMood ? displayMood.shape : NEUTRAL_SHAPE;
  const currentLabel = displayMood ? displayMood.label : '';
  const heroSize = Math.round(size * 1.55);

  const blobTransition = prefersReduced
    ? { duration: 0 }
    : ({ type: 'spring', stiffness: 420, damping: 26 } as const);

  const commit = (id: string) => {
    if (readOnly) return;
    if (onChange && id !== value) onChange(id);
    setValue(id);
    const idx = moods.findIndex(m => m.id === id);
    blobRefs.current[idx]?.focus();
    if (!prefersReduced && heroRef.current) {
      animate(heroRef.current, { scale: [1, 1.07, 1] }, { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (readOnly) return;
    const idx = value == null ? -1 : moods.findIndex(m => m.id === value);
    let nextIdx: number;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIdx = Math.min(moods.length - 1, idx + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIdx = idx === -1 ? 0 : Math.max(0, idx - 1);
    else if (e.key === 'Home') nextIdx = 0;
    else if (e.key === 'End') nextIdx = moods.length - 1;
    else return;
    e.preventDefault();
    commit(moods[nextIdx].id);
  };

  return (
    <div className={join('mood-picker-root', className)} ref={scope} {...rest}>
      {showHero && (
        <div className="mood-picker-hero-wrap" style={{ height: heroSize }}>
          <div
            ref={heroRef}
            className="mood-picker-hero"
            aria-hidden="true"
            style={{
              width: heroSize,
              height: heroSize,
              background: heroColor,
              borderRadius: heroShape,
              boxShadow: `0 22px 50px -18px ${withAlpha(heroColor, 0.65)}`,
              transition: prefersReduced
                ? 'none'
                : 'border-radius 0.6s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.45s ease, box-shadow 0.45s ease'
            }}
          />
        </div>
      )}

      {showLabel && (
        <div className="mood-picker-label-wrap" aria-live="polite">
          <AnimatePresence mode="wait">
            {currentLabel && (
              <motion.span
                key={currentLabel}
                className="mood-picker-label"
                style={{ color: heroColor }}
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

      <div
        className="mood-picker-row"
        role="radiogroup"
        aria-label="Mood"
        onMouseLeave={() => setHover(null)}
        style={{ gap, pointerEvents: readOnly ? 'none' : undefined }}
      >
        {moods.map((m, i) => {
          const selected = value === m.id;
          const active = selected || hover === m.id;
          const tabbable = !readOnly && (value == null ? i === 0 : selected);
          return (
            <motion.button
              key={m.id}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={m.label}
              tabIndex={tabbable ? 0 : -1}
              disabled={readOnly}
              className="mood-picker-blob"
              data-selected={selected}
              ref={el => {
                blobRefs.current[i] = el;
              }}
              style={{
                width: size,
                height: size,
                background: m.color,
                borderRadius: m.shape,
                boxShadow: selected
                  ? `0 0 0 4px ${withAlpha(m.color, 0.22)}, 0 12px 26px -8px ${withAlpha(m.color, 0.6)}`
                  : '0 6px 16px -10px rgba(0, 0, 0, 0.6)'
              }}
              animate={{
                scale: selected ? 1.16 : hover === m.id ? 1.08 : 1,
                y: selected ? -4 : 0,
                opacity: active ? 1 : 0.78
              }}
              transition={blobTransition}
              whileTap={!readOnly && !prefersReduced ? { scale: 0.92 } : undefined}
              onClick={() => commit(m.id)}
              onMouseEnter={() => !readOnly && setHover(m.id)}
              onKeyDown={handleKeyDown}
            />
          );
        })}
      </div>
    </div>
  );
}
