import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import SwipeAction from '../../content/Components/SwipeAction/SwipeAction';
import { swipeAction } from '../../constants/code/Components/swipeActionCode';

const DEFAULT_PROPS = {
  actionWidth: 80,
  surfaceColor: '#1c1c22',
  width: 360,
  fullSwipe: true
};

const SURFACES = [
  { value: '#1c1c22', label: 'Charcoal' },
  { value: '#16181d', label: 'Ink' },
  { value: '#241f2b', label: 'Plum' },
  { value: '#15201d', label: 'Forest' }
];

const SAMPLE = [
  { initials: 'AM', name: 'Ava Morgan', message: 'Sent the files over for review', tint: '#6366f1' },
  { initials: 'JT', name: 'Jonah Tate', message: 'Are we still on for 3pm?', tint: '#14b8a6' },
  { initials: 'RK', name: 'Riley Kim', message: 'Loved the new mockups!', tint: '#f59e0b' }
];

const Row = ({ initials, name, message, tint }) => (
  <span style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', width: '100%' }}>
    <span
      style={{
        flex: 'none',
        display: 'grid',
        placeItems: 'center',
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: tint,
        color: '#fff',
        fontSize: '0.85rem',
        fontWeight: 700,
        letterSpacing: '-0.01em'
      }}
    >
      {initials}
    </span>
    <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
      <span style={{ fontSize: '0.92rem', fontWeight: 600, color: '#fff' }}>{name}</span>
      <span
        style={{
          fontSize: '0.84rem',
          color: 'rgba(255, 255, 255, 0.5)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {message}
      </span>
    </span>
  </span>
);

const SwipeActionDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'children', type: 'ReactNode', default: 'undefined', description: 'Row content shown on the swipeable surface.' },
      {
        name: 'actions',
        type: 'SwipeActionItem[]',
        default: '[Archive, Delete]',
        description: 'Trailing actions, each with id, label, color, and a lucide icon.'
      },
      { name: 'actionWidth', type: 'number', default: '80', description: 'Width of each revealed action, in px.' },
      { name: 'surfaceColor', type: 'string', default: "'#1c1c22'", description: 'Background of the swipeable row.' },
      { name: 'width', type: 'number', default: '360', description: 'Width of the row, in px.' },
      {
        name: 'fullSwipe',
        type: 'boolean',
        default: 'true',
        description: 'Fling past the actions to fire the primary action.'
      },
      {
        name: 'onAction',
        type: '(id: string) => void',
        default: 'undefined',
        description: 'Fires with the action id when an action is triggered.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={swipeAction}
      componentName="SwipeAction"
      preview={({ props, key }) => (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {SAMPLE.map(s => (
            <SwipeAction key={s.name} {...props}>
              <Row {...s} />
            </SwipeAction>
          ))}
        </div>
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Row width" min={280} max={440} value={props.width} valueUnit="px" onChange={v => set('width', v)} />
            <PreviewSlider
              title="Action width"
              min={64}
              max={110}
              value={props.actionWidth}
              valueUnit="px"
              onChange={v => set('actionWidth', v)}
            />
            <PreviewSelect
              title="Surface"
              options={SURFACES}
              value={props.surfaceColor}
              onChange={v => set('surfaceColor', v)}
            />
            <PreviewSwitch title="Full swipe" isChecked={props.fullSwipe} onChange={v => set('fullSwipe', v)} />
          </>
        );
      }}
    />
  );
};

export default SwipeActionDemo;
