import code from '@content/Scroll/ScrollProgress/ScrollProgress.jsx?raw';
import css from '@content/Scroll/ScrollProgress/ScrollProgress.css?raw';
import tailwind from '@tailwind/Scroll/ScrollProgress/ScrollProgress.jsx?raw';
import tsCode from '@ts-default/Scroll/ScrollProgress/ScrollProgress.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/ScrollProgress/ScrollProgress.tsx?raw';

export const scrollProgress = {
  dependencies: 'motion',
  usage: `import ScrollProgress from './ScrollProgress';

<ScrollProgress barColor="#5227FF" circular showPercent>
  <article>Your long-form content…</article>
</ScrollProgress>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
