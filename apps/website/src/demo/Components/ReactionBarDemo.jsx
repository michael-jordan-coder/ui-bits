import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import ReactionBar from '../../content/Components/ReactionBar/ReactionBar';
import { reactionBar } from '../../constants/code/Components/reactionBarCode';

const EMOJI_SETS = {
  classic: ['👍', '❤️', '😂', '😮', '😢', '🙏'],
  office: ['👍', '👎', '🎉', '🚀', '👀', '✅'],
  hearts: ['❤️', '🧡', '💛', '💚', '💙', '💜']
};

const EMOJI_SET_OPTIONS = [
  { label: 'Classic', value: 'classic' },
  { label: 'Office', value: 'office' },
  { label: 'Hearts', value: 'hearts' }
];

const DEFAULT_PROPS = {
  emojiSet: 'classic',
  baseSize: 28,
  magnification: 1.8,
  range: 90,
  count: 0,
  showCount: true
};

const ReactionBarDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'emojis', type: 'string[]', default: "['👍','❤️','😂','😮','😢','🙏']", description: 'The emoji shown in the bar, in order.' },
      { name: 'defaultSelected', type: 'string | null', default: 'null', description: 'Emoji selected on mount, or null for none.' },
      { name: 'baseSize', type: 'number', default: '28', description: 'Resting emoji font-size in pixels.' },
      { name: 'magnification', type: 'number', default: '1.8', description: 'Max scale multiplier of the emoji nearest the cursor.' },
      { name: 'range', type: 'number', default: '90', description: 'Pixel radius of the magnification falloff.' },
      { name: 'count', type: 'number', default: '0', description: 'Base reaction count; increments by one while a reaction is selected.' },
      { name: 'showCount', type: 'boolean', default: 'true', description: 'Show the running reaction count after the bar.' },
      { name: 'onReact', type: '(emoji: string | null) => void', default: 'undefined', description: 'Called with the selected emoji, or null when deselected.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={reactionBar}
      componentName="ReactionBar"
      preview={({ props, key }) => {
        const { emojiSet, ...rest } = props;
        return <ReactionBar key={key} emojis={EMOJI_SETS[emojiSet]} {...rest} />;
      }}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect
              title="Emoji set"
              name="reactionbar-emoji-set"
              value={props.emojiSet}
              options={EMOJI_SET_OPTIONS}
              onChange={v => set('emojiSet', v)}
            />
            <PreviewSlider
              title="Magnification"
              min={1.2}
              max={2.6}
              step={0.1}
              value={props.magnification}
              onChange={v => set('magnification', v)}
            />
            <PreviewSlider
              title="Base size"
              min={20}
              max={44}
              value={props.baseSize}
              valueUnit="px"
              onChange={v => set('baseSize', v)}
            />
            <PreviewSlider
              title="Range"
              min={40}
              max={160}
              value={props.range}
              valueUnit="px"
              onChange={v => set('range', v)}
            />
            <PreviewSwitch title="Show count" isChecked={props.showCount} onChange={v => set('showCount', v)} />
          </>
        );
      }}
    />
  );
};

export default ReactionBarDemo;
