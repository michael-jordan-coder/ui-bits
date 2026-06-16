import { useState, type CSSProperties, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Sparkles, Zap, Star, Heart, type LucideIcon } from 'lucide-react';
import './FlipCard.css';

export type FlipCardIcon = 'sparkles' | 'zap' | 'star' | 'heart';
export type FlipCardTrigger = 'hover' | 'click';
export type FlipCardDirection = 'horizontal' | 'vertical';

export interface FlipCardProps {
  frontTitle?: string;
  frontSubtitle?: string;
  backTitle?: string;
  backText?: string;
  icon?: FlipCardIcon;
  trigger?: FlipCardTrigger;
  direction?: FlipCardDirection;
  accentColor?: string;
  surfaceColor?: string;
  flipped?: boolean;
  onFlip?: (flipped: boolean) => void;
  className?: string;
}

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

const ICONS: Record<FlipCardIcon, LucideIcon> = { sparkles: Sparkles, zap: Zap, star: Star, heart: Heart };

// A data-driven 3D flip card. The perspective wrapper keeps the rotation looking
// dimensional, while the inner element carries preserve-3d so the two faces sit
// back to back. Inspired by the flip-card interaction documented on reactbits.dev.
export default function FlipCard({
  frontTitle = 'ui bits',
  frontSubtitle = 'Hover to reveal',
  backTitle = 'Crafted to flip',
  backText = 'A self-contained 3D card with spring-driven rotation and a reduced-motion fallback.',
  icon = 'sparkles',
  trigger = 'hover',
  direction = 'horizontal',
  accentColor = '#6366f1',
  surfaceColor = '#1c1c22',
  flipped: flippedProp,
  onFlip,
  className = ''
}: FlipCardProps) {
  const prefersReduced = useReducedMotion();
  const isControlled = flippedProp !== undefined;
  const [internal, setInternal] = useState(false);
  const flipped = isControlled ? flippedProp : internal;

  const Icon = ICONS[icon] || Sparkles;
  const axis: 'rotateX' | 'rotateY' = direction === 'vertical' ? 'rotateX' : 'rotateY';

  const setFlipped = (next: boolean) => {
    if (!isControlled) setInternal(next);
    onFlip?.(next);
  };

  const toggle = () => setFlipped(!flipped);

  const hoverHandlers =
    trigger === 'hover'
      ? {
          onPointerEnter: () => setFlipped(true),
          onPointerLeave: () => setFlipped(false)
        }
      : {};

  const clickHandlers =
    trigger === 'click'
      ? {
          role: 'button' as const,
          tabIndex: 0,
          'aria-pressed': flipped,
          onClick: toggle,
          onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              toggle();
            }
          }
        }
      : {};

  const cssVars = {
    '--flip-card-accent': accentColor,
    '--flip-card-surface': surfaceColor
  } as CSSProperties;

  return (
    <div className={join('flip-card-perspective', className)} style={cssVars} {...hoverHandlers} {...clickHandlers}>
      <motion.div
        className="flip-card-inner"
        animate={{ [axis]: flipped ? 180 : 0 }}
        transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 26 }}
      >
        <div className="flip-card-face flip-card-front">
          <span className="flip-card-icon" aria-hidden="true">
            <Icon size={28} strokeWidth={2} />
          </span>
          <h3 className="flip-card-title">{frontTitle}</h3>
          <p className="flip-card-subtitle">{frontSubtitle}</p>
        </div>

        <div className={join('flip-card-face', 'flip-card-back', `flip-card-back--${direction}`)}>
          <h3 className="flip-card-title">{backTitle}</h3>
          <p className="flip-card-text">{backText}</p>
          <span className="flip-card-cta">{trigger === 'click' ? 'Click to flip back' : 'Move away to flip back'}</span>
        </div>
      </motion.div>
    </div>
  );
}
