import { type HTMLAttributes } from 'react';
import { useReducedMotion } from 'motion/react';

const sizeClass = { sm: 'text-[13px]', md: 'text-[14px]', lg: 'text-[16px]' };

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
  textColor = '#a1a1aa',
  size = 'md',
  className = '',
  ...rest
}: ThinkingDotProps) {
  const reduced = useReducedMotion();

  return (
    <div
      className={`inline-flex items-center gap-2 font-[inherit] ${sizeClass[size] ?? sizeClass.md} ${className}`}
      {...rest}
    >
      <span
        className={`block rounded-full flex-shrink-0${reduced ? ' opacity-50' : ''}`}
        style={{
          width: '0.7em',
          height: '0.7em',
          background: dotColor,
          animation: reduced ? 'none' : 'thinking-dot-pulse 1.8s ease-in-out infinite',
        }}
      />
      <span
        className="inline-flex items-baseline gap-[1px] tracking-[0.01em]"
        style={{ color: textColor }}
      >
        {text}
        {!reduced && (
          <span className="inline-flex gap-[1px]" aria-hidden="true">
            {[0, 0.2, 0.4].map((delay, i) => (
              <span
                key={i}
                style={{ animation: `thinking-dot-blink 1.4s ease-in-out ${delay}s infinite` }}
              >
                .
              </span>
            ))}
          </span>
        )}
        {reduced && '…'}
      </span>

      <style>{`
        @keyframes thinking-dot-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.85); }
          50%       { opacity: 1;   transform: scale(1); }
        }
        @keyframes thinking-dot-blink {
          0%, 60%, 100% { opacity: 0.2; }
          30%           { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
