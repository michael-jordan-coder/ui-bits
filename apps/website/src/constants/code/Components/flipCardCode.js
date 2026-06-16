import code from '@content/Components/FlipCard/FlipCard.jsx?raw';
import css from '@content/Components/FlipCard/FlipCard.css?raw';
import tailwind from '@tailwind/Components/FlipCard/FlipCard.jsx?raw';
import tsCode from '@ts-default/Components/FlipCard/FlipCard.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/FlipCard/FlipCard.tsx?raw';

export const flipCard = {
  dependencies: 'motion lucide-react',
  usage: `import FlipCard from './FlipCard';

<FlipCard
  frontTitle="ui bits"
  frontSubtitle="Hover to reveal"
  backTitle="Crafted to flip"
  backText="A self-contained 3D card with spring-driven rotation."
  icon="sparkles"
  trigger="hover"
  direction="horizontal"
  accentColor="#6366f1"
  onFlip={next => console.log(next)}
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
