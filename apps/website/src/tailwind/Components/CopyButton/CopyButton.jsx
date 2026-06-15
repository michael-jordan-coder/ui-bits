import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check, Clipboard } from 'lucide-react';

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
      className={join(
        'relative inline-flex cursor-pointer items-center gap-2 rounded-[10px] border border-white/[0.18] bg-white/[0.06] px-4 py-[0.6rem] text-[0.9rem] font-semibold leading-none text-[#fafafa] outline-none transition-[color,border-color,background] duration-200 [-webkit-tap-highlight-color:transparent] hover:bg-white/10 focus-visible:shadow-[0_0_0_3px_rgba(255,255,255,0.25)]',
        className
      )}
      style={copied ? { color: accentColor, borderColor: accentColor } : undefined}
      onClick={handleClick}
      aria-label={copied ? copiedLabel : `${label} to clipboard`}
      whileTap={prefersReduced ? undefined : { scale: 0.95 }}
      {...rest}
    >
      {showIcon && (
        <span className="relative grid h-4 w-4 place-items-center">
          <AnimatePresence initial={false} mode="wait">
            {copied ? (
              <motion.span
                key="check"
                className="absolute grid place-items-center leading-[0]"
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
                className="absolute grid place-items-center leading-[0]"
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

      <span className="text-left" style={{ minWidth: reserve }}>
        {copied ? copiedLabel : label}
      </span>

      {copied && !prefersReduced && (
        <motion.span
          key={pulseId}
          className="pointer-events-none absolute -inset-px rounded-[10px] border-[1.5px]"
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
