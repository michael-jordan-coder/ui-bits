import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import Vortex from '../../content/Backgrounds/Vortex/Vortex';
import { vortex } from '../../constants/code/Backgrounds/vortexCode';

const DEFAULT_PROPS = {
  count: 400,
  speed: 1,
  twist: 1
};

const VortexDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'count', type: 'number', default: '400', description: 'Number of particles in the vortex.' },
      { name: 'color', type: 'string', default: "'#a78bfa'", description: 'Particle tint as a hex color.' },
      { name: 'surfaceColor', type: 'string', default: "'#06070d'", description: 'Backdrop and trail-veil color.' },
      { name: 'speed', type: 'number', default: '1', description: 'Spin and inflow speed multiplier.' },
      {
        name: 'twist',
        type: 'number',
        default: '1',
        description: 'How sharply the spin ramps up toward the core.'
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
      codeObject={vortex}
      componentName="Vortex"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <Vortex key={key} count={props.count} speed={props.speed} twist={props.twist} />
      )}
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
              max={700}
              step={25}
              value={props.count}
              onChange={val => set('count', val)}
            />
            <PreviewSlider
              title="Speed"
              min={0.2}
              max={2.5}
              step={0.1}
              value={props.speed}
              onChange={val => set('speed', val)}
            />
            <PreviewSlider
              title="Twist"
              min={0.4}
              max={2}
              step={0.1}
              value={props.twist}
              onChange={val => set('twist', val)}
            />
          </>
        );
      }}
    />
  );
};

export default VortexDemo;
