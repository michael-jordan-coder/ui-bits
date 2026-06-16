import code from '@content/Backgrounds/Particles/Particles.jsx?raw';
import css from '@content/Backgrounds/Particles/Particles.css?raw';
import tailwind from '@tailwind/Backgrounds/Particles/Particles.jsx?raw';
import tsCode from '@ts-default/Backgrounds/Particles/Particles.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/Particles/Particles.tsx?raw';

export const particles = {
  dependencies: 'motion',
  usage: `import Particles from './Particles';

<Particles count={80} speed={0.4} />

// With centered content and connection lines
<Particles connect color="#7c9cff">
  <h1 style={{ color: '#fff' }}>ui bits</h1>
</Particles>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
