import code from '@content/Components/Toast/Toast.jsx?raw';
import css from '@content/Components/Toast/Toast.css?raw';
import tailwind from '@tailwind/Components/Toast/Toast.jsx?raw';
import tsCode from '@ts-default/Components/Toast/Toast.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/Toast/Toast.tsx?raw';

export const toast = {
  dependencies: 'motion lucide-react',
  usage: `import Toast from './Toast';

// Self-contained: renders a trigger button plus the stacked toast region.
// Drop it inside any element with \`position: relative\`.
<Toast position="bottom-right" maxVisible={3} duration={4000} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
