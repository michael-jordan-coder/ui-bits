import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Sparkles, Zap, Star, Heart } from 'lucide-react';

const join = (...classes) => classes.filter(Boolean).join(' ');

const ICONS = { sparkles: Sparkles, zap: Zap, star: Star, heart: Heart };

const FACE =
  'absolute inset-0 box-border flex flex-col overflow-hidden rounded-[20px] border border-white/[0.08] p-7 text-white select-none [backface-visibility:hidden]';

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
  className = '',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const isControlled = flippedProp !== undefined;
  const [internal, setInternal] = useState(false);
  const flipped = isControlled ? flippedProp : internal;

  const Icon = ICONS[icon] || Sparkles;
  const axis = direction === 'vertical' ? 'rotateX' : 'rotateY';

  const setFlipped = next => {
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
          role: 'button',
          tabIndex: 0,
          'aria-pressed': flipped,
          onClick: toggle,
          onKeyDown: event => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              toggle();
            }
          }
        }
      : {};

  const frontBg = `radial-gradient(120% 120% at 18% 12%, color-mix(in srgb, ${accentColor} 22%, transparent), transparent 60%), ${surfaceColor}`;
  const backBg = `radial-gradient(120% 120% at 82% 88%, color-mix(in srgb, ${accentColor} 26%, transparent), transparent 62%), ${surfaceColor}`;
  const backTransform = direction === 'vertical' ? 'rotateX(180deg)' : 'rotateY(180deg)';

  return (
    <div
      className={join(
        'h-[340px] w-[280px] outline-none [perspective:1200px] focus-visible:rounded-[20px] focus-visible:outline-2 focus-visible:outline-offset-4',
        className
      )}
      style={{ outlineColor: accentColor }}
      {...hoverHandlers}
      {...clickHandlers}
      {...rest}
    >
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        animate={{ [axis]: flipped ? 180 : 0 }}
        transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 26 }}
      >
        <div className={join(FACE, 'items-start justify-end gap-2')} style={{ background: frontBg }}>
          <span
            className="mb-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl border"
            style={{
              color: accentColor,
              background: `color-mix(in srgb, ${accentColor} 16%, transparent)`,
              borderColor: `color-mix(in srgb, ${accentColor} 32%, transparent)`
            }}
            aria-hidden="true"
          >
            <Icon size={28} strokeWidth={2} />
          </span>
          <h3 className="m-0 text-[1.4rem] font-[650] leading-[1.15]">{frontTitle}</h3>
          <p className="m-0 text-[0.95rem] text-white/55">{frontSubtitle}</p>
        </div>

        <div
          className={join(FACE, 'items-start justify-center gap-3')}
          style={{ background: backBg, transform: backTransform }}
        >
          <h3 className="m-0 text-[1.4rem] font-[650] leading-[1.15]">{backTitle}</h3>
          <p className="m-0 text-[0.95rem] leading-[1.5] text-white/70">{backText}</p>
          <span className="mt-2 text-[0.8rem] font-semibold tracking-[0.02em]" style={{ color: accentColor }}>
            {trigger === 'click' ? 'Click to flip back' : 'Move away to flip back'}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
