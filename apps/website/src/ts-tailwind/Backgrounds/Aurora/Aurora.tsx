import { type CSSProperties, type HTMLAttributes, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';

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

// Keyframes and blend/blur effects can't be expressed with Tailwind utilities,
// so the gradient layers live in a scoped <style> tag while layout uses utility
// classes. Visual result is identical to the CSS variant.
const STYLES = `
.aurora-tw-stage { position: absolute; inset: 0; z-index: 0; }
.aurora-tw-blob {
  position: absolute; width: 70%; height: 70%; border-radius: 50%;
  filter: blur(var(--aurora-blur, 60px)); mix-blend-mode: screen;
  opacity: var(--aurora-blend, 0.6); will-change: transform;
}
.aurora-tw-blob-1 {
  top: -18%; left: -10%;
  background: radial-gradient(circle at 50% 50%, var(--aurora-c1, #5227ff) 0%, transparent 65%);
  animation: aurora-tw-drift-1 calc(18s / var(--aurora-speed, 1)) ease-in-out infinite;
}
.aurora-tw-blob-2 {
  top: -8%; right: -16%; left: auto;
  background: radial-gradient(circle at 50% 50%, var(--aurora-c2, #7cff67) 0%, transparent 65%);
  animation: aurora-tw-drift-2 calc(23s / var(--aurora-speed, 1)) ease-in-out infinite;
}
.aurora-tw-blob-3 {
  bottom: -22%; left: 18%;
  background: radial-gradient(circle at 50% 50%, var(--aurora-c3, #22d3ee) 0%, transparent 65%);
  animation: aurora-tw-drift-3 calc(29s / var(--aurora-speed, 1)) ease-in-out infinite;
}
.aurora-tw-sheet {
  position: absolute; inset: -20%;
  background: conic-gradient(from 210deg at 50% 50%, transparent 0deg, var(--aurora-c1, #5227ff) 90deg, transparent 180deg, var(--aurora-c3, #22d3ee) 270deg, transparent 360deg);
  filter: blur(calc(var(--aurora-blur, 60px) * 1.4)); mix-blend-mode: screen;
  opacity: calc(var(--aurora-blend, 0.6) * 0.35); will-change: transform;
  animation: aurora-tw-spin calc(46s / var(--aurora-speed, 1)) linear infinite;
}
@keyframes aurora-tw-drift-1 {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  33% { transform: translate3d(14%, 10%, 0) scale(1.18); }
  66% { transform: translate3d(6%, 22%, 0) scale(0.92); }
}
@keyframes aurora-tw-drift-2 {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  40% { transform: translate3d(-18%, 16%, 0) scale(1.22); }
  70% { transform: translate3d(-8%, 4%, 0) scale(0.9); }
}
@keyframes aurora-tw-drift-3 {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1.05); }
  35% { transform: translate3d(16%, -14%, 0) scale(0.88); }
  68% { transform: translate3d(-12%, -8%, 0) scale(1.2); }
}
@keyframes aurora-tw-spin { to { transform: rotate(360deg); } }
.aurora-tw-static .aurora-tw-blob, .aurora-tw-static .aurora-tw-sheet { animation: none; }
`;

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
    '--aurora-speed': speed > 0 ? speed : 1,
    '--aurora-blend': blend,
    '--aurora-blur': `${blur}px`,
    '--aurora-c1': c1,
    '--aurora-c2': c2,
    '--aurora-c3': c3,
    background: surfaceColor,
    ...rest.style
  } as CSSProperties;

  return (
    <div
      {...rest}
      className={join(
        'relative isolate h-full min-h-[280px] w-full overflow-hidden',
        prefersReduced && 'aurora-tw-static',
        className
      )}
      style={style}
    >
      <style>{STYLES}</style>
      <div className="aurora-tw-stage" aria-hidden="true">
        <span className="aurora-tw-blob aurora-tw-blob-1" />
        <span className="aurora-tw-blob aurora-tw-blob-2" />
        <span className="aurora-tw-blob aurora-tw-blob-3" />
        <span className="aurora-tw-sheet" />
      </div>
      {children != null && (
        <div className="relative z-[1] flex h-full w-full items-center justify-center p-6 text-center">
          {children}
        </div>
      )}
    </div>
  );
}
