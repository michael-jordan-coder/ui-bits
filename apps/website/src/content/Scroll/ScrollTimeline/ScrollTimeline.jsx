import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import './ScrollTimeline.css';

const join = (...classes) => classes.filter(Boolean).join(' ');

// Neutral sample milestones. The component slices the first `items` of these so a
// caller gets real, sentence-case content without supplying any data.
const SAMPLE = [
  { title: 'Idea takes shape', caption: 'The first sketches and notes come together.' },
  { title: 'Prototype comes alive', caption: 'A rough build proves the core flow works.' },
  { title: 'Early testers weigh in', caption: 'Feedback sharpens the rough edges.' },
  { title: 'Polish and refine', caption: 'Details, motion, and copy get their pass.' },
  { title: 'Quiet beta launch', caption: 'A small group puts it through real use.' },
  { title: 'Public release', caption: 'The work ships to everyone at last.' },
  { title: 'Listen and iterate', caption: 'Usage data guides the next round of work.' }
];

// How much scroll progress a single row spends transitioning from its resting
// offset to settled. Each row's window is keyed to its index, so rows activate
// one after another as they scroll into the band.
const ACTIVE_WINDOW = 0.22;

// One timeline entry: a node on the spine plus its title and caption. As its slice
// of scroll progress passes, the dot scales up and fills with the accent while the
// row fades and slides from a slight offset into its resting position.
function TimelineRow({ index, total, progress, accent, reduce }) {
  const start = total > 1 ? (index / total) * (1 - ACTIVE_WINDOW) : 0;
  const end = start + ACTIVE_WINDOW;

  const opacity = useTransform(progress, [start, end], [0.35, 1], { clamp: true });
  const x = useTransform(progress, [start, end], [14, 0], { clamp: true });
  const dotScale = useTransform(progress, [start, end], [0.6, 1], { clamp: true });
  const fill = useTransform(progress, [start, end], ['rgba(255, 255, 255, 0.16)', accent], { clamp: true });

  return (
    <li className="scroll-timeline-row">
      <motion.span
        className="scroll-timeline-dot"
        style={{
          background: reduce ? accent : fill,
          scale: reduce ? 1 : dotScale
        }}
        aria-hidden="true"
      />
      <motion.div
        className="scroll-timeline-body"
        style={{
          opacity: reduce ? 1 : opacity,
          x: reduce ? 0 : x
        }}
      >
        <h3 className="scroll-timeline-title">{SAMPLE[index].title}</h3>
        <p className="scroll-timeline-caption">{SAMPLE[index].caption}</p>
      </motion.div>
    </li>
  );
}

// A vertical timeline that fills as you scroll. The spine runs down the left and
// its colored portion grows top-to-bottom bound to scroll progress, while each
// node lights up and its row eases into place as it enters the active band.
// Self-contained — it owns an internal scroll container, so it works anywhere
// without a page-level scroll rig. Reduced-motion users get the fully settled
// timeline with no movement.
export default function ScrollTimeline({ items = 5, accent = '#3ecf8e', height = 460, className = '', ...rest }) {
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ container: ref });
  const total = Math.max(1, Math.min(SAMPLE.length, Math.floor(items)));

  const fillScale = useTransform(scrollYProgress, [0, 1], [0, 1], { clamp: true });

  return (
    <div {...rest} ref={ref} className={join('scroll-timeline', className)} style={{ height, ...rest.style }}>
      <div className="scroll-timeline-track" style={{ minHeight: height * 1.7 }}>
        <div className="scroll-timeline-spine" aria-hidden="true">
          <motion.div
            className="scroll-timeline-spine-fill"
            style={{ background: accent, scaleY: reduce ? 1 : fillScale }}
          />
        </div>
        <ol className="scroll-timeline-list">
          {Array.from({ length: total }, (_, i) => (
            <TimelineRow key={i} index={i} total={total} progress={scrollYProgress} accent={accent} reduce={reduce} />
          ))}
        </ol>
      </div>
    </div>
  );
}
