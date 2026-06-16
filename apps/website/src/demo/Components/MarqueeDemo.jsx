import { useMemo } from 'react';
import { Sparkles, Zap, Wind, Atom, Layers, Boxes } from 'lucide-react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import Marquee from '../../content/Components/Marquee/Marquee';
import { marquee } from '../../constants/code/Components/marqueeCode';

const DEFAULT_PROPS = {
  speed: 30,
  direction: 'left',
  pauseOnHover: true,
  gap: 24,
  fade: true,
  fadeWidth: 64
};

const DIRECTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'right', label: 'Right' }
];

const CHIPS = [
  { label: 'React', tint: '#61dafb', icon: Atom },
  { label: 'Vite', tint: '#a78bfa', icon: Zap },
  { label: 'Tailwind', tint: '#38bdf8', icon: Wind },
  { label: 'Motion', tint: '#f472b6', icon: Sparkles },
  { label: 'Chakra', tint: '#2dd4bf', icon: Layers },
  { label: 'TypeScript', tint: '#60a5fa', icon: Boxes }
];

const Chip = ({ label, tint, icon: Icon }) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.55rem 1rem',
      borderRadius: 999,
      border: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'rgba(255, 255, 255, 0.04)',
      color: '#fff',
      fontSize: '0.9rem',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      whiteSpace: 'nowrap'
    }}
  >
    <Icon size={16} strokeWidth={2} color={tint} aria-hidden="true" />
    {label}
  </span>
);

const MarqueeDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'children', type: 'ReactNode', default: 'undefined', description: 'The items rendered inside the scrolling track.' },
      { name: 'speed', type: 'number', default: '30', description: 'Seconds for one full loop. Lower is faster.' },
      {
        name: 'direction',
        type: "'left' | 'right'",
        default: "'left'",
        description: 'Scroll direction.'
      },
      { name: 'pauseOnHover', type: 'boolean', default: 'true', description: 'Pause the scroll while hovered.' },
      { name: 'gap', type: 'number', default: '24', description: 'Gap between items, in px.' },
      { name: 'fade', type: 'boolean', default: 'true', description: 'Soft gradient fade masks at both edges.' },
      { name: 'fadeWidth', type: 'number', default: '64', description: 'Width of each edge fade, in px.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={marquee}
      componentName="Marquee"
      flexProps={{ direction: 'column', width: '100%' }}
      preview={({ props, key }) => (
        <Marquee key={key} {...props}>
          {CHIPS.map(chip => (
            <Chip key={chip.label} {...chip} />
          ))}
        </Marquee>
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Speed"
              min={10}
              max={80}
              value={props.speed}
              valueUnit="s"
              onChange={v => set('speed', v)}
            />
            <PreviewSlider title="Gap" min={8} max={48} value={props.gap} valueUnit="px" onChange={v => set('gap', v)} />
            <PreviewSelect
              title="Direction"
              options={DIRECTIONS}
              value={props.direction}
              onChange={v => set('direction', v)}
            />
            <PreviewSwitch title="Pause on hover" isChecked={props.pauseOnHover} onChange={v => set('pauseOnHover', v)} />
            <PreviewSwitch title="Edge fade" isChecked={props.fade} onChange={v => set('fade', v)} />
          </>
        );
      }}
    />
  );
};

export default MarqueeDemo;
