import code from '@content/Components/SegmentedToggle/SegmentedToggle.jsx?raw';
import css from '@content/Components/SegmentedToggle/SegmentedToggle.css?raw';
import tailwind from '@tailwind/Components/SegmentedToggle/SegmentedToggle.jsx?raw';
import tsCode from '@ts-default/Components/SegmentedToggle/SegmentedToggle.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/SegmentedToggle/SegmentedToggle.tsx?raw';

export const segmentedToggle = {
  dependencies: 'motion lucide-react',
  usage: `import SegmentedToggle from './SegmentedToggle';

<SegmentedToggle accentColor="#ff385c" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
