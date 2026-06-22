import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import Waves from '../../content/Backgrounds/Waves/Waves';
import { waves } from '../../constants/code/Backgrounds/wavesCode';

const DEFAULT_PROPS = {
  lineCount: 14,
  amplitude: 26,
  frequency: 1.3,
  speed: 1,
  lineWidth: 1.5
};

const WavesDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'lineCount', type: 'number', default: '14', description: 'Number of stacked wave lines.' },
      { name: 'amplitude', type: 'number', default: '26', description: 'Peak vertical travel of each line in pixels.' },
      { name: 'frequency', type: 'number', default: '1.3', description: 'Wave cycles spanning the width.' },
      { name: 'speed', type: 'number', default: '1', description: 'Drift speed multiplier; higher flows faster.' },
      { name: 'lineWidth', type: 'number', default: '1.5', description: 'Stroke width of each line in pixels.' },
      { name: 'color', type: 'string', default: "'#5227FF'", description: 'Stroke color of the lines.' },
      { name: 'surfaceColor', type: 'string', default: "'#08080c'", description: 'Backdrop fill behind the waves.' },
      {
        name: 'children',
        type: 'ReactNode',
        default: 'undefined',
        description: 'Optional content centered above the waves.'
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
      codeObject={waves}
      componentName="Waves"
      flexProps={{ padding: 0, height: 420, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <Waves key={key} {...props}>
          <span
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#fff'
            }}
          >
            Waves
          </span>
        </Waves>
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Line count" min={4} max={30} step={1} value={props.lineCount} onChange={v => set('lineCount', v)} />
            <PreviewSlider title="Amplitude" min={4} max={60} step={1} value={props.amplitude} valueUnit="px" onChange={v => set('amplitude', v)} />
            <PreviewSlider title="Frequency" min={0.4} max={3} step={0.1} value={props.frequency} onChange={v => set('frequency', v)} />
            <PreviewSlider title="Speed" min={0} max={3} step={0.1} value={props.speed} onChange={v => set('speed', v)} />
            <PreviewSlider title="Line width" min={0.5} max={4} step={0.5} value={props.lineWidth} valueUnit="px" onChange={v => set('lineWidth', v)} />
          </>
        );
      }}
    />
  );
};

export default WavesDemo;
