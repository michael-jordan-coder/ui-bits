import code from '@content/Components/LikeButton/LikeButton.jsx?raw';
import css from '@content/Components/LikeButton/LikeButton.css?raw';
import tailwind from '@tailwind/Components/LikeButton/LikeButton.jsx?raw';
import tsCode from '@ts-default/Components/LikeButton/LikeButton.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/LikeButton/LikeButton.tsx?raw';

export const likeButton = {
  dependencies: 'motion lucide-react',
  usage: `import LikeButton from './LikeButton';

<LikeButton count={128} color="#ff3b5c" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
