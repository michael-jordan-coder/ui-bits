import code from '@content/Components/ThinkingDot/ThinkingDot.jsx?raw';
import css from '@content/Components/ThinkingDot/ThinkingDot.css?raw';
import tailwind from '@tailwind/Components/ThinkingDot/ThinkingDot.jsx?raw';
import tsCode from '@ts-default/Components/ThinkingDot/ThinkingDot.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/ThinkingDot/ThinkingDot.tsx?raw';

export const thinkingDot = {
  dependencies: 'motion',
  usage: `import ThinkingDot from './ThinkingDot';

// Default — quiet inline thinking state
<ThinkingDot />

// Custom text and colors
<ThinkingDot text="Analyzing" dotColor="#6366f1" textColor="#6366f1" />

// Size variants: 'sm' | 'md' | 'lg'
<ThinkingDot size="lg" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
