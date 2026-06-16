import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import Toast from '../../content/Components/Toast/Toast';
import { toast } from '../../constants/code/Components/toastCode';

const DEFAULT_PROPS = {
  position: 'bottom-right',
  maxVisible: 3,
  duration: 4000,
  expandOnHover: true,
  triggerLabel: 'Send notification'
};

const POSITIONS = [
  { value: 'bottom-right', label: 'Bottom right' },
  { value: 'bottom-left', label: 'Bottom left' },
  { value: 'top-right', label: 'Top right' },
  { value: 'top-left', label: 'Top left' }
];

const ToastDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'position',
        type: "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'",
        default: "'bottom-right'",
        description: 'Corner the stack is anchored to.'
      },
      {
        name: 'maxVisible',
        type: 'number',
        default: '3',
        description: 'How many toasts peek out before the rest fade behind.'
      },
      { name: 'duration', type: 'number', default: '4000', description: 'Auto-dismiss delay in ms (paused on hover).' },
      {
        name: 'expandOnHover',
        type: 'boolean',
        default: 'true',
        description: 'Fan the stack apart and pause timers on hover.'
      },
      {
        name: 'triggerLabel',
        type: 'string',
        default: "'Send notification'",
        description: 'Label of the demo button.'
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
      codeObject={toast}
      componentName="Toast"
      flexProps={{ minH: '460px' }}
      preview={({ props, key }) => <Toast key={key} {...props} />}
      controls={({ props, updateProp }) => (
        <>
          <PreviewSelect
            title="Position"
            options={POSITIONS}
            value={props.position}
            onChange={v => updateProp('position', v)}
          />
          <PreviewSlider
            title="Max visible"
            min={1}
            max={5}
            value={props.maxVisible}
            onChange={v => updateProp('maxVisible', v)}
          />
          <PreviewSlider
            title="Duration"
            min={1500}
            max={7000}
            step={500}
            value={props.duration}
            valueUnit="ms"
            onChange={v => updateProp('duration', v)}
          />
          <PreviewSwitch
            title="Expand on hover"
            isChecked={props.expandOnHover}
            onChange={v => updateProp('expandOnHover', v)}
          />
        </>
      )}
    />
  );
};

export default ToastDemo;
