import code from '@content/Backgrounds/NoiseContours/NoiseContours.jsx?raw';
import css from '@content/Backgrounds/NoiseContours/NoiseContours.css?raw';
import tailwind from '@tailwind/Backgrounds/NoiseContours/NoiseContours.jsx?raw';
import tsCode from '@ts-default/Backgrounds/NoiseContours/NoiseContours.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/NoiseContours/NoiseContours.tsx?raw';

export const noiseContours = {
  dependencies: 'motion',
  usage: `import NoiseContours from './NoiseContours';

<div style={{ width: '100%', height: 400 }}>
  <NoiseContours
    color="#7aa2ff"
    levels={7}
    scale={1}
    speed={1}
  />
</div>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
