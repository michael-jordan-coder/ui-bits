import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';

import CubeShowcase from '../../content/ThreeD/CubeShowcase/CubeShowcase';
import { cubeShowcase } from '../../constants/code/ThreeD/cubeShowcaseCode';

const DEFAULT_PROPS = {};

const CubeShowcaseDemo = () => {
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
      codeObject={cubeShowcase}
      componentName="CubeShowcase"
      preview={({ props, key }) => <CubeShowcase key={key} {...props} />}
      controls={(/* { props, updateProp, forceRerender } */) => (
        <>{/* Add PreviewSlider / PreviewSwitch / PreviewSelect controls here */}</>
      )}
    />
  );
};

export default CubeShowcaseDemo;
