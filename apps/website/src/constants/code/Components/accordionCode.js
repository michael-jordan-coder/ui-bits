import code from '@content/Components/Accordion/Accordion.jsx?raw';
import css from '@content/Components/Accordion/Accordion.css?raw';
import tailwind from '@tailwind/Components/Accordion/Accordion.jsx?raw';
import tsCode from '@ts-default/Components/Accordion/Accordion.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/Accordion/Accordion.tsx?raw';

export const accordion = {
  dependencies: 'motion lucide-react',
  usage: `import Accordion from './Accordion';

const items = [
  { title: 'What is ui bits?', content: 'A collection of copyable React components.' },
  { title: 'How is it delivered?', content: 'Four variants: JS or TS, CSS or Tailwind.' }
];

<Accordion items={items} singleOpen defaultOpen={0} accentColor="#6366f1" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
