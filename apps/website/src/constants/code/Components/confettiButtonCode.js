import code from '@content/Components/ConfettiButton/ConfettiButton.jsx?raw';
import css from '@content/Components/ConfettiButton/ConfettiButton.css?raw';
import tailwind from '@tailwind/Components/ConfettiButton/ConfettiButton.jsx?raw';
import tsCode from '@ts-default/Components/ConfettiButton/ConfettiButton.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/ConfettiButton/ConfettiButton.tsx?raw';

export const confettiButton = {
  dependencies: 'motion',
  usage: `import ConfettiButton from './ConfettiButton';

<ConfettiButton accentColor="#6366f1" onClick={() => console.log('🎉')}>
  Celebrate
</ConfettiButton>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
