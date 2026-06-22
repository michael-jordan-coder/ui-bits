import code from '@content/Components/FileDrop/FileDrop.jsx?raw';
import css from '@content/Components/FileDrop/FileDrop.css?raw';
import tailwind from '@tailwind/Components/FileDrop/FileDrop.jsx?raw';
import tsCode from '@ts-default/Components/FileDrop/FileDrop.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/FileDrop/FileDrop.tsx?raw';

export const fileDrop = {
  dependencies: 'motion lucide-react',
  usage: `import FileDrop from './FileDrop';

<FileDrop accept="image/*" multiple maxSize={5_000_000} onFiles={files => console.log(files)} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
