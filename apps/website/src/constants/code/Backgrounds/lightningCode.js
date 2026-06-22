import code from '@content/Backgrounds/Lightning/Lightning.jsx?raw';
import css from '@content/Backgrounds/Lightning/Lightning.css?raw';
import tailwind from '@tailwind/Backgrounds/Lightning/Lightning.jsx?raw';
import tsCode from '@ts-default/Backgrounds/Lightning/Lightning.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/Lightning/Lightning.tsx?raw';

export const lightning = {
  dependencies: 'motion',
  usage: `import Lightning from './Lightning';

<div style={{ width: '100%', height: 400 }}>
  <Lightning color="#7aa2ff" frequency={1} branchiness={1} glow={1} />
</div>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
