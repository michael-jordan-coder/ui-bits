import code from '@content/Scroll/ScrollReveal/ScrollReveal.jsx?raw';
import css from '@content/Scroll/ScrollReveal/ScrollReveal.css?raw';
import tailwind from '@tailwind/Scroll/ScrollReveal/ScrollReveal.jsx?raw';
import tsCode from '@ts-default/Scroll/ScrollReveal/ScrollReveal.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/ScrollReveal/ScrollReveal.tsx?raw';

export const scrollReveal = {
  dependencies: 'motion',
  usage: `import ScrollReveal from './ScrollReveal';

<ScrollReveal direction="up" distance={40} blur={6} stagger={0.08}>
  <section>First block</section>
  <section>Second block</section>
  <section>Third block</section>
</ScrollReveal>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
