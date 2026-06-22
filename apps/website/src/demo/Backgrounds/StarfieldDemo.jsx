import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import Starfield from '../../content/Backgrounds/Starfield/Starfield';
import { starfield } from '../../constants/code/Backgrounds/starfieldCode';

const DEFAULT_PROPS = {
  count: 220,
  speed: 1,
  maxSize: 2.4,
  streak: true
};

const StarfieldDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'count', type: 'number', default: '220', description: 'Number of stars.' },
      { name: 'speed', type: 'number', default: '1', description: 'Fly-through speed multiplier.' },
      { name: 'maxSize', type: 'number', default: '2.4', description: 'Size of the nearest stars in pixels.' },
      { name: 'streak', type: 'boolean', default: 'true', description: 'Draw warp trails instead of dots.' },
      { name: 'color', type: 'string', default: "'#ffffff'", description: 'Star color.' },
      { name: 'surfaceColor', type: 'string', default: "'#08080c'", description: 'Backdrop fill behind the stars.' },
      {
        name: 'children',
        type: 'ReactNode',
        default: 'undefined',
        description: 'Optional content centered above the starfield.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={starfield}
      componentName="Starfield"
      flexProps={{ padding: 0, height: 420, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <Starfield key={key} {...props}>
          <span
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#fff'
            }}
          >
            Starfield
          </span>
        </Starfield>
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Star count" min={60} max={500} step={20} value={props.count} onChange={v => set('count', v)} />
            <PreviewSlider title="Speed" min={0.2} max={4} step={0.2} value={props.speed} onChange={v => set('speed', v)} />
            <PreviewSlider title="Max size" min={1} max={5} step={0.2} value={props.maxSize} valueUnit="px" onChange={v => set('maxSize', v)} />
            <PreviewSwitch title="Warp streaks" isChecked={props.streak} onChange={v => set('streak', v)} />
          </>
        );
      }}
    />
  );
};

export default StarfieldDemo;
