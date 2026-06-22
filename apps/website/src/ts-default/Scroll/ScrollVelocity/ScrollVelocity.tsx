import { useRef, type HTMLAttributes } from 'react';
import {
  motion,
  useScroll,
  useVelocity,
  useSpring,
  useTransform,
  useMotionValue,
  useAnimationFrame,
  useReducedMotion,
  wrap,
  type MotionValue
} from 'motion/react';
import './ScrollVelocity.css';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

const COPIES = 6;

export interface ScrollVelocityRow {
  text: string;
  direction?: number;
}

export interface ScrollVelocityProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  rows?: ScrollVelocityRow[];
  baseVelocity?: number;
  boost?: number;
  stiffness?: number;
  damping?: number;
  height?: number;
  className?: string;
}

const DEFAULT_ROWS: ScrollVelocityRow[] = [
  { text: 'Design — Build — Ship', direction: 1 },
  { text: 'Motion — Detail — Craft', direction: -1 }
];

interface VelocityLaneProps {
  text: string;
  direction: number;
  baseVelocity: number;
  velocityFactor: MotionValue<number>;
  reduce: boolean;
}

// One marquee lane. It drifts continuously at `baseVelocity` in its lane
// direction, and the smoothed container scroll velocity both speeds it up and
// flips its direction while you scroll. Position is held in a single motion
// value advanced per frame and wrapped so the duplicated text tiles seamlessly.
function VelocityLane({ text, direction, baseVelocity, velocityFactor, reduce }: VelocityLaneProps) {
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
    <div className="scroll-velocity-lane">
      <motion.div className="scroll-velocity-track" style={{ x }}>
        {Array.from({ length: COPIES }).map((_, i) => (
          <span className="scroll-velocity-text" key={i}>
            {text}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// A self-contained marquee panel whose lanes react to scroll velocity: scroll
// inside it and the rows surge and flip direction, then ease back to a slow
// idle drift. Inspired by the scroll-velocity marquee interaction catalogued on
// designspells / reactbits. Reduced-motion users get static, readable rows.
export default function ScrollVelocity({
  rows = DEFAULT_ROWS,
  baseVelocity = 5,
  boost = 5,
  stiffness = 400,
  damping = 50,
  height = 360,
  className = '',
  ...rest
}: ScrollVelocityProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollY } = useScroll({ container: ref });
  const scrollVelocity = useVelocity(scrollY);
  const smooth = useSpring(scrollVelocity, { damping, stiffness });
  const velocityFactor = useTransform(smooth, [-2000, 0, 2000], [-boost, 0, boost], { clamp: true });

  return (
    <div {...rest} ref={ref} className={join('scroll-velocity', className)} style={{ height, ...rest.style }}>
      <div className="scroll-velocity-scroll" style={{ height: height * 2.2 }}>
        <div className="scroll-velocity-stage" style={{ height }}>
          {rows.map((row, i) => (
            <VelocityLane
              key={i}
              text={row.text}
              direction={row.direction ?? (i % 2 === 0 ? 1 : -1)}
              baseVelocity={baseVelocity}
              velocityFactor={velocityFactor}
              reduce={reduce}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
