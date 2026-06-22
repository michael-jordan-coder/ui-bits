import { motion, useReducedMotion } from 'motion/react';
import './BlurText.css';

export default function BlurText({
  text = 'Ag — blur text resolves into focus',
  stagger = 0.06,
  duration = 0.6,
  blurAmount = 8,
  color,
  className = ''
}) {
  const reduceMotion = useReducedMotion();
  const words = text.split(' ');

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger }
    }
  };

  const word = {
    hidden: { opacity: 0, filter: `blur(${blurAmount}px)`, y: '0.2em' },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: { duration, ease: [0.16, 1, 0.3, 1] }
    }
  };

  if (reduceMotion) {
    return (
      <span className={`blur-text ${className}`.trim()} style={color ? { color } : undefined} aria-label={text}>
        {text}
      </span>
    );
  }

  return (
    <motion.span
      className={`blur-text ${className}`.trim()}
      style={color ? { color } : undefined}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <motion.span key={`${w}-${i}`} className="blur-text-word" variants={word} aria-hidden="true">
          {w}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.span>
  );
}
