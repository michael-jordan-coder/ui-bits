import code from '@content/Components/StarRating/StarRating.jsx?raw';
import css from '@content/Components/StarRating/StarRating.css?raw';
import tailwind from '@tailwind/Components/StarRating/StarRating.jsx?raw';
import tsCode from '@ts-default/Components/StarRating/StarRating.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/StarRating/StarRating.tsx?raw';

export const starRating = {
  dependencies: 'motion lucide-react',
  usage: `import StarRating from './StarRating';

<StarRating
  count={5}
  defaultValue={4}
  color="#fbbf24"
  labels={['Hated it', 'Disliked it', "It's okay", 'Liked it', 'Loved it!']}
  onChange={value => console.log(value)}
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
