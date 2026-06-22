import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import Kaleidoscope from '../../content/Backgrounds/Kaleidoscope/Kaleidoscope';
import { kaleidoscope } from '../../constants/code/Backgrounds/kaleidoscopeCode';

const DEFAULT_PROPS = {
  speed: 1,
  segments: 8,
  zoom: 1,
  interactive: true
};

const KaleidoscopeDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'speed', type: 'number', default: '1', description: 'Animation speed of the kaleidoscope field.' },
      { name: 'segments', type: 'number', default: '8', description: 'Number of mirrored kaleidoscope segments.' },
      { name: 'zoom', type: 'number', default: '1', description: 'Zoom into the folded field.' },
      { name: 'colorA', type: 'string', default: "'#1a0b3a'", description: 'Base color of the field.' },
      { name: 'colorB', type: 'string', default: "'#ff3d81'", description: 'Mid color blended into the bands.' },
      { name: 'colorC', type: 'string', default: "'#3ad6ff'", description: 'Highlight color for sparkle and rings.' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Let the pointer steer rotation and zoom.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={kaleidoscope}
      componentName="Kaleidoscope"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <Kaleidoscope
          key={key}
          speed={props.speed}
          segments={props.segments}
          zoom={props.zoom}
          interactive={props.interactive}
        />
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Speed" min={0.2} max={2.5} step={0.1} value={props.speed} onChange={v => set('speed', v)} />
            <PreviewSlider
              title="Segments"
              min={3}
              max={16}
              step={1}
              value={props.segments}
              onChange={v => set('segments', v)}
            />
            <PreviewSlider title="Zoom" min={0.5} max={2} step={0.1} value={props.zoom} onChange={v => set('zoom', v)} />
            <PreviewSwitch title="Interactive" isChecked={props.interactive} onChange={v => set('interactive', v)} />
          </>
        );
      }}
    />
  );
};

export default KaleidoscopeDemo;
