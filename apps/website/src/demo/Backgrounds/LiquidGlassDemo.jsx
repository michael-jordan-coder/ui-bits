import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import LiquidGlass from '../../content/Backgrounds/LiquidGlass/LiquidGlass';
import { liquidGlass } from '../../constants/code/Backgrounds/liquidGlassCode';

const DEFAULT_PROPS = {
  speed: 1,
  scale: 1,
  ior: 1.45,
  dispersion: 0.5,
  interactive: true
};

const LiquidGlassDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'speed', type: 'number', default: '1', description: 'Drift speed of the metaballs.' },
      { name: 'scale', type: 'number', default: '1', description: 'Size multiplier for the metaballs.' },
      { name: 'exposure', type: 'number', default: '1', description: 'Overall brightness fed into the ACES tone map.' },
      { name: 'ior', type: 'number', default: '1.45', description: 'Index of refraction — how hard the glass bends the environment.' },
      { name: 'dispersion', type: 'number', default: '0.5', description: 'Chromatic spread that splits the refracted rim into colour.' },
      { name: 'tint', type: 'string', default: "'#bfe9ff'", description: 'Color the glass body is tinted toward.' },
      { name: 'interactive', type: 'boolean', default: 'true', description: 'Let one blob follow the pointer.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={liquidGlass}
      componentName="LiquidGlass"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <LiquidGlass
          key={key}
          speed={props.speed}
          scale={props.scale}
          ior={props.ior}
          dispersion={props.dispersion}
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
            <PreviewSlider title="Scale" min={0.6} max={1.8} step={0.1} value={props.scale} onChange={v => set('scale', v)} />
            <PreviewSlider title="IOR" min={1} max={2} step={0.01} value={props.ior} onChange={v => set('ior', v)} />
            <PreviewSlider
              title="Dispersion"
              min={0}
              max={1}
              step={0.05}
              value={props.dispersion}
              onChange={v => set('dispersion', v)}
            />
            <PreviewSwitch title="Interactive" isChecked={props.interactive} onChange={v => set('interactive', v)} />
          </>
        );
      }}
    />
  );
};

export default LiquidGlassDemo;
