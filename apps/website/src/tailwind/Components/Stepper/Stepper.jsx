import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Minus, Plus } from 'lucide-react';

const join = (...classes) => classes.filter(Boolean).join(' ');
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

// Hold-to-accelerate: the repeat interval ramps from slow to fast the longer a
// button stays pressed, mirroring the feel of native iOS steppers.
const FIRST_DELAY = 320;
const MIN_INTERVAL = 55;
const RAMP = 0.82;

function StepperButton({ label, accentColor, disabled, onStart, onStop, prefersReduced, children }) {
  return (
    <motion.button
      type="button"
      className="inline-flex h-10 w-10 flex-none cursor-pointer items-center justify-center rounded-[10px] border-none bg-white/[0.06] p-0 touch-none enabled:hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
      style={{ color: accentColor }}
      aria-label={label}
      disabled={disabled}
      tabIndex={-1}
      onPointerDown={event => {
        if (disabled) return;
        event.currentTarget.setPointerCapture?.(event.pointerId);
        onStart();
      }}
      onPointerUp={onStop}
      onPointerLeave={onStop}
      onPointerCancel={onStop}
      whileTap={prefersReduced || disabled ? undefined : { scale: 0.86 }}
    >
      {children}
    </motion.button>
  );
}

// A quantity stepper with press-and-hold acceleration and a direction-aware value
// roll. Inspired by the hold-to-repeat stepper interaction documented on reactbits.dev.
export default function Stepper({
  value: valueProp,
  defaultValue = 1,
  min = 0,
  max = 99,
  step = 1,
  accentColor = '#6366f1',
  surfaceColor = '#1c1c22',
  holdToAccelerate = true,
  onChange,
  className = '',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const isControlled = valueProp !== undefined;
  const [internal, setInternal] = useState(() => clamp(defaultValue, min, max));
  const value = isControlled ? clamp(valueProp, min, max) : internal;
  const [direction, setDirection] = useState(1);

  const valueRef = useRef(value);
  valueRef.current = value;
  const timerRef = useRef(null);

  const apply = next => {
    const clamped = clamp(next, min, max);
    if (clamped === valueRef.current) return;
    setDirection(clamped > valueRef.current ? 1 : -1);
    if (!isControlled) setInternal(clamped);
    onChange?.(clamped);
  };

  const stepBy = dir => apply(valueRef.current + dir * step);

  const stopHold = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const startHold = dir => {
    stepBy(dir);
    if (!holdToAccelerate) return;
    let interval = FIRST_DELAY;
    const tick = () => {
      stepBy(dir);
      interval = Math.max(MIN_INTERVAL, interval * RAMP);
      timerRef.current = setTimeout(tick, interval);
    };
    timerRef.current = setTimeout(tick, interval);
  };

  useEffect(() => stopHold, []);

  const handleKeyDown = event => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
      event.preventDefault();
      stepBy(1);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      event.preventDefault();
      stepBy(-1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      apply(min);
    } else if (event.key === 'End') {
      event.preventDefault();
      apply(max);
    }
  };

  const offset = prefersReduced ? 0 : 14;

  return (
    <div
      className={join(
        'inline-flex select-none items-center gap-1 rounded-[14px] border border-white/[0.08] p-[0.3rem] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
        className
      )}
      style={{ background: surfaceColor }}
      role="spinbutton"
      aria-valuenow={value}
      aria-valuemin={min}
      aria-valuemax={max}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <StepperButton
        label="Decrease"
        accentColor={accentColor}
        disabled={value <= min}
        onStart={() => startHold(-1)}
        onStop={stopHold}
        prefersReduced={prefersReduced}
      >
        <Minus size={18} strokeWidth={2.4} aria-hidden="true" />
      </StepperButton>

      <div className="relative flex h-10 min-w-[56px] items-center justify-center overflow-hidden text-[1.05rem] font-semibold tabular-nums" aria-hidden="true">
        <motion.span
          key={value}
          className="inline-block"
          initial={{ y: direction * offset, opacity: 0.3 }}
          animate={{ y: 0, opacity: 1 }}
          transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 700, damping: 38 }}
        >
          {value}
        </motion.span>
      </div>

      <StepperButton
        label="Increase"
        accentColor={accentColor}
        disabled={value >= max}
        onStart={() => startHold(1)}
        onStop={stopHold}
        prefersReduced={prefersReduced}
      >
        <Plus size={18} strokeWidth={2.4} aria-hidden="true" />
      </StepperButton>
    </div>
  );
}
