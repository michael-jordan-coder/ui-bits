import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import LikeButton from '../../content/Components/LikeButton/LikeButton';
import { likeButton } from '../../constants/code/Components/likeButtonCode';

const DEFAULT_PROPS = {
  count: 128,
  color: '#ff3b5c',
  particleCount: 8,
  size: 28,
  showCount: true
};

const COLOR_OPTIONS = [
  { label: 'Instagram Red', value: '#ff3b5c' },
  { label: 'X Pink', value: '#f91880' },
  { label: 'YouTube', value: '#ff0000' },
  { label: 'Violet', value: '#8b5cf6' }
];

const LikeButtonDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'defaultLiked', type: 'boolean', default: 'false', description: 'Whether the button starts in the liked state.' },
      { name: 'count', type: 'number', default: '128', description: 'Base like count; increments by one while liked.' },
      { name: 'color', type: 'string', default: '#ff3b5c', description: 'Fill color of the heart and burst particles.' },
      { name: 'particleCount', type: 'number', default: '8', description: 'Number of particles in the burst.' },
      { name: 'size', type: 'number', default: '28', description: 'Heart icon size in pixels.' },
      { name: 'showCount', type: 'boolean', default: 'true', description: 'Show the like count next to the heart.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={likeButton}
      componentName="LikeButton"
      preview={({ props, key }) => <LikeButton key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect
              title="Color"
              name="likebutton-color"
              value={props.color}
              options={COLOR_OPTIONS}
              onChange={v => set('color', v)}
            />
            <PreviewSlider
              title="Particles"
              min={0}
              max={16}
              value={props.particleCount}
              onChange={v => set('particleCount', v)}
            />
            <PreviewSlider title="Size" min={20} max={56} value={props.size} valueUnit="px" onChange={v => set('size', v)} />
            <PreviewSwitch title="Show count" isChecked={props.showCount} onChange={v => set('showCount', v)} />
          </>
        );
      }}
    />
  );
};

export default LikeButtonDemo;
