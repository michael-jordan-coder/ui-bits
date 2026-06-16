import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import SpotlightCard from '../../content/Components/SpotlightCard/SpotlightCard';
import { spotlightCard } from '../../constants/code/Components/spotlightCardCode';

const DEFAULT_PROPS = {
  spotlightColor: 'rgba(99, 102, 241, 0.25)',
  surfaceColor: '#16181d',
  radius: 220,
  borderGlow: true
};

const SPOTLIGHTS = [
  { value: 'rgba(99, 102, 241, 0.25)', label: 'Indigo' },
  { value: 'rgba(20, 184, 166, 0.25)', label: 'Teal' },
  { value: 'rgba(244, 114, 182, 0.25)', label: 'Pink' },
  { value: 'rgba(245, 158, 11, 0.25)', label: 'Amber' }
];

const SURFACES = [
  { value: '#16181d', label: 'Ink' },
  { value: '#1c1c22', label: 'Charcoal' },
  { value: '#241f2b', label: 'Plum' },
  { value: '#15201d', label: 'Forest' }
];

const SpotlightCardDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'children', type: 'ReactNode', default: 'undefined', description: 'Content rendered inside the card.' },
      {
        name: 'spotlightColor',
        type: 'string',
        default: "'rgba(99, 102, 241, 0.25)'",
        description: 'Color of the radial glow that follows the pointer.'
      },
      { name: 'surfaceColor', type: 'string', default: "'#16181d'", description: 'Background color of the card.' },
      { name: 'radius', type: 'number', default: '220', description: 'Diameter of the spotlight glow, in px.' },
      {
        name: 'borderGlow',
        type: 'boolean',
        default: 'true',
        description: 'Brighten the border nearest the cursor as it moves.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={spotlightCard}
      componentName="SpotlightCard"
      preview={({ props, key }) => (
        <SpotlightCard key={key} {...props} style={{ width: 320, maxWidth: '100%' }}>
          <span
            style={{
              display: 'inline-block',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.55)'
            }}
          >
            Realtime
          </span>
          <h3 style={{ margin: '0.6rem 0 0.5rem', fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.01em' }}>
            Live collaboration
          </h3>
          <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.55, color: 'rgba(255, 255, 255, 0.55)' }}>
            See every cursor, comment, and change as it happens. Move your pointer across the card to chase the light.
          </p>
        </SpotlightCard>
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Radius"
              min={120}
              max={400}
              value={props.radius}
              valueUnit="px"
              onChange={v => set('radius', v)}
            />
            <PreviewSelect
              title="Spotlight"
              options={SPOTLIGHTS}
              value={props.spotlightColor}
              onChange={v => set('spotlightColor', v)}
            />
            <PreviewSelect
              title="Surface"
              options={SURFACES}
              value={props.surfaceColor}
              onChange={v => set('surfaceColor', v)}
            />
            <PreviewSwitch title="Border glow" isChecked={props.borderGlow} onChange={v => set('borderGlow', v)} />
          </>
        );
      }}
    />
  );
};

export default SpotlightCardDemo;
