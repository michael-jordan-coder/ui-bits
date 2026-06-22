import code from '@content/Scroll/ScrollSnap/ScrollSnap.jsx?raw';
import css from '@content/Scroll/ScrollSnap/ScrollSnap.css?raw';
import tailwind from '@tailwind/Scroll/ScrollSnap/ScrollSnap.jsx?raw';
import tsCode from '@ts-default/Scroll/ScrollSnap/ScrollSnap.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/ScrollSnap/ScrollSnap.tsx?raw';

export const scrollSnap = {
  dependencies: 'motion',
  usage: `import ScrollSnap from './ScrollSnap';

<ScrollSnap panels={4} accent="#3ecf8e" height={460} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
