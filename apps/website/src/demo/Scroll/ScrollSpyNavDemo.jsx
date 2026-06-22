import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import ScrollSpyNav from '../../content/Scroll/ScrollSpyNav/ScrollSpyNav';
import { scrollSpyNav } from '../../constants/code/Scroll/scrollSpyNavCode';

const DEFAULT_PROPS = {
  height: 460
};

const ScrollSpyNavDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'sections',
        type: '{ id, label, title, body }[]',
        default: '5 built-in sections',
        description: 'Sections to render and track. Each `label` becomes a rail link.'
      },
      { name: 'activeColor', type: 'string', default: "'#5227FF'", description: 'Color of the active link and its dot.' },
      { name: 'height', type: 'number', default: '460', description: 'Height of the panel in pixels.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={scrollSpyNav}
      componentName="ScrollSpyNav"
      flexProps={{ minH: '520px', h: '520px', padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <ScrollSpyNav key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Height" min={320} max={560} step={10} value={props.height} valueUnit="px" onChange={v => set('height', v)} />
          </>
        );
      }}
    />
  );
};

export default ScrollSpyNavDemo;
