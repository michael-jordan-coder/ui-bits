import { useState, useEffect, type HTMLAttributes } from 'react';
import { useReducedMotion } from 'motion/react';

const DEFAULT_TOOLS = ['Searching the web', 'Reading sources', 'Preparing answer'];

export interface ThinkingToolsProps extends HTMLAttributes<HTMLDivElement> {
  tools?: typeof DEFAULT_TOOLS;
  interval?: number;
  dotColor?: string;
  textColor?: string;
  completedColor?: string;
  className?: string;
}

export default function ThinkingTools({
  tools = DEFAULT_TOOLS,
  interval = 1600,
  dotColor = '#a1a1aa',
  textColor = '#a1a1aa',
  completedColor = '#52525b',
  className = '',
  ...rest
}: ThinkingToolsProps) {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

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
      className={`inline-flex flex-col gap-[7px] font-[inherit] text-[14px] ${className}`}
      {...rest}
    >
      {tools.map((tool, i) => {
        const isDone = i < activeIndex;
        const isActive = i === activeIndex;
        const isQueued = !isDone && !isActive;

        const dotStyle = {
          width: '0.7em',
          height: '0.7em',
          background: isDone ? completedColor : dotColor,
          animation: isActive && !reduced ? 'tt-pulse 1.8s ease-in-out infinite' : 'none',
          opacity: isActive ? 1 : isDone ? 0.2 : 0.3,
          transform: isActive ? 'scale(1)' : isDone ? 'scale(0.8)' : 'scale(0.85)',
          transition: 'opacity 0.3s, transform 0.3s',
        };

        const labelColor = isActive ? textColor : completedColor;
        const labelOpacity = isQueued ? 0.35 : isDone ? 0.6 : 1;

        return (
          <div
            key={tool}
            className="inline-flex items-center gap-2"
            style={{ animation: `tt-fadein 0.25s ease ${reduced ? 0 : i * 60}ms both` }}
          >
            <span className="block rounded-full flex-shrink-0" style={dotStyle} />
            <span
              className="tracking-[0.01em] transition-[color,opacity] duration-300"
              style={{ color: labelColor, opacity: labelOpacity }}
            >
              {tool}
            </span>
          </div>
        );
      })}

      <style>{`
        @keyframes tt-pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.85); }
          50%       { opacity: 1;   transform: scale(1); }
        }
        @keyframes tt-fadein {
          from { opacity: 0; transform: translateY(3px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
