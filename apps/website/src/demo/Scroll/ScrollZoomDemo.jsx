import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import ScrollZoom from '../../content/Scroll/ScrollZoom/ScrollZoom';
import { scrollZoom } from '../../constants/code/Scroll/scrollZoomCode';

const DEFAULT_PROPS = {
  height: 460,
  from: 0.6,
  accent: '#3ecf8e'
};

const ScrollZoomDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'height', type: 'number', default: '460', description: 'Height of the scroll panel in pixels.' },
      { name: 'from', type: 'number', default: '0.6', description: 'Starting scale the panel zooms up from.' },
      { name: 'accent', type: 'string', default: "'#3ecf8e'", description: 'Accent color for the panel and frame.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={scrollZoom}
      componentName="ScrollZoom"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <ScrollZoom key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="From"
              min={0.3}
              max={0.9}
              step={0.05}
              value={props.from}
              onChange={val => set('from', val)}
            />
            <PreviewSlider
              title="Height"
              min={360}
              max={560}
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

export default ScrollZoomDemo;
