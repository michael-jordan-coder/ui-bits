import code from '@content/Components/RubberSlider/RubberSlider.jsx?raw';
import css from '@content/Components/RubberSlider/RubberSlider.css?raw';
import tailwind from '@tailwind/Components/RubberSlider/RubberSlider.jsx?raw';
import tsCode from '@ts-default/Components/RubberSlider/RubberSlider.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/RubberSlider/RubberSlider.tsx?raw';

export const rubberSlider = {
  dependencies: 'motion',
  usage: `import RubberSlider from './RubberSlider';

<RubberSlider label="Focus duration" valueSuffix=" min" max={120} defaultValue={45} />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
