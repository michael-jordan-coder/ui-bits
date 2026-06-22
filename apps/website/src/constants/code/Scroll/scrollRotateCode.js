import code from '@content/Scroll/ScrollRotate/ScrollRotate.jsx?raw';
import css from '@content/Scroll/ScrollRotate/ScrollRotate.css?raw';
import tailwind from '@tailwind/Scroll/ScrollRotate/ScrollRotate.jsx?raw';
import tsCode from '@ts-default/Scroll/ScrollRotate/ScrollRotate.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/ScrollRotate/ScrollRotate.tsx?raw';

export const scrollRotate = {
  dependencies: 'motion',
  usage: `import ScrollRotate from './ScrollRotate';

<ScrollRotate turns={0.5} segments={24} accent="#3ecf8e" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
