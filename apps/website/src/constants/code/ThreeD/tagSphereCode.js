import code from '@content/ThreeD/TagSphere/TagSphere.jsx?raw';
import css from '@content/ThreeD/TagSphere/TagSphere.css?raw';
import tailwind from '@tailwind/ThreeD/TagSphere/TagSphere.jsx?raw';
import tsCode from '@ts-default/ThreeD/TagSphere/TagSphere.tsx?raw';
import tsTailwind from '@ts-tailwind/ThreeD/TagSphere/TagSphere.tsx?raw';

export const tagSphere = {
  dependencies: '',
  usage: `import TagSphere from './TagSphere';

const tags = [
  'React',
  'TypeScript',
  'Vite',
  'Tailwind',
  { label: 'Docs', href: '/docs' },
  // ...
];

<TagSphere tags={tags} radius={150} height={420} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
