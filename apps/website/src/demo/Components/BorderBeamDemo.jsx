import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import BorderBeam from '../../content/Components/BorderBeam/BorderBeam';
import { borderBeam } from '../../constants/code/Components/borderBeamCode';

const DEFAULT_PROPS = {
  beamColor: '#6366f1',
  beamColorTo: '#a855f7',
  duration: 6,
  borderWidth: 2,
  borderRadius: 16,
  surfaceColor: '#16181d'
};

const BEAM_COLORS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#22d3ee', label: 'Cyan' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#ec4899', label: 'Pink' }
];

const BEAM_COLORS_TO = [
  { value: '#a855f7', label: 'Violet' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#f43f5e', label: 'Rose' },
  { value: '#fbbf24', label: 'Yellow' }
];

const SURFACE_COLORS = [
  { value: '#16181d', label: 'Charcoal' },
  { value: '#1e293b', label: 'Slate' },
  { value: '#0f172a', label: 'Navy' },
  { value: '#18181b', label: 'Zinc' }
];

const SampleCard = () => (
  <div style={{ width: 280, padding: '1.5rem 1.6rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
    <span
      style={{
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'rgba(255, 255, 255, 0.45)'
      }}
    >
      Pro plan
    </span>
    <span style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em', color: '#fff' }}>
      Ship faster with ui bits
    </span>
    <span style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.55)' }}>
      A spotlight beam circles the border to draw the eye without stealing the show.
    </span>
    <span
      style={{
        marginTop: '0.4rem',
        alignSelf: 'flex-start',
        padding: '0.4rem 0.9rem',
        borderRadius: 999,
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        fontSize: '0.82rem',
        fontWeight: 600,
        color: '#fff'
      }}
    >
      Get started
    </span>
  </div>
);

const BorderBeamDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'children', type: 'ReactNode', default: 'undefined', description: 'Content rendered on the inner surface.' },
      { name: 'beamColor', type: 'string', default: "'#6366f1'", description: 'Leading color of the traveling beam.' },
      {
        name: 'beamColorTo',
        type: 'string',
        default: "'#a855f7'",
        description: 'Trailing color, blended into the beam for a gradient comet.'
      },
      { name: 'duration', type: 'number', default: '6', description: 'Seconds for one full revolution around the border.' },
      { name: 'borderWidth', type: 'number', default: '2', description: 'Thickness of the visible ring, in px.' },
      { name: 'borderRadius', type: 'number', default: '16', description: 'Corner radius of the card, in px.' },
      { name: 'surfaceColor', type: 'string', default: "'#16181d'", description: 'Background of the inner card surface.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={borderBeam}
      componentName="BorderBeam"
      preview={({ props, key }) => (
        <BorderBeam key={key} {...props}>
          <SampleCard />
        </BorderBeam>
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Duration"
              min={2}
              max={14}
              value={props.duration}
              valueUnit="s"
              onChange={v => set('duration', v)}
            />
            <PreviewSlider
              title="Border width"
              min={1}
              max={6}
              value={props.borderWidth}
              valueUnit="px"
              onChange={v => set('borderWidth', v)}
            />
            <PreviewSlider
              title="Border radius"
              min={8}
              max={28}
              value={props.borderRadius}
              valueUnit="px"
              onChange={v => set('borderRadius', v)}
            />
            <PreviewSelect
              title="Beam color"
              options={BEAM_COLORS}
              value={props.beamColor}
              onChange={v => set('beamColor', v)}
            />
            <PreviewSelect
              title="Beam color (to)"
              options={BEAM_COLORS_TO}
              value={props.beamColorTo}
              onChange={v => set('beamColorTo', v)}
            />
            <PreviewSelect
              title="Surface"
              options={SURFACE_COLORS}
              value={props.surfaceColor}
              onChange={v => set('surfaceColor', v)}
            />
          </>
        );
      }}
    />
  );
};

export default BorderBeamDemo;
