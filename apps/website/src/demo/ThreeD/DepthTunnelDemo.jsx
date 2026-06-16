import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';

import DepthTunnel from '../../content/ThreeD/DepthTunnel/DepthTunnel';
import { depthTunnel } from '../../constants/code/ThreeD/depthTunnelCode';

const DEFAULT_PROPS = {};

const DepthTunnelDemo = () => {
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
      codeObject={depthTunnel}
      componentName="DepthTunnel"
      preview={({ props, key }) => <DepthTunnel key={key} {...props} />}
      controls={(/* { props, updateProp, forceRerender } */) => (
        <>{/* Add PreviewSlider / PreviewSwitch / PreviewSelect controls here */}</>
      )}
    />
  );
};

export default DepthTunnelDemo;
