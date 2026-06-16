import { useRef, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import './SpotlightCard.css';

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

  return (
    <div
      ref={cardRef}
      className={join('spotlight-card-root', borderGlow && 'spotlight-card-root--border', className)}
      data-active={active}
      data-reduced={prefersReduced ? true : undefined}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      style={{
        '--spotlight': spotlightColor,
        '--surface': surfaceColor,
        '--radius': `${radius}px`
      }}
      {...rest}
    >
      <div className="spotlight-card-glow" aria-hidden="true" />
      <div className="spotlight-card-content">{children}</div>
    </div>
  );
}
