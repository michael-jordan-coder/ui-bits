import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import SpeedDial from '../../content/Components/SpeedDial/SpeedDial';
import { speedDial } from '../../constants/code/Components/speedDialCode';

const DEFAULT_PROPS = {
  actions: [
    { label: 'Share', icon: 'share' },
    { label: 'Copy', icon: 'copy' },
    { label: 'Favorite', icon: 'heart' },
    { label: 'Edit', icon: 'edit' }
  ],
  direction: 'up',
  openOnHover: false,
  accentColor: '#6366f1',
  surfaceColor: '#1c1c22'
};

const DIRECTIONS = [
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' },
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
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

const SpeedDialDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'actions',
        type: 'Array<{ label: string; icon: string }>',
        default: '4 actions',
        description: "Buttons to fan out. `icon` is a lucide name: 'share' | 'copy' | 'heart' | 'star' | 'trash' | 'edit' | 'download' | 'plus'."
      },
      {
        name: 'direction',
        type: "'up' | 'down' | 'left' | 'right'",
        default: "'up'",
        description: 'Axis the actions fan out along.'
      },
      {
        name: 'openOnHover',
        type: 'boolean',
        default: 'false',
        description: 'Open on pointer hover instead of click toggle.'
      },
      { name: 'accentColor', type: 'string', default: "'#6366f1'", description: 'Background of the main FAB.' },
      { name: 'surfaceColor', type: 'string', default: "'#1c1c22'", description: 'Background of action buttons and tooltips.' },
      {
        name: 'onAction',
        type: '(index: number) => void',
        default: 'undefined',
        description: 'Fires with the clicked action index, then closes.'
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
      codeObject={speedDial}
      componentName="SpeedDial"
      preview={({ props, key }) => <SpeedDial key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, value) => {
          updateProp(name, value);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect title="Direction" options={DIRECTIONS} value={props.direction} onChange={v => set('direction', v)} />
            <PreviewSwitch title="Open on hover" isChecked={props.openOnHover} onChange={v => set('openOnHover', v)} />
            <PreviewSelect title="Accent" options={ACCENTS} value={props.accentColor} onChange={v => set('accentColor', v)} />
            <PreviewSelect title="Surface" options={SURFACES} value={props.surfaceColor} onChange={v => set('surfaceColor', v)} />
          </>
        );
      }}
    />
  );
};

export default SpeedDialDemo;
