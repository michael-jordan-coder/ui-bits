import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import PeekPassword from '../../content/Components/PeekPassword/PeekPassword';
import { peekPassword } from '../../constants/code/Components/peekPasswordCode';

const DEFAULT_PROPS = {
  emailPlaceholder: 'you@example.com',
  passwordPlaceholder: 'Password',
  accentColor: '#5b8def',
  mascotColor: '#a9744f',
  size: 104,
  width: 300
};

const ACCENTS = [
  { value: '#5b8def', label: 'Blue' },
  { value: '#8b5cf6', label: 'Violet' },
  { value: '#14b8a6', label: 'Teal' },
  { value: '#f43f5e', label: 'Rose' }
];

const MASCOTS = [
  { value: '#a9744f', label: 'Brown bear' },
  { value: '#d9a441', label: 'Honey' },
  { value: '#8b8f99', label: 'Polar grey' },
  { value: '#5a4633', label: 'Grizzly' }
];

const PeekPasswordDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'emailPlaceholder',
        type: 'string',
        default: "'you@example.com'",
        description: 'Placeholder text for the email input.'
      },
      {
        name: 'passwordPlaceholder',
        type: 'string',
        default: "'Password'",
        description: 'Placeholder text for the password input.'
      },
      { name: 'accentColor', type: 'string', default: "'#5b8def'", description: 'Focus ring and active border color.' },
      { name: 'mascotColor', type: 'string', default: "'#a9744f'", description: 'Body color of the mascot.' },
      { name: 'size', type: 'number', default: '104', description: 'Size of the mascot, in px.' },
      { name: 'width', type: 'number', default: '300', description: 'Width of the input column, in px.' },
      {
        name: 'onEmailChange',
        type: '(value: string) => void',
        default: 'undefined',
        description: 'Fires with the email value on every keystroke.'
      },
      {
        name: 'onPasswordChange',
        type: '(value: string) => void',
        default: 'undefined',
        description: 'Fires with the password value on every keystroke.'
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
      codeObject={peekPassword}
      componentName="PeekPassword"
      preview={({ props, key }) => <PeekPassword key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect
              title="Accent"
              options={ACCENTS}
              value={props.accentColor}
              onChange={v => set('accentColor', v)}
            />
            <PreviewSelect
              title="Mascot"
              options={MASCOTS}
              value={props.mascotColor}
              onChange={v => set('mascotColor', v)}
            />
            <PreviewSlider title="Mascot size" min={80} max={140} value={props.size} valueUnit="px" onChange={v => set('size', v)} />
            <PreviewSlider title="Field width" min={240} max={360} value={props.width} valueUnit="px" onChange={v => set('width', v)} />
          </>
        );
      }}
    />
  );
};

export default PeekPasswordDemo;
