import code from '@content/Backgrounds/Waves/Waves.jsx?raw';
import css from '@content/Backgrounds/Waves/Waves.css?raw';
import tailwind from '@tailwind/Backgrounds/Waves/Waves.jsx?raw';
import tsCode from '@ts-default/Backgrounds/Waves/Waves.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/Waves/Waves.tsx?raw';

export const waves = {
  dependencies: 'motion',
  usage: `import Waves from './Waves';

<div style={{ position: 'relative', height: 420 }}>
  <Waves lineCount={14} amplitude={26} speed={1} color="#5227FF">
    <h1>Waves</h1>
  </Waves>
</div>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
