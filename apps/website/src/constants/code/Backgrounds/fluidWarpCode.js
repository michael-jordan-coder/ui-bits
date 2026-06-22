import code from '@content/Backgrounds/FluidWarp/FluidWarp.jsx?raw';
import css from '@content/Backgrounds/FluidWarp/FluidWarp.css?raw';
import tailwind from '@tailwind/Backgrounds/FluidWarp/FluidWarp.jsx?raw';
import tsCode from '@ts-default/Backgrounds/FluidWarp/FluidWarp.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/FluidWarp/FluidWarp.tsx?raw';

export const fluidWarp = {
  dependencies: 'motion',
  usage: `import FluidWarp from './FluidWarp';

<FluidWarp speed={1} warp={1} colorB="#26d6e6" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
