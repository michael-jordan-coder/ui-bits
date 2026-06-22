import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import StickyGridScroll from '../../content/Scroll/StickyGridScroll/StickyGridScroll';
import { stickyGridScroll } from '../../constants/code/Scroll/stickyGridScrollCode';

const DEFAULT_PROPS = {
  tiles: 9,
  columns: 3,
  gap: 12,
  travel: 64,
  zoom: 1.12
};

const StickyGridScrollDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'tiles', type: 'number', default: '9', description: 'Number of tiles in the grid.' },
      { name: 'columns', type: 'number', default: '3', description: 'Number of grid columns.' },
      { name: 'gap', type: 'number', default: '12', description: 'Gap between tiles in pixels.' },
      { name: 'travel', type: 'number', default: '64', description: 'Distance each tile rises into place, in pixels.' },
      { name: 'zoom', type: 'number', default: '1.12', description: 'Starting scale the grid eases down from.' },
      { name: 'height', type: 'number', default: '460', description: 'Height of the scroll panel in pixels.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={stickyGridScroll}
      componentName="StickyGridScroll"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <StickyGridScroll key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Tiles" min={4} max={20} value={props.tiles} onChange={val => set('tiles', val)} />
            <PreviewSlider title="Columns" min={2} max={5} value={props.columns} onChange={val => set('columns', val)} />
            <PreviewSlider
              title="Gap"
              min={4}
              max={28}
              value={props.gap}
              valueUnit="px"
              onChange={val => set('gap', val)}
            />
            <PreviewSlider
              title="Travel"
              min={20}
              max={120}
              value={props.travel}
              valueUnit="px"
              onChange={val => set('travel', val)}
            />
            <PreviewSlider
              title="Zoom"
              min={1}
              max={1.4}
              step={0.02}
              value={props.zoom}
              onChange={val => set('zoom', val)}
            />
          </>
        );
      }}
    />
  );
};

export default StickyGridScrollDemo;
