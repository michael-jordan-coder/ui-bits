import code from '@content/Scroll/ScrollStack/ScrollStack.jsx?raw';
import css from '@content/Scroll/ScrollStack/ScrollStack.css?raw';
import tailwind from '@tailwind/Scroll/ScrollStack/ScrollStack.jsx?raw';
import tsCode from '@ts-default/Scroll/ScrollStack/ScrollStack.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/ScrollStack/ScrollStack.tsx?raw';

export const scrollStack = {
  dependencies: 'motion',
  usage: `import ScrollStack from './ScrollStack';

const items = [
  { title: 'Capture', description: 'Drop any idea in and keep moving.', accent: '#5227FF' },
  { title: 'Organize', description: 'Group related thoughts together.', accent: '#0EA5E9' },
  { title: 'Ship', description: 'Hand it off when it can stand alone.', accent: '#10B981' }
];

<ScrollStack items={items} peek={22} cardHeight={190} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
