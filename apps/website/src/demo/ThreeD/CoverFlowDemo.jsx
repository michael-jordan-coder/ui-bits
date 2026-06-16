import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';

import CoverFlow from '../../content/ThreeD/CoverFlow/CoverFlow';
import { coverFlow } from '../../constants/code/ThreeD/coverFlowCode';

const DEFAULT_PROPS = {};

const CoverFlowDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'className', type: 'string', default: '', description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={[]}
      codeObject={coverFlow}
      componentName="CoverFlow"
      preview={({ props, key }) => <CoverFlow key={key} {...props} />}
      controls={(/* { props, updateProp, forceRerender } */) => (
        <>{/* Add PreviewSlider / PreviewSwitch / PreviewSelect controls here */}</>
      )}
    />
  );
};

export default CoverFlowDemo;
