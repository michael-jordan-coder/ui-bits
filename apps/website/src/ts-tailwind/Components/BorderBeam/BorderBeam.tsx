import type { ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

const KEYFRAMES = `@property --border-beam-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 0deg;
}
@keyframes border-beam-spin {
  to { --border-beam-angle: 360deg; }
}`;

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

  const gradient = `conic-gradient(from var(--border-beam-angle), transparent 0deg, ${beamColor} 40deg, ${beamColorTo} 90deg, transparent 130deg, transparent 360deg)`;

  return (
    <div
      className={join('relative inline-flex isolate font-[inherit] text-white', className)}
      style={{ padding: borderWidth, borderRadius }}
      {...rest}
    >
      <style>{KEYFRAMES}</style>
      <span
        aria-hidden="true"
        className="absolute inset-0 z-0 rounded-[inherit]"
        style={{
          background: gradient,
          animation: prefersReduced ? 'none' : `border-beam-spin ${duration}s linear infinite`
        }}
      >
        <span
          aria-hidden="true"
          className="absolute rounded-[inherit] opacity-55"
          style={{
            inset: borderWidth * -2,
            background: gradient,
            filter: 'blur(10px)',
            animation: prefersReduced ? 'none' : `border-beam-spin ${duration}s linear infinite`
          }}
        />
      </span>
      <div
        className="relative z-[1] w-full"
        style={{ borderRadius: borderRadius - borderWidth, background: surfaceColor }}
      >
        {children}
      </div>
    </div>
  );
}
