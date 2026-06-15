import code from '@content/Components/AnimatedMenu/AnimatedMenu.jsx?raw';
import css from '@content/Components/AnimatedMenu/AnimatedMenu.css?raw';
import tailwind from '@tailwind/Components/AnimatedMenu/AnimatedMenu.jsx?raw';
import tsCode from '@ts-default/Components/AnimatedMenu/AnimatedMenu.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/AnimatedMenu/AnimatedMenu.tsx?raw';

export const animatedMenu = {
  dependencies: 'motion lucide-react',
  usage: `import AnimatedMenu from './AnimatedMenu';

<AnimatedMenu accentColor="#3ecf8e" animation="bounce" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
