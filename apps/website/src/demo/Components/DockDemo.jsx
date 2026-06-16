import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import Dock from '../../content/Components/Dock/Dock';
import { dock } from '../../constants/code/Components/dockCode';

const DEFAULT_PROPS = {
  baseItemSize: 48,
  magnification: 80,
  distance: 150,
  accentColor: '#6366f1',
  showLabels: true
};

const ACCENTS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#22d3ee', label: 'Cyan' },
  { value: '#22c55e', label: 'Green' },
  { value: '#f59e0b', label: 'Amber' }
];

const DockDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'items',
        type: 'DockItem[]',
        default: '6 sample apps',
        description: 'Tiles to render: { label, icon, active?, onClick?, id? }.'
      },
      { name: 'baseItemSize', type: 'number', default: '48', description: 'Resting tile size in px.' },
      { name: 'magnification', type: 'number', default: '80', description: 'Maximum tile size under the cursor, in px.' },
      {
        name: 'distance',
        type: 'number',
        default: '150',
        description: 'Cursor distance (px) over which magnification falls off.'
      },
      { name: 'accentColor', type: 'string', default: "'#6366f1'", description: 'Color of the "running app" dot.' },
      { name: 'showLabels', type: 'boolean', default: 'true', description: 'Show the tooltip label on hover/focus.' },
      { name: 'ariaLabel', type: 'string', default: "'Application dock'", description: 'Accessible label for the toolbar.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the dock panel.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={dock}
      componentName="Dock"
      preview={({ props, key }) => <Dock key={key} {...props} />}
      controls={({ props, updateProp }) => (
        <>
          <PreviewSelect
            title="Accent"
            options={ACCENTS}
            value={props.accentColor}
            onChange={v => updateProp('accentColor', v)}
          />
          <PreviewSlider
            title="Base size"
            min={36}
            max={64}
            step={2}
            value={props.baseItemSize}
            valueUnit="px"
            onChange={v => updateProp('baseItemSize', v)}
          />
          <PreviewSlider
            title="Magnification"
            min={64}
            max={120}
            step={4}
            value={props.magnification}
            valueUnit="px"
            onChange={v => updateProp('magnification', v)}
          />
          <PreviewSlider
            title="Distance"
            min={80}
            max={240}
            step={10}
            value={props.distance}
            valueUnit="px"
            onChange={v => updateProp('distance', v)}
          />
          <PreviewSwitch title="Show labels" isChecked={props.showLabels} onChange={v => updateProp('showLabels', v)} />
        </>
      )}
    />
  );
};

export default DockDemo;
