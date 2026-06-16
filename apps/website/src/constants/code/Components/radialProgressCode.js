import code from '@content/Components/RadialProgress/RadialProgress.jsx?raw';
import css from '@content/Components/RadialProgress/RadialProgress.css?raw';
import tailwind from '@tailwind/Components/RadialProgress/RadialProgress.jsx?raw';
import tsCode from '@ts-default/Components/RadialProgress/RadialProgress.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/RadialProgress/RadialProgress.tsx?raw';

export const radialProgress = {
  dependencies: 'motion',
  usage: `import RadialProgress from './RadialProgress';

<RadialProgress value={72} label="Complete" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
