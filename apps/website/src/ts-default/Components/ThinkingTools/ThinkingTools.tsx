import { useState, useEffect, type HTMLAttributes, type CSSProperties } from 'react';
import { useReducedMotion } from 'motion/react';
import './ThinkingTools.css';

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
  textColor = '#52525b',
  completedColor = '#3f3f46',
  className = '',
  ...rest
}: ThinkingToolsProps) {
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
      className={`thinking-tools-root ${className}`}
      style={{ '--tt-dot': dotColor, '--tt-text': textColor, '--tt-done': completedColor }}
      aria-live="polite"
      {...rest}
    >
      {tools.map((tool, i) => {
        const isDone = i < activeIndex;
        const isActive = i === activeIndex;

        return (
          <div
            key={tool}
            className={[
              'thinking-tools-row',
              isActive ? 'thinking-tools-row--active' : '',
              isDone   ? 'thinking-tools-row--done'   : '',
            ].join(' ')}
            style={reduced ? undefined : { animationDelay: `${i * 50}ms` }}
          >
            <span
              className={[
                'thinking-tools-dot',
                isActive && !reduced ? 'thinking-tools-dot--ripple' : '',
              ].join(' ')}
            />
            {isActive && !reduced ? (
              <span className="thinking-tools-shimmer" aria-label={tool}>{tool}</span>
            ) : (
              <span className="thinking-tools-label">{tool}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
