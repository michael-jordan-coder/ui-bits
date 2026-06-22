import code from '@content/Backgrounds/Grid/Grid.jsx?raw';
import css from '@content/Backgrounds/Grid/Grid.css?raw';
import tailwind from '@tailwind/Backgrounds/Grid/Grid.jsx?raw';
import tsCode from '@ts-default/Backgrounds/Grid/Grid.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/Grid/Grid.tsx?raw';

export const grid = {
  dependencies: 'motion',
  usage: `import Grid from './Grid';

<div style={{ position: 'relative', height: 420 }}>
  <Grid cellSize={48} color="#5227FF" glowColor="#7C8CFF" speed={1}>
    <h1>Grid</h1>
  </Grid>
</div>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
