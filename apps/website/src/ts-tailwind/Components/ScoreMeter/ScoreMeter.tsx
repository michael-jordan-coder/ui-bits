import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform, useReducedMotion } from 'motion/react';

export interface ScoreMeterProps extends React.HTMLAttributes<HTMLDivElement> {
  score?: number;
  max?: number;
  size?: number;
  thickness?: number;
  duration?: number;
  label?: string;
  showValue?: boolean;
  showMax?: boolean;
  trackColor?: string;
  lowColor?: string;
  midColor?: string;
  highColor?: string;
  className?: string;
}

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

// A circular gauge whose score counts up from 0 while the ring sweeps in and the
// color climbs through the low / mid / high stops. Inspired by the 1Password
// Watchtower security-score reveal on designspells.com.
export default function ScoreMeter({
  score = 87,
  max = 100,
  size = 200,
  thickness = 14,
  duration = 1.6,
  label = 'Security score',
  showValue = true,
  showMax = false,
  trackColor = 'rgba(255, 255, 255, 0.1)',
  lowColor = '#f43f5e',
  midColor = '#f59e0b',
  highColor = '#22c55e',
  className = '',
  ...rest
}: ScoreMeterProps) {
  const prefersReduced = useReducedMotion();

  const target = clamp(score, 0, max);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  const count = useMotionValue(0);
  const display = useTransform(count, v => Math.round(v));
  const dashOffset = useTransform(count, v => circumference * (1 - clamp(v / max, 0, 1)));
  const tint = useTransform(count, [0, max / 2, max], [lowColor, midColor, highColor]);

  useEffect(() => {
    if (prefersReduced) {
      count.set(target);
      return undefined;
    }
    count.set(0);
    const controls = animate(count, target, { duration: Math.max(0, duration), ease: [0.16, 1, 0.3, 1] });
    return () => controls.stop();
  }, [count, target, duration, prefersReduced]);

  return (
    <div
      className={join('relative inline-flex items-center justify-center font-sans', className)}
      style={{ width: size, height: size }}
      role="meter"
      aria-valuenow={target}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label || 'Score'}
      {...rest}
    >
      <svg
        className="block -rotate-90 overflow-visible"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={thickness} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ stroke: tint, strokeDashoffset: dashOffset }}
        />
      </svg>

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-[0.15em]">
        {showValue && (
          <div className="flex items-baseline gap-[0.08em]">
            <motion.span
              className="font-bold leading-none tracking-[-0.02em] tabular-nums"
              style={{ color: tint, fontSize: size * 0.26 }}
            >
              {display}
            </motion.span>
            {showMax && <span className="text-[0.9rem] font-semibold text-white/45">/{max}</span>}
          </div>
        )}
        {label && (
          <span className="text-[0.8rem] font-medium uppercase tracking-[0.02em] text-white/55">{label}</span>
        )}
      </div>
    </div>
  );
}
