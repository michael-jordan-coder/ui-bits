import code from '@content/Components/SpotlightCard/SpotlightCard.jsx?raw';
import css from '@content/Components/SpotlightCard/SpotlightCard.css?raw';
import tailwind from '@tailwind/Components/SpotlightCard/SpotlightCard.jsx?raw';
import tsCode from '@ts-default/Components/SpotlightCard/SpotlightCard.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/SpotlightCard/SpotlightCard.tsx?raw';

export const spotlightCard = {
  dependencies: 'motion',
  usage: `import SpotlightCard from './SpotlightCard';

<SpotlightCard spotlightColor="rgba(99, 102, 241, 0.25)" radius={220}>
  <span className="eyebrow">Realtime</span>
  <h3>Live collaboration</h3>
  <p>See every cursor, comment, and change as it happens.</p>
</SpotlightCard>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
