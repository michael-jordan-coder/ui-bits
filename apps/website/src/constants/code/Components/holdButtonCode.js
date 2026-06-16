import code from '@content/Components/HoldButton/HoldButton.jsx?raw';
import css from '@content/Components/HoldButton/HoldButton.css?raw';
import tailwind from '@tailwind/Components/HoldButton/HoldButton.jsx?raw';
import tsCode from '@ts-default/Components/HoldButton/HoldButton.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/HoldButton/HoldButton.tsx?raw';

export const holdButton = {
  dependencies: 'motion lucide-react',
  usage: `import HoldButton from './HoldButton';

<HoldButton
  label="Hold to delete"
  confirmedLabel="Deleted"
  duration={1200}
  accentColor="#ef4444"
  onConfirm={() => console.log('confirmed')}
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
