import code from '@content/Components/SplitPane/SplitPane.jsx?raw';
import css from '@content/Components/SplitPane/SplitPane.css?raw';
import tailwind from '@tailwind/Components/SplitPane/SplitPane.jsx?raw';
import tsCode from '@ts-default/Components/SplitPane/SplitPane.tsx?raw';
import tsTailwind from '@ts-tailwind/Components/SplitPane/SplitPane.tsx?raw';

export const splitPane = {
  dependencies: 'motion lucide-react',
  usage: `import SplitPane from './SplitPane';

<SplitPane
  orientation="horizontal"
  defaultSize={50}
  snapPoints={[50]}
  first={
    <div style={{ padding: 16 }}>
      <h3>Calendar</h3>
      <p>9:00 — Standup</p>
      <p>13:30 — Design review</p>
    </div>
  }
  second={
    <div style={{ padding: 16 }}>
      <h3>Tasks</h3>
      <p>Ship SplitPane</p>
      <p>Reply to threads</p>
    </div>
  }
/>`,
  code,
  css,
  tailwind,
  tsCode,
  tsTailwind
};
