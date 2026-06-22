import { useRef } from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
  wrap
} from 'motion/react';

const join = (...classes) => classes.filter(Boolean).join(' ');

const COPIES = 6;

const DEFAULT_ROWS = [
  { text: 'Design — Build — Ship', direction: 1 },
  { text: 'Motion — Detail — Craft', direction: -1 }
];

function VelocityLane({ text, direction, baseVelocity, velocityFactor, color, reduce }) {
  const baseX = useMotionValue(0);
  const x = useTransform(baseX, v => `${wrap(-100 / COPIES, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const vf = velocityFactor.get();
    const dir = direction * (vf < 0 ? -1 : 1);
    const moveBy = dir * baseVelocity * (delta / 1000) * (1 + Math.abs(vf));
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="w-full overflow-hidden whitespace-nowrap">
      <motion.div className="flex w-max whitespace-nowrap [will-change:transform]" style={{ x }}>
        {Array.from({ length: COPIES }).map((_, i) => (
          <span
            className="inline-block pr-[0.4em] text-[clamp(2rem,6vw,3.6rem)] font-semibold leading-[1.05] tracking-[-0.02em]"
            style={{ color }}
            key={i}
          >
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export default function ScrollVelocity({
  rows = DEFAULT_ROWS,
  baseVelocity = 5,
  boost = 5,
  stiffness = 400,
  damping = 50,
  height = 360,
  className = '',
  ...rest
}) {
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const { scrollY } = useScroll({ container: ref });
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping, stiffness });
  const velocityFactor = useTransform(smooth, [-2000, 0, 2000], [-boost, 0, boost], { clamp: true });

  return (
    <div
      {...rest}
      ref={ref}
      className={join(
        'relative w-full overflow-y-auto overflow-x-hidden rounded-[18px] bg-[#08080c] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
      style={{ height, ...rest.style }}
    >
      <div className="relative w-full" style={{ height: height * 2.2 }}>
        <div className="sticky top-0 flex w-full flex-col justify-center gap-1 overflow-hidden" style={{ height }}>
          {rows.map((row, i) => (
            <VelocityLane
              key={i}
              text={row.text}
              direction={row.direction ?? (i % 2 === 0 ? 1 : -1)}
              baseVelocity={baseVelocity}
              velocityFactor={velocityFactor}
              color={i % 2 === 0 ? '#fafafa' : '#5227ff'}
              reduce={reduce}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
