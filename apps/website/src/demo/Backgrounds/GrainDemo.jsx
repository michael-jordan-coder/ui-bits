import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import Grain from '../../content/Backgrounds/Grain/Grain';
import { grain } from '../../constants/code/Backgrounds/grainCode';

const DEFAULT_PROPS = {
  intensity: 0.12,
  grainSize: 1.6,
  speed: 1
};

const GrainDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'intensity', type: 'number', default: '0.12', description: 'Opacity of the grain over the surface, from 0 to 1.' },
      { name: 'grainSize', type: 'number', default: '1.6', description: 'Pixel size of each grain speck; higher is coarser.' },
      { name: 'speed', type: 'number', default: '1', description: 'How fast the grain re-randomizes (relative to ~24fps).' },
      { name: 'color', type: 'string', default: "'#ffffff'", description: 'Tint of the grain speckle.' },
      { name: 'surfaceColor', type: 'string', default: "'#08080c'", description: 'Flat backdrop behind the grain.' },
      {
        name: 'children',
        type: 'ReactNode',
        default: 'undefined',
        description: 'Optional content centered above the grain.'
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
      codeObject={grain}
      componentName="Grain"
      flexProps={{ padding: 0, height: 420, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <Grain key={key} {...props}>
          <span
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#fff'
            }}
          >
            Grain
          </span>
        </Grain>
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Intensity" min={0.02} max={0.4} step={0.02} value={props.intensity} onChange={v => set('intensity', v)} />
            <PreviewSlider title="Grain size" min={1} max={4} step={0.2} value={props.grainSize} valueUnit="px" onChange={v => set('grainSize', v)} />
            <PreviewSlider title="Speed" min={0.2} max={3} step={0.2} value={props.speed} onChange={v => set('speed', v)} />
          </>
        );
      }}
    />
  );
};

export default GrainDemo;
