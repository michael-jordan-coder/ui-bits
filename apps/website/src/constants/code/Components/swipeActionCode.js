import code from '@content/Components/SwipeAction/SwipeAction.jsx?raw';
import css from '@content/Components/SwipeAction/SwipeAction.css?raw';
import tailwind from '@tailwind/Components/SwipeAction/SwipeAction.jsx?raw';
import tsCode from '@ts-default/Components/SwipeAction/SwipeAction.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/SwipeAction/SwipeAction.tsx?raw';

export const swipeAction = {
  dependencies: 'motion lucide-react',
  usage: `import SwipeAction from './SwipeAction';

<SwipeAction onAction={id => console.log(id)}>
  <div className="row">Ava Morgan · Sent the files over</div>
</SwipeAction>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
