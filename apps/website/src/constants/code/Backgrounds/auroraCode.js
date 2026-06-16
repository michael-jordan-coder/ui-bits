import code from '@content/Backgrounds/Aurora/Aurora.jsx?raw';
import css from '@content/Backgrounds/Aurora/Aurora.css?raw';
import tailwind from '@tailwind/Backgrounds/Aurora/Aurora.jsx?raw';
import tsCode from '@ts-default/Backgrounds/Aurora/Aurora.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/Aurora/Aurora.tsx?raw';

export const aurora = {
  dependencies: 'motion',
  usage: `import Aurora from './Aurora';

<div style={{ position: 'relative', height: 420 }}>
  <Aurora colorStops={['#5227FF', '#7CFF67', '#22d3ee']} speed={1} blur={60} blend={0.6}>
    <h1>Northern Lights</h1>
  </Aurora>
</div>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
