import { useState, useEffect, type HTMLAttributes } from 'react';
import { useReducedMotion } from 'motion/react';

const DEFAULT_STEPS = ['Breaking down the problem', 'Reviewing context', 'Preparing the answer'];

export interface ThinkingStepsProps extends HTMLAttributes<HTMLDivElement> {
  steps?: typeof DEFAULT_STEPS;
  interval?: number;
  dotColor?: string;
  textColor?: string;
  stepColor?: string;
  className?: string;
}

export default function ThinkingSteps({
  steps = DEFAULT_STEPS,
  interval = 1800,
  dotColor = '#a1a1aa',
  textColor = '#52525b',
  stepColor = '#3f3f46',
  className = '',
  ...rest
}: ThinkingStepsProps) {
  const reduced = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(reduced ? steps.length : 0);

  useEffect(() => {
    if (reduced) { setVisibleCount(steps.length); return; }
    setVisibleCount(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setVisibleCount(i);
      if (i >= steps.length) clearInterval(id);
    }, interval);
    return () => clearInterval(id);
  }, [steps, interval, reduced]);

  return (
    <div
      className={`inline-flex flex-col gap-[10px] font-[inherit] text-[14px] select-none ${className}`}
      aria-live="polite"
      {...rest}
    >
      {/* Header */}
      <div className="inline-flex items-center gap-2">
        <span
          className="block rounded-full flex-shrink-0"
          style={{
            width: '0.55em',
            height: '0.55em',
            background: dotColor,
            opacity: 0.7,
            animation: reduced ? 'none' : 'ts-ripple 2s ease-out infinite',
          }}
        />
        {reduced ? (
          <span style={{ color: textColor, letterSpacing: '0.01em' }}>Thinking…</span>
        ) : (
          <span
            aria-label="Thinking"
            style={{
              background: `linear-gradient(90deg, ${textColor} 0%, ${textColor} 20%, #e4e4e7 50%, ${textColor} 80%, ${textColor} 100%)`,
              backgroundSize: '300% auto',
              backgroundPosition: '100% center',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'ts-shimmer 2.4s linear infinite',
              letterSpacing: '0.01em',
            }}
          >
            Thinking
          </span>
        )}
      </div>

      {/* Steps */}
      {visibleCount > 0 && (
        <ul
          className="list-none m-0 flex flex-col gap-[6px]"
          style={{ paddingLeft: 'calc(0.275em + 8px)' }}
          aria-label="Reasoning steps"
        >
          {steps.slice(0, visibleCount).map((step, i) => (
            <li
              key={step}
              className="flex items-center gap-2"
              style={{
                animation: reduced ? 'none' : `ts-step-in 0.35s cubic-bezier(0.22,1,0.36,1) ${i * 30}ms both`,
              }}
            >
              <span
                className="block rounded-full flex-shrink-0"
                style={{ width: 3, height: 3, background: stepColor, opacity: 0.4 }}
              />
              <span style={{ color: stepColor, fontSize: '0.857em', opacity: 0.7, letterSpacing: '0.005em' }}>
                {step}
              </span>
            </li>
          ))}
        </ul>
      )}

      <style>{`
        @keyframes ts-ripple {
          0%   { box-shadow: 0 0 0 0   rgba(161,161,170,0.5); opacity: 0.7; }
          60%  { box-shadow: 0 0 0 6px rgba(161,161,170,0);   opacity: 1; }
          100% { box-shadow: 0 0 0 0   rgba(161,161,170,0);   opacity: 0.7; }
        }
        @keyframes ts-shimmer {
          0%   { background-position: 100% center; }
          100% { background-position: -200% center; }
        }
        @keyframes ts-step-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
