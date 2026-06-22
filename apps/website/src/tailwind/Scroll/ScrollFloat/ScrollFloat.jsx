import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

const join = (...classes) => classes.filter(Boolean).join(' ');

// Each row reveals over its own slice of the container's scroll progress. The
// band is keyed to the row's vertical fraction so a row floats in as it enters
// the upper-middle of the viewport and is settled by the time it's centred.
const BAND = 0.34;

const titleFor = index => `Floating panel ${String(index + 1).padStart(2, '0')}`;
const captionFor = index => `Row ${index + 1} eases up from depth as it enters the band`;

// One row. Its reveal window is a slice of the shared scroll progress keyed to
// its index, so it lifts from depth (translateY + rotateX) and fades into place,
// re-animating as you scroll up or down past the band.
function FloatRow({ index, total, progress, accent, reduce }) {
  // Spread reveal start across the scrollable range so each row leads the next.
  const start = total > 1 ? (index / (total - 1)) * (1 - BAND) : 0;
  const end = start + BAND;

  const opacity = useTransform(progress, [start, end], [0, 1], { clamp: true });
  const y = useTransform(progress, [start, end], [56, 0], { clamp: true });
  const rotateX = useTransform(progress, [start, end], [12, 0], { clamp: true });

  return (
    <motion.div
      className="relative grid min-h-[96px] grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 rounded-[16px] border border-white/[0.08] bg-white/[0.04] px-[22px] py-5 shadow-[0_22px_48px_-32px_rgba(0,0,0,0.8)] [grid-template-areas:'index_title''index_caption'] [transform-origin:50%_100%] [will-change:transform,opacity]"
      style={{
        opacity: reduce ? 1 : opacity,
        y: reduce ? 0 : y,
        rotateX: reduce ? 0 : rotateX
      }}
    >
      <span
        className="self-center text-[28px] font-semibold leading-none tabular-nums tracking-tight [grid-area:index]"
        style={{ color: accent }}
      >
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="self-end text-[16px] font-semibold tracking-tight text-white/90 [grid-area:title]">
        {titleFor(index)}
      </span>
      <span className="self-start text-[13px] leading-[1.35] text-white/55 [grid-area:caption]">{captionFor(index)}</span>
      <span className="absolute bottom-4 left-0 top-4 w-[3px] rounded-[3px]" style={{ background: accent }} />
    </motion.div>
  );
}

// A scroll-driven stack whose rows float into place with a 3D perspective tilt
// as they pass through an entry band. Each row is tied to scroll position via a
// per-row progress window, so it re-animates on the way up as well as down —
// not a one-shot reveal. Self-contained: it owns an internal scroll container,
// so it works anywhere without a page-level scroll rig. Reduced-motion users get
// the settled stack with no movement.
export default function ScrollFloat({ items = 6, height = 460, accent = '#3ecf8e', className = '', ...rest }) {
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ container: ref });
  const total = Math.max(1, Math.floor(items));

  const rows = Array.from({ length: total }, (_, i) => i);

  return (
    <div
      {...rest}
      ref={ref}
      className={join(
        'relative mx-auto w-full max-w-[560px] overflow-y-auto overflow-x-hidden rounded-[18px] [perspective:900px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
      style={{ height, ...rest.style }}
    >
      <div className="flex flex-col gap-[18px] px-[22px] py-7 [transform-style:preserve-3d]">
        {rows.map(i => (
          <FloatRow key={i} index={i} total={total} progress={scrollYProgress} accent={accent} reduce={reduce} />
        ))}
      </div>
    </div>
  );
}
