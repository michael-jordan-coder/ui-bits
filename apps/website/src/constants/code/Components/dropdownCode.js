import code from '@content/Components/Dropdown/Dropdown.jsx?raw';
import css from '@content/Components/Dropdown/Dropdown.css?raw';
import tailwind from '@tailwind/Components/Dropdown/Dropdown.jsx?raw';
import tsCode from '@ts-default/Components/Dropdown/Dropdown.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/Dropdown/Dropdown.tsx?raw';

export const dropdown = {
  dependencies: 'lucide-react tailwind-merge',
  usage: `import Dropdown from './Dropdown';

const regions = [
  { label: 'Frankfurt', value: 'fra1', description: 'Lowest latency in Europe' },
  { label: 'Washington D.C.', value: 'iad1', description: 'Default for the Americas' },
  { label: 'Singapore', value: 'sin1', description: 'Best for Southeast Asia' }
];

<Dropdown
  options={regions}
  defaultValue="fra1"
  placeholder="Select a region"
  onChange={value => console.log(value)}
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
