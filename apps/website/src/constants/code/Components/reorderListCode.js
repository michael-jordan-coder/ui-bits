import code from '@content/Components/ReorderList/ReorderList.jsx?raw';
import css from '@content/Components/ReorderList/ReorderList.css?raw';
import tailwind from '@tailwind/Components/ReorderList/ReorderList.jsx?raw';
import tsCode from '@ts-default/Components/ReorderList/ReorderList.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/ReorderList/ReorderList.tsx?raw';

export const reorderList = {
  dependencies: 'motion lucide-react',
  usage: `import ReorderList from './ReorderList';

const items = [
  { id: 'launch', label: 'Draft the launch announcement' },
  { id: 'review', label: 'Review open pull requests' },
  { id: 'changelog', label: 'Ship the changelog' }
];

<ReorderList items={items} onReorder={next => console.log(next.map(i => i.id))} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
