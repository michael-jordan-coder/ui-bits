import code from '@content/ThreeD/CubeShowcase/CubeShowcase.jsx?raw';
import css from '@content/ThreeD/CubeShowcase/CubeShowcase.css?raw';
import tailwind from '@tailwind/ThreeD/CubeShowcase/CubeShowcase.jsx?raw';
import tsCode from '@ts-default/ThreeD/CubeShowcase/CubeShowcase.tsx?raw';
import tsTailwind from '@ts-tailwind/ThreeD/CubeShowcase/CubeShowcase.tsx?raw';

export const cubeShowcase = {
  dependencies: '',
  usage: `import CubeShowcase from './CubeShowcase';

const faces = [
  { id: 'fa', image: '/faces/atlas.jpg', title: 'Atlas', meta: 'Spatial UI kit' },
  { id: 'fb', image: '/faces/relay.jpg', title: 'Relay', meta: 'Realtime sync' },
  { id: 'fc', color: '#ff4d2e', title: 'Pulse', meta: 'Motion system' },
  { id: 'fd', image: '/faces/grain.jpg', title: 'Grain', meta: 'Texture pack' },
  // up to 6 faces with showTopBottom
];

<CubeShowcase faces={faces} size={280} height={520} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
