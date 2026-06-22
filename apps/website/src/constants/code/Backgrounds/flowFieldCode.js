import code from '@content/Backgrounds/FlowField/FlowField.jsx?raw';
import css from '@content/Backgrounds/FlowField/FlowField.css?raw';
import tailwind from '@tailwind/Backgrounds/FlowField/FlowField.jsx?raw';
import tsCode from '@ts-default/Backgrounds/FlowField/FlowField.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/FlowField/FlowField.tsx?raw';

export const flowField = {
  dependencies: 'motion',
  usage: `import FlowField from './FlowField';

<FlowField count={700} color="#7aa2ff" speed={1} scale={1} trail={0.92} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
