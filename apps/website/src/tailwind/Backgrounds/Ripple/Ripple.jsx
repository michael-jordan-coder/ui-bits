import { useCallback, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';

const join = (...classes) => classes.filter(Boolean).join(' ');

let rippleId = 0;

// An interactive ripple background: ambient concentric rings continuously emit
// from the center, and (when interactive) every pointer-down spawns a ripple at
// the cursor that expands and fades once. Only transform/opacity animate.
export default function Ripple({
  color = '#6366f1',
  backgroundColor = '#0a0a0f',
  rippleCount = 6,
  speed = 4,
  interactive = true,
  maxRipples = 8,
  className = '',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const [ripples, setRipples] = useState([]);

  const count = Math.max(1, Math.round(rippleCount));

  const handlePointerDown = useCallback(
    event => {
      if (!interactive || prefersReduced) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const id = ++rippleId;
      setRipples(prev => {
        const next = [...prev, { id, x, y }];
        return next.length > maxRipples ? next.slice(next.length - maxRipples) : next;
      });
    },
    [interactive, prefersReduced, maxRipples]
  );

  const removeRipple = useCallback(id => {
    setRipples(prev => prev.filter(r => r.id !== id));
  }, []);

  // Reduced motion: a couple of static faint rings, no animation, no interaction.
  if (prefersReduced) {
    return (
      <div
        className={join('absolute inset-0 h-full min-h-[200px] w-full overflow-hidden', className)}
        style={{ backgroundColor }}
        {...rest}
      >
        <div className="absolute left-1/2 top-1/2 h-0 w-0">
          {[0.45, 0.7].map((scale, i) => (
            <span
              key={i}
              className="absolute left-0 top-0 -ml-[40vmin] -mt-[40vmin] h-[80vmin] w-[80vmin] rounded-full border-[1.5px] border-solid"
              style={{ borderColor: color, transform: `translate(-50%, -50%) scale(${scale})`, opacity: 0.25 - i * 0.1 }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={join('absolute inset-0 h-full min-h-[200px] w-full overflow-hidden', className)}
      style={{ backgroundColor }}
      onPointerDown={handlePointerDown}
      {...rest}
    >
      <div className="absolute left-1/2 top-1/2 h-0 w-0">
        {Array.from({ length: count }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 -ml-[40vmin] -mt-[40vmin] h-[80vmin] w-[80vmin] rounded-full border-[1.5px] border-solid [will-change:transform,opacity]"
            style={{ borderColor: color }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 1, opacity: 0 }}
            transition={{
              duration: speed,
              repeat: Infinity,
              ease: 'easeOut',
              delay: (speed / count) * i
            }}
          />
        ))}
      </div>

      {interactive && (
        <AnimatePresence>
          {ripples.map(r => (
            <motion.span
              key={r.id}
              className="pointer-events-none absolute -ml-[25vmin] -mt-[25vmin] h-[50vmin] w-[50vmin] rounded-full border-[1.5px] border-solid [will-change:transform,opacity]"
              style={{ left: r.x, top: r.y, borderColor: color }}
              initial={{ scale: 0, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
              onAnimationComplete={() => removeRipple(r.id)}
            />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
