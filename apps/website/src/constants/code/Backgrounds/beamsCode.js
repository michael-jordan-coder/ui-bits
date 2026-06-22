import code from '@content/Backgrounds/Beams/Beams.jsx?raw';
import css from '@content/Backgrounds/Beams/Beams.css?raw';
import tailwind from '@tailwind/Backgrounds/Beams/Beams.jsx?raw';
import tsCode from '@ts-default/Backgrounds/Beams/Beams.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/Beams/Beams.tsx?raw';

export const beams = {
  dependencies: 'motion',
  usage: `import Beams from './Beams';

<div style={{ position: 'relative', height: 420 }}>
  <Beams beamCount={9} color="#5227FF" speed={1} intensity={0.5}>
    <h1>Beams</h1>
  </Beams>
</div>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
