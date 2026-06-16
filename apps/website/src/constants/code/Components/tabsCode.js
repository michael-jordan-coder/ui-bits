import code from '@content/Components/Tabs/Tabs.jsx?raw';
import css from '@content/Components/Tabs/Tabs.css?raw';
import tailwind from '@tailwind/Components/Tabs/Tabs.jsx?raw';
import tsCode from '@ts-default/Components/Tabs/Tabs.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/Tabs/Tabs.tsx?raw';

export const tabs = {
  dependencies: 'motion',
  usage: `import Tabs from './Tabs';

const items = [
  { label: 'Overview', content: 'A quick summary of the project.' },
  { label: 'Activity', content: 'Recent events and updates.' },
  { label: 'Settings', content: 'Tweak your preferences here.' }
];

<Tabs items={items} variant="underline" onChange={i => console.log(i)} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
