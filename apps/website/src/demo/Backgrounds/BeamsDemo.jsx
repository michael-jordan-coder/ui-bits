import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import Beams from '../../content/Backgrounds/Beams/Beams';
import { beams } from '../../constants/code/Backgrounds/beamsCode';

const DEFAULT_PROPS = {
  beamCount: 9,
  speed: 1,
  intensity: 0.5,
  beamWidth: 120
};

const BeamsDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'beamCount', type: 'number', default: '9', description: 'Number of vertical light beams.' },
      { name: 'beamWidth', type: 'number', default: '120', description: 'Base beam width in pixels (randomized ±40%).' },
      { name: 'intensity', type: 'number', default: '0.5', description: 'Peak opacity of the beams, from 0 to 1.' },
      { name: 'speed', type: 'number', default: '1', description: 'Drift + breathing speed multiplier.' },
      { name: 'color', type: 'string', default: "'#5227FF'", description: 'Beam color.' },
      { name: 'surfaceColor', type: 'string', default: "'#08080c'", description: 'Backdrop fill behind the beams.' },
      {
        name: 'children',
        type: 'ReactNode',
        default: 'undefined',
        description: 'Optional content centered above the beams.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={beams}
      componentName="Beams"
      flexProps={{ padding: 0, height: 420, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <Beams key={key} {...props}>
          <span
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#fff'
            }}
          >
            Beams
          </span>
        </Beams>
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Beam count" min={3} max={20} step={1} value={props.beamCount} onChange={v => set('beamCount', v)} />
            <PreviewSlider title="Beam width" min={40} max={240} step={10} value={props.beamWidth} valueUnit="px" onChange={v => set('beamWidth', v)} />
            <PreviewSlider title="Intensity" min={0.1} max={1} step={0.05} value={props.intensity} onChange={v => set('intensity', v)} />
            <PreviewSlider title="Speed" min={0} max={3} step={0.1} value={props.speed} onChange={v => set('speed', v)} />
          </>
        );
      }}
    />
  );
};

export default BeamsDemo;
