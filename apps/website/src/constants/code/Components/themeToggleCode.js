import code from '@content/Components/ThemeToggle/ThemeToggle.jsx?raw';
import css from '@content/Components/ThemeToggle/ThemeToggle.css?raw';
import tailwind from '@tailwind/Components/ThemeToggle/ThemeToggle.jsx?raw';
import tsCode from '@ts-default/Components/ThemeToggle/ThemeToggle.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/ThemeToggle/ThemeToggle.tsx?raw';

export const themeToggle = {
  dependencies: 'motion lucide-react',
  usage: `import ThemeToggle from './ThemeToggle';

<ThemeToggle
  defaultDark={false}
  showLabel
  onChange={isDark => document.documentElement.classList.toggle('dark', isDark)}
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
