import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { motion, animate, useMotionValue, useReducedMotion } from 'motion/react';
import { Trash2, Check } from 'lucide-react';
import './HoldButton.css';

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

type HoldButtonSize = 'sm' | 'md' | 'lg';

const ICON_SIZE: Record<HoldButtonSize, number> = { sm: 15, md: 17, lg: 19 };

export interface HoldButtonProps {
  label?: string;
  confirmedLabel?: string;
  duration?: number;
  accentColor?: string;
  size?: HoldButtonSize;
  showIcon?: boolean;
  autoReset?: boolean;
  resetDelay?: number;
  onConfirm?: () => void;
  disabled?: boolean;
  className?: string;
}

// A button that only fires once you press and hold it long enough for the
// accent fill to sweep all the way across — then it locks into a confirmed
// state with a check and a pulse. Releasing early springs the fill back to
// zero. A deliberate, satisfying guard for destructive actions, inspired by
// the press-and-hold confirm interactions catalogued on Design Spells.
export default function HoldButton({
  label = 'Hold to confirm',
  confirmedLabel = 'Confirmed',
  duration = 1200,
  accentColor = '#ef4444',
  size = 'md',
  showIcon = true,
  autoReset = true,
  resetDelay = 1600,
  onConfirm,
  disabled = false,
  className = '',
  ...rest
}: HoldButtonProps) {
  const prefersReduced = useReducedMotion();
  const progress = useMotionValue(0);
  const [state, setState] = useState<'idle' | 'holding' | 'confirmed'>('idle');

  const controlsRef = useRef<ReturnType<typeof animate> | null>(null);
  const heldRef = useRef(false);
  const resetTimer = useRef<number | null>(null);

  const stopControls = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stopControls();
    setState('idle');
    controlsRef.current = animate(progress, 0, { duration: prefersReduced ? 0 : 0.28, ease: 'easeOut' });
  }, [progress, prefersReduced, stopControls]);

  const handleComplete = useCallback(() => {
    heldRef.current = false;
    controlsRef.current = null;
    setState('confirmed');
    progress.set(1);
    onConfirm?.();
    if (autoReset) {
      resetTimer.current = window.setTimeout(reset, resetDelay);
    }
  }, [onConfirm, autoReset, resetDelay, progress, reset]);

  const startHold = useCallback(() => {
    if (disabled || state === 'confirmed' || heldRef.current) return;
    heldRef.current = true;
    setState('holding');
    stopControls();
    const remaining = duration * (1 - progress.get());
    controlsRef.current = animate(progress, 1, {
      duration: Math.max(remaining, 0) / 1000,
      ease: 'linear',
      onComplete: handleComplete
    });
  }, [disabled, state, duration, progress, handleComplete, stopControls]);

  const endHold = useCallback(() => {
    if (!heldRef.current) return;
    heldRef.current = false;
    if (state === 'holding') reset();
  }, [state, reset]);

  useEffect(
    () => () => {
      stopControls();
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    },
    [stopControls]
  );

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      startHold();
    }
  };

  const handleKeyUp = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      endHold();
    }
  };

  const confirmed = state === 'confirmed';

  return (
    <motion.button
      type="button"
      className={join('hold-button-root', className)}
      data-state={state}
      data-size={size}
      style={{ '--hold-accent': accentColor } as CSSProperties}
      disabled={disabled}
      aria-label={confirmed ? confirmedLabel : label}
      aria-pressed={state === 'holding'}
      animate={{ scale: state === 'holding' && !prefersReduced ? 0.97 : 1 }}
      transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 24 }}
      onPointerDown={startHold}
      onPointerUp={endHold}
      onPointerLeave={endHold}
      onPointerCancel={endHold}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onContextMenu={e => e.preventDefault()}
      {...rest}
    >
      <motion.span className="hold-button-fill" style={{ scaleX: progress }} aria-hidden="true" />
      {confirmed && !prefersReduced && (
        <motion.span
          className="hold-button-pulse"
          initial={{ opacity: 0.55, scale: 0.9 }}
          animate={{ opacity: 0, scale: 1.25 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          aria-hidden="true"
        />
      )}
      <span className="hold-button-content">
        {showIcon && (
          <span className="hold-button-icon" aria-hidden="true">
            {confirmed ? (
              <Check size={ICON_SIZE[size]} strokeWidth={2.6} />
            ) : (
              <Trash2 size={ICON_SIZE[size]} strokeWidth={2.2} />
            )}
          </span>
        )}
        <span className="hold-button-label">{confirmed ? confirmedLabel : label}</span>
      </span>
      <span className="hold-button-sr" role="status" aria-live="polite">
        {confirmed ? `${confirmedLabel}.` : ''}
      </span>
    </motion.button>
  );
}
