import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import Lightning from '../../content/Backgrounds/Lightning/Lightning';
import { lightning } from '../../constants/code/Backgrounds/lightningCode';

const DEFAULT_PROPS = {
  frequency: 1,
  branchiness: 1,
  glow: 1
};

const LightningDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'color', type: 'string', default: "'#7aa2ff'", description: 'Bolt core and glow color.' },
      { name: 'surfaceColor', type: 'string', default: "'#06070d'", description: 'Dark backdrop fill color.' },
      { name: 'frequency', type: 'number', default: '1', description: 'Relative strike rate; higher strikes sooner.' },
      {
        name: 'branchiness',
        type: 'number',
        default: '1',
        description: 'Relative branch count and fork spread.'
      },
      { name: 'glow', type: 'number', default: '1', description: 'Glow strength of each bolt and the afterglow.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' },
      { name: 'children', type: 'ReactNode', default: '—', description: 'Optional content centered above the canvas.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={lightning}
      componentName="Lightning"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <Lightning key={key} frequency={props.frequency} branchiness={props.branchiness} glow={props.glow} />
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Frequency"
              min={0.2}
              max={3}
              step={0.1}
              value={props.frequency}
              onChange={val => set('frequency', val)}
            />
            <PreviewSlider
              title="Branchiness"
              min={0}
              max={2}
              step={0.1}
              value={props.branchiness}
              onChange={val => set('branchiness', val)}
            />
            <PreviewSlider
              title="Glow"
              min={0}
              max={2}
              step={0.1}
              value={props.glow}
              onChange={val => set('glow', val)}
            />
          </>
        );
      }}
    />
  );
};

export default LightningDemo;
