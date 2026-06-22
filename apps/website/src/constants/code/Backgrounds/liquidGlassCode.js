import code from '@content/Backgrounds/LiquidGlass/LiquidGlass.jsx?raw';
import css from '@content/Backgrounds/LiquidGlass/LiquidGlass.css?raw';
import tailwind from '@tailwind/Backgrounds/LiquidGlass/LiquidGlass.jsx?raw';
import tsCode from '@ts-default/Backgrounds/LiquidGlass/LiquidGlass.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/LiquidGlass/LiquidGlass.tsx?raw';

export const liquidGlass = {
  dependencies: 'motion',
  usage: `import LiquidGlass from './LiquidGlass';

<LiquidGlass ior={1.45} dispersion={0.5} tint="#bfe9ff" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
