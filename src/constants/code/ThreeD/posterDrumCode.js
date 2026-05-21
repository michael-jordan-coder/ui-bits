import code from '@content/ThreeD/PosterDrum/PosterDrum.jsx?raw';
import css from '@content/ThreeD/PosterDrum/PosterDrum.css?raw';
import tailwind from '@tailwind/ThreeD/PosterDrum/PosterDrum.jsx?raw';
import tsCode from '@ts-default/ThreeD/PosterDrum/PosterDrum.tsx?raw';
import tsTailwind from '@ts-tailwind/ThreeD/PosterDrum/PosterDrum.tsx?raw';

export const posterDrum = {
  dependencies: '',
  usage: `import PosterDrum from './PosterDrum';

const films = [
  { id: '01', title: 'Solaris', year: '1972', tag: 'Drama' },
  { id: '02', title: 'Blade Runner', year: '1982', tag: 'Sci-fi' },
  { id: '03', title: 'Stalker', year: '1979', tag: 'Drama' }
];

<PosterDrum
  items={films}
  radius={410}
  idleSpeed={0.04}
  onActiveChange={(item) => console.log(item.title)}
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
