import { useId, useState, type ChangeEvent, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

const ERROR_COLOR = '#f87171';
const MUTED_COLOR = '#a1a1aa';

export interface FloatingInputProps {
  label?: string;
  type?: string;
  defaultValue?: string;
  helperText?: string;
  error?: string;
  accentColor?: string;
  disabled?: boolean;
  icon?: ReactNode;
  className?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

// A filled text field whose label rests as a placeholder, then floats up and
// shrinks the moment the field is focused or filled, while an accent underline
// sweeps in from the center. Inspired by Google's Material Design floating label.
export default function FloatingInput({
  label = 'Email address',
  type = 'text',
  defaultValue = '',
  helperText = '',
  error = '',
  accentColor = '#6366f1',
  disabled = false,
  icon = null,
  className = '',
  onChange
}: FloatingInputProps) {
  const prefersReduced = useReducedMotion();
  const inputId = useId();
  const helperId = useId();
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const isPassword = type === 'password';
  const hasError = Boolean(error);
  const active = focused || String(value).length > 0;
  const inputType = isPassword && revealed ? 'text' : type;
  const labelColor = hasError ? ERROR_COLOR : active ? accentColor : MUTED_COLOR;
  const lineColor = hasError ? ERROR_COLOR : accentColor;
  const transition = prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 440, damping: 34 };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    onChange?.(event);
  };

  return (
    <div
      className={join('w-[22rem] max-w-full data-[disabled]:pointer-events-none data-[disabled]:opacity-[0.55]', className)}
      data-disabled={disabled || undefined}
    >
      <div className="relative flex items-center gap-[0.65rem] rounded-t-[0.6rem] bg-white/[0.05] px-[0.9rem] pb-[0.5rem] pt-[1.1rem] [border-bottom:1.5px_solid_rgba(255,255,255,0.22)]">
        {icon && (
          <span className="pointer-events-none flex shrink-0 text-[#a1a1aa]" aria-hidden="true">
            {icon}
          </span>
        )}

        <span className="relative min-w-0 flex-1">
          <input
            id={inputId}
            className="m-0 block w-full border-none bg-transparent p-0 text-base leading-[1.5] text-[#fafafa] outline-none [&:-webkit-autofill]:[-webkit-text-fill-color:#fafafa]"
            type={inputType}
            value={value}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={error || helperText ? helperId : undefined}
            style={{ caretColor: accentColor }}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <motion.label
            htmlFor={inputId}
            className="pointer-events-none absolute left-0 top-0 whitespace-nowrap text-base leading-[1.5] [will-change:transform] motion-reduce:[will-change:auto]"
            style={{ transformOrigin: 'left center' }}
            initial={false}
            animate={{ y: active ? -18 : 0, scale: active ? 0.8 : 1, color: labelColor }}
            transition={transition}
          >
            {label}
          </motion.label>
        </span>

        {isPassword && (
          <button
            type="button"
            className="flex shrink-0 cursor-pointer items-center justify-center rounded-[0.4rem] border-none bg-transparent p-[0.3rem] text-[#a1a1aa] outline-none hover:text-[#e4e4e7] focus-visible:text-[#e4e4e7] focus-visible:[box-shadow:0_0_0_2px_rgba(255,255,255,0.7)]"
            onClick={() => setRevealed(prev => !prev)}
            disabled={disabled}
            aria-label={revealed ? 'Hide password' : 'Show password'}
          >
            {revealed ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        <motion.span
          className="absolute bottom-[-1.5px] left-0 h-[2px] w-full origin-center rounded-[2px]"
          style={{ backgroundColor: lineColor }}
          initial={false}
          animate={{ scaleX: focused || hasError ? 1 : 0 }}
          transition={transition}
          aria-hidden="true"
        />
      </div>

      {(error || helperText) && (
        <p
          id={helperId}
          className="mt-[0.45rem] min-h-[1rem] px-[0.2rem] text-[0.78rem] leading-[1.3]"
          style={{ color: hasError ? ERROR_COLOR : MUTED_COLOR }}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}
