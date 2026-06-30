import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import ParallaxScroll from '../../content/Scroll/ParallaxScroll/ParallaxScroll';
import { parallaxScroll } from '../../constants/code/Scroll/parallaxScrollCode';

const DEFAULT_PROPS = {
  bgSpeed: 0.4,
  blobColor: '#5227ff'
};

const ACCENTS = [
  { value: '#5227ff', label: 'Violet' },
  { value: '#3ecf8e', label: 'Emerald' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#f43f5e', label: 'Rose' },
  { value: '#38bdf8', label: 'Sky' }
];

const ParallaxScrollDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'children',
        type: 'ReactNode',
        default: 'sample sequence',
        description: 'Foreground content scrolled over the parallax backdrop.'
      },
      {
        name: 'bgSpeed',
        type: 'number',
        default: '0.4',
        description: 'Backdrop speed relative to scroll. Lower pushes it further back.'
      },
      { name: 'blobColor', type: 'string', default: "'#5227FF'", description: 'Color of the backdrop blobs.' },
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
      codeObject={parallaxScroll}
      componentName="ParallaxScroll"
      flexProps={{ minH: '520px', h: '520px', padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <ParallaxScroll key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Background speed" min={0} max={1} step={0.05} value={props.bgSpeed} onChange={v => set('bgSpeed', v)} />
            <PreviewSelect title="Blob color" options={ACCENTS} value={props.blobColor} onChange={v => set('blobColor', v)} />
          </>
        );
      }}
    />
  );
};

export default ParallaxScrollDemo;
