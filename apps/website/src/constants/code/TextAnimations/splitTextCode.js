import code from '@content/TextAnimations/SplitText/SplitText.jsx?raw';
import css from '@content/TextAnimations/SplitText/SplitText.css?raw';
import tailwind from '@tailwind/TextAnimations/SplitText/SplitText.jsx?raw';
import tsCode from '@ts-default/TextAnimations/SplitText/SplitText.tsx?raw';
import tsTailwind from '@ts-tailwind/TextAnimations/SplitText/SplitText.tsx?raw';

export const splitText = {
  dependencies: 'motion',
  usage: `import SplitText from './SplitText';

<SplitText text="Ag — split text reveal" as="chars" stagger={0.03} duration={0.5} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
