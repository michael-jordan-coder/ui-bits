import type { CSSProperties, ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

export interface MarqueeProps {
  children?: ReactNode;
  speed?: number;
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  gap?: number;
  fade?: boolean;
  fadeWidth?: number;
  className?: string;
}

const KEYFRAMES = `@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}`;

// A seamless infinite scroller: the children are rendered twice inside one flex
// track, and the track animates from translateX(0) to translateX(-50%). Because
// the second copy is identical to the first, the moment the track has shifted by
// half its width the loop restarts with no visible seam. Speed, gap and the edge
// fade widths are driven by inline CSS custom properties; pause-on-hover toggles
// the animation play-state on group hover; reduced motion freezes the track.
export default function Marquee({
  children,
  speed = 30,
  direction = 'left',
  pauseOnHover = true,
  gap = 24,
  fade = true,
  fadeWidth = 64,
  className = '',
  ...rest
}: MarqueeProps) {
  const prefersReduced = useReducedMotion();
  const animated = !prefersReduced;

  const rootStyle = {
    '--marquee-duration': `${speed}s`,
    '--marquee-gap': `${gap}px`,
    '--marquee-fade-width': `${fadeWidth}px`,
    '--marquee-direction': direction === 'right' ? 'reverse' : 'normal',
    ...(fade
      ? {
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0, #000 var(--marquee-fade-width), #000 calc(100% - var(--marquee-fade-width)), transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0, #000 var(--marquee-fade-width), #000 calc(100% - var(--marquee-fade-width)), transparent 100%)'
        }
      : {})
  } as CSSProperties;

  const trackStyle: CSSProperties | undefined = animated
    ? {
        animation: 'marquee-scroll var(--marquee-duration) linear infinite',
        animationDirection: 'var(--marquee-direction)',
        willChange: 'transform'
      }
    : undefined;

  return (
    <div
      className={join('group relative w-full select-none overflow-hidden', className)}
      style={rootStyle}
      {...rest}
    >
      <style>{KEYFRAMES}</style>
      <div
        className={join(
          'flex w-max flex-nowrap',
          pauseOnHover && animated && 'group-hover:[animation-play-state:paused]'
        )}
        style={trackStyle}
      >
        <div className="flex flex-nowrap items-center" style={{ gap, paddingRight: gap }} aria-hidden={false}>
          {children}
        </div>
        <div className="flex flex-nowrap items-center" style={{ gap, paddingRight: gap }} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
