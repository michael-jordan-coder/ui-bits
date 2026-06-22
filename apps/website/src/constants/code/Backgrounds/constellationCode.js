import code from '@content/Backgrounds/Constellation/Constellation.jsx?raw';
import css from '@content/Backgrounds/Constellation/Constellation.css?raw';
import tailwind from '@tailwind/Backgrounds/Constellation/Constellation.jsx?raw';
import tsCode from '@ts-default/Backgrounds/Constellation/Constellation.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/Constellation/Constellation.tsx?raw';

export const constellation = {
  dependencies: 'motion',
  usage: `import Constellation from './Constellation';

<div style={{ width: '100%', height: 400 }}>
  <Constellation count={70} linkDistance={130} speed={1} />
</div>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
