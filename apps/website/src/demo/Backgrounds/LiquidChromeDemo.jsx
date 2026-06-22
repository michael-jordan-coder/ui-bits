import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import LiquidChrome from '../../content/Backgrounds/LiquidChrome/LiquidChrome';
import { liquidChrome } from '../../constants/code/Backgrounds/liquidChromeCode';

const DEFAULT_PROPS = {
  speed: 1,
  scale: 1,
  exposure: 1.1,
  roughness: 0.14,
  interactive: true
};

const LiquidChromeDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'speed', type: 'number', default: '1', description: 'Drift speed of the metaballs.' },
      { name: 'scale', type: 'number', default: '1', description: 'Size multiplier for the metaballs.' },
      { name: 'exposure', type: 'number', default: '1.1', description: 'Overall brightness fed into the ACES tone map.' },
      { name: 'roughness', type: 'number', default: '0.14', description: 'Blurs the reflection from mirror-sharp toward satin.' },
      { name: 'tint', type: 'string', default: "'#74e7ff'", description: 'Color the chrome is tinted toward.' },
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
      codeObject={liquidChrome}
      componentName="LiquidChrome"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <LiquidChrome
          key={key}
          speed={props.speed}
          scale={props.scale}
          exposure={props.exposure}
          roughness={props.roughness}
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
            <PreviewSlider
              title="Exposure"
              min={0.5}
              max={1.8}
              step={0.05}
              value={props.exposure}
              onChange={v => set('exposure', v)}
            />
            <PreviewSlider
              title="Roughness"
              min={0}
              max={0.6}
              step={0.02}
              value={props.roughness}
              onChange={v => set('roughness', v)}
            />
            <PreviewSwitch title="Interactive" isChecked={props.interactive} onChange={v => set('interactive', v)} />
          </>
        );
      }}
    />
  );
};

export default LiquidChromeDemo;
