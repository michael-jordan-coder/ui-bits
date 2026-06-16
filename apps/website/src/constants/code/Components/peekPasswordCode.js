import code from '@content/Components/PeekPassword/PeekPassword.jsx?raw';
import css from '@content/Components/PeekPassword/PeekPassword.css?raw';
import tailwind from '@tailwind/Components/PeekPassword/PeekPassword.jsx?raw';
import tsCode from '@ts-default/Components/PeekPassword/PeekPassword.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/PeekPassword/PeekPassword.tsx?raw';

export const peekPassword = {
  dependencies: 'motion lucide-react',
  usage: `import PeekPassword from './PeekPassword';

<PeekPassword
  onEmailChange={setEmail}
  onPasswordChange={setPassword}
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
