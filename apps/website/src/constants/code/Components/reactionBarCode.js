import code from '@content/Components/ReactionBar/ReactionBar.jsx?raw';
import css from '@content/Components/ReactionBar/ReactionBar.css?raw';
import tailwind from '@tailwind/Components/ReactionBar/ReactionBar.jsx?raw';
import tsCode from '@ts-default/Components/ReactionBar/ReactionBar.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/ReactionBar/ReactionBar.tsx?raw';

export const reactionBar = {
  dependencies: 'motion',
  usage: `import ReactionBar from './ReactionBar';

<ReactionBar
  emojis={['👍', '❤️', '😂', '😮', '😢', '🙏']}
  count={12}
  onReact={emoji => console.log(emoji)}
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
