import code from '@content/Components/MagneticButton/MagneticButton.jsx?raw';
import css from '@content/Components/MagneticButton/MagneticButton.css?raw';
import tailwind from '@tailwind/Components/MagneticButton/MagneticButton.jsx?raw';
import tsCode from '@ts-default/Components/MagneticButton/MagneticButton.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/MagneticButton/MagneticButton.tsx?raw';

export const magneticButton = {
  dependencies: 'motion lucide-react',
  usage: `import MagneticButton from './MagneticButton';

<MagneticButton label="Get started" strength={0.4} radius={120} accentColor="#6366f1" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
