import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import BlurText from '../../content/TextAnimations/BlurText/BlurText';
import { blurText } from '../../constants/code/TextAnimations/blurTextCode';

const DEFAULT_PROPS = {
  text: 'Ag — blur text resolves into focus',
  stagger: 0.06,
  duration: 0.6,
  blurAmount: 8
};

const BlurTextDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'text',
        type: 'string',
        default: "'Ag — blur text resolves into focus'",
        description: 'The string revealed word by word.'
      },
      { name: 'stagger', type: 'number', default: '0.06', description: 'Delay in seconds between each word.' },
      { name: 'duration', type: 'number', default: '0.6', description: 'Reveal duration per word, in seconds.' },
      { name: 'blurAmount', type: 'number', default: '8', description: 'Starting blur radius in pixels.' },
      {
        name: 'color',
        type: 'string',
        default: 'undefined',
        description: 'Optional text color. Inherits when unset.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={[]}
      codeObject={blurText}
      componentName="BlurText"
      preview={({ props, key }) => <BlurText key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Stagger"
              min={0}
              max={0.16}
              step={0.01}
              value={props.stagger}
              valueUnit="s"
              onChange={val => set('stagger', val)}
            />
            <PreviewSlider
              title="Duration"
              min={0.2}
              max={1.2}
              step={0.1}
              value={props.duration}
              valueUnit="s"
              onChange={val => set('duration', val)}
            />
            <PreviewSlider
              title="Blur amount"
              min={2}
              max={16}
              step={1}
              value={props.blurAmount}
              valueUnit="px"
              onChange={val => set('blurAmount', val)}
            />
          </>
        );
      }}
    />
  );
};

export default BlurTextDemo;
