import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useReducedMotion } from 'motion/react';

const join = (...classes) => classes.filter(Boolean).join(' ');

const VIEWBOX = 200;
const CENTER = VIEWBOX / 2;
const RADIUS = 86;
const TICK_INNER = 70;
const TICK_LONG = 58;

// A ring of N evenly spaced radial ticks, rendered crisp in SVG. Every fourth tick
// reaches further in as a major mark, so the ring reads like a dial rather than a
// uniform comb.
function TickRing({ segments, accent }) {
  const count = Math.max(1, Math.floor(segments));
  const ticks = Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const major = i % 4 === 0;
    const inner = major ? TICK_LONG : TICK_INNER;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
      x1: CENTER + cos * inner,
      y1: CENTER + sin * inner,
      x2: CENTER + cos * RADIUS,
      y2: CENTER + sin * RADIUS,
      major
    };
  });

  return (
    <svg className="h-full w-full" viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`} aria-hidden="true">
      <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={accent}
          strokeWidth={t.major ? 3 : 1.5}
          strokeLinecap="round"
          opacity={t.major ? 1 : 0.55}
        />
      ))}
    </svg>
  );
}

// A graphic that rotates as you scroll. Self-contained: it owns an internal scroll
// container with a tall track and a sticky stage that pins a tick-ring while it
// turns. The ring rotates bound to scroll progress (0 → turns*360deg) and eases up
// in scale (0.85 → 1) while pinned; a percent readout in the center counter-rotates
// to stay upright. Scope is local — it never hijacks page scroll. Reduced-motion
// users get the ring at its final rotation and full scale, static.
export default function ScrollRotate({
  height = 460,
  turns = 0.5,
  segments = 24,
  accent = '#3ecf8e',
  className = '',
  ...rest
}) {
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ container: ref });

  const degrees = useTransform(scrollYProgress, [0, 1], [0, turns * 360], { clamp: true });
  const rotate = useMotionTemplate`${degrees}deg`;
  const counterDegrees = useTransform(degrees, value => -value);
  const counterRotate = useMotionTemplate`${counterDegrees}deg`;
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1], { clamp: true });
  const percent = useTransform(scrollYProgress, value => `${Math.round(value * 100)}%`);

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
      <div className="relative w-full" style={{ height: height * 2.4 }}>
        <div
          className="sticky top-0 box-border flex items-center justify-center overflow-hidden p-[22px]"
          style={{ height }}
        >
          <motion.div
            className="relative flex aspect-square w-[clamp(180px,60%,260px)] items-center justify-center [transform-origin:50%_50%] [will-change:transform]"
            style={{
              rotate: reduce ? `${turns * 360}deg` : rotate,
              scale: reduce ? 1 : scale
            }}
          >
            <TickRing segments={segments} accent={accent} />
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-1 [transform-origin:50%_50%] [will-change:transform]"
              style={{ rotate: reduce ? `${-(turns * 360)}deg` : counterRotate }}
            >
              <motion.span className="text-[34px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-white/95">
                {reduce ? '100%' : percent}
              </motion.span>
              <span className="text-[12px] font-medium tracking-[0.01em] text-white/50">scrolled</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
