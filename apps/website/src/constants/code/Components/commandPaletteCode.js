import code from '@content/Components/CommandPalette/CommandPalette.jsx?raw';
import css from '@content/Components/CommandPalette/CommandPalette.css?raw';
import tailwind from '@tailwind/Components/CommandPalette/CommandPalette.jsx?raw';
import tsCode from '@ts-default/Components/CommandPalette/CommandPalette.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/CommandPalette/CommandPalette.tsx?raw';

export const commandPalette = {
  dependencies: 'motion lucide-react',
  usage: `import CommandPalette from './CommandPalette';
import { FilePlus, Settings, LogOut } from 'lucide-react';

const commands = [
  { id: 'new', label: 'New file', group: 'Actions', shortcut: '⌘N', icon: FilePlus },
  { id: 'settings', label: 'Open settings', group: 'Navigation', shortcut: '⌘,', icon: Settings },
  { id: 'sign-out', label: 'Sign out', group: 'Account', icon: LogOut }
];

<CommandPalette commands={commands} onSelect={id => console.log(id)} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
