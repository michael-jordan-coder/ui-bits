import { Flex } from '@chakra-ui/react';
import { CodeTab, PreviewTab, TabsLayout } from '../TabsLayout';
import Customize from './Customize';
import PropTable from './PropTable';
import RefreshButton from './RefreshButton';
import FullscreenButton from './FullscreenButton';
import Dependencies from '../../code/Dependencies';
import CodeExample from '../../code/CodeExample';
import { ComponentPropsProvider } from '../../context/ComponentPropsContext';
import useComponentProps from '../../../hooks/useComponentProps';
import useForceRerender from '../../../hooks/useForceRerender';

const DEFAULT_FLEX_PROPS = {
  overflow: 'hidden',
  justifyContent: 'center',
  alignItems: 'center',
  minH: '400px',
  position: 'relative',
  className: 'demo-container'
};

const DemoShell = ({
  defaultProps,
  propData,
  dependencies = [],
  codeObject,
  componentName,
  flexProps,
  demoOnlyProps,
  computedProps,
  preview,
  controls,
  extraPreview
}) => {
  const [key, forceRerender] = useForceRerender();
  const { props, updateProp, resetProps, hasChanges } = useComponentProps(defaultProps);
  const ctx = { props, updateProp, forceRerender, key };

  return (
    <ComponentPropsProvider
      props={props}
      defaultProps={defaultProps}
      resetProps={resetProps}
      hasChanges={hasChanges}
      demoOnlyProps={demoOnlyProps}
      computedProps={computedProps}
    >
      <TabsLayout>
        <PreviewTab>
          <Flex {...DEFAULT_FLEX_PROPS} {...flexProps}>
            {preview(ctx)}
            {extraPreview ? extraPreview(ctx) : null}
            <FullscreenButton />
            <RefreshButton onClick={forceRerender} />
          </Flex>

          {controls ? <Customize>{controls(ctx)}</Customize> : null}

          <PropTable data={propData} />
          <Dependencies dependencyList={dependencies} />
        </PreviewTab>

        <CodeTab>
          <CodeExample codeObject={codeObject} componentName={componentName} />
        </CodeTab>
      </TabsLayout>
    </ComponentPropsProvider>
  );
};

export default DemoShell;
