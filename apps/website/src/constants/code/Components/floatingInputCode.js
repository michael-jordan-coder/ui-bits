import code from '@content/Components/FloatingInput/FloatingInput.jsx?raw';
import css from '@content/Components/FloatingInput/FloatingInput.css?raw';
import tailwind from '@tailwind/Components/FloatingInput/FloatingInput.jsx?raw';
import tsCode from '@ts-default/Components/FloatingInput/FloatingInput.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/FloatingInput/FloatingInput.tsx?raw';

export const floatingInput = {
  dependencies: 'motion lucide-react',
  usage: `import FloatingInput from './FloatingInput';
import { Mail } from 'lucide-react';

<FloatingInput
  label="Email address"
  type="email"
  accentColor="#6366f1"
  helperText="We'll never share your email."
  icon={<Mail size={18} />}
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
