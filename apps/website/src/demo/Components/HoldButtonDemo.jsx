import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import HoldButton from '../../content/Components/HoldButton/HoldButton';
import { holdButton } from '../../constants/code/Components/holdButtonCode';

const DEFAULT_PROPS = {
  label: 'Hold to delete',
  confirmedLabel: 'Deleted',
  duration: 1200,
  accentColor: '#ef4444',
  size: 'md',
  showIcon: true,
  autoReset: true
};

const ACCENTS = [
  { value: '#ef4444', label: 'Red' },
  { value: '#6366f1', label: 'Indigo' },
  { value: '#22c55e', label: 'Green' },
  { value: '#f59e0b', label: 'Amber' }
];

const SIZES = [
  { value: 'sm', label: 'Small' },
  { value: 'md', label: 'Medium' },
  { value: 'lg', label: 'Large' }
];

const HoldButtonDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'label', type: 'string', default: "'Hold to confirm'", description: 'Text shown in the resting state.' },
      {
        name: 'confirmedLabel',
        type: 'string',
        default: "'Confirmed'",
        description: 'Text shown once the hold completes.'
      },
      { name: 'duration', type: 'number', default: '1200', description: 'How long the hold must last, in ms.' },
      { name: 'accentColor', type: 'string', default: "'#ef4444'", description: 'Fill, border, and pulse color.' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size preset.' },
      { name: 'showIcon', type: 'boolean', default: 'true', description: 'Show the leading trash / check icon.' },
      {
        name: 'autoReset',
        type: 'boolean',
        default: 'true',
        description: 'Return to the resting state after confirming.'
      },
      { name: 'resetDelay', type: 'number', default: '1600', description: 'Delay before auto-reset, in ms.' },
      {
        name: 'onConfirm',
        type: '() => void',
        default: 'undefined',
        description: 'Fires once the hold reaches completion.'
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disable the button.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the button.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={holdButton}
      componentName="HoldButton"
      preview={({ props, key }) => <HoldButton key={key} {...props} />}
      controls={({ props, updateProp }) => (
        <>
          <PreviewSelect title="Size" options={SIZES} value={props.size} onChange={v => updateProp('size', v)} />
          <PreviewSelect
            title="Accent"
            options={ACCENTS}
            value={props.accentColor}
            onChange={v => updateProp('accentColor', v)}
          />
          <PreviewSlider
            title="Duration"
            min={600}
            max={3000}
            step={100}
            value={props.duration}
            valueUnit="ms"
            onChange={v => updateProp('duration', v)}
          />
          <PreviewSwitch title="Show icon" isChecked={props.showIcon} onChange={v => updateProp('showIcon', v)} />
          <PreviewSwitch title="Auto reset" isChecked={props.autoReset} onChange={v => updateProp('autoReset', v)} />
        </>
      )}
    />
  );
};

export default HoldButtonDemo;
