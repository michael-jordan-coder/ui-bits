import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { animate, motion, useMotionValue, useTransform, useReducedMotion } from 'motion/react';

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

// Diminishing-returns overscroll past the ends, iOS rubber-band style.
const rubberband = (distance: number, dimension: number, constant: number) =>
  (distance * dimension * constant) / (dimension + constant * Math.abs(distance));

const snapToStep = (value: number, min: number, step: number) =>
  step <= 0 ? value : min + Math.round((value - min) / step) * step;

export interface RubberSliderProps {
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  width?: number;
  accentColor?: string;
  trackColor?: string;
  label?: string;
  valueSuffix?: string;
  showValue?: boolean;
  elasticity?: number;
  onChange?: (value: number) => void;
  className?: string;
  style?: CSSProperties;
}

// A horizontal slider whose bar stretches elastically when you drag the handle
// past either end, then springs back on release. Inspired by the rubber-banding
// timer slider in Opal documented on designspells.com.
export default function RubberSlider({
  defaultValue = 40,
  min = 0,
  max = 100,
  step = 1,
  width = 320,
  accentColor = '#6366f1',
  trackColor = 'rgba(255, 255, 255, 0.12)',
  label = 'Focus duration',
  valueSuffix = ' min',
  showValue = true,
  elasticity = 0.35,
  onChange,
  className = '',
  ...rest
}: RubberSliderProps) {
  const prefersReduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const [value, setValue] = useState(() => clamp(defaultValue, min, max));

  const stretch = useMotionValue(0);
  const base = useMotionValue(((clamp(defaultValue, min, max) - min) / (max - min)) * width);

  const barScaleX = useTransform(stretch, v => (width + Math.abs(v)) / width);
  const barX = useTransform(stretch, v => v / 2);
  const handleX = useTransform([base, stretch], ([b, s]: number[]) => b + s);

  const fraction = (clamp(value, min, max) - min) / (max - min);

  // Keep the resting handle / fill in sync with the committed value.
  useEffect(() => {
    base.set(fraction * width);
  }, [base, fraction, width]);

  const commit = (next: number) => {
    const clamped = clamp(snapToStep(next, min, step), min, max);
    setValue(prev => {
      if (prev !== clamped && onChange) onChange(clamped);
      return clamped;
    });
    return clamped;
  };

  const updateFromPointer = (clientX: number) => {
    const rect = trackRef.current!.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const clamped = commit(min + ratio * (max - min));
    if (prefersReduced || (ratio >= 0 && ratio <= 1)) {
      stretch.set(0);
      return;
    }
    const overflow = ratio * width - ((clamped - min) / (max - min)) * width;
    stretch.set(rubberband(overflow, width, elasticity));
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateFromPointer(e.clientX);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) updateFromPointer(e.clientX);
  };

  const release = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (prefersReduced) stretch.set(0);
    else animate(stretch, 0, { type: 'spring', stiffness: 340, damping: 17, mass: 0.6 });
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    let next = value;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') next = value + step;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') next = value - step;
    else if (e.key === 'Home') next = min;
    else if (e.key === 'End') next = max;
    else return;
    e.preventDefault();
    commit(next);
  };

  return (
    <div
      className={join('flex flex-col gap-[0.85rem] font-sans text-white select-none [touch-action:none]', className)}
      style={{ width }}
      {...rest}
    >
      {(label || showValue) && (
        <div className="flex items-baseline justify-between gap-4">
          {label && (
            <span className="text-[0.8rem] font-medium uppercase tracking-[0.02em] text-white/55">{label}</span>
          )}
          {showValue && (
            <span className="text-base font-bold leading-none tabular-nums tracking-[-0.01em]" style={{ color: accentColor }}>
              {value}
              {valueSuffix}
            </span>
          )}
        </div>
      )}

      <div
        ref={trackRef}
        className="relative h-6 cursor-pointer"
        style={{ width }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={release}
      >
        <motion.div
          className="absolute left-0 top-1/2 h-[6px] w-full rounded-full will-change-transform"
          style={{ scaleX: barScaleX, x: barX, y: '-50%', background: trackColor }}
        >
          <motion.div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{ width: base, background: accentColor }}
          />
        </motion.div>

        <motion.div
          className="absolute left-0 top-1/2 -ml-2.5 h-5 w-5 cursor-grab rounded-full border-2 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.35)] outline-none will-change-transform active:cursor-grabbing focus-visible:shadow-[0_4px_12px_rgba(0,0,0,0.35),0_0_0_4px_rgba(255,255,255,0.25)]"
          role="slider"
          tabIndex={0}
          aria-label={label || 'Slider'}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-valuetext={`${value}${valueSuffix}`}
          onKeyDown={handleKeyDown}
          style={{ x: handleX, y: '-50%', borderColor: accentColor }}
        />
      </div>
    </div>
  );
}
