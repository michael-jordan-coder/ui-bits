import code from '@content/Components/ThinkingTools/ThinkingTools.jsx?raw';
import css from '@content/Components/ThinkingTools/ThinkingTools.css?raw';
import tailwind from '@tailwind/Components/ThinkingTools/ThinkingTools.jsx?raw';
import tsCode from '@ts-default/Components/ThinkingTools/ThinkingTools.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/ThinkingTools/ThinkingTools.tsx?raw';

export const thinkingTools = {
  dependencies: 'motion',
  usage: `import ThinkingTools from './ThinkingTools';

// Default — three tool states cycling through
<ThinkingTools />

// Custom tool labels and speed
<ThinkingTools
  tools={['Reading files', 'Analyzing code', 'Generating diff', 'Preparing answer']}
  interval={1800}
/>

// Custom colors
<ThinkingTools dotColor="#6366f1" textColor="#6366f1" completedColor="#3f3f46" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
