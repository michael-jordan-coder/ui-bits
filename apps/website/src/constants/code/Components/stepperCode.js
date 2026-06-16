import code from '@content/Components/Stepper/Stepper.jsx?raw';
import css from '@content/Components/Stepper/Stepper.css?raw';
import tailwind from '@tailwind/Components/Stepper/Stepper.jsx?raw';
import tsCode from '@ts-default/Components/Stepper/Stepper.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/Stepper/Stepper.tsx?raw';

export const stepper = {
  dependencies: 'motion lucide-react',
  usage: `import Stepper from './Stepper';

<Stepper defaultValue={1} min={0} max={20} onChange={qty => console.log(qty)} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
