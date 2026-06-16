import { useReducedMotion } from 'motion/react';
import './ShinyText.css';

const join = (...classes) => classes.filter(Boolean).join(' ');

// Text painted in a muted base color with a bright highlight that sweeps across
// the glyphs on a loop, like light glancing off brushed metal. The effect is a
// single linear-gradient (base -> shine -> base) clipped to the text via
// `background-clip: text` + transparent fill; the shimmer is just the gradient's
// `background-position` animating from one edge to the other. Pure CSS, no deps.
export default function ShinyText({
  text = 'Shiny Text',
  children,
  speed = 4,
  baseColor = '#6b7280',
  shineColor = '#ffffff',
  disabled = false,
  className = '',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const content = children ?? text;
  const isStatic = disabled || prefersReduced;

  const style = {
    '--shiny-text-base': baseColor,
    '--shiny-text-shine': shineColor,
    '--shiny-text-speed': `${speed}s`
  };

  return (
    <span
      className={join('shiny-text', isStatic && 'shiny-text--static', className)}
      style={style}
      {...rest}
    >
      {content}
    </span>
  );
}
