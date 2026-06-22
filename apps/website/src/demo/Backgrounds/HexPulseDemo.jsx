import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import HexPulse from '../../content/Backgrounds/HexPulse/HexPulse';
import { hexPulse } from '../../constants/code/Backgrounds/hexPulseCode';

const DEFAULT_PROPS = {
  size: 26,
  speed: 1,
  waveWidth: 1
};

const HexPulseDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'size', type: 'number', default: '26', description: 'Hexagon radius in pixels.' },
      { name: 'color', type: 'string', default: "'#3ecf8e'", description: 'Hex color for the lit cells and outlines.' },
      { name: 'surfaceColor', type: 'string', default: "'#06070d'", description: 'Backdrop fill color.' },
      { name: 'speed', type: 'number', default: '1', description: 'Pulse-wave speed multiplier.' },
      {
        name: 'waveWidth',
        type: 'number',
        default: '1',
        description: 'Thickness of each lit ring; higher lights more rows at once.'
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
      codeObject={hexPulse}
      componentName="HexPulse"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <HexPulse key={key} size={props.size} speed={props.speed} waveWidth={props.waveWidth} />
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Size"
              min={16}
              max={40}
              step={2}
              value={props.size}
              valueUnit="px"
              onChange={val => set('size', val)}
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
              title="Wave width"
              min={0.4}
              max={2}
              step={0.1}
              value={props.waveWidth}
              onChange={val => set('waveWidth', val)}
            />
          </>
        );
      }}
    />
  );
};

export default HexPulseDemo;
