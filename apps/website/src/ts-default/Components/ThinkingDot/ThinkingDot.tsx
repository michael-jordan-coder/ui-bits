import { type HTMLAttributes, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import './ThinkingDot.css';

export interface ThinkingDotProps extends HTMLAttributes<HTMLDivElement> {
  text?: string;
  dotColor?: string;
  textColor?: string;
  size?: string;
  className?: string;
}

export default function ThinkingDot({
  text = 'Thinking',
  dotColor = '#a1a1aa',
  textColor = '#52525b',
  size = 'md',
  className = '',
  ...rest
}: ThinkingDotProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={`thinking-dot-root thinking-dot-${size} ${className}`}
      style={{ '--td-dot': dotColor, '--td-text': textColor }}
      aria-label={`${text}…`}
      aria-live="polite"
      {...rest}
    >
      <span className={`thinking-dot-indicator${reduced ? '' : ' thinking-dot-indicator--ripple'}`} />

      {reduced ? (
        <span className="thinking-dot-static">{text}…</span>
      ) : (
        <>
          <span className="thinking-dot-shimmer" aria-hidden="true">{text}</span>
          <span className="thinking-dot-bounce" aria-hidden="true">
            <span /><span /><span />
          </span>
        </>
      )}
    </div>
  );
}
