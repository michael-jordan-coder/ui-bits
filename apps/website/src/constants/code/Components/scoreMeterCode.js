import code from '@content/Components/ScoreMeter/ScoreMeter.jsx?raw';
import css from '@content/Components/ScoreMeter/ScoreMeter.css?raw';
import tailwind from '@tailwind/Components/ScoreMeter/ScoreMeter.jsx?raw';
import tsCode from '@ts-default/Components/ScoreMeter/ScoreMeter.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/ScoreMeter/ScoreMeter.tsx?raw';

export const scoreMeter = {
  dependencies: 'motion',
  usage: `import ScoreMeter from './ScoreMeter';

<ScoreMeter score={87} label="Security score" showMax />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
