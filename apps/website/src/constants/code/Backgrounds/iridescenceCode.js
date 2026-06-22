import code from '@content/Backgrounds/Iridescence/Iridescence.jsx?raw';
import css from '@content/Backgrounds/Iridescence/Iridescence.css?raw';
import tailwind from '@tailwind/Backgrounds/Iridescence/Iridescence.jsx?raw';
import tsCode from '@ts-default/Backgrounds/Iridescence/Iridescence.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/Iridescence/Iridescence.tsx?raw';

export const iridescence = {
  dependencies: 'motion',
  usage: `import Iridescence from './Iridescence';

<Iridescence iridescence={0.85} roughness={0.12} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
