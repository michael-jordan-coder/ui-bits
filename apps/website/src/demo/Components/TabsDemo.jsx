import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import Tabs from '../../content/Components/Tabs/Tabs';
import { tabs } from '../../constants/code/Components/tabsCode';

const DEFAULT_PROPS = {
  items: [
    { label: 'Overview', content: 'A quick summary of what this panel is about, shown the moment the tab becomes active.' },
    { label: 'Activity', content: 'Recent events and updates stream into this panel as soon as you switch to it.' },
    { label: 'Settings', content: 'Tweak preferences here — each tab crossfades smoothly into the next one.' }
  ],
  defaultIndex: 0,
  variant: 'underline',
  accentColor: '#6366f1',
  surfaceColor: '#1c1c22'
};

const VARIANTS = [
  { value: 'underline', label: 'Underline' },
  { value: 'pill', label: 'Pill' }
];

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

const TabsDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'items',
        type: 'Array<{ label: string; content: string }>',
        default: '[3 items]',
        description: 'Tabs to render. Each item provides a label and panel content.'
      },
      { name: 'defaultIndex', type: 'number', default: '0', description: 'Index of the tab selected on mount.' },
      {
        name: 'variant',
        type: "'underline' | 'pill'",
        default: "'underline'",
        description: 'Sliding accent bar under the active tab, or a pill behind it.'
      },
      { name: 'accentColor', type: 'string', default: "'#6366f1'", description: 'Color of the active indicator and label.' },
      { name: 'surfaceColor', type: 'string', default: "'#1c1c22'", description: 'Background of the control.' },
      {
        name: 'onChange',
        type: '(index: number) => void',
        default: 'undefined',
        description: 'Fires with the new index when the active tab changes.'
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
      codeObject={tabs}
      componentName="Tabs"
      preview={({ props, key }) => <Tabs key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, value) => {
          updateProp(name, value);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect title="Variant" options={VARIANTS} value={props.variant} onChange={v => set('variant', v)} />
            <PreviewSelect title="Accent" options={ACCENTS} value={props.accentColor} onChange={v => set('accentColor', v)} />
            <PreviewSelect title="Surface" options={SURFACES} value={props.surfaceColor} onChange={v => set('surfaceColor', v)} />
          </>
        );
      }}
    />
  );
};

export default TabsDemo;
