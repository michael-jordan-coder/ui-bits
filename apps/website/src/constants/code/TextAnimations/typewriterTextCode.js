import code from '@content/TextAnimations/TypewriterText/TypewriterText.jsx?raw';
import css from '@content/TextAnimations/TypewriterText/TypewriterText.css?raw';
import tailwind from '@tailwind/TextAnimations/TypewriterText/TypewriterText.jsx?raw';
import tsCode from '@ts-default/TextAnimations/TypewriterText/TypewriterText.tsx?raw';
import tsTailwind from '@ts-tailwind/TextAnimations/TypewriterText/TypewriterText.tsx?raw';

export const typewriterText = {
  dependencies: 'motion',
  usage: `import TypewriterText from './TypewriterText';

<TypewriterText
  strings={['Design once.', 'Ship everywhere.', 'Delight always.']}
  typingSpeed={70}
  pauseDuration={1600}
  cursorColor="#6366f1"
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
