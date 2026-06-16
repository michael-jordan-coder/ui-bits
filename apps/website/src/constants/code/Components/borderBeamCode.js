import code from '@content/Components/BorderBeam/BorderBeam.jsx?raw';
import css from '@content/Components/BorderBeam/BorderBeam.css?raw';
import tailwind from '@tailwind/Components/BorderBeam/BorderBeam.jsx?raw';
import tsCode from '@ts-default/Components/BorderBeam/BorderBeam.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/BorderBeam/BorderBeam.tsx?raw';

export const borderBeam = {
  dependencies: 'motion',
  usage: `import BorderBeam from './BorderBeam';

<BorderBeam beamColor="#6366f1" beamColorTo="#a855f7" duration={6}>
  <div style={{ padding: '1.5rem' }}>Ship faster with ui bits</div>
</BorderBeam>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
