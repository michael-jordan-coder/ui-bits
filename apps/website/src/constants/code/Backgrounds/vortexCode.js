import code from '@content/Backgrounds/Vortex/Vortex.jsx?raw';
import css from '@content/Backgrounds/Vortex/Vortex.css?raw';
import tailwind from '@tailwind/Backgrounds/Vortex/Vortex.jsx?raw';
import tsCode from '@ts-default/Backgrounds/Vortex/Vortex.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/Vortex/Vortex.tsx?raw';

export const vortex = {
  dependencies: 'motion',
  usage: `import Vortex from './Vortex';

<div style={{ width: '100%', height: 400 }}>
  <Vortex count={400} color="#a78bfa" speed={1} twist={1} />
</div>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
