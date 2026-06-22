import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import Constellation from '../../content/Backgrounds/Constellation/Constellation';
import { constellation } from '../../constants/code/Backgrounds/constellationCode';

const DEFAULT_PROPS = {
  count: 70,
  linkDistance: 130,
  speed: 1
};

const ConstellationDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'count', type: 'number', default: '70', description: 'Number of drifting nodes.' },
      { name: 'color', type: 'string', default: "'#7aa2ff'", description: 'Node and link color.' },
      { name: 'surfaceColor', type: 'string', default: "'#06070d'", description: 'Backdrop fill color.' },
      {
        name: 'linkDistance',
        type: 'number',
        default: '130',
        description: 'Max pixel gap at which two nodes are linked.'
      },
      { name: 'speed', type: 'number', default: '1', description: 'Drift speed multiplier.' },
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
      codeObject={constellation}
      componentName="Constellation"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <Constellation key={key} count={props.count} linkDistance={props.linkDistance} speed={props.speed} />
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
              min={30}
              max={140}
              step={5}
              value={props.count}
              onChange={val => set('count', val)}
            />
            <PreviewSlider
              title="Link distance"
              min={80}
              max={200}
              value={props.linkDistance}
              valueUnit="px"
              onChange={val => set('linkDistance', val)}
            />
            <PreviewSlider
              title="Speed"
              min={0.2}
              max={2}
              step={0.1}
              value={props.speed}
              onChange={val => set('speed', val)}
            />
          </>
        );
      }}
    />
  );
};

export default ConstellationDemo;
