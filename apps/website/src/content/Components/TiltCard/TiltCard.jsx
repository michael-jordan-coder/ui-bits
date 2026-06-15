import { useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react';
import './TiltCard.css';

const join = (...classes) => classes.filter(Boolean).join(' ');

// A card that tilts in 3D toward the pointer with a specular glare that tracks
// the cursor, then settles flat on leave. Inspired by the pointer-tilt product
// cards popularized across the web (see reactbits.dev's TiltedCard).
export default function TiltCard({
  children,
  maxTilt = 14,
  scale = 1.05,
  glare = true,
  glareColor = 'rgba(255, 255, 255, 0.45)',
  perspective = 800,
  radius = 20,
  className = '',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  // Pointer position over the card, normalized 0–1.
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 250, damping: 22, mass: 0.6 };
  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), spring);

  const glareX = useTransform(px, v => `${v * 100}%`);
  const glareY = useTransform(py, v => `${v * 100}%`);
  const glareBg = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, ${glareColor}, transparent 55%)`;

  const handleMove = e => {
    if (prefersReduced) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    setHovered(false);
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className={join('tilt-card-root', className)} style={{ perspective }} {...rest}>
      <motion.div
        ref={ref}
        className="tilt-card-inner"
        style={{
          borderRadius: radius,
          rotateX: prefersReduced ? 0 : rotateX,
          rotateY: prefersReduced ? 0 : rotateY,
          transformStyle: 'preserve-3d'
        }}
        animate={{ scale: hovered && !prefersReduced ? scale : 1 }}
        transition={{ type: 'spring', stiffness: 250, damping: 22 }}
        onPointerEnter={() => setHovered(true)}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
      >
        <div className="tilt-card-content">{children}</div>
        {glare && !prefersReduced && (
          <motion.div
            className="tilt-card-glare"
            style={{ background: glareBg, opacity: hovered ? 1 : 0, borderRadius: radius }}
            aria-hidden="true"
          />
        )}
      </motion.div>
    </div>
  );
}
