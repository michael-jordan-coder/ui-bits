import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import './ScrollMask.css';

const join = (...classes) => classes.filter(Boolean).join(' ');

// `inset(top right bottom left)` closes the panel from one leading edge; as the
// wipe runs that edge's inset shrinks to 0, opening the panel toward it. The map
// keys the collapsing edge to the reveal direction.
const INSET_BY_DIRECTION = {
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
export default function ScrollMask({
  height = 460,
  direction = 'up',
  accent = '#3ecf8e',
  className = '',
  ...rest
}) {
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ container: ref });

  const insetFn = INSET_BY_DIRECTION[direction] || INSET_BY_DIRECTION.up;
  const closed = useTransform(scrollYProgress, [0, 1], [100, 0], { clamp: true });
  const clipPath = useTransform(closed, p => insetFn(p));
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1.1, 1], { clamp: true });

  return (
    <div {...rest} ref={ref} className={join('scroll-mask', className)} style={{ height, ...rest.style }}>
      <div className="scroll-mask-track" style={{ height: height * 2.4 }}>
        <div className="scroll-mask-stage" style={{ height }}>
          <motion.div className="scroll-mask-panel" style={{ clipPath: reduce ? 'none' : clipPath }}>
            <motion.div
              className="scroll-mask-media"
              style={{
                background: `linear-gradient(135deg, ${accent} 0%, #0b0d10 92%)`,
                scale: reduce ? 1 : mediaScale
              }}
            />
            <div className="scroll-mask-caption">
              <span className="scroll-mask-eyebrow" style={{ color: accent }}>
                in focus
              </span>
              <span className="scroll-mask-title">Scroll to reveal the frame</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
