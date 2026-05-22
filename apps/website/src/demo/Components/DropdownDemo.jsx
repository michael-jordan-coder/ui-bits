import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import Dropdown from '../../content/Components/Dropdown/Dropdown';
import { dropdown } from '../../constants/code/Components/dropdownCode';

const DEFAULT_PROPS = {
  defaultValue: 'fra1',
  placeholder: 'Select a region',
  accentColor: '#ffffff',
  surfaceColor: '#141415',
  disabled: false
};

const ACCENT_OPTIONS = [
  { label: 'Neutral', value: '#ffffff' },
  { label: 'Lilac mist', value: '#f2e4ff' },
  { label: 'Purple', value: '#a855f7' },
  { label: 'Cyan', value: '#06b6d4' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Mint', value: '#3ccb91' }
];

const SURFACE_OPTIONS = [
  { label: 'Carbon', value: '#141415' },
  { label: 'Plum', value: '#15121c' },
  { label: 'Slate', value: '#161b22' },
  { label: 'Espresso', value: '#1a130f' }
];

const DropdownDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'options',
        type: 'DropdownOption[]',
        default: '[Region presets]',
        description:
          'Each option has `label`, `value`, optional `description` (rendered as secondary text), and optional `disabled`.'
      },
      {
        name: 'value',
        type: 'string',
        default: '—',
        description: 'Controlled selected value. When omitted the dropdown manages its own selection state.'
      },
      {
        name: 'defaultValue',
        type: 'string',
        default: '—',
        description: 'Initial value in uncontrolled mode.'
      },
      {
        name: 'onChange',
        type: '(value: string) => void',
        default: '—',
        description: 'Fires when a new value is committed.'
      },
      {
        name: 'placeholder',
        type: 'string',
        default: "'Select an option'",
        description: 'Shown in the trigger when no value is selected.'
      },
      {
        name: 'accentColor',
        type: 'string',
        default: "'#ffffff'",
        description:
          'Drives the open border, chevron tint, focus outline, selected check, and option highlight. Defaults to a neutral white tone for a monochrome look.'
      },
      {
        name: 'surfaceColor',
        type: 'string',
        default: "'#141415'",
        description: 'Trigger background; the panel surface is mixed from this with a touch of white.'
      },
      {
        name: 'disabled',
        type: 'boolean',
        default: 'false',
        description: 'Disables the trigger and prevents the panel from opening.'
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
      codeObject={dropdown}
      componentName="Dropdown"
      flexProps={{ alignItems: 'flex-start', justifyContent: 'center', minH: '420px', pt: '60px' }}
      preview={({ props, key }) => <Dropdown key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect
              title="Accent color"
              name="dropdown-accent"
              value={props.accentColor}
              options={ACCENT_OPTIONS}
              onChange={v => set('accentColor', v)}
            />
            <PreviewSelect
              title="Surface"
              name="dropdown-surface"
              value={props.surfaceColor}
              options={SURFACE_OPTIONS}
              onChange={v => set('surfaceColor', v)}
            />
            <PreviewSwitch
              title="Disabled"
              isChecked={props.disabled}
              onChange={v => set('disabled', v)}
            />
          </>
        );
      }}
    />
  );
};

export default DropdownDemo;
