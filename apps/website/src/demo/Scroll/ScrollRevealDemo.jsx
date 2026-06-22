import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import ScrollReveal from '../../content/Scroll/ScrollReveal/ScrollReveal';
import { scrollReveal } from '../../constants/code/Scroll/scrollRevealCode';

const DEFAULT_PROPS = {
  distance: 40,
  direction: 'up',
  blur: 6,
  duration: 0.6,
  stagger: 0.08,
  once: true
};

const DIRECTION_OPTIONS = [
  { label: 'Up', value: 'up' },
  { label: 'Down', value: 'down' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
  { label: 'None', value: 'none' }
];

const ScrollRevealDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'children',
        type: 'ReactNode',
        default: 'sample sequence',
        description: 'Items to reveal. Each direct child animates in as it enters view.'
      },
      { name: 'distance', type: 'number', default: '40', description: 'Offset in pixels the item travels in.' },
      {
        name: 'direction',
        type: "'up' | 'down' | 'left' | 'right' | 'none'",
        default: "'up'",
        description: 'Direction each item enters from.'
      },
      { name: 'blur', type: 'number', default: '6', description: 'Initial blur in pixels, cleared on reveal.' },
      { name: 'duration', type: 'number', default: '0.6', description: 'Reveal duration in seconds.' },
      { name: 'stagger', type: 'number', default: '0.08', description: 'Delay between items revealing together.' },
      { name: 'once', type: 'boolean', default: 'true', description: 'Reveal once, or replay every time it re-enters.' },
      { name: 'amount', type: 'number', default: '0.4', description: 'Fraction of an item visible before it triggers.' },
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
      codeObject={scrollReveal}
      componentName="ScrollReveal"
      flexProps={{ minH: '520px', h: '520px', padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => <ScrollReveal key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect
              title="Direction"
              value={props.direction}
              options={DIRECTION_OPTIONS}
              onChange={v => set('direction', v)}
            />
            <PreviewSlider title="Distance" min={0} max={120} step={4} value={props.distance} valueUnit="px" onChange={v => set('distance', v)} />
            <PreviewSlider title="Blur" min={0} max={20} step={1} value={props.blur} valueUnit="px" onChange={v => set('blur', v)} />
            <PreviewSlider title="Duration" min={0.2} max={1.4} step={0.1} value={props.duration} valueUnit="s" onChange={v => set('duration', v)} />
            <PreviewSlider title="Stagger" min={0} max={0.3} step={0.02} value={props.stagger} valueUnit="s" onChange={v => set('stagger', v)} />
            <PreviewSwitch title="Reveal once" isChecked={props.once} onChange={v => set('once', v)} />
          </>
        );
      }}
    />
  );
};

export default ScrollRevealDemo;
