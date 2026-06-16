import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import ConfettiButton from '../../content/Components/ConfettiButton/ConfettiButton';
import { confettiButton } from '../../constants/code/Components/confettiButtonCode';

const DEFAULT_PROPS = {
  particleCount: 28,
  spread: 70,
  accentColor: '#6366f1'
};

const ACCENTS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#10b981', label: 'Emerald' },
  { value: '#f59e0b', label: 'Amber' }
];

const ConfettiButtonDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'children', type: 'ReactNode', default: "'Celebrate'", description: 'Button label content.' },
      { name: 'particleCount', type: 'number', default: '28', description: 'Number of confetti particles per burst.' },
      {
        name: 'colors',
        type: 'string[]',
        default: '[5 colors]',
        description: 'Palette the particles cycle through.'
      },
      {
        name: 'spread',
        type: 'number',
        default: '70',
        description: 'Burst spread in degrees around straight-up.'
      },
      { name: 'accentColor', type: 'string', default: "'#6366f1'", description: 'Button background color.' },
      {
        name: 'onClick',
        type: '(e: MouseEvent) => void',
        default: 'undefined',
        description: 'Fires on click, in addition to the burst.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the button.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={confettiButton}
      componentName="ConfettiButton"
      preview={({ props, key }) => (
        <ConfettiButton key={key} {...props}>
          Celebrate 🎉
        </ConfettiButton>
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Particle count"
              min={10}
              max={60}
              value={props.particleCount}
              onChange={v => set('particleCount', v)}
            />
            <PreviewSlider
              title="Spread"
              min={20}
              max={140}
              value={props.spread}
              valueUnit="°"
              onChange={v => set('spread', v)}
            />
            <PreviewSelect title="Accent" options={ACCENTS} value={props.accentColor} onChange={v => set('accentColor', v)} />
          </>
        );
      }}
    />
  );
};

export default ConfettiButtonDemo;
