import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import FillButton from '../../content/Components/FillButton/FillButton';
import { fillButton } from '../../constants/code/Components/fillButtonCode';

const DEFAULT_PROPS = {
  label: 'Hover me',
  size: 'md',
  filled: false,
  fillColor: '#5227FF'
};

const SIZE_OPTIONS = [
  { label: 'md', value: 'md' },
  { label: 'sm', value: 'sm' }
];

const FILL_OPTIONS = [
  { label: 'Violet', value: '#5227FF' },
  { label: 'Ember', value: '#F25C2A' },
  { label: 'Mint', value: '#3CCB91' },
  { label: 'Ink', value: '#0F1115' }
];

const FillButtonDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'children', type: 'ReactNode', default: '—', description: 'Button label content.' },
      {
        name: 'fillColor',
        type: 'string',
        default: '#5227FF',
        description: 'Background color of the radial fill layer.'
      },
      {
        name: 'textColor',
        type: 'string',
        default: '#ffffff',
        description: 'Label color once the fill has covered the button.'
      },
      {
        name: 'restingTextColor',
        type: 'string',
        default: '#ffffff',
        description: 'Label color before hover / focus.'
      },
      {
        name: 'size',
        type: "'sm' | 'md'",
        default: "'md'",
        description: 'Padding and type scale. `md` is the hero size; `sm` is for inline / overlay use.'
      },
      {
        name: 'filled',
        type: 'boolean',
        default: 'false',
        description: 'Render in the filled state by default and skip the hover/focus animation.'
      },
      {
        name: 'trailing',
        type: 'ReactNode',
        default: '—',
        description: 'Optional glyph rendered inline after the label.'
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
      dependencies={['gsap', '@gsap/react', 'motion', 'tailwind-merge']}
      codeObject={fillButton}
      componentName="FillButton"
      demoOnlyProps={['label']}
      preview={({ props, key }) => {
        const { label, ...rest } = props;
        return (
          <FillButton key={key} {...rest}>
            {label}
          </FillButton>
        );
      }}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect
              title="Size"
              name="fillbutton-size"
              value={props.size}
              options={SIZE_OPTIONS}
              onChange={v => set('size', v)}
            />
            <PreviewSelect
              title="Fill color"
              name="fillbutton-color"
              value={props.fillColor}
              options={FILL_OPTIONS}
              onChange={v => set('fillColor', v)}
            />
            <PreviewSwitch
              title="Filled"
              isChecked={props.filled}
              onChange={v => set('filled', v)}
            />
          </>
        );
      }}
    />
  );
};

export default FillButtonDemo;
