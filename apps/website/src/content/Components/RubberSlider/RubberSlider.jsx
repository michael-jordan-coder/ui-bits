import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useTransform, useReducedMotion } from 'motion/react';
import './RubberSlider.css';

const clamp = (val, min, max) => Math.min(Math.max(val, min), max);
const join = (...classes) => classes.filter(Boolean).join(' ');

// Diminishing-returns overscroll past the ends, iOS rubber-band style.
const rubberband = (distance, dimension, constant) =>
  (distance * dimension * constant) / (dimension + constant * Math.abs(distance));

const snapToStep = (value, min, step) => (step <= 0 ? value : min + Math.round((value - min) / step) * step);

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
}) {
  const prefersReduced = useReducedMotion();
  const trackRef = useRef(null);
  const draggingRef = useRef(false);

  const [value, setValue] = useState(() => clamp(defaultValue, min, max));

  const stretch = useMotionValue(0);
  const base = useMotionValue(((clamp(defaultValue, min, max) - min) / (max - min)) * width);

  const barScaleX = useTransform(stretch, v => (width + Math.abs(v)) / width);
  const barX = useTransform(stretch, v => v / 2);
  const handleX = useTransform([base, stretch], ([b, s]) => b + s);

  const fraction = (clamp(value, min, max) - min) / (max - min);

  // Keep the resting handle / fill in sync with the committed value.
  useEffect(() => {
    base.set(fraction * width);
  }, [base, fraction, width]);

  const commit = next => {
    const clamped = clamp(snapToStep(next, min, step), min, max);
    setValue(prev => {
      if (prev !== clamped && onChange) onChange(clamped);
      return clamped;
    });
    return clamped;
  };

  const updateFromPointer = clientX => {
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    const clamped = commit(min + ratio * (max - min));
    if (prefersReduced || (ratio >= 0 && ratio <= 1)) {
      stretch.set(0);
      return;
    }
    const overflow = ratio * width - ((clamped - min) / (max - min)) * width;
    stretch.set(rubberband(overflow, width, elasticity));
  };

  const handlePointerDown = e => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    updateFromPointer(e.clientX);
  };

  const handlePointerMove = e => {
    if (draggingRef.current) updateFromPointer(e.clientX);
  };

  const release = () => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (prefersReduced) stretch.set(0);
    else animate(stretch, 0, { type: 'spring', stiffness: 340, damping: 17, mass: 0.6 });
  };

  const handleKeyDown = e => {
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
    <div className={join('rubber-slider-root', className)} style={{ width }} {...rest}>
      {(label || showValue) && (
        <div className="rubber-slider-header">
          {label && <span className="rubber-slider-label">{label}</span>}
          {showValue && (
            <span className="rubber-slider-value" style={{ color: accentColor }}>
              {value}
              {valueSuffix}
            </span>
          )}
        </div>
      )}

      <div
        ref={trackRef}
        className="rubber-slider-track-area"
        style={{ width }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={release}
        onPointerCancel={release}
        onLostPointerCapture={release}
      >
        <motion.div
          className="rubber-slider-bar"
          style={{ scaleX: barScaleX, x: barX, y: '-50%', background: trackColor }}
        >
          <motion.div className="rubber-slider-fill" style={{ width: base, background: accentColor }} />
        </motion.div>

        <motion.div
          className="rubber-slider-handle"
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
