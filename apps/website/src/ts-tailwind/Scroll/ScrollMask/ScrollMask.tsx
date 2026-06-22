import { useRef, type HTMLAttributes } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

// `inset(top right bottom left)` closes the panel from one leading edge; as the
// wipe runs that edge's inset shrinks to 0, opening the panel toward it. The map
// keys the collapsing edge to the reveal direction.
type Direction = 'up' | 'down' | 'left' | 'right';

const INSET_BY_DIRECTION: Record<Direction, (p: number) => string> = {
  up: p => `inset(${p}% 0% 0% 0%)`,
  down: p => `inset(0% 0% ${p}% 0%)`,
  left: p => `inset(0% 0% 0% ${p}%)`,
  right: p => `inset(0% ${p}% 0% 0%)`
};

// A media panel revealed by an expanding clip-path wipe bound to scroll. The panel
// stays pinned while you scroll the internal track: its clip inset shrinks from
// fully-closed to fully-open, wiping the panel into view, while the inner media
// eases down from a slight zoom for parallax depth. `direction` sets the wipe
// origin. Self-contained — it owns an internal scroll container, so it works
// anywhere without a page-level scroll rig. Reduced-motion users get the fully
// revealed panel with no movement.
export interface ScrollMaskProps extends HTMLAttributes<HTMLDivElement> {
  height?: number;
  direction?: Direction;
  accent?: string;
  className?: string;
}

export default function ScrollMask({
  height = 460,
  direction = 'up',
  accent = '#3ecf8e',
  className = '',
  ...rest
}: ScrollMaskProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ container: ref });

  const insetFn = INSET_BY_DIRECTION[direction] || INSET_BY_DIRECTION.up;
  const closed = useTransform(scrollYProgress, [0, 1], [100, 0], { clamp: true });
  const clipPath = useTransform(closed, p => insetFn(p));
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1.1, 1], { clamp: true });

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
            className="relative h-full w-full overflow-hidden rounded-[16px] shadow-[0_24px_60px_-32px_rgba(0,0,0,0.7)] [will-change:clip-path]"
            style={{ clipPath: reduce ? 'none' : clipPath }}
          >
            <motion.div
              className="absolute inset-0 h-full w-full [will-change:transform]"
              style={{
                background: `linear-gradient(135deg, ${accent} 0%, #0b0d10 92%)`,
                scale: reduce ? 1 : mediaScale
              }}
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 bg-[linear-gradient(0deg,rgba(8,10,12,0.72)_0%,rgba(8,10,12,0)_100%)] p-6">
              <span className="text-[12px] font-semibold tracking-[0.01em]" style={{ color: accent }}>
                in focus
              </span>
              <span className="text-[19px] font-semibold tracking-[-0.01em] text-white/95">
                Scroll to reveal the frame
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
