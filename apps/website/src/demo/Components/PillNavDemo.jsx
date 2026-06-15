import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import PillNav from '../../content/Components/PillNav/PillNav';
import { pillNav } from '../../constants/code/Components/pillNavCode';

const DEFAULT_PROPS = {
  accentColor: '#7a5236',
  animationDuration: 300
};

const ACCENT_OPTIONS = [
  { label: 'Brown', value: '#7a5236' },
  { label: 'White', value: '#fafafa' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Green', value: '#22c55e' }
];

const PillNavDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'tabs',
        type: 'string[]',
        default: "['Home', 'About', 'Productions', 'Contact']",
        description: 'Labels rendered as tabs, left to right.'
      },
      {
        name: 'defaultActive',
        type: 'string',
        default: 'tabs[0]',
        description: 'Tab selected on first render.'
      },
      {
        name: 'accentColor',
        type: 'string',
        default: '#7a5236',
        description: 'Fill color of the sliding pill; the glow is derived from it.'
      },
      {
        name: 'animationDuration',
        type: 'number',
        default: '300',
        description: 'Duration of the pill slide in milliseconds.'
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
      dependencies={['motion']}
      codeObject={pillNav}
      componentName="PillNav"
      preview={({ props, key }) => <PillNav key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Animation duration"
              min={100}
              max={900}
              step={50}
              value={props.animationDuration}
              valueUnit="ms"
              onChange={v => set('animationDuration', v)}
            />
            <PreviewSelect
              title="Accent color"
              name="pillnav-accent"
              value={props.accentColor}
              options={ACCENT_OPTIONS}
              onChange={v => set('accentColor', v)}
            />
          </>
        );
      }}
    />
  );
};

export default PillNavDemo;
