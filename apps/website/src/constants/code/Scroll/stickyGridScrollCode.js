import code from '@content/Scroll/StickyGridScroll/StickyGridScroll.jsx?raw';
import css from '@content/Scroll/StickyGridScroll/StickyGridScroll.css?raw';
import tailwind from '@tailwind/Scroll/StickyGridScroll/StickyGridScroll.jsx?raw';
import tsCode from '@ts-default/Scroll/StickyGridScroll/StickyGridScroll.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/StickyGridScroll/StickyGridScroll.tsx?raw';

export const stickyGridScroll = {
  dependencies: 'motion',
  usage: `import StickyGridScroll from './StickyGridScroll';

<StickyGridScroll tiles={9} columns={3} gap={12} travel={64} zoom={1.12} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
