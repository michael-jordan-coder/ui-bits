import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import ReorderList from '../../content/Components/ReorderList/ReorderList';
import { reorderList } from '../../constants/code/Components/reorderListCode';

const DEFAULT_PROPS = {
  accentColor: '#6366f1',
  surfaceColor: '#1c1c22',
  gap: 10,
  width: 380,
  handleOnly: false
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

const ReorderListDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'items',
        type: 'ReorderListItem[]',
        default: '5 sample items',
        description: 'List items to reorder, each with an id and label.'
      },
      { name: 'accentColor', type: 'string', default: "'#6366f1'", description: 'Color of the drag handle.' },
      { name: 'surfaceColor', type: 'string', default: "'#1c1c22'", description: 'Background of each row.' },
      { name: 'gap', type: 'number', default: '10', description: 'Vertical gap between rows, in px.' },
      { name: 'width', type: 'number', default: '380', description: 'Width of the list, in px.' },
      {
        name: 'handleOnly',
        type: 'boolean',
        default: 'false',
        description: 'Restrict dragging to the grip handle instead of the whole row.'
      },
      {
        name: 'onReorder',
        type: '(items: ReorderListItem[]) => void',
        default: 'undefined',
        description: 'Fires with the new order after a drag or arrow-key move.'
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
      codeObject={reorderList}
      componentName="ReorderList"
      preview={({ props, key }) => <ReorderList key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, value) => {
          updateProp(name, value);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Width" min={300} max={460} value={props.width} valueUnit="px" onChange={v => set('width', v)} />
            <PreviewSlider title="Gap" min={4} max={20} value={props.gap} valueUnit="px" onChange={v => set('gap', v)} />
            <PreviewSelect title="Accent" options={ACCENTS} value={props.accentColor} onChange={v => set('accentColor', v)} />
            <PreviewSelect title="Surface" options={SURFACES} value={props.surfaceColor} onChange={v => set('surfaceColor', v)} />
            <PreviewSwitch title="Handle only" isChecked={props.handleOnly} onChange={v => set('handleOnly', v)} />
          </>
        );
      }}
    />
  );
};

export default ReorderListDemo;
