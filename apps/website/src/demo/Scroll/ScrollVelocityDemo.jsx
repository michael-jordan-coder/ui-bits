import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import ScrollVelocity from '../../content/Scroll/ScrollVelocity/ScrollVelocity';
import { scrollVelocity } from '../../constants/code/Scroll/scrollVelocityCode';

const DEFAULT_PROPS = {
  baseVelocity: 5,
  boost: 5,
  stiffness: 400,
  damping: 50
};

const ScrollVelocityDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'rows',
        type: '{ text, direction? }[]',
        default: '2 built-in rows',
        description: 'Marquee lanes. `direction` (1 or -1) sets each lane’s idle drift.'
      },
      { name: 'baseVelocity', type: 'number', default: '5', description: 'Idle drift speed of each lane.' },
      {
        name: 'boost',
        type: 'number',
        default: '5',
        description: 'Maximum velocity multiplier added from scrolling.'
      },
      { name: 'stiffness', type: 'number', default: '400', description: 'Spring stiffness smoothing the scroll velocity.' },
      { name: 'damping', type: 'number', default: '50', description: 'Spring damping smoothing the scroll velocity.' },
      { name: 'height', type: 'number', default: '360', description: 'Height of the scroll panel in pixels.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={scrollVelocity}
      componentName="ScrollVelocity"
      flexProps={{ minH: '420px', h: '420px', padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <ScrollVelocity key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Base velocity" min={1} max={16} step={1} value={props.baseVelocity} onChange={v => set('baseVelocity', v)} />
            <PreviewSlider title="Scroll boost" min={0} max={12} step={1} value={props.boost} onChange={v => set('boost', v)} />
            <PreviewSlider title="Spring stiffness" min={100} max={800} step={20} value={props.stiffness} onChange={v => set('stiffness', v)} />
            <PreviewSlider title="Spring damping" min={10} max={120} step={5} value={props.damping} onChange={v => set('damping', v)} />
          </>
        );
      }}
    />
  );
};

export default ScrollVelocityDemo;
