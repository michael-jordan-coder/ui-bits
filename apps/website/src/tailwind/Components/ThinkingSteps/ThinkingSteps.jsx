import { useState, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';

const DEFAULT_STEPS = ['Breaking down the problem', 'Reviewing context', 'Preparing the answer'];

export default function ThinkingSteps({
  steps = DEFAULT_STEPS,
  interval = 1800,
  dotColor = '#a1a1aa',
  textColor = '#a1a1aa',
  stepColor = '#71717a',
  className = '',
  ...rest
}) {
  const reduced = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(0);

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
      className={`inline-flex flex-col gap-2 font-[inherit] text-[14px] ${className}`}
      {...rest}
    >
      <div className="inline-flex items-center gap-2">
        <span
          className={`block rounded-full flex-shrink-0${reduced ? ' opacity-50' : ''}`}
          style={{
            width: '0.7em',
            height: '0.7em',
            background: dotColor,
            animation: reduced ? 'none' : 'ts-pulse 1.8s ease-in-out infinite',
          }}
        />
        <span
          className="inline-flex items-baseline gap-[1px] tracking-[0.01em]"
          style={{ color: textColor }}
        >
          Thinking
          {!reduced && (
            <span className="inline-flex gap-[1px]" aria-hidden="true">
              {[0, 0.2, 0.4].map((delay, i) => (
                <span key={i} style={{ animation: `ts-blink 1.4s ease-in-out ${delay}s infinite` }}>.</span>
              ))}
            </span>
          )}
          {reduced && '…'}
        </span>
      </div>

      {visibleCount > 0 && (
        <ul
          className="list-none m-0 flex flex-col gap-[5px]"
          style={{ paddingLeft: 'calc(0.35em + 8px)' }}
          aria-label="Reasoning steps"
        >
          {steps.slice(0, visibleCount).map((step, i) => (
            <li
              key={step}
              className="flex items-center gap-[7px] text-[0.875em]"
              style={{
                color: stepColor,
                animation: `ts-fadein 0.3s ease ${reduced ? 0 : i * 40}ms both`,
              }}
            >
              <span
                className="block rounded-full flex-shrink-0 opacity-50"
                style={{ width: 4, height: 4, background: stepColor }}
              />
              {step}
            </li>
          ))}
        </ul>
      )}

      <style>{`
        @keyframes ts-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50%       { opacity: 1;   transform: scale(1); }
        }
        @keyframes ts-blink {
          0%, 60%, 100% { opacity: 0.2; }
          30%           { opacity: 1; }
        }
        @keyframes ts-fadein {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
