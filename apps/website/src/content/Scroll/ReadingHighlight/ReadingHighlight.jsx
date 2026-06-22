import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import './ReadingHighlight.css';

const join = (...classes) => classes.filter(Boolean).join(' ');

const DEFAULT_TEXT =
  'Good software starts as a small honest idea and grows one careful decision at a time. You read each line slowly, let the meaning settle, and only then move on to the next thought.';

// Fraction of total scroll progress over which the highlight sweep travels from the
// first word to the last. The remaining progress lets the finished block hold.
const SWEEP_SPAN = 0.72;
// Width of each word's own brighten window, as a fraction of progress. A small window
// keeps the highlight crisp; overlap with neighbours keeps the sweep smooth.
const WORD_WINDOW = 0.14;

// One word in the paragraph. Its color interpolates from `dim` to `bright` over a slice
// of the shared scroll progress keyed to its index, so the highlight sweeps left-to-right,
// top-to-bottom through the block as the panel scrolls.
function Word({ index, total, progress, dim, bright, reduce, word }) {
  const start = total > 1 ? (index / (total - 1)) * SWEEP_SPAN : 0;
  const end = Math.min(1, start + WORD_WINDOW);

  const color = useTransform(progress, [start, end], [dim, bright], { clamp: true });

  // Trailing space is part of the span so screen readers read the words as a normal,
  // continuously-spaced sentence rather than as run-together fragments.
  return (
    <motion.span className="reading-highlight-word" style={{ color: reduce ? bright : color }}>
      {word}{' '}
    </motion.span>
  );
}

// A guided-reading highlight: a paragraph whose words light up one-by-one as you scroll,
// sweeping through the block like a reading guide. Self-contained — it owns an internal
// scroll container with a tall track and a sticky stage holding the paragraph, so it
// drives the sweep without hijacking the page scroll. Reduced-motion users get the full
// paragraph at `bright` with no movement.
export default function ReadingHighlight({
  text = DEFAULT_TEXT,
  dim = '#3a3f4b',
  bright = '#f5f7fa',
  height = 460,
  className = '',
  ...rest
}) {
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ container: ref });

  const words = text.split(/\s+/).filter(Boolean);
  const total = words.length;

  return (
    <div {...rest} ref={ref} className={join('reading-highlight', className)} style={{ height, ...rest.style }}>
      <div className="reading-highlight-track" style={{ height: height * 2.4 }}>
        <div className="reading-highlight-stage" style={{ height }}>
          <p className="reading-highlight-text">
            {words.map((word, i) => (
              <Word
                key={i}
                index={i}
                total={total}
                progress={scrollYProgress}
                dim={dim}
                bright={bright}
                reduce={reduce}
                word={word}
              />
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}
