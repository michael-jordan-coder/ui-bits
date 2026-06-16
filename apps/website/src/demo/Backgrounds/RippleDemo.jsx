import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import Ripple from '../../content/Backgrounds/Ripple/Ripple';
import { ripple } from '../../constants/code/Backgrounds/rippleCode';

const DEFAULT_PROPS = {
  color: '#6366f1',
  backgroundColor: '#0a0a0f',
  rippleCount: 6,
  speed: 4,
  interactive: true,
  maxRipples: 8
};

const COLOR_OPTIONS = [
  { label: 'Indigo', value: '#6366f1' },
  { label: 'Cyan', value: '#22d3ee' },
  { label: 'Emerald', value: '#34d399' },
  { label: 'Rose', value: '#fb7185' },
  { label: 'Amber', value: '#fbbf24' }
];

const RippleDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'color', type: 'string', default: "'#6366f1'", description: 'Stroke color of every ring.' },
      {
        name: 'backgroundColor',
        type: 'string',
        default: "'#0a0a0f'",
        description: 'Fill color behind the rings.'
      },
      {
        name: 'rippleCount',
        type: 'number',
        default: '6',
        description: 'Number of ambient rings emitting from the center.'
      },
      { name: 'speed', type: 'number', default: '4', description: 'Seconds per ambient ring cycle.' },
      {
        name: 'interactive',
        type: 'boolean',
        default: 'true',
        description: 'Emit a ripple at the pointer on pointer-down.'
      },
      {
        name: 'maxRipples',
        type: 'number',
        default: '8',
        description: 'Cap on simultaneous click ripples (oldest dropped).'
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
      codeObject={ripple}
      componentName="Ripple"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <Ripple key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Ripple count"
              min={1}
              max={12}
              value={props.rippleCount}
              onChange={val => set('rippleCount', val)}
            />
            <PreviewSlider
              title="Speed"
              min={1}
              max={10}
              step={0.5}
              value={props.speed}
              valueUnit="s"
              onChange={val => set('speed', val)}
            />
            <PreviewSelect
              title="Color"
              options={COLOR_OPTIONS}
              value={props.color}
              onChange={val => set('color', val)}
            />
            <PreviewSwitch
              title="Interactive"
              isChecked={props.interactive}
              onChange={val => set('interactive', val)}
            />
          </>
        );
      }}
    />
  );
};

export default RippleDemo;
