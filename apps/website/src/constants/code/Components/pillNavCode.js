import code from '@content/Components/PillNav/PillNav.jsx?raw';
import css from '@content/Components/PillNav/PillNav.css?raw';
import tailwind from '@tailwind/Components/PillNav/PillNav.jsx?raw';
import tsCode from '@ts-default/Components/PillNav/PillNav.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/PillNav/PillNav.tsx?raw';

export const pillNav = {
  dependencies: 'motion',
  usage: `import PillNav from './PillNav';

<PillNav
  tabs={['Home', 'About', 'Productions', 'Contact']}
  accentColor="#7a5236"
  animationDuration={300}
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
