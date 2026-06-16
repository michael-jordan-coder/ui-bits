import code from '@content/TextAnimations/ShinyText/ShinyText.jsx?raw';
import css from '@content/TextAnimations/ShinyText/ShinyText.css?raw';
import tailwind from '@tailwind/TextAnimations/ShinyText/ShinyText.jsx?raw';
import tsCode from '@ts-default/TextAnimations/ShinyText/ShinyText.tsx?raw';
import tsTailwind from '@ts-tailwind/TextAnimations/ShinyText/ShinyText.tsx?raw';

export const shinyText = {
  dependencies: 'motion',
  usage: `import ShinyText from './ShinyText';

<ShinyText text="Shiny Text" speed={4} baseColor="#6b7280" shineColor="#ffffff" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
