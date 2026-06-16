import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import MagneticButton from '../../content/Components/MagneticButton/MagneticButton';
import { magneticButton } from '../../constants/code/Components/magneticButtonCode';

const DEFAULT_PROPS = {
  label: 'Get started',
  strength: 0.4,
  radius: 120,
  scaleOnHover: 1.05,
  accentColor: '#6366f1',
  showArrow: true
};

const ACCENTS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#22c55e', label: 'Green' },
  { value: '#f59e0b', label: 'Amber' }
];

const LABELS = [
  { value: 'Get started', label: 'Get started' },
  { value: 'Book a demo', label: 'Book a demo' },
  { value: 'Say hello', label: 'Say hello' }
];

const MagneticButtonDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'label', type: 'string', default: "'Get started'", description: 'Button text.' },
      {
        name: 'strength',
        type: 'number',
        default: '0.4',
        description: 'Fraction of the cursor offset the button follows (0–1).'
      },
      { name: 'radius', type: 'number', default: '120', description: 'Activation radius around the button, in px.' },
      {
        name: 'scaleOnHover',
        type: 'number',
        default: '1.05',
        description: 'Scale applied while the field is active.'
      },
      { name: 'accentColor', type: 'string', default: "'#6366f1'", description: 'Button background color.' },
      { name: 'showArrow', type: 'boolean', default: 'true', description: 'Show the trailing arrow icon.' },
      {
        name: 'onClick',
        type: '(e: MouseEvent) => void',
        default: 'undefined',
        description: 'Fires when the button is pressed.'
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
      codeObject={magneticButton}
      componentName="MagneticButton"
      preview={({ props, key }) => <MagneticButton key={key} {...props} />}
      controls={({ props, updateProp }) => (
        <>
          <PreviewSelect title="Label" options={LABELS} value={props.label} onChange={v => updateProp('label', v)} />
          <PreviewSelect
            title="Accent"
            options={ACCENTS}
            value={props.accentColor}
            onChange={v => updateProp('accentColor', v)}
          />
          <PreviewSlider
            title="Strength"
            min={0.1}
            max={0.8}
            step={0.05}
            value={props.strength}
            onChange={v => updateProp('strength', v)}
          />
          <PreviewSlider
            title="Radius"
            min={60}
            max={220}
            step={10}
            value={props.radius}
            valueUnit="px"
            onChange={v => updateProp('radius', v)}
          />
          <PreviewSlider
            title="Hover scale"
            min={1}
            max={1.2}
            step={0.01}
            value={props.scaleOnHover}
            onChange={v => updateProp('scaleOnHover', v)}
          />
          <PreviewSwitch title="Show arrow" isChecked={props.showArrow} onChange={v => updateProp('showArrow', v)} />
        </>
      )}
    />
  );
};

export default MagneticButtonDemo;
