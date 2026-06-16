import code from '@content/Components/Marquee/Marquee.jsx?raw';
import css from '@content/Components/Marquee/Marquee.css?raw';
import tailwind from '@tailwind/Components/Marquee/Marquee.jsx?raw';
import tsCode from '@ts-default/Components/Marquee/Marquee.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/Marquee/Marquee.tsx?raw';

export const marquee = {
  dependencies: 'motion',
  usage: `import Marquee from './Marquee';

<Marquee speed={30} pauseOnHover>
  <span className="chip">React</span>
  <span className="chip">Vite</span>
  <span className="chip">Tailwind</span>
  <span className="chip">Motion</span>
</Marquee>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
