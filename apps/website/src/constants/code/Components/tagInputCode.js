import code from '@content/Components/TagInput/TagInput.jsx?raw';
import css from '@content/Components/TagInput/TagInput.css?raw';
import tailwind from '@tailwind/Components/TagInput/TagInput.jsx?raw';
import tsCode from '@ts-default/Components/TagInput/TagInput.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/TagInput/TagInput.tsx?raw';

export const tagInput = {
  dependencies: 'motion lucide-react',
  usage: `import TagInput from './TagInput';

<TagInput
  defaultTags={['design', 'react', 'motion']}
  maxTags={8}
  accentColor="#6366f1"
  onChange={tags => console.log(tags)}
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
