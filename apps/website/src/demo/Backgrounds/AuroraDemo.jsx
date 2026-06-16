import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import Aurora from '../../content/Backgrounds/Aurora/Aurora';
import { aurora } from '../../constants/code/Backgrounds/auroraCode';

const DEFAULT_PROPS = {
  speed: 1,
  blur: 60,
  blend: 0.6
};

const AuroraDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'colorStops',
        type: 'string[]',
        default: "['#5227FF', '#7CFF67', '#22d3ee']",
        description: 'Three colors assigned to the drifting light blobs.'
      },
      { name: 'surfaceColor', type: 'string', default: "'#08080c'", description: 'Dark backdrop behind the aurora.' },
      {
        name: 'speed',
        type: 'number',
        default: '1',
        description: 'Animation speed multiplier; higher drifts faster.'
      },
      { name: 'blend', type: 'number', default: '0.6', description: 'Blob intensity / opacity, from 0 to 1.' },
      { name: 'blur', type: 'number', default: '60', description: 'Blur radius of the blobs in pixels.' },
      {
        name: 'children',
        type: 'ReactNode',
        default: 'undefined',
        description: 'Optional content centered above the aurora.'
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
      codeObject={aurora}
      componentName="Aurora"
      flexProps={{ padding: 0, height: 420, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <Aurora key={key} {...props}>
          <span
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#fff'
            }}
          >
            Northern Lights
          </span>
        </Aurora>
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Speed"
              min={0.2}
              max={3}
              step={0.1}
              value={props.speed}
              onChange={v => set('speed', v)}
            />
            <PreviewSlider
              title="Blur"
              min={20}
              max={120}
              value={props.blur}
              valueUnit="px"
              onChange={v => set('blur', v)}
            />
            <PreviewSlider
              title="Blend"
              min={0.1}
              max={1}
              step={0.1}
              value={props.blend}
              onChange={v => set('blend', v)}
            />
          </>
        );
      }}
    />
  );
};

export default AuroraDemo;
