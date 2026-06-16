import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import './TypewriterText.css';

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

export interface TypewriterTextProps {
  strings?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
  showCursor?: boolean;
  cursorChar?: string;
  cursorBlink?: boolean;
  cursorColor?: string;
  className?: string;
}

// Types each phrase out one character at a time, holds it, deletes it, and moves
// on to the next — trailing a blinking caret the whole way. Inspired by the
// classic typewriter / terminal typing effect.
export default function TypewriterText({
  strings = ['Design once.', 'Ship everywhere.', 'Delight always.'],
  typingSpeed = 70,
  deletingSpeed = 40,
  pauseDuration = 1600,
  loop = true,
  showCursor = true,
  cursorChar = '|',
  cursorBlink = true,
  cursorColor = '#6366f1',
  className = ''
}: TypewriterTextProps) {
  const prefersReduced = useReducedMotion();
  const [displayed, setDisplayed] = useState('');
  const [stringIndex, setStringIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (prefersReduced || strings.length === 0) return undefined;
    const current = strings[stringIndex % strings.length];

    if (!deleting && displayed === current) {
      if (!loop && stringIndex >= strings.length - 1) return undefined;
      const hold = setTimeout(() => setDeleting(true), pauseDuration);
      return () => clearTimeout(hold);
    }

    if (deleting && displayed === '') {
      const advance = setTimeout(() => {
        setDeleting(false);
        setStringIndex(index => (index + 1) % strings.length);
      }, deletingSpeed);
      return () => clearTimeout(advance);
    }

    const tick = setTimeout(
      () => setDisplayed(current.slice(0, displayed.length + (deleting ? -1 : 1))),
      deleting ? deletingSpeed : typingSpeed
    );
    return () => clearTimeout(tick);
  }, [displayed, deleting, stringIndex, strings, loop, pauseDuration, typingSpeed, deletingSpeed, prefersReduced]);

  const shown = prefersReduced ? (strings[0] ?? '') : displayed;
  const blink = cursorBlink && !prefersReduced;

  return (
    <span className={join('typewriter-text', className)}>
      <span className="typewriter-text-sr">{strings.join('. ')}</span>
      <span className="typewriter-text-visible" aria-hidden="true">
        <span>{shown}</span>
        {showCursor && (
          <motion.span
            className="typewriter-text-cursor"
            style={{ color: cursorColor }}
            animate={blink ? { opacity: [1, 1, 0, 0] } : { opacity: 1 }}
            transition={blink ? { duration: 1, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: 'linear' } : { duration: 0 }}
          >
            {cursorChar}
          </motion.span>
        )}
      </span>
    </span>
  );
}
