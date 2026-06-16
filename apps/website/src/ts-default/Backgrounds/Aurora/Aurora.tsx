import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import './Aurora.css';

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

export interface AuroraProps extends HTMLAttributes<HTMLDivElement> {
  colorStops?: string[];
  surfaceColor?: string;
  speed?: number;
  blend?: number;
  blur?: number;
  className?: string;
  children?: ReactNode;
}

const DEFAULT_STOPS = ['#5227FF', '#7CFF67', '#22d3ee'];

// A full-bleed animated backdrop: a few big, heavily-blurred radial blobs are
// blended together with `screen` and drift on offset @keyframes so they weave
// like an aurora-borealis curtain over a dark surface. Pure CSS — no canvas,
// no deps — animating transform/opacity only, so it stays GPU-friendly.
// Dynamic values flow in through CSS custom properties on the root.
export default function Aurora({
  colorStops = DEFAULT_STOPS,
  surfaceColor = '#08080c',
  speed = 1,
  blend = 0.6,
  blur = 60,
  className = '',
  children,
  ...rest
}: AuroraProps) {
  const prefersReduced = useReducedMotion();
  const c1 = colorStops[0] ?? DEFAULT_STOPS[0];
  const c2 = colorStops[1] ?? colorStops[0] ?? DEFAULT_STOPS[1];
  const c3 = colorStops[2] ?? colorStops[0] ?? DEFAULT_STOPS[2];

  const style = {
    '--aurora-surface': surfaceColor,
    '--aurora-speed': speed > 0 ? speed : 1,
    '--aurora-blend': blend,
    '--aurora-blur': `${blur}px`,
    '--aurora-c1': c1,
    '--aurora-c2': c2,
    '--aurora-c3': c3,
    ...rest.style
  } as CSSProperties;

  return (
    <div
      {...rest}
      className={join('aurora-root', prefersReduced && 'aurora-static', className)}
      style={style}
    >
      <div className="aurora-stage" aria-hidden="true">
        <span className="aurora-blob aurora-blob-1" />
        <span className="aurora-blob aurora-blob-2" />
        <span className="aurora-blob aurora-blob-3" />
        <span className="aurora-sheet" />
      </div>
      {children != null && <div className="aurora-content">{children}</div>}
    </div>
  );
}
