import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import Iridescence from '../../content/Backgrounds/Iridescence/Iridescence';
import { iridescence } from '../../constants/code/Backgrounds/iridescenceCode';

const DEFAULT_PROPS = {
  speed: 1,
  scale: 1,
  roughness: 0.12,
  iridescence: 0.85,
  interactive: true
};

const IridescenceDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'speed', type: 'number', default: '1', description: 'Drift speed of the metaballs.' },
      { name: 'scale', type: 'number', default: '1', description: 'Size multiplier for the metaballs.' },
      { name: 'exposure', type: 'number', default: '1.1', description: 'Overall brightness fed into the ACES tone map.' },
      { name: 'roughness', type: 'number', default: '0.12', description: 'Blurs the reflection from mirror-sharp toward satin.' },
      { name: 'iridescence', type: 'number', default: '0.85', description: 'How strongly the thin-film rainbow tints the metal.' },
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
      codeObject={iridescence}
      componentName="Iridescence"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <Iridescence
          key={key}
          speed={props.speed}
          scale={props.scale}
          roughness={props.roughness}
          iridescence={props.iridescence}
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
              title="Roughness"
              min={0}
              max={0.6}
              step={0.02}
              value={props.roughness}
              onChange={v => set('roughness', v)}
            />
            <PreviewSlider
              title="Iridescence"
              min={0}
              max={1}
              step={0.05}
              value={props.iridescence}
              onChange={v => set('iridescence', v)}
            />
            <PreviewSwitch title="Interactive" isChecked={props.interactive} onChange={v => set('interactive', v)} />
          </>
        );
      }}
    />
  );
};

export default IridescenceDemo;
