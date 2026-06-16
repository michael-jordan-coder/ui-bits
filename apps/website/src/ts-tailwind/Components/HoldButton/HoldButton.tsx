import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { motion, animate, useMotionValue, useReducedMotion } from 'motion/react';
import { Trash2, Check } from 'lucide-react';

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

type HoldButtonSize = 'sm' | 'md' | 'lg';

const ICON_SIZE: Record<HoldButtonSize, number> = { sm: 15, md: 17, lg: 19 };

const SIZE_CLASSES: Record<HoldButtonSize, string> = {
  sm: 'px-[1.1rem] py-[0.55rem] text-[0.85rem]',
  md: 'px-6 py-3 text-[0.95rem]',
  lg: 'px-[1.9rem] py-[0.95rem] text-[1.05rem]'
};

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
      className={join(
        'relative inline-flex cursor-pointer select-none items-center justify-center overflow-hidden rounded-full border font-semibold leading-none text-[#fafafa] outline-none [touch-action:none] [-webkit-tap-highlight-color:transparent] [box-shadow:0_10px_30px_-16px_rgba(0,0,0,0.7)] [will-change:transform] focus-visible:[box-shadow:0_10px_30px_-16px_rgba(0,0,0,0.7),0_0_0_3px_color-mix(in_srgb,var(--hold-accent)_45%,transparent)] disabled:cursor-not-allowed disabled:opacity-50',
        SIZE_CLASSES[size],
        className
      )}
      data-state={state}
      style={
        {
          '--hold-accent': accentColor,
          backgroundColor: '#18181b',
          borderColor: confirmed ? accentColor : 'color-mix(in srgb, var(--hold-accent) 55%, transparent)'
        } as CSSProperties
      }
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
      <motion.span
        className="absolute inset-0 z-0 origin-left [will-change:transform]"
        style={{ scaleX: progress, backgroundColor: accentColor }}
        aria-hidden="true"
      />
      {confirmed && !prefersReduced && (
        <motion.span
          className="pointer-events-none absolute inset-0 z-[2] rounded-[inherit] border-2"
          style={{ borderColor: accentColor }}
          initial={{ opacity: 0.55, scale: 0.9 }}
          animate={{ opacity: 0, scale: 1.25 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          aria-hidden="true"
        />
      )}
      <span className="relative z-[1] inline-flex items-center gap-2">
        {showIcon && (
          <span className="inline-flex leading-[0]" aria-hidden="true">
            {confirmed ? (
              <Check size={ICON_SIZE[size]} strokeWidth={2.6} />
            ) : (
              <Trash2 size={ICON_SIZE[size]} strokeWidth={2.2} />
            )}
          </span>
        )}
        <span className="whitespace-nowrap">{confirmed ? confirmedLabel : label}</span>
      </span>
      <span className="sr-only" role="status" aria-live="polite">
        {confirmed ? `${confirmedLabel}.` : ''}
      </span>
    </motion.button>
  );
}
