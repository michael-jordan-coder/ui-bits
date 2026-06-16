import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import RadialProgress from '../../content/Components/RadialProgress/RadialProgress';
import { radialProgress } from '../../constants/code/Components/radialProgressCode';

const DEFAULT_PROPS = {
  value: 72,
  size: 160,
  strokeWidth: 12,
  progressColor: '#6366f1',
  label: 'Complete'
};

const PROGRESS_COLORS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#14b8a6', label: 'Teal' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#ec4899', label: 'Pink' }
];

const RadialProgressDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'value', type: 'number', default: '72', description: 'Progress percentage from 0 to 100.' },
      { name: 'size', type: 'number', default: '160', description: 'Diameter of the ring, in px.' },
      { name: 'strokeWidth', type: 'number', default: '12', description: 'Thickness of the track and progress arc, in px.' },
      { name: 'trackColor', type: 'string', default: "'#26282f'", description: 'Color of the unfilled track.' },
      { name: 'progressColor', type: 'string', default: "'#6366f1'", description: 'Color of the progress arc.' },
      { name: 'showValue', type: 'boolean', default: 'true', description: 'Show the centered count-up percentage.' },
      { name: 'duration', type: 'number', default: '1.2', description: 'Seconds for the sweep and count-up.' },
      { name: 'label', type: 'string', default: 'undefined', description: 'Optional caption shown under the number.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={radialProgress}
      componentName="RadialProgress"
      preview={({ props, key }) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RadialProgress {...props} />
        </div>
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Value" min={0} max={100} value={props.value} valueUnit="%" onChange={v => set('value', v)} />
            <PreviewSlider title="Size" min={100} max={240} value={props.size} valueUnit="px" onChange={v => set('size', v)} />
            <PreviewSlider
              title="Stroke width"
              min={4}
              max={24}
              value={props.strokeWidth}
              valueUnit="px"
              onChange={v => set('strokeWidth', v)}
            />
            <PreviewSelect
              title="Progress color"
              options={PROGRESS_COLORS}
              value={props.progressColor}
              onChange={v => set('progressColor', v)}
            />
          </>
        );
      }}
    />
  );
};

export default RadialProgressDemo;
