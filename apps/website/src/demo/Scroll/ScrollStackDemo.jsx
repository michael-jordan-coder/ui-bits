import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import ScrollStack from '../../content/Scroll/ScrollStack/ScrollStack';
import { scrollStack } from '../../constants/code/Scroll/scrollStackCode';

const DEFAULT_PROPS = {
  peek: 22,
  gap: 18,
  cardHeight: 190,
  scaleStep: 0.04,
  minScale: 0.82,
  dim: 0.35
};

const ScrollStackDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'items',
        type: '{ title, description?, accent }[]',
        default: '5 built-in cards',
        description: 'Cards to stack, top to bottom. `accent` sets each card background.'
      },
      { name: 'peek', type: 'number', default: '22', description: 'Pixels each pinned card peeks below the one above.' },
      { name: 'gap', type: 'number', default: '18', description: 'Vertical gap between cards before they pin.' },
      { name: 'cardHeight', type: 'number', default: '190', description: 'Height of every card in pixels.' },
      {
        name: 'scaleStep',
        type: 'number',
        default: '0.04',
        description: 'How much each deeper card shrinks once buried.'
      },
      { name: 'minScale', type: 'number', default: '0.82', description: 'Floor for the depth scale of the deepest card.' },
      { name: 'dim', type: 'number', default: '0.35', description: 'Opacity removed from a card as it gets buried.' },
      { name: 'height', type: 'number', default: '460', description: 'Height of the scroll viewport in pixels.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={scrollStack}
      componentName="ScrollStack"
      flexProps={{ minH: '520px', h: '520px', padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <ScrollStack key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Peek" min={8} max={48} step={1} value={props.peek} valueUnit="px" onChange={v => set('peek', v)} />
            <PreviewSlider title="Card height" min={140} max={260} step={2} value={props.cardHeight} valueUnit="px" onChange={v => set('cardHeight', v)} />
            <PreviewSlider title="Gap" min={0} max={40} step={1} value={props.gap} valueUnit="px" onChange={v => set('gap', v)} />
            <PreviewSlider title="Scale step" min={0} max={0.12} step={0.01} value={props.scaleStep} onChange={v => set('scaleStep', v)} />
            <PreviewSlider title="Min scale" min={0.6} max={1} step={0.02} value={props.minScale} onChange={v => set('minScale', v)} />
            <PreviewSlider title="Dim" min={0} max={0.8} step={0.05} value={props.dim} onChange={v => set('dim', v)} />
          </>
        );
      }}
    />
  );
};

export default ScrollStackDemo;
