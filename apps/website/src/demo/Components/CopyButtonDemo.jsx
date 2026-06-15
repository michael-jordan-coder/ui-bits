import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import CopyButton from '../../content/Components/CopyButton/CopyButton';
import { copyButton } from '../../constants/code/Components/copyButtonCode';

const DEFAULT_PROPS = {
  value: 'npm i ui-bits',
  label: 'Copy',
  copiedLabel: 'Copied!',
  timeout: 1600,
  showIcon: true,
  accentColor: '#22c55e'
};

const ACCENTS = [
  { value: '#22c55e', label: 'Green' },
  { value: '#6366f1', label: 'Indigo' },
  { value: '#38bdf8', label: 'Sky' },
  { value: '#f59e0b', label: 'Amber' }
];

const LABELS = [
  { value: 'Copy', label: 'Copy' },
  { value: 'Copy code', label: 'Copy code' },
  { value: 'Copy link', label: 'Copy link' }
];

const CopyButtonDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'value', type: 'string', default: "''", description: 'The text written to the clipboard.' },
      { name: 'label', type: 'string', default: "'Copy'", description: 'Resting label.' },
      { name: 'copiedLabel', type: 'string', default: "'Copied!'", description: 'Label shown after copying.' },
      { name: 'timeout', type: 'number', default: '1600', description: 'How long the copied state lasts, in ms.' },
      { name: 'showIcon', type: 'boolean', default: 'true', description: 'Show the clipboard/check icon.' },
      {
        name: 'accentColor',
        type: 'string',
        default: "'#22c55e'",
        description: 'Color of the copied state and pulse ring.'
      },
      {
        name: 'onCopy',
        type: '(value: string) => void',
        default: 'undefined',
        description: 'Fires after a copy attempt.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the button.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={copyButton}
      componentName="CopyButton"
      preview={({ props, key }) => <CopyButton key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect title="Label" options={LABELS} value={props.label} onChange={v => set('label', v)} />
            <PreviewSelect
              title="Accent"
              options={ACCENTS}
              value={props.accentColor}
              onChange={v => updateProp('accentColor', v)}
            />
            <PreviewSlider
              title="Timeout"
              min={600}
              max={3000}
              step={100}
              value={props.timeout}
              valueUnit="ms"
              onChange={v => updateProp('timeout', v)}
            />
            <PreviewSwitch
              title="Show icon"
              isChecked={props.showIcon}
              onChange={v => set('showIcon', v)}
            />
          </>
        );
      }}
    />
  );
};

export default CopyButtonDemo;
