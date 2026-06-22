import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import LiquidMetal from '../../content/Backgrounds/LiquidMetal/LiquidMetal';
import { liquidMetal } from '../../constants/code/Backgrounds/liquidMetalCode';

const DEFAULT_PROPS = {
  count: 6,
  speed: 1,
  scale: 1
};

const LiquidMetalDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'count', type: 'number', default: '6', description: 'Number of metaball blobs.' },
      { name: 'color', type: 'string', default: "'#c8d0e0'", description: 'Metal tint of the merged mass.' },
      { name: 'surfaceColor', type: 'string', default: "'#05060a'", description: 'Backdrop fill behind the metal.' },
      { name: 'speed', type: 'number', default: '1', description: 'Drift speed multiplier.' },
      { name: 'scale', type: 'number', default: '1', description: 'Blob size multiplier.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={liquidMetal}
      componentName="LiquidMetal"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <LiquidMetal key={key} count={props.count} speed={props.speed} scale={props.scale} />
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
              min={3}
              max={10}
              step={1}
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
              title="Scale"
              min={0.6}
              max={1.8}
              step={0.1}
              value={props.scale}
              onChange={val => set('scale', val)}
            />
          </>
        );
      }}
    />
  );
};

export default LiquidMetalDemo;
