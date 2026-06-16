import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';

import TagSphere from '../../content/ThreeD/TagSphere/TagSphere';
import { tagSphere } from '../../constants/code/ThreeD/tagSphereCode';

const DEFAULT_PROPS = {};

const TagSphereDemo = () => {
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
      codeObject={tagSphere}
      componentName="TagSphere"
      preview={({ props, key }) => <TagSphere key={key} {...props} />}
      controls={(/* { props, updateProp, forceRerender } */) => (
        <>{/* Add PreviewSlider / PreviewSwitch / PreviewSelect controls here */}</>
      )}
    />
  );
};

export default TagSphereDemo;
