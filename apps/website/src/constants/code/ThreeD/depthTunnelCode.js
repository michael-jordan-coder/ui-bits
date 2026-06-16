import code from '@content/ThreeD/DepthTunnel/DepthTunnel.jsx?raw';
import css from '@content/ThreeD/DepthTunnel/DepthTunnel.css?raw';
import tailwind from '@tailwind/ThreeD/DepthTunnel/DepthTunnel.jsx?raw';
import tsCode from '@ts-default/ThreeD/DepthTunnel/DepthTunnel.tsx?raw';
import tsTailwind from '@ts-tailwind/ThreeD/DepthTunnel/DepthTunnel.tsx?raw';

export const depthTunnel = {
  dependencies: '',
  usage: `import DepthTunnel from './DepthTunnel';

const items = [
  { id: 1, image: '/shots/genesis.jpg', title: 'Genesis', meta: ['v0.1.0', 'First commit'] },
  { id: 2, image: '/shots/lattice.jpg', title: 'Lattice', meta: ['v1.0.0'] },
  // ...
];

<DepthTunnel items={items} height={600} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
