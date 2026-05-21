import code from '@content/Scroll/HoneycombGrid/HoneycombGrid.jsx?raw';
import css from '@content/Scroll/HoneycombGrid/HoneycombGrid.css?raw';
import tailwind from '@tailwind/Scroll/HoneycombGrid/HoneycombGrid.jsx?raw';
import tsCode from '@ts-default/Scroll/HoneycombGrid/HoneycombGrid.tsx?raw';
import tsTailwind from '@ts-tailwind/Scroll/HoneycombGrid/HoneycombGrid.tsx?raw';

export const honeycombGrid = {
  dependencies: '',
  usage: `import HoneycombGrid from './HoneycombGrid';

const apps = [
  { label: 'Mint', color: '#3CCB91' },
  { label: 'Violet', color: '#5227FF' },
  { label: 'Ember', color: '#F25C2A' }
];

<HoneycombGrid
  apps={apps}
  wideCount={4}
  fisheyeStrength={0.7}
  onSelect={(app) => console.log(app.label)}
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
