import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import Stepper from '../../content/Components/Stepper/Stepper';
import { stepper } from '../../constants/code/Components/stepperCode';

const DEFAULT_PROPS = {
  defaultValue: 1,
  min: 0,
  max: 99,
  step: 1,
  accentColor: '#6366f1',
  surfaceColor: '#1c1c22',
  holdToAccelerate: true
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

const StepperDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'value', type: 'number', default: 'undefined', description: 'Controlled value. Omit to run uncontrolled.' },
      { name: 'defaultValue', type: 'number', default: '1', description: 'Initial value when uncontrolled.' },
      { name: 'min', type: 'number', default: '0', description: 'Lowest allowed value.' },
      { name: 'max', type: 'number', default: '99', description: 'Highest allowed value.' },
      { name: 'step', type: 'number', default: '1', description: 'Amount added or removed per step.' },
      { name: 'accentColor', type: 'string', default: "'#6366f1'", description: 'Color of the −/+ glyphs.' },
      { name: 'surfaceColor', type: 'string', default: "'#1c1c22'", description: 'Background of the control.' },
      {
        name: 'holdToAccelerate',
        type: 'boolean',
        default: 'true',
        description: 'Press and hold a button to repeat at an accelerating rate.'
      },
      { name: 'onChange', type: '(value: number) => void', default: 'undefined', description: 'Fires with the new value.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={stepper}
      componentName="Stepper"
      preview={({ props, key }) => <Stepper key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, value) => {
          updateProp(name, value);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Step" min={1} max={10} value={props.step} onChange={v => set('step', v)} />
            <PreviewSlider title="Max" min={10} max={999} value={props.max} onChange={v => set('max', v)} />
            <PreviewSelect title="Accent" options={ACCENTS} value={props.accentColor} onChange={v => set('accentColor', v)} />
            <PreviewSelect title="Surface" options={SURFACES} value={props.surfaceColor} onChange={v => set('surfaceColor', v)} />
            <PreviewSwitch
              title="Hold to accelerate"
              isChecked={props.holdToAccelerate}
              onChange={v => set('holdToAccelerate', v)}
            />
          </>
        );
      }}
    />
  );
};

export default StepperDemo;
