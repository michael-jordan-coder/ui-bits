import code from '@content/Backgrounds/Starfield/Starfield.jsx?raw';
import css from '@content/Backgrounds/Starfield/Starfield.css?raw';
import tailwind from '@tailwind/Backgrounds/Starfield/Starfield.jsx?raw';
import tsCode from '@ts-default/Backgrounds/Starfield/Starfield.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/Starfield/Starfield.tsx?raw';

export const starfield = {
  dependencies: 'motion',
  usage: `import Starfield from './Starfield';

<div style={{ position: 'relative', height: 420 }}>
  <Starfield count={220} speed={1} streak>
    <h1>Starfield</h1>
  </Starfield>
</div>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
