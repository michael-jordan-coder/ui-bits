import { useReducedMotion } from 'motion/react';
import './ThinkingDot.css';

export default function ThinkingDot({
  text = 'Thinking',
  dotColor = '#a1a1aa',
  textColor = '#a1a1aa',
  size = 'md',
  className = '',
  ...rest
}) {
  const reduced = useReducedMotion();

  return (
    <div
      className={`thinking-dot-root thinking-dot-size-${size} ${className}`}
      style={{ '--td-dot': dotColor, '--td-text': textColor }}
      {...rest}
    >
      <span className={`thinking-dot-circle${reduced ? ' thinking-dot-static' : ''}`} />
      <span className="thinking-dot-label">
        {text}
        {!reduced && (
          <span className="thinking-dot-ellipsis" aria-hidden="true">
            <span>.</span><span>.</span><span>.</span>
          </span>
        )}
        {reduced && '…'}
      </span>
    </div>
  );
}
