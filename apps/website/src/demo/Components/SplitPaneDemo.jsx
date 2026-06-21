import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import SplitPane from '../../content/Components/SplitPane/SplitPane';
import { splitPane } from '../../constants/code/Components/splitPaneCode';

const DEFAULT_PROPS = {
  orientation: 'horizontal',
  defaultSize: 50,
  min: 15,
  max: 85,
  snapPoints: [50],
  snapThreshold: 4,
  keyboardStep: 4,
  dividerSize: 12
};

const ORIENTATION_OPTIONS = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' }
];

const panelStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: '18px 20px',
  height: '100%',
  boxSizing: 'border-box'
};

const headingStyle = {
  margin: 0,
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '-0.01em',
  color: '#f3f4f6'
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 12,
  fontSize: 12.5,
  color: '#9ca3af'
};

const CalendarPane = () => (
  <div style={panelStyle}>
    <h3 style={headingStyle}>Calendar</h3>
    <div style={rowStyle}>
      <span style={{ color: '#d1d5db' }}>Standup</span>
      <span>9:00</span>
    </div>
    <div style={rowStyle}>
      <span style={{ color: '#d1d5db' }}>Design review</span>
      <span>13:30</span>
    </div>
    <div style={rowStyle}>
      <span style={{ color: '#d1d5db' }}>1:1 with Sam</span>
      <span>16:00</span>
    </div>
  </div>
);

const TasksPane = () => (
  <div style={panelStyle}>
    <h3 style={headingStyle}>Tasks</h3>
    <div style={rowStyle}>
      <span style={{ color: '#d1d5db' }}>Ship SplitPane</span>
      <span>Today</span>
    </div>
    <div style={rowStyle}>
      <span style={{ color: '#d1d5db' }}>Reply to threads</span>
      <span>Today</span>
    </div>
    <div style={rowStyle}>
      <span style={{ color: '#d1d5db' }}>Plan next sprint</span>
      <span>Fri</span>
    </div>
  </div>
);

const SplitPaneDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: 'Horizontal places panes side by side with a vertical divider; vertical stacks them.'
      },
      { name: 'defaultSize', type: 'number', default: '50', description: 'Initial size of the first pane as a percentage.' },
      { name: 'min', type: 'number', default: '15', description: 'Minimum percentage the first pane can shrink to.' },
      { name: 'max', type: 'number', default: '85', description: 'Maximum percentage the first pane can grow to.' },
      {
        name: 'snapPoints',
        type: 'number[]',
        default: '[50]',
        description: 'Percentages the divider gently snaps to when released nearby.'
      },
      { name: 'snapThreshold', type: 'number', default: '4', description: 'Distance in percent within which a snap point engages.' },
      { name: 'keyboardStep', type: 'number', default: '4', description: 'Percent the divider nudges per arrow keypress.' },
      { name: 'dividerSize', type: 'number', default: '12', description: 'Thickness of the divider handle in pixels.' },
      { name: 'first', type: 'ReactNode', default: '—', description: 'Content rendered in the first pane.' },
      { name: 'second', type: 'ReactNode', default: '—', description: 'Content rendered in the second pane.' },
      { name: 'onResize', type: '(size: number) => void', default: '—', description: 'Fires with the first pane percentage as it changes.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={splitPane}
      componentName="SplitPane"
      flexProps={{ padding: 0, overflow: 'hidden', minH: '420px', alignItems: 'stretch', justifyContent: 'stretch' }}
      preview={({ props, key }) => (
        <SplitPane key={key} {...props} first={<CalendarPane />} second={<TasksPane />} />
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect
              title="Orientation"
              name="splitpane-orientation"
              value={props.orientation}
              options={ORIENTATION_OPTIONS}
              onChange={v => set('orientation', v)}
            />
            <PreviewSlider
              title="Default size"
              min={props.min}
              max={props.max}
              value={props.defaultSize}
              valueUnit="%"
              onChange={v => set('defaultSize', v)}
            />
            <PreviewSlider title="Min" min={5} max={40} value={props.min} valueUnit="%" onChange={v => set('min', v)} />
            <PreviewSlider title="Max" min={60} max={95} value={props.max} valueUnit="%" onChange={v => set('max', v)} />
            <PreviewSlider
              title="Divider size"
              min={4}
              max={24}
              value={props.dividerSize}
              valueUnit="px"
              onChange={v => set('dividerSize', v)}
            />
            <PreviewSwitch
              title="Snap to center"
              isChecked={props.snapPoints.length > 0}
              onChange={v => set('snapPoints', v ? [50] : [])}
            />
          </>
        );
      }}
    />
  );
};

export default SplitPaneDemo;
