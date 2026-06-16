import { useRef, useState, type MouseEventHandler, type PointerEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import './MagneticButton.css';

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

export interface MagneticButtonProps {
  label?: string;
  strength?: number;
  radius?: number;
  scaleOnHover?: number;
  accentColor?: string;
  showArrow?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
}

// A button that is pulled toward the cursor whenever the pointer enters its
// magnetic field, then springs back to rest on leave. The label and arrow drift
// a touch further than the shell for a parallax feel. Inspired by the magnetic
// cursor buttons popularized by interaction studios like Cuberto.
export default function MagneticButton({
  label = 'Get started',
  strength = 0.4,
  radius = 120,
  scaleOnHover = 1.05,
  accentColor = '#6366f1',
  showArrow = true,
  onClick,
  className = '',
  ...rest
}: MagneticButtonProps) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  const spring = { stiffness: 200, damping: 14, mass: 0.18 };
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, spring);
  const springY = useSpring(y, spring);

  // The inner content trails a little further than the shell for parallax depth.
  const contentX = useTransform(springX, value => value * 0.35);
  const contentY = useTransform(springY, value => value * 0.35);

  const reset = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    if (Math.hypot(dx, dy) <= radius) {
      setHovered(true);
      x.set(dx * strength);
      y.set(dy * strength);
    } else {
      reset();
    }
  };

  return (
    <div
      className="magnetic-button-field"
      style={{ padding: radius }}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
    >
      <motion.button
        ref={ref}
        type="button"
        className={join('magnetic-button-root', className)}
        style={{ x: springX, y: springY, backgroundColor: accentColor }}
        onClick={onClick}
        animate={{ scale: hovered ? scaleOnHover : 1 }}
        transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 18 }}
        whileTap={prefersReduced ? undefined : { scale: 0.96 }}
        {...rest}
      >
        <motion.span className="magnetic-button-content" style={{ x: contentX, y: contentY }}>
          <span className="magnetic-button-label">{label}</span>
          {showArrow && (
            <motion.span
              className="magnetic-button-arrow"
              animate={{ x: hovered ? 4 : 0 }}
              transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 20 }}
              aria-hidden="true"
            >
              <ArrowRight size={18} strokeWidth={2.4} />
            </motion.span>
          )}
        </motion.span>
      </motion.button>
    </div>
  );
}
