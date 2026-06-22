import code from '@content/Backgrounds/Rain/Rain.jsx?raw';
import css from '@content/Backgrounds/Rain/Rain.css?raw';
import tailwind from '@tailwind/Backgrounds/Rain/Rain.jsx?raw';
import tsCode from '@ts-default/Backgrounds/Rain/Rain.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/Rain/Rain.tsx?raw';

export const rain = {
  dependencies: 'motion',
  usage: `import Rain from './Rain';

<div style={{ width: '100%', height: 400 }}>
  <Rain count={300} color="#7aa2ff" speed={1} angle={12} />
</div>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
