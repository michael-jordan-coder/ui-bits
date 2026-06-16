import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import FlipCard from '../../content/Components/FlipCard/FlipCard';
import { flipCard } from '../../constants/code/Components/flipCardCode';

const DEFAULT_PROPS = {
  frontTitle: 'ui bits',
  frontSubtitle: 'Hover to reveal',
  backTitle: 'Crafted to flip',
  backText: 'A self-contained 3D card with spring-driven rotation and a reduced-motion fallback.',
  icon: 'sparkles',
  trigger: 'hover',
  direction: 'horizontal',
  accentColor: '#6366f1',
  surfaceColor: '#1c1c22'
};

const TRIGGERS = [
  { value: 'hover', label: 'Hover' },
  { value: 'click', label: 'Click' }
];

const DIRECTIONS = [
  { value: 'horizontal', label: 'Horizontal' },
  { value: 'vertical', label: 'Vertical' }
];

const ICONS = [
  { value: 'sparkles', label: 'Sparkles' },
  { value: 'zap', label: 'Zap' },
  { value: 'star', label: 'Star' },
  { value: 'heart', label: 'Heart' }
];

const ACCENTS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#14b8a6', label: 'Teal' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#ec4899', label: 'Pink' }
];

const SURFACES = [
  { value: '#1c1c22', label: 'Charcoal' },
  { value: '#16181d', label: 'Ink' },
  { value: '#101418', label: 'Slate' }
];

const FlipCardDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'frontTitle', type: 'string', default: "'ui bits'", description: 'Heading shown on the front face.' },
      { name: 'frontSubtitle', type: 'string', default: "'Hover to reveal'", description: 'Supporting line on the front face.' },
      { name: 'backTitle', type: 'string', default: "'Crafted to flip'", description: 'Heading shown on the back face.' },
      { name: 'backText', type: 'string', default: '...', description: 'Body copy on the back face.' },
      {
        name: 'icon',
        type: "'sparkles' | 'zap' | 'star' | 'heart'",
        default: "'sparkles'",
        description: 'Lucide icon rendered on the front face.'
      },
      {
        name: 'trigger',
        type: "'hover' | 'click'",
        default: "'hover'",
        description: 'Flip on pointer hover, or toggle on click/Enter/Space.'
      },
      {
        name: 'direction',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: 'Rotate around the Y axis (horizontal) or X axis (vertical).'
      },
      { name: 'accentColor', type: 'string', default: "'#6366f1'", description: 'Icon, glow, and call-to-action color.' },
      { name: 'surfaceColor', type: 'string', default: "'#1c1c22'", description: 'Background of both card faces.' },
      { name: 'flipped', type: 'boolean', default: 'undefined', description: 'Controlled flip state. Omit to run uncontrolled.' },
      { name: 'onFlip', type: '(flipped: boolean) => void', default: 'undefined', description: 'Fires with the new flip state.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={flipCard}
      componentName="FlipCard"
      preview={({ props, key }) => <FlipCard key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, value) => {
          updateProp(name, value);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect title="Trigger" options={TRIGGERS} value={props.trigger} onChange={v => set('trigger', v)} />
            <PreviewSelect title="Direction" options={DIRECTIONS} value={props.direction} onChange={v => set('direction', v)} />
            <PreviewSelect title="Icon" options={ICONS} value={props.icon} onChange={v => set('icon', v)} />
            <PreviewSelect title="Accent" options={ACCENTS} value={props.accentColor} onChange={v => set('accentColor', v)} />
            <PreviewSelect title="Surface" options={SURFACES} value={props.surfaceColor} onChange={v => set('surfaceColor', v)} />
          </>
        );
      }}
    />
  );
};

export default FlipCardDemo;
