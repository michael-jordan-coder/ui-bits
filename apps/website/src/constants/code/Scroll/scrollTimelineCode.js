import code from '@content/Scroll/ScrollTimeline/ScrollTimeline.jsx?raw';
import css from '@content/Scroll/ScrollTimeline/ScrollTimeline.css?raw';
import tailwind from '@tailwind/Scroll/ScrollTimeline/ScrollTimeline.jsx?raw';
import tsCode from '@ts-default/Scroll/ScrollTimeline/ScrollTimeline.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/ScrollTimeline/ScrollTimeline.tsx?raw';

export const scrollTimeline = {
  dependencies: 'motion',
  usage: `import ScrollTimeline from './ScrollTimeline';

<ScrollTimeline items={5} accent="#3ecf8e" height={460} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
