import { useId, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';
import './FloatingInput.css';

const join = (...classes) => classes.filter(Boolean).join(' ');

const ERROR_COLOR = '#f87171';
const MUTED_COLOR = '#a1a1aa';

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
  onChange,
  ...rest
}) {
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

  const handleChange = event => {
    setValue(event.target.value);
    onChange?.(event);
  };

  return (
    <div className={join('floating-input', className)} data-disabled={disabled || undefined}>
      <div className="floating-input-field">
        {icon && (
          <span className="floating-input-icon" aria-hidden="true">
            {icon}
          </span>
        )}

        <span className="floating-input-control-wrap">
          <input
            id={inputId}
            className="floating-input-control"
            type={inputType}
            value={value}
            disabled={disabled}
            aria-invalid={hasError || undefined}
            aria-describedby={error || helperText ? helperId : undefined}
            style={{ caretColor: accentColor }}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...rest}
          />
          <motion.label
            htmlFor={inputId}
            className="floating-input-label"
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
            className="floating-input-toggle"
            onClick={() => setRevealed(prev => !prev)}
            disabled={disabled}
            aria-label={revealed ? 'Hide password' : 'Show password'}
          >
            {revealed ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        <motion.span
          className="floating-input-underline"
          style={{ backgroundColor: lineColor }}
          initial={false}
          animate={{ scaleX: focused || hasError ? 1 : 0 }}
          transition={transition}
          aria-hidden="true"
        />
      </div>

      {(error || helperText) && (
        <p id={helperId} className="floating-input-helper" style={{ color: hasError ? ERROR_COLOR : MUTED_COLOR }}>
          {error || helperText}
        </p>
      )}
    </div>
  );
}
