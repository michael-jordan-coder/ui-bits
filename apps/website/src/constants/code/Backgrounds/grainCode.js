import code from '@content/Backgrounds/Grain/Grain.jsx?raw';
import css from '@content/Backgrounds/Grain/Grain.css?raw';
import tailwind from '@tailwind/Backgrounds/Grain/Grain.jsx?raw';
import tsCode from '@ts-default/Backgrounds/Grain/Grain.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/Grain/Grain.tsx?raw';

export const grain = {
  dependencies: 'motion',
  usage: `import Grain from './Grain';

<div style={{ position: 'relative', height: 420 }}>
  <Grain intensity={0.12} grainSize={1.6} speed={1}>
    <h1>Grain</h1>
  </Grain>
</div>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
