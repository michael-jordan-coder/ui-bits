import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import './ThemeToggle.css';

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');
const STAR_DOTS = [
  { x: 0.32, y: 0.3, r: 1.4 },
  { x: 0.5, y: 0.62, r: 1 },
  { x: 0.66, y: 0.34, r: 1.2 }
];

export interface ThemeToggleProps {
  defaultDark?: boolean;
  size?: number;
  lightColor?: string;
  darkColor?: string;
  showLabel?: boolean;
  labels?: { light: string; dark: string };
  onChange?: (isDark: boolean) => void;
  className?: string;
}

// A sun/moon switch: the knob springs across the track, the icon morphs with a
// rotate-and-scale swap, and stars fade in over the night sky. Inspired by the
// classic sun/moon dark-mode toggle interaction (see reactbits.dev).
export default function ThemeToggle({
  defaultDark = false,
  size = 30,
  lightColor = '#7dd3fc',
  darkColor = '#1e293b',
  showLabel = false,
  labels = { light: 'Light', dark: 'Dark' },
  onChange,
  className = '',
  ...rest
}: ThemeToggleProps) {
  const prefersReduced = useReducedMotion();
  const [isDark, setIsDark] = useState(defaultDark);

  const pad = Math.round(size * 0.2);
  const trackW = size * 2 + pad * 2;
  const trackH = size + pad * 2;
  const travel = size;
  const iconSize = Math.round(size * 0.62);

  const spring = prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 30 };

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    onChange?.(next);
  };

  return (
    <div className={join('theme-toggle-root', className)} {...rest}>
      <motion.button
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label="Toggle dark mode"
        className="theme-toggle-track"
        style={{ width: trackW, height: trackH, padding: pad, borderRadius: trackH }}
        onClick={toggle}
        animate={{ backgroundColor: isDark ? darkColor : lightColor }}
        transition={prefersReduced ? { duration: 0 } : { duration: 0.5, ease: 'easeInOut' }}
        whileTap={prefersReduced ? undefined : { scale: 0.96 }}
      >
        <span className="theme-toggle-stars" aria-hidden="true">
          {STAR_DOTS.map((s, i) => (
            <motion.span
              key={i}
              className="theme-toggle-star"
              style={{ left: `${s.x * 100}%`, top: `${s.y * 100}%`, width: s.r * 2, height: s.r * 2 }}
              animate={{ opacity: isDark ? 0.9 : 0, scale: isDark ? 1 : 0.2 }}
              transition={prefersReduced ? { duration: 0 } : { duration: 0.4, delay: isDark ? 0.15 + i * 0.05 : 0 }}
            />
          ))}
        </span>

        <motion.span
          className="theme-toggle-knob"
          style={{ width: size, height: size }}
          animate={{ x: isDark ? travel : 0 }}
          transition={spring}
        >
          <AnimatePresence initial={false} mode="wait">
            {isDark ? (
              <motion.span
                key="moon"
                className="theme-toggle-icon"
                initial={{ rotate: -90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0, opacity: 0 }}
                transition={prefersReduced ? { duration: 0 } : { duration: 0.3 }}
              >
                <Moon size={iconSize} color="#475569" fill="#cbd5e1" strokeWidth={2} />
              </motion.span>
            ) : (
              <motion.span
                key="sun"
                className="theme-toggle-icon"
                initial={{ rotate: 90, scale: 0, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0, opacity: 0 }}
                transition={prefersReduced ? { duration: 0 } : { duration: 0.3 }}
              >
                <Sun size={iconSize} color="#f59e0b" fill="#fbbf24" strokeWidth={2} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.span>
      </motion.button>

      {showLabel && (
        <span className="theme-toggle-label" aria-live="polite">
          {isDark ? labels.dark : labels.light}
        </span>
      )}
    </div>
  );
}
