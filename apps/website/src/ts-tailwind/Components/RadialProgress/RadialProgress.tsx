import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform, useReducedMotion } from 'motion/react';

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

export interface RadialProgressProps {
  value?: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
  showValue?: boolean;
  duration?: number;
  label?: string;
  className?: string;
}

// A clean circular progress ring: an SVG stroke whose dashoffset sweeps from
// empty to the target percentage on mount (and on every value change), with the
// centered number counting up from 0 in lockstep. The progress arc is rotated
// -90deg so it grows clockwise from twelve o'clock. Respects reduced motion by
// snapping straight to the final value.
export default function RadialProgress({
  value = 72,
  size = 160,
  strokeWidth = 12,
  trackColor = '#26282f',
  progressColor = '#6366f1',
  showValue = true,
  duration = 1.2,
  label,
  className = '',
  ...rest
}: RadialProgressProps) {
  const prefersReduced = useReducedMotion();

  const target = clamp(value, 0, 100);
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;

  const count = useMotionValue(0);
  const display = useTransform(count, v => Math.round(v));
  const dashOffset = useTransform(count, v => circumference * (1 - clamp(v / 100, 0, 1)));

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
      className={join('relative inline-flex items-center justify-center font-[inherit]', className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={target}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || 'Progress'}
      {...rest}
    >
      <svg
        className="block overflow-visible"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden="true"
      >
        <circle cx={center} cy={center} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset, transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>

      {showValue && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-[0.2em]">
          <span className="flex items-baseline gap-[0.04em] leading-none text-white" style={{ fontSize: size * 0.26 }}>
            <motion.span className="font-bold tracking-[-0.03em] [font-variant-numeric:tabular-nums]">
              {display}
            </motion.span>
            <span className="text-[0.42em] font-semibold text-white/55">%</span>
          </span>
          {label && (
            <span className="text-[0.78rem] font-medium uppercase tracking-[0.02em] text-white/55">{label}</span>
          )}
        </div>
      )}
    </div>
  );
}
