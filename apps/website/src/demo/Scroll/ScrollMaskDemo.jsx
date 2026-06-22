import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import ScrollMask from '../../content/Scroll/ScrollMask/ScrollMask';
import { scrollMask } from '../../constants/code/Scroll/scrollMaskCode';

const DEFAULT_PROPS = {
  height: 460,
  direction: 'up',
  accent: '#3ecf8e'
};

const DIRECTION_OPTIONS = [
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

const ScrollMaskDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'height', type: 'number', default: '460', description: 'Height of the scroll panel in pixels.' },
      {
        name: 'direction',
        type: "'up' | 'down' | 'left' | 'right'",
        default: "'up'",
        description: 'Axis and origin the wipe reveals from.'
      },
      { name: 'accent', type: 'string', default: "'#3ecf8e'", description: 'Accent color for the media and eyebrow.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={scrollMask}
      componentName="ScrollMask"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <ScrollMask key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect
              title="Direction"
              value={props.direction}
              options={DIRECTION_OPTIONS}
              onChange={val => set('direction', val)}
            />
            <PreviewSlider
              title="Height"
              min={320}
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

export default ScrollMaskDemo;
