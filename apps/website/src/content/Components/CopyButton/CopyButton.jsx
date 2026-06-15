import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, Clipboard } from 'lucide-react';
import './CopyButton.css';

const join = (...classes) => classes.filter(Boolean).join(' ');

// A copy-to-clipboard button: the clipboard icon morphs into a check, the label
// swaps to "Copied!", and a ring pulses out, then it all reverts. Inspired by
// the copy-confirmation buttons in apps like Vercel and Linear.
export default function CopyButton({
  value = '',
  label = 'Copy',
  copiedLabel = 'Copied!',
  timeout = 1600,
  showIcon = true,
  accentColor = '#22c55e',
  onCopy,
  className = '',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [pulseId, setPulseId] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const handleClick = async () => {
    try {
      await navigator.clipboard?.writeText(value);
    } catch {
      // Clipboard may be unavailable (e.g. insecure context) — still confirm visually.
    }
    onCopy?.(value);
    setCopied(true);
    setPulseId(id => id + 1);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), timeout);
  };

  const iconSize = 16;
  const reserve = `${Math.max(label.length, copiedLabel.length)}ch`;

  return (
    <motion.button
      type="button"
      className={join('copy-button-root', copied && 'copy-button-root--copied', className)}
      style={copied ? { color: accentColor, borderColor: accentColor } : undefined}
      onClick={handleClick}
      aria-label={copied ? copiedLabel : `${label} to clipboard`}
      whileTap={prefersReduced ? undefined : { scale: 0.95 }}
      {...rest}
    >
      {showIcon && (
        <span className="copy-button-icon">
          <AnimatePresence initial={false} mode="wait">
            {copied ? (
              <motion.span
                key="check"
                className="copy-button-glyph"
                initial={prefersReduced ? false : { scale: 0, rotate: -45, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={prefersReduced ? { opacity: 0 } : { scale: 0, rotate: 45, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Check size={iconSize} strokeWidth={2.5} />
              </motion.span>
            ) : (
              <motion.span
                key="clipboard"
                className="copy-button-glyph"
                initial={prefersReduced ? false : { scale: 0, rotate: 45, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={prefersReduced ? { opacity: 0 } : { scale: 0, rotate: -45, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Clipboard size={iconSize} strokeWidth={2.2} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      )}

      <span className="copy-button-label" style={{ minWidth: reserve }}>
        {copied ? copiedLabel : label}
      </span>

      {copied && !prefersReduced && (
        <motion.span
          key={pulseId}
          className="copy-button-pulse"
          style={{ borderColor: accentColor }}
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: 1.35, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          aria-hidden="true"
        />
      )}
    </motion.button>
  );
}
