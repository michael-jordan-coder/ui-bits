import code from '@content/Components/ThinkingSteps/ThinkingSteps.jsx?raw';
import css from '@content/Components/ThinkingSteps/ThinkingSteps.css?raw';
import tailwind from '@tailwind/Components/ThinkingSteps/ThinkingSteps.jsx?raw';
import tsCode from '@ts-default/Components/ThinkingSteps/ThinkingSteps.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/ThinkingSteps/ThinkingSteps.tsx?raw';

export const thinkingSteps = {
  dependencies: 'motion',
  usage: `import ThinkingSteps from './ThinkingSteps';

// Default — three steps revealed over time
<ThinkingSteps />

// Custom steps and reveal speed
<ThinkingSteps
  steps={['Reading the file', 'Comparing changes', 'Preparing answer']}
  interval={2000}
/>

// Custom colors
<ThinkingSteps dotColor="#6366f1" textColor="#6366f1" stepColor="#818cf8" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
