import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import DepthTunnel from '../../content/ThreeD/DepthTunnel/DepthTunnel';
import { depthTunnel } from '../../constants/code/ThreeD/depthTunnelCode';

const SAMPLE_ITEMS = [
  { id: 't01', image: 'https://picsum.photos/seed/genesis/600/400', title: 'Genesis', meta: ['v0.1.0', 'First commit'] },
  { id: 't02', image: 'https://picsum.photos/seed/foothold/600/400', title: 'Foothold', meta: ['v0.4.0', 'Auth & routing'] },
  { id: 't03', image: 'https://picsum.photos/seed/cadence/600/400', title: 'Cadence', meta: ['v0.7.0', 'Realtime sync'] },
  { id: 't04', image: 'https://picsum.photos/seed/lattice/600/400', title: 'Lattice', meta: ['v1.0.0', 'Public launch'] },
  { id: 't05', image: 'https://picsum.photos/seed/meridian/600/400', title: 'Meridian', meta: ['v1.3.0', 'Teams & roles'] },
  { id: 't06', image: 'https://picsum.photos/seed/halcyon/600/400', title: 'Halcyon', meta: ['v1.6.0', 'Offline mode'] },
  { id: 't07', image: 'https://picsum.photos/seed/vantage/600/400', title: 'Vantage', meta: ['v2.0.0', 'New editor'] },
  { id: 't08', image: 'https://picsum.photos/seed/keystone/600/400', title: 'Keystone', meta: ['v2.4.0', 'Plugin API'] },
  { id: 't09', image: 'https://picsum.photos/seed/perigee/600/400', title: 'Perigee', meta: ['v2.7.0', 'Mobile apps'] },
  { id: 't10', image: 'https://picsum.photos/seed/zenith/600/400', title: 'Zenith', meta: ['v3.0.0', 'AI assist'] }
];

const DEFAULT_PROPS = {
  spacing: 360,
  perspective: 1400,
  idleSpeed: 0.16,
  wheelSensitivity: 0.7,
  height: 600,
  fog: true,
  showCounter: true,
  showHint: true
};

const DepthTunnelDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'items',
        type: 'DepthTunnelItem[]',
        default: '[]',
        description: 'Array of panels arranged along the tunnel. Each item needs `id`, `image`, `title`; `meta` is optional.'
      },
      { name: 'spacing', type: 'number', default: '360', description: 'Z distance in pixels between adjacent panels along the tunnel.' },
      { name: 'perspective', type: 'number', default: '1400', description: 'CSS perspective of the stage, in pixels. Lower is more dramatic.' },
      { name: 'idleSpeed', type: 'number', default: '0.16', description: 'Depth units of automatic fly-through per frame when in view and idle.' },
      { name: 'dragSensitivity', type: 'number', default: '1.1', description: 'Multiplier converting vertical drag distance into depth travel.' },
      { name: 'wheelSensitivity', type: 'number', default: '0.7', description: 'Multiplier converting wheel delta into depth travel (only while hovered).' },
      { name: 'ease', type: 'number', default: '0.08', description: 'Easing factor for catching up to the target depth (0..1).' },
      { name: 'fog', type: 'boolean', default: 'true', description: 'Fade far panels into the background and render the central depth haze.' },
      { name: 'showCounter', type: 'boolean', default: 'true', description: 'Show the "NN / NN" counter in the HUD.' },
      { name: 'showHint', type: 'boolean', default: 'true', description: 'Show the interaction hint in the HUD.' },
      { name: 'hint', type: 'string', default: "'Scroll or drag · ↑/↓'", description: 'Text displayed under the counter as an interaction hint.' },
      { name: 'accentColor', type: 'string', default: '—', description: 'Override the highlight color around the active panel. Accepts any CSS color.' },
      { name: 'height', type: 'number | string', default: '600', description: 'Height of the scene. Numbers are treated as px.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={[]}
      codeObject={depthTunnel}
      componentName="DepthTunnel"
      flexProps={{ minH: '560px' }}
      preview={({ props, key }) => (
        <DepthTunnel key={key} {...props} items={SAMPLE_ITEMS} accentColor="var(--accent)" />
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Spacing"
              min={220}
              max={620}
              step={10}
              value={props.spacing}
              valueUnit="px"
              onChange={v => set('spacing', v)}
            />
            <PreviewSlider
              title="Perspective"
              min={800}
              max={2400}
              step={50}
              value={props.perspective}
              valueUnit="px"
              onChange={v => set('perspective', v)}
            />
            <PreviewSlider
              title="Idle speed"
              min={0}
              max={0.6}
              step={0.02}
              value={props.idleSpeed}
              onChange={v => set('idleSpeed', v)}
            />
            <PreviewSlider
              title="Wheel"
              min={0.2}
              max={1.6}
              step={0.1}
              value={props.wheelSensitivity}
              onChange={v => set('wheelSensitivity', v)}
            />
            <PreviewSlider
              title="Height"
              min={420}
              max={900}
              step={20}
              value={props.height}
              valueUnit="px"
              onChange={v => set('height', v)}
            />
            <PreviewSwitch title="Fog" isChecked={props.fog} onChange={v => set('fog', v)} />
            <PreviewSwitch title="Counter" isChecked={props.showCounter} onChange={v => set('showCounter', v)} />
            <PreviewSwitch title="Hint" isChecked={props.showHint} onChange={v => set('showHint', v)} />
          </>
        );
      }}
    />
  );
};

export default DepthTunnelDemo;
