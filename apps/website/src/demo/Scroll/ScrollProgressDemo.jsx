import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import ScrollProgress from '../../content/Scroll/ScrollProgress/ScrollProgress';
import { scrollProgress } from '../../constants/code/Scroll/scrollProgressCode';

const DEFAULT_PROPS = {
  barHeight: 4,
  circular: true,
  showPercent: true
};

const ScrollProgressDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'children',
        type: 'ReactNode',
        default: 'sample article',
        description: 'Scrollable content. A sample article renders when omitted.'
      },
      { name: 'barColor', type: 'string', default: "'#5227FF'", description: 'Progress bar + ring color.' },
      { name: 'trackColor', type: 'string', default: "'rgba(255,255,255,0.1)'", description: 'Bar + ring track color.' },
      { name: 'barHeight', type: 'number', default: '4', description: 'Height of the top progress rail in pixels.' },
      { name: 'circular', type: 'boolean', default: 'true', description: 'Show the circular percentage dial.' },
      { name: 'showPercent', type: 'boolean', default: 'true', description: 'Show the numeric percentage inside the dial.' },
      { name: 'height', type: 'number', default: '460', description: 'Height of the scroll panel in pixels.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={scrollProgress}
      componentName="ScrollProgress"
      flexProps={{ minH: '520px', h: '520px', padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <ScrollProgress key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Bar height" min={2} max={10} step={1} value={props.barHeight} valueUnit="px" onChange={v => set('barHeight', v)} />
            <PreviewSwitch title="Circular dial" isChecked={props.circular} onChange={v => set('circular', v)} />
            <PreviewSwitch title="Show percent" isChecked={props.showPercent} onChange={v => set('showPercent', v)} />
          </>
        );
      }}
    />
  );
};

export default ScrollProgressDemo;
