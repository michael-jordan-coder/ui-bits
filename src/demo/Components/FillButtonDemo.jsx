import { useMemo } from 'react';
import { Flex } from '@chakra-ui/react';
import { CodeTab, PreviewTab, TabsLayout } from '../../components/common/TabsLayout';
import Customize from '../../components/common/Preview/Customize';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';
import CodeExample from '../../components/code/CodeExample';
import RefreshButton from '../../components/common/Preview/RefreshButton';
import FullscreenButton from '../../components/common/Preview/FullscreenButton';
import PropTable from '../../components/common/Preview/PropTable';
import Dependencies from '../../components/code/Dependencies';
import useForceRerender from '../../hooks/useForceRerender';
import useComponentProps from '../../hooks/useComponentProps';
import { ComponentPropsProvider } from '../../components/context/ComponentPropsContext';

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
  const [key, forceRerender] = useForceRerender();
  const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
  const { label, size, filled, fillColor } = props;

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

  const controlledProps = { size, filled, fillColor };

  return (
    <ComponentPropsProvider
      props={props}
      defaultProps={DEFAULT_PROPS}
      resetProps={resetProps}
      hasChanges={hasChanges}
      demoOnlyProps={['label']}
    >
      <TabsLayout>
        <PreviewTab>
          <Flex
            overflow="hidden"
            justifyContent="center"
            alignItems="center"
            minH="400px"
            position="relative"
            className="demo-container"
          >
            <FillButton key={key} {...controlledProps}>
              {label}
            </FillButton>
            <FullscreenButton />
            <RefreshButton onClick={forceRerender} />
          </Flex>

          <Customize>
            <PreviewSelect
              title="Size"
              name="fillbutton-size"
              value={size}
              options={SIZE_OPTIONS}
              onChange={val => {
                updateProp('size', val);
                forceRerender();
              }}
            />
            <PreviewSelect
              title="Fill color"
              name="fillbutton-color"
              value={fillColor}
              options={FILL_OPTIONS}
              onChange={val => {
                updateProp('fillColor', val);
                forceRerender();
              }}
            />
            <PreviewSwitch
              title="Filled"
              isChecked={filled}
              onChange={checked => {
                updateProp('filled', checked);
                forceRerender();
              }}
            />
          </Customize>

          <PropTable data={propData} />
          <Dependencies dependencyList={['gsap', '@gsap/react', 'motion', 'tailwind-merge']} />
        </PreviewTab>

        <CodeTab>
          <CodeExample codeObject={fillButton} componentName="FillButton" />
        </CodeTab>
      </TabsLayout>
    </ComponentPropsProvider>
  );
};

export default FillButtonDemo;
