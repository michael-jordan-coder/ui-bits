import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import StageTracker from '../../content/Components/StageTracker/StageTracker';
import { stageTracker } from '../../constants/code/Components/stageTrackerCode';

const SAMPLE_STAGES = [
  { label: 'Connect source', description: 'Authorize and pick what to bring in' },
  { label: 'Import data', description: 'Pulling issues, comments, and attachments' },
  { label: 'Map fields', description: 'Match statuses and assignees' },
  { label: 'Finish up', description: 'Verifying and wrapping things up' }
];

const DEFAULT_PROPS = {
  stages: SAMPLE_STAGES,
  activeIndex: 1,
  orientation: 'vertical',
  accent: '#6366f1',
  showDescriptions: true,
  animateConnector: true
};

const ORIENTATION_OPTIONS = [
  { value: 'vertical', label: 'Vertical' },
  { value: 'horizontal', label: 'Horizontal' }
];

const ACCENT_OPTIONS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#10b981', label: 'Emerald' },
  { value: '#f43f5e', label: 'Rose' },
  { value: '#f59e0b', label: 'Amber' }
];

const StageTrackerDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'stages',
        type: '{ label: string; description?: string }[]',
        default: '4-stage import flow',
        description: 'Ordered list of stages, each with a label and optional description.'
      },
      {
        name: 'activeIndex',
        type: 'number',
        default: '1',
        description: 'Index of the in-progress stage; earlier are complete, later pending.'
      },
      {
        name: 'orientation',
        type: "'vertical' | 'horizontal'",
        default: "'vertical'",
        description: 'Stack nodes vertically or lay them out in a row.'
      },
      { name: 'accent', type: 'string', default: "'#6366f1'", description: 'Accent color for completed and active nodes and the fill.' },
      { name: 'showDescriptions', type: 'boolean', default: 'true', description: 'Show each stage description line under its label.' },
      { name: 'animateConnector', type: 'boolean', default: 'true', description: 'Animate a moving shimmer on the active outgoing connector.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={stageTracker}
      componentName="StageTracker"
      preview={({ props, key }) => <StageTracker key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Active stage"
              min={0}
              max={props.stages.length - 1}
              value={props.activeIndex}
              onChange={v => set('activeIndex', v)}
            />
            <PreviewSelect
              title="Orientation"
              options={ORIENTATION_OPTIONS}
              value={props.orientation}
              onChange={v => set('orientation', v)}
            />
            <PreviewSelect title="Accent" options={ACCENT_OPTIONS} value={props.accent} onChange={v => set('accent', v)} />
            <PreviewSwitch
              title="Descriptions"
              isChecked={props.showDescriptions}
              onChange={v => set('showDescriptions', v)}
            />
            <PreviewSwitch
              title="Animate connector"
              isChecked={props.animateConnector}
              onChange={v => set('animateConnector', v)}
            />
          </>
        );
      }}
    />
  );
};

export default StageTrackerDemo;
