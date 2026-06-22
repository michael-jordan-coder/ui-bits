import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import Rain from '../../content/Backgrounds/Rain/Rain';
import { rain } from '../../constants/code/Backgrounds/rainCode';

const DEFAULT_PROPS = {
  count: 300,
  speed: 1,
  angle: 12
};

const RainDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'count', type: 'number', default: '300', description: 'Total drops spread across three depth layers.' },
      { name: 'color', type: 'string', default: "'#7aa2ff'", description: 'Drop stroke color.' },
      { name: 'surfaceColor', type: 'string', default: "'#06070d'", description: 'Backdrop fill color.' },
      { name: 'speed', type: 'number', default: '1', description: 'Fall speed multiplier.' },
      { name: 'angle', type: 'number', default: '12', description: 'Wind angle in degrees.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' },
      { name: 'children', type: 'ReactNode', default: '—', description: 'Optional content centered above the rain.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={rain}
      componentName="Rain"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <Rain key={key} count={props.count} speed={props.speed} angle={props.angle} />
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
              min={120}
              max={500}
              step={20}
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
              title="Angle"
              min={0}
              max={30}
              value={props.angle}
              valueUnit="°"
              onChange={val => set('angle', val)}
            />
          </>
        );
      }}
    />
  );
};

export default RainDemo;
