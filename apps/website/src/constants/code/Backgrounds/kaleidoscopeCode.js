import code from '@content/Backgrounds/Kaleidoscope/Kaleidoscope.jsx?raw';
import css from '@content/Backgrounds/Kaleidoscope/Kaleidoscope.css?raw';
import tailwind from '@tailwind/Backgrounds/Kaleidoscope/Kaleidoscope.jsx?raw';
import tsCode from '@ts-default/Backgrounds/Kaleidoscope/Kaleidoscope.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/Kaleidoscope/Kaleidoscope.tsx?raw';

export const kaleidoscope = {
  dependencies: 'motion',
  usage: `import Kaleidoscope from './Kaleidoscope';

<Kaleidoscope segments={8} speed={1} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
