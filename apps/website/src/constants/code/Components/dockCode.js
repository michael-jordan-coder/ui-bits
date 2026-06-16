import code from '@content/Components/Dock/Dock.jsx?raw';
import css from '@content/Components/Dock/Dock.css?raw';
import tailwind from '@tailwind/Components/Dock/Dock.jsx?raw';
import tsCode from '@ts-default/Components/Dock/Dock.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/Dock/Dock.tsx?raw';

export const dock = {
  dependencies: 'motion lucide-react',
  usage: `import Dock from './Dock';
import { Home, Search, Music, Settings } from 'lucide-react';

const items = [
  { id: 'home', label: 'Home', icon: <Home />, active: true, onClick: () => {} },
  { id: 'search', label: 'Search', icon: <Search /> },
  { id: 'music', label: 'Music', icon: <Music />, active: true },
  { id: 'settings', label: 'Settings', icon: <Settings /> }
];

<Dock items={items} baseItemSize={48} magnification={80} distance={150} accentColor="#6366f1" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
