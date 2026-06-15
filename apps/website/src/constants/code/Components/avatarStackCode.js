import code from '@content/Components/AvatarStack/AvatarStack.jsx?raw';
import css from '@content/Components/AvatarStack/AvatarStack.css?raw';
import tailwind from '@tailwind/Components/AvatarStack/AvatarStack.jsx?raw';
import tsCode from '@ts-default/Components/AvatarStack/AvatarStack.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/AvatarStack/AvatarStack.tsx?raw';

export const avatarStack = {
  dependencies: 'motion',
  usage: `import AvatarStack from './AvatarStack';

<AvatarStack
  max={5}
  avatars={[
    { name: 'Ada Lovelace' },
    { name: 'Grace Hopper', src: '/grace.jpg' },
    { name: 'Alan Turing', color: '#10b981' }
  ]}
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
