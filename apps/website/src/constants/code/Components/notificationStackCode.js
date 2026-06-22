import code from '@content/Components/NotificationStack/NotificationStack.jsx?raw';
import css from '@content/Components/NotificationStack/NotificationStack.css?raw';
import tailwind from '@tailwind/Components/NotificationStack/NotificationStack.jsx?raw';
import tsCode from '@ts-default/Components/NotificationStack/NotificationStack.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/NotificationStack/NotificationStack.tsx?raw';

export const notificationStack = {
  dependencies: 'motion lucide-react',
  usage: `import NotificationStack from './NotificationStack';

const notifications = [
  { id: 'n1', title: 'New comment', body: 'Maya replied to your thread.' },
  { id: 'n2', title: 'Build passed', body: 'Deploy to production finished.' },
  { id: 'n3', title: 'Weekly summary', body: 'Your activity report is ready.' }
];

<NotificationStack notifications={notifications} accent="#3ecf8e" collapsedByDefault />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
