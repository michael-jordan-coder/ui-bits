import { useState, useEffect } from 'react';
import { useReducedMotion } from 'motion/react';
import './ThinkingTools.css';

const DEFAULT_TOOLS = ['Searching the web', 'Reading sources', 'Preparing answer'];

export default function ThinkingTools({
  tools = DEFAULT_TOOLS,
  interval = 1600,
  dotColor = '#a1a1aa',
  textColor = '#a1a1aa',
  completedColor = '#52525b',
  className = '',
  ...rest
}) {
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
      className={`thinking-tools-root ${className}`}
      style={{ '--tt-dot': dotColor, '--tt-text': textColor, '--tt-done': completedColor }}
      {...rest}
    >
      {tools.map((tool, i) => {
        const isDone = i < activeIndex;
        const isActive = i === activeIndex;
        return (
          <div
            key={tool}
            className={`thinking-tools-row${isDone ? ' thinking-tools-done' : ''}${isActive ? ' thinking-tools-active' : ''}`}
            style={{ animationDelay: reduced ? '0ms' : `${i * 60}ms` }}
          >
            <span className={`thinking-tools-dot${reduced ? ' thinking-tools-static' : ''}`} />
            <span className="thinking-tools-label">{tool}</span>
          </div>
        );
      })}
    </div>
  );
}
