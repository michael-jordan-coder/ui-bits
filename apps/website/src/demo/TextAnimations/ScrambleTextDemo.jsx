import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewInput from '../../components/common/Preview/PreviewInput';

import ScrambleText from '../../content/TextAnimations/ScrambleText/ScrambleText';
import { scrambleText } from '../../constants/code/TextAnimations/scrambleTextCode';

const TRIGGER_OPTIONS = [
  { value: 'hover', label: 'On hover / focus' },
  { value: 'view', label: 'When in view' }
];

const DEFAULT_PROPS = {
  text: 'Scramble',
  trigger: 'hover',
  duration: 900
};

const ScrambleTextDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'text', type: 'string', default: "'Scramble'", description: 'The string that resolves into place.' },
      {
        name: 'trigger',
        type: "'hover' | 'view'",
        default: "'hover'",
        description: 'Replay on pointer/focus, or run once when scrolled into view.'
      },
      { name: 'duration', type: 'number', default: '900', description: 'Resolve duration in milliseconds.' },
      {
        name: 'scrambleChars',
        type: 'string',
        default: "'!<>-_\\\\/[]{}—=+*^?#'",
        description: 'Glyph pool sampled while a character is unsettled.'
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
      codeObject={scrambleText}
      componentName="ScrambleText"
      preview={({ props, key }) => <ScrambleText key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewInput
              title="Text"
              value={props.text}
              placeholder="Type text…"
              maxLength={48}
              onChange={val => set('text', val)}
            />
            <PreviewSelect
              title="Trigger"
              options={TRIGGER_OPTIONS}
              value={props.trigger}
              onChange={val => set('trigger', val)}
            />
            <PreviewSlider
              title="Duration"
              min={300}
              max={2000}
              step={50}
              value={props.duration}
              valueUnit="ms"
              onChange={val => set('duration', val)}
            />
          </>
        );
      }}
    />
  );
};

export default ScrambleTextDemo;
