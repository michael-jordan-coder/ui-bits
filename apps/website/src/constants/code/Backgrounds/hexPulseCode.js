import code from '@content/Backgrounds/HexPulse/HexPulse.jsx?raw';
import css from '@content/Backgrounds/HexPulse/HexPulse.css?raw';
import tailwind from '@tailwind/Backgrounds/HexPulse/HexPulse.jsx?raw';
import tsCode from '@ts-default/Backgrounds/HexPulse/HexPulse.tsx?raw';
import tsTailwind from '@ts-tailwind/Backgrounds/HexPulse/HexPulse.tsx?raw';

export const hexPulse = {
  dependencies: 'motion',
  usage: `import HexPulse from './HexPulse';

<div style={{ width: '100%', height: 400 }}>
  <HexPulse size={26} color="#3ecf8e" speed={1} waveWidth={1} />
</div>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
