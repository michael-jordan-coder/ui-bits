import { useRef, type HTMLAttributes } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'motion/react';
import './ScrollFloat.css';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

// Each row reveals over its own slice of the container's scroll progress. The
// band is keyed to the row's vertical fraction so a row floats in as it enters
// the upper-middle of the viewport and is settled by the time it's centred.
const BAND = 0.34;

const titleFor = (index: number) => `Floating panel ${String(index + 1).padStart(2, '0')}`;
const captionFor = (index: number) => `Row ${index + 1} eases up from depth as it enters the band`;

interface FloatRowProps {
  index: number;
  total: number;
  progress: MotionValue<number>;
  accent: string;
  reduce: boolean;
}

// One row. Its reveal window is a slice of the shared scroll progress keyed to
// its index, so it lifts from depth (translateY + rotateX) and fades into place,
// re-animating as you scroll up or down past the band.
function FloatRow({ index, total, progress, accent, reduce }: FloatRowProps) {
  // Spread reveal start across the scrollable range so each row leads the next.
  const start = total > 1 ? (index / (total - 1)) * (1 - BAND) : 0;
  const end = start + BAND;

  const opacity = useTransform(progress, [start, end], [0, 1], { clamp: true });
  const y = useTransform(progress, [start, end], [56, 0], { clamp: true });
  const rotateX = useTransform(progress, [start, end], [12, 0], { clamp: true });

  return (
    <motion.div
      className="scroll-float-row"
      style={{
        opacity: reduce ? 1 : opacity,
        y: reduce ? 0 : y,
        rotateX: reduce ? 0 : rotateX
      }}
    >
      <span className="scroll-float-index" style={{ color: accent }}>
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="scroll-float-title">{titleFor(index)}</span>
      <span className="scroll-float-caption">{captionFor(index)}</span>
      <span className="scroll-float-bar" style={{ background: accent }} />
    </motion.div>
  );
}

// A scroll-driven stack whose rows float into place with a 3D perspective tilt
// as they pass through an entry band. Each row is tied to scroll position via a
// per-row progress window, so it re-animates on the way up as well as down —
// not a one-shot reveal. Self-contained: it owns an internal scroll container,
// so it works anywhere without a page-level scroll rig. Reduced-motion users get
// the settled stack with no movement.
export interface ScrollFloatProps extends HTMLAttributes<HTMLDivElement> {
  items?: number;
  height?: number;
  accent?: string;
  className?: string;
}

export default function ScrollFloat({ items = 6, height = 460, accent = '#3ecf8e', className = '', ...rest }: ScrollFloatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ container: ref });
  const total = Math.max(1, Math.floor(items));

  const rows = Array.from({ length: total }, (_, i) => i);

  return (
    <div {...rest} ref={ref} className={join('scroll-float', className)} style={{ height, ...rest.style }}>
      <div className="scroll-float-stage">
        {rows.map(i => (
          <FloatRow key={i} index={i} total={total} progress={scrollYProgress} accent={accent} reduce={reduce} />
        ))}
      </div>
    </div>
  );
}
