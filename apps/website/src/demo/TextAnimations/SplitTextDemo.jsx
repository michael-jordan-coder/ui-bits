import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import SplitText from '../../content/TextAnimations/SplitText/SplitText';
import { splitText } from '../../constants/code/TextAnimations/splitTextCode';

const AS_OPTIONS = [
  { value: 'chars', label: 'By character' },
  { value: 'words', label: 'By word' }
];

const DEFAULT_PROPS = {
  text: 'Ag — split text reveal',
  as: 'chars',
  stagger: 0.03,
  duration: 0.5
};

const SplitTextDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'text', type: 'string', default: "'Ag — split text reveal'", description: 'The string that reveals on view.' },
      {
        name: 'as',
        type: "'chars' | 'words'",
        default: "'chars'",
        description: 'Split the text into individual characters or whole words.'
      },
      { name: 'stagger', type: 'number', default: '0.03', description: 'Delay in seconds between each unit reveal.' },
      { name: 'duration', type: 'number', default: '0.5', description: 'Reveal duration of a single unit in seconds.' },
      {
        name: 'color',
        type: 'string',
        default: 'undefined',
        description: 'Optional text color. Inherits the surrounding color when unset.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={splitText}
      componentName="SplitText"
      preview={({ props, key }) => <SplitText key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect title="Split by" options={AS_OPTIONS} value={props.as} onChange={val => set('as', val)} />
            <PreviewSlider
              title="Stagger"
              min={0}
              max={0.12}
              step={0.01}
              value={props.stagger}
              valueUnit="s"
              onChange={val => set('stagger', val)}
            />
            <PreviewSlider
              title="Duration"
              min={0.2}
              max={1}
              step={0.05}
              value={props.duration}
              valueUnit="s"
              onChange={val => set('duration', val)}
            />
          </>
        );
      }}
    />
  );
};

export default SplitTextDemo;
