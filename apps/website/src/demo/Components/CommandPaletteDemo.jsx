import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import CommandPalette from '../../content/Components/CommandPalette/CommandPalette';
import { commandPalette } from '../../constants/code/Components/commandPaletteCode';

const DEFAULT_PROPS = {
  accentColor: '#6366f1',
  surfaceColor: '#16181d',
  showShortcuts: true,
  width: 420
};

const ACCENTS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#14b8a6', label: 'Teal' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#ec4899', label: 'Pink' }
];

const SURFACES = [
  { value: '#16181d', label: 'Ink' },
  { value: '#1c1c22', label: 'Charcoal' },
  { value: '#101418', label: 'Slate' }
];

const CommandPaletteDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'commands',
        type: 'CommandItem[]',
        default: '7 sample commands',
        description: 'Items to show, each with id, label, optional group, shortcut, and lucide icon.'
      },
      { name: 'placeholder', type: 'string', default: "'Type a command or search…'", description: 'Search input placeholder.' },
      { name: 'accentColor', type: 'string', default: "'#6366f1'", description: 'Color of the selection highlight and matched text.' },
      { name: 'surfaceColor', type: 'string', default: "'#16181d'", description: 'Background of the palette.' },
      { name: 'emptyMessage', type: 'string', default: "'No results found.'", description: 'Shown when no command matches.' },
      { name: 'showShortcuts', type: 'boolean', default: 'true', description: 'Render each command’s keyboard shortcut.' },
      { name: 'width', type: 'number', default: '420', description: 'Width of the palette, in px.' },
      { name: 'onSelect', type: '(id: string) => void', default: 'undefined', description: 'Fires with the command id on select.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={commandPalette}
      componentName="CommandPalette"
      preview={({ props, key }) => <CommandPalette key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, value) => {
          updateProp(name, value);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Width" min={320} max={480} value={props.width} valueUnit="px" onChange={v => set('width', v)} />
            <PreviewSelect title="Accent" options={ACCENTS} value={props.accentColor} onChange={v => set('accentColor', v)} />
            <PreviewSelect title="Surface" options={SURFACES} value={props.surfaceColor} onChange={v => set('surfaceColor', v)} />
            <PreviewSwitch title="Show shortcuts" isChecked={props.showShortcuts} onChange={v => set('showShortcuts', v)} />
          </>
        );
      }}
    />
  );
};

export default CommandPaletteDemo;
