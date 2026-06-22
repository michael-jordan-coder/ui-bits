import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import ScrollSnap from '../../content/Scroll/ScrollSnap/ScrollSnap';
import { scrollSnap } from '../../constants/code/Scroll/scrollSnapCode';

const DEFAULT_PROPS = {
  panels: 4,
  accent: '#3ecf8e'
};

const ScrollSnapDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'panels', type: 'number', default: '4', description: 'Number of full-height snap panels.' },
      { name: 'accent', type: 'string', default: "'#3ecf8e'", description: 'Base accent the panel tints and active dot derive from.' },
      { name: 'height', type: 'number', default: '460', description: 'Height of the scroll container in pixels.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={scrollSnap}
      componentName="ScrollSnap"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <ScrollSnap key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <PreviewSlider title="Panels" min={3} max={6} value={props.panels} onChange={val => set('panels', val)} />
        );
      }}
    />
  );
};

export default ScrollSnapDemo;
