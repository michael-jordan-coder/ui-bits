import { useReducedMotion } from 'motion/react';
import './Marquee.css';

const join = (...classes) => classes.filter(Boolean).join(' ');

// A seamless infinite scroller: the children are rendered twice inside one flex
// track, and the track animates from translateX(0) to translateX(-50%). Because
// the second copy is identical to the first, the moment the track has shifted by
// half its width the loop restarts with no visible seam. Speed, gap and the edge
// fade widths are driven by CSS custom properties; pause-on-hover toggles the
// animation play-state via :hover; reduced motion freezes the track in place.
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
}) {
  const prefersReduced = useReducedMotion();
  const animated = !prefersReduced;

  const style = {
    '--marquee-duration': `${speed}s`,
    '--marquee-gap': `${gap}px`,
    '--marquee-fade-width': `${fadeWidth}px`,
    '--marquee-direction': direction === 'right' ? 'reverse' : 'normal'
  };

  return (
    <div
      className={join(
        'marquee-root',
        fade && 'marquee-root--fade',
        pauseOnHover && 'marquee-root--pause',
        className
      )}
      style={style}
      {...rest}
    >
      <div className={join('marquee-track', animated && 'marquee-track--animated')}>
        <div className="marquee-group" aria-hidden={false}>
          {children}
        </div>
        <div className="marquee-group" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
