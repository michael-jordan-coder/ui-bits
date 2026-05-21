import code from '@content/Components/PosterHelix/PosterHelix.jsx?raw';
import css from '@content/Components/PosterHelix/PosterHelix.css?raw';
import tailwind from '@tailwind/Components/PosterHelix/PosterHelix.jsx?raw';
import tsCode from '@ts-default/Components/PosterHelix/PosterHelix.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/PosterHelix/PosterHelix.tsx?raw';

export const posterHelix = {
  dependencies: '',
  usage: `import PosterHelix from './PosterHelix';

const posters = [
  { id: 1, image: '/posters/aurora.jpg', title: 'Aurora Drift', meta: ['Drama', '6 episodes'] },
  { id: 2, image: '/posters/longshore.jpg', title: 'Longshore', meta: ['Documentary'] },
  // ...
];

<PosterHelix posters={posters} height={640} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
