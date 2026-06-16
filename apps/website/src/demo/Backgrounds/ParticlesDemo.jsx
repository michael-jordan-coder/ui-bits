import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import Particles from '../../content/Backgrounds/Particles/Particles';
import { particles } from '../../constants/code/Backgrounds/particlesCode';

const DEFAULT_PROPS = {
  count: 80,
  color: '#ffffff',
  speed: 0.4,
  connect: false
};

const COLOR_OPTIONS = [
  { value: '#ffffff', label: 'White' },
  { value: '#7c9cff', label: 'Periwinkle' },
  { value: '#5eead4', label: 'Teal' },
  { value: '#fca5a5', label: 'Coral' }
];

const ParticlesDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'count', type: 'number', default: '80', description: 'Number of particles in the field.' },
      { name: 'color', type: 'string', default: "'#ffffff'", description: 'Particle (and connection line) color.' },
      { name: 'surfaceColor', type: 'string', default: "'#08080c'", description: 'Backdrop fill color.' },
      { name: 'speed', type: 'number', default: '0.4', description: 'Drift speed multiplier.' },
      { name: 'minSize', type: 'number', default: '1', description: 'Minimum particle radius in pixels.' },
      { name: 'maxSize', type: 'number', default: '3', description: 'Maximum particle radius in pixels.' },
      {
        name: 'connect',
        type: 'boolean',
        default: 'false',
        description: 'Draw faint lines between nearby particles.'
      },
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
      codeObject={particles}
      componentName="Particles"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <Particles key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Count" min={20} max={160} value={props.count} onChange={val => set('count', val)} />
            <PreviewSlider
              title="Speed"
              min={0.1}
              max={1.5}
              step={0.1}
              value={props.speed}
              onChange={val => set('speed', val)}
            />
            <PreviewSelect title="Color" options={COLOR_OPTIONS} value={props.color} onChange={val => set('color', val)} />
            <PreviewSwitch title="Connect" isChecked={props.connect} onChange={val => set('connect', val)} />
          </>
        );
      }}
    />
  );
};

export default ParticlesDemo;
