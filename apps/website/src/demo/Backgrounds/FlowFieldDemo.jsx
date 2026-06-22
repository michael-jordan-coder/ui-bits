import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import FlowField from '../../content/Backgrounds/FlowField/FlowField';
import { flowField } from '../../constants/code/Backgrounds/flowFieldCode';

const DEFAULT_PROPS = {
  count: 700,
  color: '#7aa2ff',
  speed: 1,
  scale: 1,
  trail: 0.92
};

const COLOR_OPTIONS = [
  { value: '#7aa2ff', label: 'Periwinkle' },
  { value: '#5eead4', label: 'Teal' },
  { value: '#f0abfc', label: 'Orchid' },
  { value: '#fcd34d', label: 'Amber' }
];

const FlowFieldDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'count', type: 'number', default: '700', description: 'Number of particles tracing the field.' },
      { name: 'color', type: 'string', default: "'#7aa2ff'", description: 'Filament stroke color.' },
      { name: 'surfaceColor', type: 'string', default: "'#06070d'", description: 'Backdrop fill color.' },
      { name: 'speed', type: 'number', default: '1', description: 'Flow speed multiplier.' },
      { name: 'scale', type: 'number', default: '1', description: 'Field frequency — higher means tighter swirls.' },
      {
        name: 'trail',
        type: 'number',
        default: '0.92',
        description: 'Trail persistence from 0 (no trail) to ~1 (long trails).'
      },
      { name: 'lineWidth', type: 'number', default: '1.1', description: 'Filament stroke width in pixels.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' },
      { name: 'children', type: 'ReactNode', default: '—', description: 'Optional content centered above the field.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={flowField}
      componentName="FlowField"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <FlowField key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Count"
              min={150}
              max={1400}
              step={50}
              value={props.count}
              onChange={val => set('count', val)}
            />
            <PreviewSlider
              title="Speed"
              min={0.3}
              max={2.5}
              step={0.1}
              value={props.speed}
              onChange={val => set('speed', val)}
            />
            <PreviewSlider
              title="Field scale"
              min={0.4}
              max={2.5}
              step={0.1}
              value={props.scale}
              onChange={val => set('scale', val)}
            />
            <PreviewSlider
              title="Trail"
              min={0.6}
              max={0.98}
              step={0.02}
              value={props.trail}
              onChange={val => set('trail', val)}
            />
            <PreviewSelect title="Color" options={COLOR_OPTIONS} value={props.color} onChange={val => set('color', val)} />
          </>
        );
      }}
    />
  );
};

export default FlowFieldDemo;
