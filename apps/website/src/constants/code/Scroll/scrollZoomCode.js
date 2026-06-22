import code from '@content/Scroll/ScrollZoom/ScrollZoom.jsx?raw';
import css from '@content/Scroll/ScrollZoom/ScrollZoom.css?raw';
import tailwind from '@tailwind/Scroll/ScrollZoom/ScrollZoom.jsx?raw';
import tsCode from '@ts-default/Scroll/ScrollZoom/ScrollZoom.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/ScrollZoom/ScrollZoom.tsx?raw';

export const scrollZoom = {
  dependencies: 'motion',
  usage: `import ScrollZoom from './ScrollZoom';

<ScrollZoom from={0.6} accent="#3ecf8e" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
