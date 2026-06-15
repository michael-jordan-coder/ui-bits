import code from '@content/Components/CopyButton/CopyButton.jsx?raw';
import css from '@content/Components/CopyButton/CopyButton.css?raw';
import tailwind from '@tailwind/Components/CopyButton/CopyButton.jsx?raw';
import tsCode from '@ts-default/Components/CopyButton/CopyButton.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/CopyButton/CopyButton.tsx?raw';

export const copyButton = {
  dependencies: 'motion lucide-react',
  usage: `import CopyButton from './CopyButton';

<CopyButton value="npm i ui-bits" label="Copy" copiedLabel="Copied!" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
