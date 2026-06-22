import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

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
    <li className="relative flex items-start gap-[22px]">
      <motion.span
        className="relative mt-1 -ml-[3px] block h-4 w-4 flex-none rounded-full shadow-[0_0_0_4px_rgba(0,0,0,0.28)] [will-change:transform,background]"
        style={{
          background: reduce ? accent : fill,
          scale: reduce ? 1 : dotScale
        }}
        aria-hidden="true"
      />
      <motion.div
        className="min-w-0 flex-1 [will-change:transform,opacity]"
        style={{
          opacity: reduce ? 1 : opacity,
          x: reduce ? 0 : x
        }}
      >
        <h3 className="m-0 text-[16px] font-semibold leading-[1.3] tracking-tight text-white/95">
          {SAMPLE[index].title}
        </h3>
        <p className="mb-0 mt-1 text-[13px] leading-[1.45] text-white/60">{SAMPLE[index].caption}</p>
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
    <div
      {...rest}
      ref={ref}
      className={join(
        'relative mx-auto w-full max-w-[560px] overflow-y-auto overflow-x-hidden rounded-[18px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
      style={{ height, ...rest.style }}
    >
      <div className="relative box-border w-full pb-10 pl-14 pr-7 pt-10" style={{ minHeight: height * 1.7 }}>
        <div
          className="absolute bottom-12 left-[38px] top-12 w-[2px] overflow-hidden rounded-[2px] bg-white/[0.12]"
          aria-hidden="true"
        >
          <motion.div
            className="h-full w-full origin-top [will-change:transform]"
            style={{ background: accent, scaleY: reduce ? 1 : fillScale }}
          />
        </div>
        <ol className="relative m-0 flex list-none flex-col gap-12 p-0">
          {Array.from({ length: total }, (_, i) => (
            <TimelineRow key={i} index={i} total={total} progress={scrollYProgress} accent={accent} reduce={reduce} />
          ))}
        </ol>
      </div>
    </div>
  );
}
