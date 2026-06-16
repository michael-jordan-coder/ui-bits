import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

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
      className={join(
        'relative inline-flex cursor-pointer items-center justify-center rounded-full border-none px-[1.6rem] py-3 font-[inherit] text-[0.95rem] font-semibold tracking-[-0.01em] text-white outline-none shadow-[0_8px_24px_-10px_rgba(0,0,0,0.6)] transition-[transform,box-shadow,filter] duration-200 ease-out hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_14px_30px_-12px_rgba(0,0,0,0.7)] active:translate-y-0 active:shadow-[0_6px_18px_-10px_rgba(0,0,0,0.6)] focus-visible:[outline:2px_solid_rgba(255,255,255,0.85)] focus-visible:[outline-offset:2px]',
        className
      )}
      style={{ background: accentColor }}
      onClick={handleClick}
      {...rest}
    >
      <span className="relative z-[1]">{children}</span>

      <span className="pointer-events-none absolute left-1/2 top-0 z-[2] h-0 w-0" aria-hidden="true">
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
          className="absolute left-0 top-0 block will-change-[transform,opacity]"
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
