import code from '@content/Scroll/ReadingHighlight/ReadingHighlight.jsx?raw';
import css from '@content/Scroll/ReadingHighlight/ReadingHighlight.css?raw';
import tailwind from '@tailwind/Scroll/ReadingHighlight/ReadingHighlight.jsx?raw';
import tsCode from '@ts-default/Scroll/ReadingHighlight/ReadingHighlight.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/ReadingHighlight/ReadingHighlight.tsx?raw';

export const readingHighlight = {
  dependencies: 'motion',
  usage: `import ReadingHighlight from './ReadingHighlight';

<ReadingHighlight dim="#3a3f4b" bright="#f5f7fa" height={460} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
