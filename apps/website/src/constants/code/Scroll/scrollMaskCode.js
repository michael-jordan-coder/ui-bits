import code from '@content/Scroll/ScrollMask/ScrollMask.jsx?raw';
import css from '@content/Scroll/ScrollMask/ScrollMask.css?raw';
import tailwind from '@tailwind/Scroll/ScrollMask/ScrollMask.jsx?raw';
import tsCode from '@ts-default/Scroll/ScrollMask/ScrollMask.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/ScrollMask/ScrollMask.tsx?raw';

export const scrollMask = {
  dependencies: 'motion',
  usage: `import ScrollMask from './ScrollMask';

<ScrollMask direction="up" accent="#3ecf8e" height={460} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
