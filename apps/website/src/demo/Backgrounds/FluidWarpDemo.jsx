import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import FluidWarp from '../../content/Backgrounds/FluidWarp/FluidWarp';
import { fluidWarp } from '../../constants/code/Backgrounds/fluidWarpCode';

const DEFAULT_PROPS = {
  speed: 1,
  scale: 1,
  warp: 1,
  swirl: 1,
  interactive: true
};

const FluidWarpDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'speed', type: 'number', default: '1', description: 'Flow speed of the warped noise.' },
      { name: 'scale', type: 'number', default: '1', description: 'Zoom of the noise field.' },
      {
        name: 'warp',
        type: 'number',
        default: '1',
        description: 'Strength of the domain warp — how hard the noise folds the ink.'
      },
      { name: 'swirl', type: 'number', default: '1', description: 'How strongly the pointer rotates/pushes the fluid.' },
      { name: 'colorA', type: 'string', default: "'#2c0e63'", description: 'First palette color (the deep base).' },
      { name: 'colorB', type: 'string', default: "'#26d6e6'", description: 'Second palette color (the bright highlight).' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Let the pointer stir the fluid.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={fluidWarp}
      componentName="FluidWarp"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <FluidWarp
          key={key}
          speed={props.speed}
          scale={props.scale}
          warp={props.warp}
          swirl={props.swirl}
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
            <PreviewSlider title="Scale" min={0.5} max={2} step={0.1} value={props.scale} onChange={v => set('scale', v)} />
            <PreviewSlider title="Warp" min={0} max={2} step={0.05} value={props.warp} onChange={v => set('warp', v)} />
            <PreviewSlider title="Swirl" min={0} max={2} step={0.05} value={props.swirl} onChange={v => set('swirl', v)} />
            <PreviewSwitch title="Interactive" isChecked={props.interactive} onChange={v => set('interactive', v)} />
          </>
        );
      }}
    />
  );
};

export default FluidWarpDemo;
