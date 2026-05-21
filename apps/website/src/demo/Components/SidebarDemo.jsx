import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import Sidebar from '../../content/Components/Sidebar/Sidebar';
import { sidebar } from '../../constants/code/Components/sidebarCode';

const DEFAULT_PROPS = {
  defaultCollapsed: false,
  defaultWidth: 240,
  minWidth: 200,
  maxWidth: 380,
  brand: 'Acme',
  accentColor: '#a855f7',
  surfaceColor: '#15121c'
};

const ACCENT_OPTIONS = [
  { label: 'Purple', value: '#a855f7' },
  { label: 'Cyan', value: '#06b6d4' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Mint', value: '#3ccb91' },
  { label: 'Coral', value: '#f43f5e' },
  { label: 'Ink', value: '#52525b' }
];

const SURFACE_OPTIONS = [
  { label: 'Plum', value: '#15121c' },
  { label: 'Carbon', value: '#0f0f12' },
  { label: 'Slate', value: '#161b22' },
  { label: 'Espresso', value: '#1a130f' },
  { label: 'Paper', value: '#1d1b18' }
];

const SidebarDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'items',
        type: 'SidebarItem[]',
        default: '[Home, Inbox, Projects, Calendar, Team, Settings]',
        description: 'Nav items. Each item has `id`, `label`, `icon` (Lucide component), and optional `badge`.'
      },
      {
        name: 'brand',
        type: 'string',
        default: "'Acme'",
        description: 'Brand label rendered in the header. The first character is used as the brand mark glyph.'
      },
      {
        name: 'defaultCollapsed',
        type: 'boolean',
        default: 'false',
        description: 'Whether the sidebar starts in the icon-only collapsed state.'
      },
      {
        name: 'defaultWidth',
        type: 'number',
        default: '240',
        description: 'Initial width in pixels when expanded.'
      },
      {
        name: 'minWidth',
        type: 'number',
        default: '200',
        description: 'Minimum width allowed during resize.'
      },
      {
        name: 'maxWidth',
        type: 'number',
        default: '380',
        description: 'Maximum width allowed during resize.'
      },
      {
        name: 'accentColor',
        type: 'string',
        default: "'#a855f7'",
        description: 'Drives the brand mark, badge, active item tint, focus rings, and resize handle line.'
      },
      {
        name: 'surfaceColor',
        type: 'string',
        default: "'#15121c'",
        description: 'Sidebar background. Hover and active states are mixed from accent and surface.'
      },
      {
        name: 'activeId',
        type: 'string',
        default: '—',
        description: 'Controlled active item id. When omitted the sidebar manages its own selection state.'
      },
      {
        name: 'onItemClick',
        type: '(id: string) => void',
        default: '—',
        description: 'Fires when a nav item is clicked.'
      },
      {
        name: 'onCollapsedChange',
        type: '(collapsed: boolean) => void',
        default: '—',
        description: 'Fires when the collapse button is toggled.'
      },
      {
        name: 'className',
        type: 'string',
        default: "''",
        description: 'Additional classes merged onto the root element.'
      }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['lucide-react', 'tailwind-merge']}
      codeObject={sidebar}
      componentName="Sidebar"
      flexProps={{ justifyContent: 'flex-start', alignItems: 'stretch', minH: '520px' }}
      preview={({ props, key }) => <Sidebar key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect
              title="Accent color"
              name="sidebar-accent"
              value={props.accentColor}
              options={ACCENT_OPTIONS}
              onChange={v => set('accentColor', v)}
            />
            <PreviewSelect
              title="Surface"
              name="sidebar-surface"
              value={props.surfaceColor}
              options={SURFACE_OPTIONS}
              onChange={v => set('surfaceColor', v)}
            />
            <PreviewSwitch
              title="Start collapsed"
              isChecked={props.defaultCollapsed}
              onChange={v => set('defaultCollapsed', v)}
            />
            <PreviewSlider
              title="Default width"
              min={props.minWidth}
              max={props.maxWidth}
              step={10}
              value={props.defaultWidth}
              valueUnit="px"
              onChange={v => set('defaultWidth', v)}
            />
            <PreviewSlider
              title="Min width"
              min={160}
              max={260}
              step={10}
              value={props.minWidth}
              valueUnit="px"
              onChange={v => set('minWidth', v)}
            />
            <PreviewSlider
              title="Max width"
              min={280}
              max={480}
              step={10}
              value={props.maxWidth}
              valueUnit="px"
              onChange={v => set('maxWidth', v)}
            />
          </>
        );
      }}
    />
  );
};

export default SidebarDemo;
