import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import RubberSlider from '../../content/Components/RubberSlider/RubberSlider';
import { rubberSlider } from '../../constants/code/Components/rubberSliderCode';

const DEFAULT_PROPS = {
  defaultValue: 40,
  min: 0,
  max: 100,
  step: 1,
  width: 320,
  accentColor: '#6366f1',
  label: 'Focus duration',
  valueSuffix: ' min',
  showValue: true,
  elasticity: 0.35
};

const ACCENTS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#22c55e', label: 'Green' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#38bdf8', label: 'Sky' }
];

const RubberSliderDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'defaultValue', type: 'number', default: '40', description: 'Initial value of the slider.' },
      { name: 'min', type: 'number', default: '0', description: 'Lowest selectable value.' },
      { name: 'max', type: 'number', default: '100', description: 'Highest selectable value.' },
      { name: 'step', type: 'number', default: '1', description: 'Increment the value snaps to.' },
      { name: 'width', type: 'number', default: '320', description: 'Width of the track, in px.' },
      { name: 'accentColor', type: 'string', default: "'#6366f1'", description: 'Fill, handle, and value color.' },
      {
        name: 'trackColor',
        type: 'string',
        default: "'rgba(255,255,255,0.12)'",
        description: 'Color of the unfilled track.'
      },
      { name: 'label', type: 'string', default: "'Focus duration'", description: 'Caption shown above the track.' },
      { name: 'valueSuffix', type: 'string', default: "' min'", description: 'Unit appended after the value.' },
      { name: 'showValue', type: 'boolean', default: 'true', description: 'Toggle the live value readout.' },
      {
        name: 'elasticity',
        type: 'number',
        default: '0.35',
        description: 'How far the bar stretches past the ends (0–1).'
      },
      {
        name: 'onChange',
        type: '(value: number) => void',
        default: 'undefined',
        description: 'Fires when the value changes.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={rubberSlider}
      componentName="RubberSlider"
      preview={({ props, key }) => <RubberSlider key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Width"
              min={220}
              max={420}
              value={props.width}
              valueUnit="px"
              onChange={v => set('width', v)}
            />
            <PreviewSlider title="Max" min={20} max={200} value={props.max} onChange={v => set('max', v)} />
            <PreviewSlider title="Step" min={1} max={10} value={props.step} onChange={v => set('step', v)} />
            <PreviewSlider
              title="Elasticity"
              min={0}
              max={0.8}
              step={0.05}
              value={props.elasticity}
              onChange={v => set('elasticity', v)}
            />
            <PreviewSelect
              title="Accent"
              options={ACCENTS}
              value={props.accentColor}
              onChange={v => set('accentColor', v)}
            />
            <PreviewSwitch title="Show value" isChecked={props.showValue} onChange={v => set('showValue', v)} />
          </>
        );
      }}
    />
  );
};

export default RubberSliderDemo;
