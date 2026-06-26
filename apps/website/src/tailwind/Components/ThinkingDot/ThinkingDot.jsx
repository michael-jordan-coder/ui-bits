import { useReducedMotion } from 'motion/react';

const sizeClass = { sm: 'text-[13px]', md: 'text-[14px]', lg: 'text-[16px]' };

export default function ThinkingDot({
  text = 'Thinking',
  dotColor = '#a1a1aa',
  textColor = '#52525b',
  size = 'md',
  className = '',
  ...rest
}) {
  const reduced = useReducedMotion();

  return (
    <div
      className={`inline-flex items-center gap-2 font-[inherit] select-none ${sizeClass[size] ?? sizeClass.md} ${className}`}
      aria-label={`${text}…`}
      aria-live="polite"
      {...rest}
    >
      {/* Radiating indicator dot */}
      <span
        className="block rounded-full flex-shrink-0"
        style={{
          width: '0.55em',
          height: '0.55em',
          background: dotColor,
          opacity: 0.7,
          animation: reduced ? 'none' : 'td-ripple 2s ease-out infinite',
        }}
      />

      {reduced ? (
        <span style={{ color: textColor, letterSpacing: '0.01em' }}>{text}…</span>
      ) : (
        <>
          {/* Shimmer text */}
          <span
            aria-hidden="true"
            style={{
              background: `linear-gradient(90deg, ${textColor} 0%, ${textColor} 20%, #e4e4e7 50%, ${textColor} 80%, ${textColor} 100%)`,
              backgroundSize: '300% auto',
              backgroundPosition: '100% center',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              animation: 'td-shimmer 2.4s linear infinite',
              letterSpacing: '0.01em',
            }}
          >
            {text}
          </span>

          {/* Bouncing dots */}
          <span
            aria-hidden="true"
            className="inline-flex items-end gap-[3px]"
            style={{ paddingBottom: '0.12em' }}
          >
            {[0, 0.15, 0.3].map((delay, i) => (
              <span
                key={i}
                className="block rounded-full"
                style={{
                  width: 3,
                  height: 3,
                  background: textColor,
                  opacity: 0.5,
                  animation: `td-bounce 1.2s ease-in-out ${delay}s infinite`,
                }}
              />
            ))}
          </span>
        </>
      )}

      <style>{`
        @keyframes td-ripple {
          0%   { box-shadow: 0 0 0 0   rgba(161,161,170,0.5); opacity: 0.7; }
          60%  { box-shadow: 0 0 0 6px rgba(161,161,170,0);   opacity: 1; }
          100% { box-shadow: 0 0 0 0   rgba(161,161,170,0);   opacity: 0.7; }
        }
        @keyframes td-shimmer {
          0%   { background-position: 100% center; }
          100% { background-position: -200% center; }
        }
        @keyframes td-bounce {
          0%, 60%, 100% { transform: translateY(0);    opacity: 0.3; }
          30%            { transform: translateY(-4px); opacity: 0.9; }
        }
      `}</style>
    </div>
  );
}
