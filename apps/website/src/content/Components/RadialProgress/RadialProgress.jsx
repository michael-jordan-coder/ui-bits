import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform, useReducedMotion } from 'motion/react';
import './RadialProgress.css';

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const join = (...classes) => classes.filter(Boolean).join(' ');

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
}) {
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
      className={join('radial-progress-root', className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuenow={target}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || 'Progress'}
      {...rest}
    >
      <svg className="radial-progress-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={center} cy={center} r={radius} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <motion.circle
          className="radial-progress-arc"
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={progressColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset, transformOrigin: '50% 50%' }}
        />
      </svg>

      {showValue && (
        <div className="radial-progress-content">
          <span className="radial-progress-value-row" style={{ fontSize: size * 0.26 }}>
            <motion.span className="radial-progress-value">{display}</motion.span>
            <span className="radial-progress-unit">%</span>
          </span>
          {label && <span className="radial-progress-label">{label}</span>}
        </div>
      )}
    </div>
  );
}
