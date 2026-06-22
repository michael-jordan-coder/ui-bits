import code from '@content/Components/ImageCompare/ImageCompare.jsx?raw';
import css from '@content/Components/ImageCompare/ImageCompare.css?raw';
import tailwind from '@tailwind/Components/ImageCompare/ImageCompare.jsx?raw';
import tsCode from '@ts-default/Components/ImageCompare/ImageCompare.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/ImageCompare/ImageCompare.tsx?raw';

export const imageCompare = {
  dependencies: 'lucide-react',
  usage: `import ImageCompare from './ImageCompare';

<ImageCompare value={50} beforeLabel="before" afterLabel="after" accent="#ffffff" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
