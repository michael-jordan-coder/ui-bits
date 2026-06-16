import code from '@content/Backgrounds/Ripple/Ripple.jsx?raw';
import css from '@content/Backgrounds/Ripple/Ripple.css?raw';
import tailwind from '@tailwind/Backgrounds/Ripple/Ripple.jsx?raw';
import tsCode from '@ts-default/Backgrounds/Ripple/Ripple.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/Ripple/Ripple.tsx?raw';

export const ripple = {
  dependencies: 'motion',
  usage: `import Ripple from './Ripple';

<div style={{ position: 'relative', width: '100%', height: 400 }}>
  <Ripple color="#6366f1" rippleCount={6} speed={4} interactive />
</div>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
