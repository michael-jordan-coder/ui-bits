import code from '@content/Components/SpeedDial/SpeedDial.jsx?raw';
import css from '@content/Components/SpeedDial/SpeedDial.css?raw';
import tailwind from '@tailwind/Components/SpeedDial/SpeedDial.jsx?raw';
import tsCode from '@ts-default/Components/SpeedDial/SpeedDial.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/SpeedDial/SpeedDial.tsx?raw';

export const speedDial = {
  dependencies: 'motion lucide-react',
  usage: `import SpeedDial from './SpeedDial';

<SpeedDial
  direction="up"
  actions={[
    { label: 'Share', icon: 'share' },
    { label: 'Copy', icon: 'copy' },
    { label: 'Favorite', icon: 'heart' },
    { label: 'Edit', icon: 'edit' }
  ]}
  onAction={index => console.log('action', index)}
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
