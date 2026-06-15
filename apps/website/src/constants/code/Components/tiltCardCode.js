import code from '@content/Components/TiltCard/TiltCard.jsx?raw';
import css from '@content/Components/TiltCard/TiltCard.css?raw';
import tailwind from '@tailwind/Components/TiltCard/TiltCard.jsx?raw';
import tsCode from '@ts-default/Components/TiltCard/TiltCard.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/TiltCard/TiltCard.tsx?raw';

export const tiltCard = {
  dependencies: 'motion',
  usage: `import TiltCard from './TiltCard';

<TiltCard maxTilt={16} glare radius={22}>
  <img src="/poster.jpg" alt="" width={260} height={340} />
</TiltCard>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
