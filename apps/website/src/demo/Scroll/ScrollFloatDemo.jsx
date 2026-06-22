import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import ScrollFloat from '../../content/Scroll/ScrollFloat/ScrollFloat';
import { scrollFloat } from '../../constants/code/Scroll/scrollFloatCode';

const DEFAULT_PROPS = {
  items: 6,
  height: 460,
  accent: '#3ecf8e'
};

const ScrollFloatDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'items', type: 'number', default: '6', description: 'Number of rows in the stack.' },
      { name: 'height', type: 'number', default: '460', description: 'Height of the scroll panel in pixels.' },
      { name: 'accent', type: 'string', default: "'#3ecf8e'", description: 'Accent colour for the index and side bar.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={scrollFloat}
      componentName="ScrollFloat"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <ScrollFloat key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Items" min={3} max={9} value={props.items} onChange={val => set('items', val)} />
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

export default ScrollFloatDemo;
