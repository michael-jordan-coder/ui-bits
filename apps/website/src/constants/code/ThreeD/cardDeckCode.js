import code from '@content/ThreeD/CardDeck/CardDeck.jsx?raw';
import css from '@content/ThreeD/CardDeck/CardDeck.css?raw';
import tailwind from '@tailwind/ThreeD/CardDeck/CardDeck.jsx?raw';
import tsCode from '@ts-default/ThreeD/CardDeck/CardDeck.tsx?raw';
import tsTailwind from '@ts-tailwind/ThreeD/CardDeck/CardDeck.tsx?raw';

export const cardDeck = {
  dependencies: '',
  usage: `import CardDeck from './CardDeck';

const items = [
  { id: 1, image: '/cards/aurora.jpg', title: 'Aurora Drift', meta: 'Drama · 6 episodes' },
  { id: 2, image: '/cards/longshore.jpg', title: 'Longshore', meta: 'Documentary' },
  // ...
];

<CardDeck items={items} height={520} accentColor="#ff4d2e" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
