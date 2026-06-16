import { CSSProperties, ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';

const join = (...classes: (string | boolean | undefined)[]): string => classes.filter(Boolean).join(' ');

export interface ShinyTextProps {
  text?: string;
  children?: ReactNode;
  speed?: number;
  baseColor?: string;
  shineColor?: string;
  disabled?: boolean;
  className?: string;
  [key: string]: unknown;
}

// Keyframes can't be expressed with utilities, so the sweep lives in an injected
// <style> tag. Everything else (gradient, background-clip, transparent fill) is
// carried by inline style so the effect matches the CSS variant exactly.
const KEYFRAMES = `@keyframes shiny-text-sweep{to{background-position:-120% 0}}`;

export default function ShinyText({
  text = 'Shiny Text',
  children,
  speed = 4,
  baseColor = '#6b7280',
  shineColor = '#ffffff',
  disabled = false,
  className = '',
  ...rest
}: ShinyTextProps) {
  const prefersReduced = useReducedMotion();
  const content = children ?? text;
  const isStatic = disabled || prefersReduced;

  const style: CSSProperties = isStatic
    ? { color: baseColor }
    : {
        backgroundImage: `linear-gradient(100deg, ${baseColor} 0%, ${baseColor} 38%, ${shineColor} 50%, ${baseColor} 62%, ${baseColor} 100%)`,
        backgroundSize: '220% 100%',
        backgroundPosition: '100% 0',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        color: 'transparent',
        WebkitTextFillColor: 'transparent',
        animation: `shiny-text-sweep ${speed}s linear infinite`
      };

  return (
    <>
      {!isStatic && <style>{KEYFRAMES}</style>}
      <span className={join('inline-block font-semibold', className)} style={style} {...rest}>
        {content}
      </span>
    </>
  );
}
