import { Children, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import './ScrollReveal.css';

const join = (...classes) => classes.filter(Boolean).join(' ');

const OFFSETS = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 }
};

const SAMPLE = [
  { eyebrow: 'Plan', title: 'Sketch the shape', body: 'Map the flow before a single pixel goes down.' },
  { eyebrow: 'Draft', title: 'Build the skeleton', body: 'Rough structure first — polish comes later.' },
  { eyebrow: 'Refine', title: 'Tune the details', body: 'Spacing, motion, and copy earn their place.' },
  { eyebrow: 'Review', title: 'Pressure-test it', body: 'Edge cases and empty states get the same care.' },
  { eyebrow: 'Ship', title: 'Send it out', body: 'Done is a feature; perfect is a moving target.' }
];

// Wraps a single child and reveals it the first time it scrolls into the
// container's viewport: it eases from offset + blur + transparent to resolved.
// inView is measured against the scroll container (root) so it works inside a
// fixed panel, not just the page. Reduced-motion users see it resolved at once.
function RevealItem({ children, root, index, distance, direction, blur, duration, stagger, once, amount, reduce }) {
  const ref = useRef(null);
  const inView = useInView(ref, { root, once, amount });
  const off = OFFSETS[direction] ?? OFFSETS.up;
  const hidden = { opacity: 0, x: off.x * distance, y: off.y * distance, filter: `blur(${blur}px)` };
  const shown = { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' };

  if (reduce) {
    return (
      <div ref={ref} className="scroll-reveal-item">
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="scroll-reveal-item"
      initial={hidden}
      animate={inView ? shown : hidden}
      transition={{ duration, delay: inView ? Math.min(index * stagger, 0.4) : 0, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// A self-contained scroll panel that reveals its children one by one as they
// enter view, with configurable offset, blur, and stagger. Inspired by the
// reveal-on-scroll interactions catalogued on designspells. Pass your own
// children, or it renders a sample sequence so the effect is visible on its own.
export default function ScrollReveal({
  children,
  distance = 40,
  direction = 'up',
  blur = 6,
  duration = 0.6,
  stagger = 0.08,
  once = true,
  amount = 0.4,
  height = 460,
  className = '',
  ...rest
}) {
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const provided = Children.toArray(children);
  const nodes = provided.length
    ? provided
    : SAMPLE.map((s, i) => (
        <article className="scroll-reveal-card" key={i}>
          <span className="scroll-reveal-eyebrow">{s.eyebrow}</span>
          <h3 className="scroll-reveal-title">{s.title}</h3>
          <p className="scroll-reveal-body">{s.body}</p>
        </article>
      ));

  return (
    <div {...rest} ref={ref} className={join('scroll-reveal', className)} style={{ height, ...rest.style }}>
      <div className="scroll-reveal-track">
        {nodes.map((node, i) => (
          <RevealItem
            key={i}
            root={ref}
            index={i}
            distance={distance}
            direction={direction}
            blur={blur}
            duration={duration}
            stagger={stagger}
            once={once}
            amount={amount}
            reduce={reduce}
          >
            {node}
          </RevealItem>
        ))}
      </div>
    </div>
  );
}
