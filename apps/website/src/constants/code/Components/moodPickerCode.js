import code from '@content/Components/MoodPicker/MoodPicker.jsx?raw';
import css from '@content/Components/MoodPicker/MoodPicker.css?raw';
import tailwind from '@tailwind/Components/MoodPicker/MoodPicker.jsx?raw';
import tsCode from '@ts-default/Components/MoodPicker/MoodPicker.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/MoodPicker/MoodPicker.tsx?raw';

export const moodPicker = {
  dependencies: 'motion',
  usage: `import MoodPicker from './MoodPicker';

<MoodPicker
  defaultValue="okay"
  onChange={mood => console.log(mood)}
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
