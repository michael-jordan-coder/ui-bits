import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import CardDeck from '../../content/ThreeD/CardDeck/CardDeck';
import { cardDeck } from '../../constants/code/ThreeD/cardDeckCode';

const SAMPLE_ITEMS = [
  { id: 'c01', image: 'https://picsum.photos/seed/aurora/640/840', title: 'Aurora Drift', meta: 'Drama · 6 episodes' },
  { id: 'c02', image: 'https://picsum.photos/seed/longshore/640/840', title: 'Longshore', meta: 'Documentary · 4 episodes' },
  { id: 'c03', image: 'https://picsum.photos/seed/halflit/640/840', title: 'Half-Lit Rooms', meta: 'Anthology · 8 episodes' },
  { id: 'c04', image: 'https://picsum.photos/seed/embers/640/840', title: 'Embers', meta: 'Thriller · 6 episodes' },
  { id: 'c05', image: 'https://picsum.photos/seed/cobalt/640/840', title: 'Cobalt Sea', meta: 'Drama · 10 episodes' },
  { id: 'c06', image: 'https://picsum.photos/seed/parallax/640/840', title: 'Parallax', meta: 'Sci-fi · 8 episodes' },
  { id: 'c07', image: 'https://picsum.photos/seed/midnightroad/640/840', title: 'Midnight Road', meta: 'Crime · 7 episodes' },
  { id: 'c08', image: 'https://picsum.photos/seed/quietgods/640/840', title: 'Quiet Gods', meta: 'Drama · 6 episodes' }
];

const DEFAULT_PROPS = {
  visibleCards: 4,
  depth: 60,
  offsetY: 18,
  scaleStep: 0.06,
  idleSpeed: 0,
  swipeThreshold: 90,
  height: 520,
  showHint: true
};

const CardDeckDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'items',
        type: 'CardDeckItem[]',
        default: '[]',
        description: 'Cards to stack in the deck. Each item needs `id` and `title`; `image` and `meta` are optional.'
      },
      { name: 'visibleCards', type: 'number', default: '4', description: 'How many cards stay visible in the depth stack before the rest fade out.' },
      { name: 'depth', type: 'number', default: '60', description: 'translateZ step in pixels between each card receding into the stack.' },
      { name: 'offsetY', type: 'number', default: '18', description: 'Vertical offset in pixels added per card down the stack.' },
      { name: 'scaleStep', type: 'number', default: '0.06', description: 'Scale reduction applied per card down the stack.' },
      { name: 'idleSpeed', type: 'number', default: '0', description: 'Auto-advance rate (cards per second-ish) when in view and idle. 0 disables auto-advance.' },
      { name: 'swipeThreshold', type: 'number', default: '90', description: 'Horizontal drag distance in pixels required to throw the front card.' },
      { name: 'showHint', type: 'boolean', default: 'true', description: 'Show the interaction hint in the HUD.' },
      { name: 'hint', type: 'string', default: "'Drag, swipe or use ←/→'", description: 'Text shown as the interaction hint.' },
      { name: 'accentColor', type: 'string', default: '—', description: 'Highlight color around the front card. Accepts any CSS color.' },
      { name: 'height', type: 'number | string', default: '520', description: 'Height of the scene. Numbers are treated as px.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={[]}
      codeObject={cardDeck}
      componentName="CardDeck"
      flexProps={{ alignItems: 'stretch', minH: '560px' }}
      preview={({ props, key }) => (
        <CardDeck key={key} {...props} items={SAMPLE_ITEMS} accentColor="var(--accent)" />
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Visible cards"
              min={2}
              max={6}
              step={1}
              value={props.visibleCards}
              onChange={v => set('visibleCards', v)}
            />
            <PreviewSlider
              title="Depth"
              min={20}
              max={120}
              step={4}
              value={props.depth}
              valueUnit="px"
              onChange={v => set('depth', v)}
            />
            <PreviewSlider
              title="Y offset"
              min={0}
              max={48}
              step={2}
              value={props.offsetY}
              valueUnit="px"
              onChange={v => set('offsetY', v)}
            />
            <PreviewSlider
              title="Scale step"
              min={0}
              max={0.14}
              step={0.01}
              value={props.scaleStep}
              onChange={v => set('scaleStep', v)}
            />
            <PreviewSlider
              title="Idle speed"
              min={0}
              max={0.06}
              step={0.005}
              value={props.idleSpeed}
              onChange={v => set('idleSpeed', v)}
            />
            <PreviewSlider
              title="Swipe threshold"
              min={40}
              max={180}
              step={10}
              value={props.swipeThreshold}
              valueUnit="px"
              onChange={v => set('swipeThreshold', v)}
            />
            <PreviewSlider
              title="Height"
              min={400}
              max={760}
              step={20}
              value={props.height}
              valueUnit="px"
              onChange={v => set('height', v)}
            />
            <PreviewSwitch
              title="Hint"
              isChecked={props.showHint}
              onChange={v => set('showHint', v)}
            />
          </>
        );
      }}
    />
  );
};

export default CardDeckDemo;
