import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import Accordion from '../../content/Components/Accordion/Accordion';
import { accordion } from '../../constants/code/Components/accordionCode';

const DEFAULT_PROPS = {
  singleOpen: true,
  defaultOpen: 0,
  accentColor: '#6366f1'
};

// Sample disclosure content passed as the `items` prop.
const ITEMS = [
  {
    title: 'What is ui bits?',
    content:
      'A collection of animated, interactive React components you copy straight into your project — no package to install, just source you own.'
  },
  {
    title: 'How are components delivered?',
    content:
      'Every component ships in four interchangeable variants: JavaScript or TypeScript, styled with plain CSS or Tailwind. Pick the one that matches your stack.'
  },
  {
    title: 'Can I customize the animations?',
    content:
      'Yes. Each component exposes real props for colors, sizing, and timing, and everything respects the prefers-reduced-motion setting out of the box.'
  }
];

const ACCENTS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#22c55e', label: 'Green' },
  { value: '#f97316', label: 'Orange' },
  { value: '#e11d48', label: 'Rose' }
];

const DEFAULT_OPEN_OPTIONS = [
  { value: -1, label: 'None' },
  { value: 0, label: 'First' },
  { value: 1, label: 'Second' },
  { value: 2, label: 'Third' }
];

const AccordionDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'items',
        type: '{ title: ReactNode; content: ReactNode }[]',
        default: '[]',
        description: 'The disclosure rows to render.'
      },
      {
        name: 'singleOpen',
        type: 'boolean',
        default: 'true',
        description: 'Allow only one panel open at a time.'
      },
      {
        name: 'defaultOpen',
        type: 'number | null',
        default: '0',
        description: 'Index open on mount (-1 / null for none).'
      },
      {
        name: 'accentColor',
        type: 'string',
        default: "'#6366f1'",
        description: 'Color of the open title and chevron.'
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
      codeObject={accordion}
      componentName="Accordion"
      preview={({ props, key }) => <Accordion key={key} items={ITEMS} {...props} />}
      controls={({ props, updateProp, forceRerender }) => (
        <>
          <PreviewSwitch title="Single open" isChecked={props.singleOpen} onChange={v => updateProp('singleOpen', v)} />
          <PreviewSelect
            title="Default open"
            options={DEFAULT_OPEN_OPTIONS}
            value={props.defaultOpen}
            onChange={v => {
              updateProp('defaultOpen', v);
              forceRerender();
            }}
          />
          <PreviewSelect
            title="Accent"
            options={ACCENTS}
            value={props.accentColor}
            onChange={v => updateProp('accentColor', v)}
          />
        </>
      )}
    />
  );
};

export default AccordionDemo;
