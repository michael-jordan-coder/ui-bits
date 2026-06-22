import { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import './SplitText.css';

const splitUnits = (text, as) => {
  if (as === 'words') {
    // Keep whitespace runs as standalone units so word spacing survives the split.
    return text.split(/(\s+)/).filter(part => part.length > 0);
  }
  return Array.from(text);
};

export default function SplitText({
  text = 'Ag — split text reveal',
  as = 'chars',
  stagger = 0.03,
  duration = 0.5,
  color,
  className = ''
}) {
  const reduceMotion = useReducedMotion();
  const units = useMemo(() => splitUnits(text, as), [text, as]);
  const style = color ? { color } : undefined;

  if (reduceMotion) {
    return (
      <span className={`split-text ${className}`.trim()} style={style}>
        {text}
      </span>
    );
  }

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: stagger } }
  };

  const unit = {
    hidden: { opacity: 0, y: '0.5em' },
    visible: { opacity: 1, y: 0, transition: { duration, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <motion.span
      className={`split-text ${className}`.trim()}
      style={style}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.6 }}
      aria-label={text}
    >
      {units.map((part, i) => (
        <motion.span key={`${i}-${part}`} className="split-text-unit" variants={unit} aria-hidden="true">
          {/^\s+$/.test(part) ? ' ' : part}
        </motion.span>
      ))}
    </motion.span>
  );
}
