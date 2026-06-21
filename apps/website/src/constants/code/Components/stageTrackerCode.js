import code from '@content/Components/StageTracker/StageTracker.jsx?raw';
import css from '@content/Components/StageTracker/StageTracker.css?raw';
import tailwind from '@tailwind/Components/StageTracker/StageTracker.jsx?raw';
import tsCode from '@ts-default/Components/StageTracker/StageTracker.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/StageTracker/StageTracker.tsx?raw';

export const stageTracker = {
  dependencies: 'motion lucide-react',
  usage: `import StageTracker from './StageTracker';

const stages = [
  { label: 'Connect source', description: 'Authorize and pick what to bring in' },
  { label: 'Import data', description: 'Pulling issues, comments, and attachments' },
  { label: 'Map fields', description: 'Match statuses and assignees' },
  { label: 'Finish up', description: 'Verifying and wrapping things up' }
];

<StageTracker stages={stages} activeIndex={1} accent="#6366f1" />`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
