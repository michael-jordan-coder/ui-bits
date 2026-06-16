import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import './SpotlightCard.css';

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

export interface SpotlightCardProps {
  children?: ReactNode;
  spotlightColor?: string;
  surfaceColor?: string;
  radius?: number;
  borderGlow?: boolean;
  className?: string;
}

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
}: SpotlightCardProps) {
  const prefersReduced = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(false);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
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
      style={
        {
          '--spotlight': spotlightColor,
          '--surface': surfaceColor,
          '--radius': `${radius}px`
        } as CSSProperties
      }
      {...rest}
    >
      <div className="spotlight-card-glow" aria-hidden="true" />
      <div className="spotlight-card-content">{children}</div>
    </div>
  );
}
