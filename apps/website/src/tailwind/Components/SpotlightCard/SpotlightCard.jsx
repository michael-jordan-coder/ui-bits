import { useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';

const join = (...classes) => classes.filter(Boolean).join(' ');

// A card that paints a soft radial glow wherever the pointer is: onPointerMove
// writes the cursor position into --x / --y CSS variables and the gradient
// overlay re-centers on them, while a border layer brightens on the same axis.
// The glow fades in on enter and out on leave; reduced-motion users get the
// tracking without the fade transition.
export default function SpotlightCard({
  children,
  spotlightColor = 'rgba(99, 102, 241, 0.25)',
  surfaceColor = '#16181d',
  radius = 220,
  borderGlow = true,
  className = '',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const cardRef = useRef(null);
  const [active, setActive] = useState(false);

  const handlePointerMove = e => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--y', `${e.clientY - rect.top}px`);
  };

  const transition = prefersReduced ? 'none' : 'opacity 0.4s ease';

  return (
    <div
      ref={cardRef}
      className={join(
        'relative isolate overflow-hidden rounded-2xl border border-white/[0.08] p-7 font-[inherit] text-white',
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      style={{
        background: surfaceColor,
        '--x': '50%',
        '--y': '50%',
        '--radius': `${radius}px`
      }}
      {...rest}
    >
      {borderGlow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] p-px"
          style={{
            background:
              'radial-gradient(calc(var(--radius) * 0.9) circle at var(--x) var(--y), rgba(255, 255, 255, 0.55), transparent 60%)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            opacity: active ? 1 : 0,
            transition
          }}
        />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] rounded-[inherit]"
        style={{
          background: `radial-gradient(var(--radius) circle at var(--x) var(--y), ${spotlightColor}, transparent 70%)`,
          opacity: active ? 1 : 0,
          transition
        }}
      />
      <div className="relative z-[2]">{children}</div>
    </div>
  );
}
