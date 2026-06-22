import code from '@content/Backgrounds/LiquidChrome/LiquidChrome.jsx?raw';
import css from '@content/Backgrounds/LiquidChrome/LiquidChrome.css?raw';
import tailwind from '@tailwind/Backgrounds/LiquidChrome/LiquidChrome.jsx?raw';
import tsCode from '@ts-default/Backgrounds/LiquidChrome/LiquidChrome.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/LiquidChrome/LiquidChrome.tsx?raw';

export const liquidChrome = {
  dependencies: 'motion',
  usage: `import LiquidChrome from './LiquidChrome';

<LiquidChrome speed={1} roughness={0.14} tint="#74e7ff" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
