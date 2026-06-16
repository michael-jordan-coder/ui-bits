import code from '@content/ThreeD/CoverFlow/CoverFlow.jsx?raw';
import css from '@content/ThreeD/CoverFlow/CoverFlow.css?raw';
import tailwind from '@tailwind/ThreeD/CoverFlow/CoverFlow.jsx?raw';
import tsCode from '@ts-default/ThreeD/CoverFlow/CoverFlow.tsx?raw';
import tsTailwind from '@ts-tailwind/ThreeD/CoverFlow/CoverFlow.tsx?raw';

export const coverFlow = {
  dependencies: '',
  usage: `import CoverFlow from './CoverFlow';

const items = [
  { id: 1, image: '/covers/aurora.jpg', title: 'Aurora Drift', meta: 'Slowcore · 2019' },
  { id: 2, image: '/covers/longshore.jpg', title: 'Longshore', meta: 'Ambient · 2021' },
  // ...
];

<CoverFlow items={items} height={560} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
