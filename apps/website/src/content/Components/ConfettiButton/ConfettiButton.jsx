import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import './ConfettiButton.css';

const join = (...classes) => classes.filter(Boolean).join(' ');

const DEFAULT_COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#38bdf8'];

const random = (min, max) => min + Math.random() * (max - min);

// A pill button that fires a one-shot confetti burst on click. Each click builds
// a fresh batch of particles — each with a random angle (biased upward within
// `spread` degrees), launch distance, color, size, and spin — then animates them
// outward, lets gravity pull them down, and fades them out before unmounting.
// No confetti library: particles are plain motion.span squares so every variant
// stays self-contained. Honors prefers-reduced-motion by skipping the burst.
const buildBurst = (particleCount, colors, spread) =>
  Array.from({ length: particleCount }, (_, i) => {
    // Center the spread around straight-up (-90deg), in radians.
    const angle = (-90 + random(-spread / 2, spread / 2)) * (Math.PI / 180);
    const distance = random(60, 140);
    return {
      id: i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      drop: random(60, 120),
      color: colors[i % colors.length],
      size: random(6, 11),
      rotate: random(-220, 220),
      duration: random(0.7, 1.15),
      round: Math.random() > 0.6
    };
  });

export default function ConfettiButton({
  children = 'Celebrate',
  particleCount = 28,
  colors = DEFAULT_COLORS,
  spread = 70,
  accentColor = '#6366f1',
  onClick,
  className = '',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const [bursts, setBursts] = useState([]);

  const handleClick = e => {
    onClick?.(e);
    if (prefersReduced) return;
    const id = Date.now() + Math.random();
    setBursts(prev => [...prev, { id, particles: buildBurst(particleCount, colors, spread) }]);
  };

  const removeBurst = id => setBursts(prev => prev.filter(b => b.id !== id));

  return (
    <button
      type="button"
      className={join('confetti-button', className)}
      style={{ background: accentColor }}
      onClick={handleClick}
      {...rest}
    >
      <span className="confetti-button-label">{children}</span>

      <span className="confetti-button-overlay" aria-hidden="true">
        <AnimatePresence>
          {bursts.map(burst => (
            <BurstLayer key={burst.id} particles={burst.particles} onDone={() => removeBurst(burst.id)} />
          ))}
        </AnimatePresence>
      </span>
    </button>
  );
}

function BurstLayer({ particles, onDone }) {
  let settled = 0;
  const handleComplete = () => {
    settled += 1;
    if (settled >= particles.length) onDone();
  };

  return (
    <>
      {particles.map(p => (
        <motion.span
          key={p.id}
          className="confetti-button-particle"
          style={{
            background: p.color,
            width: p.size,
            height: p.size,
            borderRadius: p.round ? '50%' : '2px'
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: p.x, y: p.y + p.drop, opacity: 0, rotate: p.rotate, scale: 0.6 }}
          transition={{ duration: p.duration, ease: [0.2, 0.7, 0.3, 1] }}
          onAnimationComplete={handleComplete}
        />
      ))}
    </>
  );
}
