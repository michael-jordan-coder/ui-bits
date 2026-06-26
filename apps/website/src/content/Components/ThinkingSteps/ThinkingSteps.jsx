import { useState, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
import './ThinkingSteps.css';

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
      className={`thinking-steps-root ${className}`}
      style={{ '--ts-dot': dotColor, '--ts-text': textColor, '--ts-step': stepColor }}
      {...rest}
    >
      <div className="thinking-steps-header">
        <span className={`thinking-steps-circle${reduced ? ' thinking-steps-static' : ''}`} />
        <span className="thinking-steps-label">
          Thinking
          {!reduced && (
            <span className="thinking-steps-ellipsis" aria-hidden="true">
              <span>.</span><span>.</span><span>.</span>
            </span>
          )}
          {reduced && '…'}
        </span>
      </div>

      {visibleCount > 0 && (
        <ul className="thinking-steps-list" aria-label="Reasoning steps">
          {steps.slice(0, visibleCount).map((step, i) => (
            <li
              key={step}
              className="thinking-steps-item"
              style={{ animationDelay: reduced ? '0ms' : `${i * 40}ms` }}
            >
              <span className="thinking-steps-item-dot" />
              {step}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
