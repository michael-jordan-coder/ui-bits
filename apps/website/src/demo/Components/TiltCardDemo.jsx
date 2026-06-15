import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import TiltCard from '../../content/Components/TiltCard/TiltCard';
import { tiltCard } from '../../constants/code/Components/tiltCardCode';

const DEFAULT_PROPS = {
  maxTilt: 16,
  scale: 1.06,
  glare: true,
  perspective: 800,
  radius: 22
};

// Sample card content passed as children to showcase the tilt mechanics.
const SampleCard = () => (
  <div
    style={{
      width: 260,
      height: 340,
      padding: 22,
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(150deg, #6d28d9 0%, #2563eb 55%, #0ea5e9 100%)',
      color: '#fff'
    }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        display: 'grid',
        placeItems: 'center',
        borderRadius: 12,
        background: 'rgba(255,255,255,0.18)',
        backdropFilter: 'blur(4px)'
      }}
    >
      <Sparkles size={24} />
    </div>
    <div style={{ marginTop: 'auto' }}>
      <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.08em', opacity: 0.8, textTransform: 'uppercase' }}>
        Featured
      </div>
      <div style={{ fontSize: 26, fontWeight: 700, lineHeight: 1.15, marginTop: 6 }}>Aurora Pass</div>
      <div style={{ fontSize: 14, opacity: 0.85, marginTop: 8 }}>Hover to tilt the card toward your cursor.</div>
    </div>
  </div>
);

const TiltCardDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'children', type: 'ReactNode', default: 'undefined', description: 'Card content to render and tilt.' },
      { name: 'maxTilt', type: 'number', default: '14', description: 'Maximum tilt at the edges, in degrees.' },
      { name: 'scale', type: 'number', default: '1.05', description: 'Scale applied while hovered.' },
      { name: 'glare', type: 'boolean', default: 'true', description: 'Show the cursor-tracking specular glare.' },
      {
        name: 'glareColor',
        type: 'string',
        default: "'rgba(255,255,255,0.45)'",
        description: 'Color of the glare highlight.'
      },
      { name: 'perspective', type: 'number', default: '800', description: 'CSS perspective depth, in px.' },
      { name: 'radius', type: 'number', default: '20', description: 'Corner radius of the card, in px.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={tiltCard}
      componentName="TiltCard"
      preview={({ props, key }) => (
        <TiltCard key={key} {...props}>
          <SampleCard />
        </TiltCard>
      )}
      controls={({ props, updateProp }) => {
        const set = (name, val) => updateProp(name, val);
        return (
          <>
            <PreviewSlider title="Max tilt" min={0} max={25} value={props.maxTilt} onChange={v => set('maxTilt', v)} />
            <PreviewSlider
              title="Hover scale"
              min={1}
              max={1.15}
              step={0.01}
              value={props.scale}
              onChange={v => set('scale', v)}
            />
            <PreviewSlider title="Radius" min={0} max={40} value={props.radius} onChange={v => set('radius', v)} />
            <PreviewSlider
              title="Perspective"
              min={400}
              max={1400}
              step={50}
              value={props.perspective}
              onChange={v => set('perspective', v)}
            />
            <PreviewSwitch title="Glare" isChecked={props.glare} onChange={v => set('glare', v)} />
          </>
        );
      }}
    />
  );
};

export default TiltCardDemo;
