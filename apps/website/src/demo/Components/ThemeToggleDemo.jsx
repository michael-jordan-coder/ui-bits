import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import ThemeToggle from '../../content/Components/ThemeToggle/ThemeToggle';
import { themeToggle } from '../../constants/code/Components/themeToggleCode';

const DEFAULT_PROPS = {
  defaultDark: false,
  size: 32,
  lightColor: '#7dd3fc',
  darkColor: '#1e293b',
  showLabel: true
};

const LIGHT_COLORS = [
  { value: '#7dd3fc', label: 'Sky' },
  { value: '#fcd34d', label: 'Amber' },
  { value: '#86efac', label: 'Mint' }
];

const DARK_COLORS = [
  { value: '#1e293b', label: 'Slate' },
  { value: '#312e81', label: 'Indigo' },
  { value: '#0b1220', label: 'Midnight' }
];

const ThemeToggleDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'defaultDark', type: 'boolean', default: 'false', description: 'Initial state of the toggle.' },
      { name: 'size', type: 'number', default: '30', description: 'Diameter of the knob, in px (track scales from it).' },
      { name: 'lightColor', type: 'string', default: "'#7dd3fc'", description: 'Track color in the light state.' },
      { name: 'darkColor', type: 'string', default: "'#1e293b'", description: 'Track color in the dark state.' },
      { name: 'showLabel', type: 'boolean', default: 'false', description: 'Show the Light/Dark text beside the track.' },
      {
        name: 'labels',
        type: '{ light: string; dark: string }',
        default: "{ light: 'Light', dark: 'Dark' }",
        description: 'Text shown for each state.'
      },
      {
        name: 'onChange',
        type: '(isDark: boolean) => void',
        default: 'undefined',
        description: 'Fires when the state flips.'
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
      codeObject={themeToggle}
      componentName="ThemeToggle"
      preview={({ props, key }) => <ThemeToggle key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => updateProp(name, val);
        return (
          <>
            <PreviewSlider
              title="Size"
              min={22}
              max={48}
              value={props.size}
              valueUnit="px"
              onChange={v => set('size', v)}
            />
            <PreviewSelect
              title="Light color"
              options={LIGHT_COLORS}
              value={props.lightColor}
              onChange={v => set('lightColor', v)}
            />
            <PreviewSelect
              title="Dark color"
              options={DARK_COLORS}
              value={props.darkColor}
              onChange={v => set('darkColor', v)}
            />
            <PreviewSwitch title="Show label" isChecked={props.showLabel} onChange={v => set('showLabel', v)} />
            <PreviewSwitch
              title="Default dark"
              isChecked={props.defaultDark}
              onChange={v => {
                updateProp('defaultDark', v);
                forceRerender();
              }}
            />
          </>
        );
      }}
    />
  );
};

export default ThemeToggleDemo;
