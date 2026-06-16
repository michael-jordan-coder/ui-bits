import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import TagInput from '../../content/Components/TagInput/TagInput';
import { tagInput } from '../../constants/code/Components/tagInputCode';

const DEFAULT_PROPS = {
  defaultTags: ['design', 'react', 'motion'],
  placeholder: 'Add a tag…',
  maxTags: 8,
  allowDuplicates: false,
  accentColor: '#6366f1',
  surfaceColor: '#1c1c22'
};

const ACCENTS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#14b8a6', label: 'Teal' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#ec4899', label: 'Pink' }
];

const SURFACES = [
  { value: '#1c1c22', label: 'Charcoal' },
  { value: '#16181d', label: 'Ink' },
  { value: '#101418', label: 'Slate' }
];

const TagInputDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'defaultTags',
        type: 'string[]',
        default: "['design', 'react', 'motion']",
        description: 'Initial tags seeding the uncontrolled internal state.'
      },
      { name: 'placeholder', type: 'string', default: "'Add a tag…'", description: 'Placeholder shown when no tags exist.' },
      { name: 'maxTags', type: 'number', default: '8', description: 'Maximum number of tags; the field hides when reached.' },
      {
        name: 'allowDuplicates',
        type: 'boolean',
        default: 'false',
        description: 'Allow committing a tag that already exists.'
      },
      { name: 'accentColor', type: 'string', default: "'#6366f1'", description: 'Accent for chips and the focus ring.' },
      { name: 'surfaceColor', type: 'string', default: "'#1c1c22'", description: 'Background of the field.' },
      {
        name: 'onChange',
        type: '(tags: string[]) => void',
        default: 'undefined',
        description: 'Fires with the full tag list after any add or remove.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={tagInput}
      componentName="TagInput"
      preview={({ props, key }) => <TagInput key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, value) => {
          updateProp(name, value);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Max tags" min={3} max={12} value={props.maxTags} onChange={v => set('maxTags', v)} />
            <PreviewSwitch
              title="Allow duplicates"
              isChecked={props.allowDuplicates}
              onChange={v => set('allowDuplicates', v)}
            />
            <PreviewSelect title="Accent" options={ACCENTS} value={props.accentColor} onChange={v => set('accentColor', v)} />
            <PreviewSelect title="Surface" options={SURFACES} value={props.surfaceColor} onChange={v => set('surfaceColor', v)} />
          </>
        );
      }}
    />
  );
};

export default TagInputDemo;
