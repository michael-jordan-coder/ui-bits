import { useState, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';

const DEFAULT_TOOLS = ['Searching the web', 'Reading sources', 'Preparing answer'];

export default function ThinkingTools({
  tools = DEFAULT_TOOLS,
  interval = 1600,
  dotColor = '#a1a1aa',
  textColor = '#52525b',
  completedColor = '#3f3f46',
  className = '',
  ...rest
}) {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(reduced ? tools.length - 1 : 0);

  useEffect(() => {
    if (reduced) { setActiveIndex(tools.length - 1); return; }
    setActiveIndex(0);
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i >= tools.length) { clearInterval(id); return; }
      setActiveIndex(i);
    }, interval);
    return () => clearInterval(id);
  }, [tools, interval, reduced]);

  return (
    <div
      className={`inline-flex flex-col gap-2 font-[inherit] text-[14px] select-none ${className}`}
      aria-live="polite"
      {...rest}
    >
      {tools.map((tool, i) => {
        const isDone = i < activeIndex;
        const isActive = i === activeIndex;
        const isQueued = !isDone && !isActive;

        return (
          <div
            key={tool}
            className="inline-flex items-center gap-[9px]"
            style={{ animation: reduced ? 'none' : `tt-row-in 0.3s cubic-bezier(0.22,1,0.36,1) ${i * 50}ms both` }}
          >
            {/* Dot */}
            <span
              className="block rounded-full flex-shrink-0"
              style={{
                width: '0.55em',
                height: '0.55em',
                background: isActive ? dotColor : completedColor,
                opacity: isActive ? 0.8 : isDone ? 0.15 : 0.2,
                transition: 'background 0.4s ease, opacity 0.4s ease',
                animation: isActive && !reduced ? 'tt-ripple 2s ease-out infinite' : 'none',
              }}
            />

            {/* Label */}
            {isActive && !reduced ? (
              <span
                aria-label={tool}
                style={{
                  background: `linear-gradient(90deg, ${textColor} 0%, ${textColor} 20%, #e4e4e7 50%, ${textColor} 80%, ${textColor} 100%)`,
                  backgroundSize: '300% auto',
                  backgroundPosition: '100% center',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'tt-shimmer 2.4s linear infinite',
                  letterSpacing: '0.01em',
                }}
              >
                {tool}
              </span>
            ) : (
              <span
                style={{
                  color: completedColor,
                  opacity: isDone ? 0.3 : isQueued ? 0.2 : 1,
                  transition: 'opacity 0.4s ease',
                  letterSpacing: '0.01em',
                }}
              >
                {tool}
              </span>
            )}
          </div>
        );
      })}

      <style>{`
        @keyframes tt-row-in {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tt-ripple {
          0%   { box-shadow: 0 0 0 0   rgba(161,161,170,0.5); opacity: 0.8; }
          60%  { box-shadow: 0 0 0 6px rgba(161,161,170,0);   opacity: 1; }
          100% { box-shadow: 0 0 0 0   rgba(161,161,170,0);   opacity: 0.8; }
        }
        @keyframes tt-shimmer {
          0%   { background-position: 100% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
    </div>
  );
}
