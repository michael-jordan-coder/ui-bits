import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import MoodPicker from '../../content/Components/MoodPicker/MoodPicker';
import { moodPicker } from '../../constants/code/Components/moodPickerCode';

const DEFAULT_PROPS = {
  defaultValue: 'okay',
  size: 56,
  gap: 14,
  showHero: true,
  showLabel: true,
  readOnly: false
};

const MOOD_OPTIONS = [
  { value: 'awful', label: 'Awful' },
  { value: 'bad', label: 'Bad' },
  { value: 'okay', label: 'Okay' },
  { value: 'good', label: 'Good' },
  { value: 'great', label: 'Great' }
];

const MoodPickerDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'moods',
        type: 'Mood[]',
        default: '[5 moods]',
        description: 'Mood options, each with id, label, color, and an 8-value border-radius shape.'
      },
      { name: 'defaultValue', type: 'string | null', default: "'okay'", description: 'Id of the initially selected mood.' },
      { name: 'size', type: 'number', default: '56', description: 'Diameter of each selectable mood blob, in px.' },
      { name: 'gap', type: 'number', default: '14', description: 'Space between mood blobs, in px.' },
      { name: 'showHero', type: 'boolean', default: 'true', description: 'Show the large blob that morphs to the active mood.' },
      { name: 'showLabel', type: 'boolean', default: 'true', description: 'Show the pop-in label of the active mood.' },
      { name: 'readOnly', type: 'boolean', default: 'false', description: 'Render as a static, non-interactive display.' },
      {
        name: 'onChange',
        type: '(id: string) => void',
        default: 'undefined',
        description: 'Fires with the mood id when a selection is committed.'
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
      codeObject={moodPicker}
      componentName="MoodPicker"
      preview={({ props, key }) => <MoodPicker key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect
              title="Selected"
              options={MOOD_OPTIONS}
              value={props.defaultValue}
              onChange={v => set('defaultValue', v)}
            />
            <PreviewSlider title="Size" min={36} max={88} value={props.size} valueUnit="px" onChange={v => set('size', v)} />
            <PreviewSlider title="Gap" min={4} max={40} value={props.gap} valueUnit="px" onChange={v => set('gap', v)} />
            <PreviewSwitch title="Show hero" isChecked={props.showHero} onChange={v => set('showHero', v)} />
            <PreviewSwitch title="Show label" isChecked={props.showLabel} onChange={v => set('showLabel', v)} />
            <PreviewSwitch title="Read only" isChecked={props.readOnly} onChange={v => set('readOnly', v)} />
          </>
        );
      }}
    />
  );
};

export default MoodPickerDemo;
