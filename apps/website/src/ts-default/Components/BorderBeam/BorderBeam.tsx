import type { CSSProperties, ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import './BorderBeam.css';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

export interface BorderBeamProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  beamColor?: string;
  beamColorTo?: string;
  duration?: number;
  borderWidth?: number;
  borderRadius?: number;
  surfaceColor?: string;
  className?: string;
}

// A surface card wrapped in a luminous beam that travels continuously around
// its rounded border. A conic-gradient layer fills the root and spins via a
// rotating `--angle` custom property; an inner surface div covers the center,
// so only a thin ring of the rotating gradient stays visible at the edge.
export default function BorderBeam({
  children,
  beamColor = '#6366f1',
  beamColorTo = '#a855f7',
  duration = 6,
  borderWidth = 2,
  borderRadius = 16,
  surfaceColor = '#16181d',
  className = '',
  ...rest
}: BorderBeamProps) {
  const prefersReduced = useReducedMotion();

  const style = {
    '--border-beam-from': beamColor,
    '--border-beam-to': beamColorTo,
    '--border-beam-duration': `${duration}s`,
    '--border-beam-width': `${borderWidth}px`,
    '--border-beam-radius': `${borderRadius}px`,
    '--border-beam-surface': surfaceColor
  } as CSSProperties;

  return (
    <div
      className={join('border-beam-root', prefersReduced && 'border-beam-root--static', className)}
      style={style}
      {...rest}
    >
      <span className="border-beam-glow" aria-hidden="true" />
      <div className="border-beam-surface">{children}</div>
    </div>
  );
}
