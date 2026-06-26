import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import './ThinkingSteps.css';

const DEFAULT_STEPS = ['Breaking down the problem', 'Reviewing context', 'Preparing the answer'];

export default function ThinkingSteps({
  steps = DEFAULT_STEPS,
  interval = 1800,
  dotColor = '#a1a1aa',
  textColor = '#52525b',
  stepColor = '#3f3f46',
  className = '',
  ...rest
}) {
  const reduced = useReducedMotion();
  const [visibleCount, setVisibleCount] = useState(reduced ? steps.length : 0);
  const prevStepsRef = useRef(steps);

  useEffect(() => {
    prevStepsRef.current = steps;
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
      aria-live="polite"
      {...rest}
    >
      {/* Header */}
      <div className="thinking-steps-header">
        <span className={`thinking-steps-indicator${reduced ? '' : ' thinking-steps-indicator--ripple'}`} />
        {reduced ? (
          <span className="thinking-steps-static">Thinking…</span>
        ) : (
          <span className="thinking-steps-shimmer" aria-label="Thinking">Thinking</span>
        )}
      </div>

      {/* Steps */}
      {visibleCount > 0 && (
        <ul className="thinking-steps-list" aria-label="Reasoning steps">
          {steps.slice(0, visibleCount).map((step, i) => (
            <li
              key={step}
              className="thinking-steps-item"
              style={reduced ? undefined : { animationDelay: `${i * 30}ms` }}
            >
              <span className="thinking-steps-item-dot" />
              <span className="thinking-steps-item-label">{step}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
