import code from '@content/Scroll/ScrollSpyNav/ScrollSpyNav.jsx?raw';
import css from '@content/Scroll/ScrollSpyNav/ScrollSpyNav.css?raw';
import tailwind from '@tailwind/Scroll/ScrollSpyNav/ScrollSpyNav.jsx?raw';
import tsCode from '@ts-default/Scroll/ScrollSpyNav/ScrollSpyNav.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/ScrollSpyNav/ScrollSpyNav.tsx?raw';

export const scrollSpyNav = {
  dependencies: 'motion',
  usage: `import ScrollSpyNav from './ScrollSpyNav';

const sections = [
  { id: 'intro', label: 'Intro', title: 'Intro', body: 'First section…' },
  { id: 'usage', label: 'Usage', title: 'Usage', body: 'Second section…' },
  { id: 'api', label: 'API', title: 'API', body: 'Third section…' }
];

<ScrollSpyNav sections={sections} activeColor="#5227FF" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
