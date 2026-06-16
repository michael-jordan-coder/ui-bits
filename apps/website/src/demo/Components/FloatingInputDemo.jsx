import { useMemo } from 'react';
import { Mail } from 'lucide-react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import FloatingInput from '../../content/Components/FloatingInput/FloatingInput';
import { floatingInput } from '../../constants/code/Components/floatingInputCode';

const DEFAULT_PROPS = {
  label: 'Email address',
  type: 'text',
  accentColor: '#6366f1',
  helperText: "We'll never share your email.",
  disabled: false,
  withIcon: true,
  errored: false,
  prefill: ''
};

const LABELS = [
  { value: 'Email address', label: 'Email address' },
  { value: 'Full name', label: 'Full name' },
  { value: 'Password', label: 'Password' },
  { value: 'Search', label: 'Search' }
];

const TYPES = [
  { value: 'text', label: 'text' },
  { value: 'email', label: 'email' },
  { value: 'password', label: 'password' }
];

const ACCENTS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#22c55e', label: 'Green' },
  { value: '#f59e0b', label: 'Amber' }
];

const PREFILL = [
  { value: '', label: 'Empty' },
  { value: 'jane@acme.com', label: 'Filled' }
];

const FloatingInputDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'label', type: 'string', default: "'Email address'", description: 'Floating label text.' },
      {
        name: 'type',
        type: 'string',
        default: "'text'",
        description: 'Native input type. `password` adds a reveal toggle.'
      },
      {
        name: 'defaultValue',
        type: 'string',
        default: "''",
        description: 'Initial value (the field is uncontrolled).'
      },
      { name: 'helperText', type: 'string', default: "''", description: 'Hint shown beneath the field.' },
      {
        name: 'error',
        type: 'string',
        default: "''",
        description: 'When set, the field turns red and shows this message instead of the helper.'
      },
      { name: 'accentColor', type: 'string', default: "'#6366f1'", description: 'Focused label, underline, and caret color.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Dim and disable the field.' },
      { name: 'icon', type: 'ReactNode', default: 'null', description: 'Optional leading icon.' },
      {
        name: 'onChange',
        type: '(e: ChangeEvent) => void',
        default: 'undefined',
        description: 'Fires on every keystroke.'
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
      codeObject={floatingInput}
      componentName="FloatingInput"
      demoOnlyProps={['withIcon', 'errored', 'prefill']}
      preview={({ props, key }) => {
        const { withIcon, errored, prefill, ...rest } = props;
        return (
          <FloatingInput
            key={key}
            {...rest}
            defaultValue={prefill}
            error={errored ? 'Please enter a valid email address.' : ''}
            icon={withIcon ? <Mail size={18} /> : null}
          />
        );
      }}
      controls={({ props, updateProp, forceRerender }) => (
        <>
          <PreviewSelect title="Label" options={LABELS} value={props.label} onChange={v => updateProp('label', v)} />
          <PreviewSelect title="Type" options={TYPES} value={props.type} onChange={v => updateProp('type', v)} />
          <PreviewSelect
            title="Accent"
            options={ACCENTS}
            value={props.accentColor}
            onChange={v => updateProp('accentColor', v)}
          />
          <PreviewSelect
            title="Prefill"
            options={PREFILL}
            value={props.prefill}
            onChange={v => {
              updateProp('prefill', v);
              forceRerender();
            }}
          />
          <PreviewSwitch title="Leading icon" isChecked={props.withIcon} onChange={v => updateProp('withIcon', v)} />
          <PreviewSwitch title="Error state" isChecked={props.errored} onChange={v => updateProp('errored', v)} />
          <PreviewSwitch title="Disabled" isChecked={props.disabled} onChange={v => updateProp('disabled', v)} />
        </>
      )}
    />
  );
};

export default FloatingInputDemo;
