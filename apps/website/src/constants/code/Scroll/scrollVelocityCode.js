import code from '@content/Scroll/ScrollVelocity/ScrollVelocity.jsx?raw';
import css from '@content/Scroll/ScrollVelocity/ScrollVelocity.css?raw';
import tailwind from '@tailwind/Scroll/ScrollVelocity/ScrollVelocity.jsx?raw';
import tsCode from '@ts-default/Scroll/ScrollVelocity/ScrollVelocity.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/ScrollVelocity/ScrollVelocity.tsx?raw';

export const scrollVelocity = {
  dependencies: 'motion',
  usage: `import ScrollVelocity from './ScrollVelocity';

const rows = [
  { text: 'Design — Build — Ship', direction: 1 },
  { text: 'Motion — Detail — Craft', direction: -1 }
];

<ScrollVelocity rows={rows} baseVelocity={5} boost={5} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
