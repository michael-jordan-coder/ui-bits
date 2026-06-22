import code from '@content/Components/ColorPicker/ColorPicker.jsx?raw';
import css from '@content/Components/ColorPicker/ColorPicker.css?raw';
import tailwind from '@tailwind/Components/ColorPicker/ColorPicker.jsx?raw';
import tsCode from '@ts-default/Components/ColorPicker/ColorPicker.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/ColorPicker/ColorPicker.tsx?raw';

export const colorPicker = {
  dependencies: 'motion lucide-react',
  usage: `import ColorPicker from './ColorPicker';

<ColorPicker value="#3ecf8e" onChange={hex => console.log(hex)} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
