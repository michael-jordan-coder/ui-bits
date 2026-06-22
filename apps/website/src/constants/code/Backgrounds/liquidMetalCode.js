import code from '@content/Backgrounds/LiquidMetal/LiquidMetal.jsx?raw';
import css from '@content/Backgrounds/LiquidMetal/LiquidMetal.css?raw';
import tailwind from '@tailwind/Backgrounds/LiquidMetal/LiquidMetal.jsx?raw';
import tsCode from '@ts-default/Backgrounds/LiquidMetal/LiquidMetal.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/LiquidMetal/LiquidMetal.tsx?raw';

export const liquidMetal = {
  dependencies: 'motion',
  usage: `import LiquidMetal from './LiquidMetal';

<div style={{ width: '100%', height: 400 }}>
  <LiquidMetal count={6} color="#c8d0e0" speed={1} scale={1} />
</div>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
