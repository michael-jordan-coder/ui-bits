import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import ScrollTimeline from '../../content/Scroll/ScrollTimeline/ScrollTimeline';
import { scrollTimeline } from '../../constants/code/Scroll/scrollTimelineCode';

const DEFAULT_PROPS = {
  items: 5,
  accent: '#3ecf8e',
  height: 460
};

const ScrollTimelineDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'items', type: 'number', default: '5', description: 'Number of timeline nodes, from 1 to 7.' },
      { name: 'accent', type: 'string', default: "'#3ecf8e'", description: 'Color of the spine fill and active nodes.' },
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
      codeObject={scrollTimeline}
      componentName="ScrollTimeline"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <ScrollTimeline key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Items" min={3} max={7} value={props.items} onChange={val => set('items', val)} />
            <PreviewSlider
              title="Height"
              min={360}
              max={560}
              step={20}
              value={props.height}
              valueUnit="px"
              onChange={val => set('height', val)}
            />
          </>
        );
      }}
    />
  );
};

export default ScrollTimelineDemo;
