import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import AvatarStack from '../../content/Components/AvatarStack/AvatarStack';
import { avatarStack } from '../../constants/code/Components/avatarStackCode';

const AVATARS = [
  { name: 'Ada Lovelace' },
  { name: 'Grace Hopper' },
  { name: 'Alan Turing' },
  { name: 'Katherine Johnson' },
  { name: 'Linus Torvalds' },
  { name: 'Margaret Hamilton' },
  { name: 'Dennis Ritchie' }
];

const DEFAULT_PROPS = {
  avatars: AVATARS,
  max: 5,
  size: 52,
  overlap: 18,
  spread: true,
  ring: '#0a0a0a',
  showName: true
};

const AvatarStackDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'avatars',
        type: '{ name: string; src?: string; color?: string }[]',
        default: '[]',
        description: 'People to render; src for a photo, color to pin the fallback hue.'
      },
      { name: 'max', type: 'number', default: '5', description: 'How many avatars to show before the +N chip.' },
      { name: 'size', type: 'number', default: '48', description: 'Diameter of each avatar, in px.' },
      { name: 'overlap', type: 'number', default: '16', description: 'How far avatars overlap when collapsed, in px.' },
      { name: 'spread', type: 'boolean', default: 'true', description: 'Fan the avatars apart on hover.' },
      { name: 'ring', type: 'string', default: "'#0a0a0a'", description: 'Border color separating the avatars.' },
      { name: 'showName', type: 'boolean', default: 'true', description: 'Show the name tooltip on the hovered avatar.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={avatarStack}
      componentName="AvatarStack"
      preview={({ props, key }) => <AvatarStack key={key} {...props} />}
      controls={({ props, updateProp }) => {
        const set = (name, val) => updateProp(name, val);
        return (
          <>
            <PreviewSlider title="Max shown" min={1} max={7} value={props.max} onChange={v => set('max', v)} />
            <PreviewSlider
              title="Size"
              min={32}
              max={72}
              value={props.size}
              valueUnit="px"
              onChange={v => set('size', v)}
            />
            <PreviewSlider
              title="Overlap"
              min={0}
              max={32}
              value={props.overlap}
              valueUnit="px"
              onChange={v => set('overlap', v)}
            />
            <PreviewSwitch title="Spread on hover" isChecked={props.spread} onChange={v => set('spread', v)} />
            <PreviewSwitch title="Show name" isChecked={props.showName} onChange={v => set('showName', v)} />
          </>
        );
      }}
    />
  );
};

export default AvatarStackDemo;
