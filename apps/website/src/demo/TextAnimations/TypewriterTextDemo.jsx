import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import TypewriterText from '../../content/TextAnimations/TypewriterText/TypewriterText';
import { typewriterText } from '../../constants/code/TextAnimations/typewriterTextCode';

const PHRASE_SETS = {
  product: ['Design once.', 'Ship everywhere.', 'Delight always.'],
  greeting: ['Hello, world.', 'Bonjour le monde.', 'Hola, mundo.', 'Hallo, Welt.'],
  code: ['const ui = bits;', 'npm run delight', 'git push --force-delight']
};

const DEFAULT_PROPS = {
  phraseSet: 'product',
  typingSpeed: 70,
  deletingSpeed: 40,
  pauseDuration: 1600,
  cursorColor: '#6366f1',
  loop: true,
  showCursor: true,
  cursorBlink: true
};

const PHRASES = [
  { value: 'product', label: 'Product' },
  { value: 'greeting', label: 'Greeting' },
  { value: 'code', label: 'Code' }
];

const CURSORS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#22d3ee', label: 'Cyan' },
  { value: '#f472b6', label: 'Pink' },
  { value: '#fafafa', label: 'White' }
];

const TypewriterTextDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'strings', type: 'string[]', default: '3 phrases', description: 'Phrases typed out in sequence.' },
      { name: 'typingSpeed', type: 'number', default: '70', description: 'Milliseconds per character while typing.' },
      { name: 'deletingSpeed', type: 'number', default: '40', description: 'Milliseconds per character while deleting.' },
      {
        name: 'pauseDuration',
        type: 'number',
        default: '1600',
        description: 'Pause (ms) holding a fully-typed phrase before deleting.'
      },
      { name: 'loop', type: 'boolean', default: 'true', description: 'Cycle through the phrases forever.' },
      { name: 'showCursor', type: 'boolean', default: 'true', description: 'Render the trailing caret.' },
      { name: 'cursorChar', type: 'string', default: "'|'", description: 'Character used for the caret.' },
      { name: 'cursorBlink', type: 'boolean', default: 'true', description: 'Blink the caret on a steady beat.' },
      { name: 'cursorColor', type: 'string', default: "'#6366f1'", description: 'Caret color.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={typewriterText}
      componentName="TypewriterText"
      demoOnlyProps={['phraseSet']}
      preview={({ props, key }) => {
        const { phraseSet, ...rest } = props;
        return <TypewriterText key={key} {...rest} strings={PHRASE_SETS[phraseSet] ?? PHRASE_SETS.product} />;
      }}
      controls={({ props, updateProp, forceRerender }) => (
        <>
          <PreviewSelect
            title="Phrases"
            options={PHRASES}
            value={props.phraseSet}
            onChange={v => {
              updateProp('phraseSet', v);
              forceRerender();
            }}
          />
          <PreviewSelect
            title="Cursor"
            options={CURSORS}
            value={props.cursorColor}
            onChange={v => updateProp('cursorColor', v)}
          />
          <PreviewSlider
            title="Typing speed"
            min={20}
            max={160}
            step={10}
            value={props.typingSpeed}
            valueUnit="ms"
            onChange={v => updateProp('typingSpeed', v)}
          />
          <PreviewSlider
            title="Deleting speed"
            min={10}
            max={120}
            step={10}
            value={props.deletingSpeed}
            valueUnit="ms"
            onChange={v => updateProp('deletingSpeed', v)}
          />
          <PreviewSlider
            title="Pause"
            min={400}
            max={3000}
            step={100}
            value={props.pauseDuration}
            valueUnit="ms"
            onChange={v => updateProp('pauseDuration', v)}
          />
          <PreviewSwitch title="Loop" isChecked={props.loop} onChange={v => updateProp('loop', v)} />
          <PreviewSwitch title="Show cursor" isChecked={props.showCursor} onChange={v => updateProp('showCursor', v)} />
          <PreviewSwitch title="Blink cursor" isChecked={props.cursorBlink} onChange={v => updateProp('cursorBlink', v)} />
        </>
      )}
    />
  );
};

export default TypewriterTextDemo;
