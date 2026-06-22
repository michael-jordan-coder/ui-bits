import code from '@content/Scroll/ScrollFloat/ScrollFloat.jsx?raw';
import css from '@content/Scroll/ScrollFloat/ScrollFloat.css?raw';
import tailwind from '@tailwind/Scroll/ScrollFloat/ScrollFloat.jsx?raw';
import tsCode from '@ts-default/Scroll/ScrollFloat/ScrollFloat.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/ScrollFloat/ScrollFloat.tsx?raw';

export const scrollFloat = {
  dependencies: 'motion',
  usage: `import ScrollFloat from './ScrollFloat';

<ScrollFloat items={6} height={460} accent="#3ecf8e" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
