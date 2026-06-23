import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import PosterHelix from '../../content/ThreeD/PosterHelix/PosterHelix';
import { posterHelix } from '../../constants/code/ThreeD/posterHelixCode';

const SAMPLE_POSTERS = [
  { id: 'p01', image: 'https://picsum.photos/seed/aurora/480/640', title: 'Aurora Drift', meta: ['Drama', '6 episodes'] },
  { id: 'p02', image: 'https://picsum.photos/seed/longshore/480/640', title: 'Longshore', meta: ['Documentary', '4 episodes'] },
  { id: 'p03', image: 'https://picsum.photos/seed/halflit/480/640', title: 'Half-Lit Rooms', meta: ['Anthology', '8 episodes'] },
  { id: 'p04', image: 'https://picsum.photos/seed/embers/480/640', title: 'Embers', meta: ['Thriller', '6 episodes'] },
  { id: 'p05', image: 'https://picsum.photos/seed/northern/480/640', title: 'Northern Light', meta: ['Documentary', '3 episodes'] },
  { id: 'p06', image: 'https://picsum.photos/seed/cobalt/480/640', title: 'Cobalt Sea', meta: ['Drama', '10 episodes'] },
  { id: 'p07', image: 'https://picsum.photos/seed/silvercut/480/640', title: 'Silver Cut', meta: ['Crime', '6 episodes'] },
  { id: 'p08', image: 'https://picsum.photos/seed/parallax/480/640', title: 'Parallax', meta: ['Sci-fi', '8 episodes'] },
  { id: 'p09', image: 'https://picsum.photos/seed/heliodore/480/640', title: 'Heliodore', meta: ['Drama', '4 episodes'] },
  { id: 'p10', image: 'https://picsum.photos/seed/midnightroad/480/640', title: 'Midnight Road', meta: ['Crime', '7 episodes'] },
  { id: 'p11', image: 'https://picsum.photos/seed/quietgods/480/640', title: 'Quiet Gods', meta: ['Drama', '6 episodes'] },
  { id: 'p12', image: 'https://picsum.photos/seed/oxblood/480/640', title: 'Oxblood', meta: ['Thriller', '5 episodes'] }
];

const DEFAULT_PROPS = {
  radius: 360,
  yStep: 56,
  turnDeg: 50,
  idleSpeed: 0.05,
  height: 600,
  showGrain: true,
  showVignette: true,
  showAxis: true,
  showCounter: true,
  showHint: true
};

const PosterHelixDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'posters',
        type: 'PosterItem[]',
        default: '[]',
        description: 'Array of posters to arrange along the helix. Each item needs `id`, `image`, `title`; `meta` is optional.'
      },
      { name: 'radius', type: 'number', default: '360', description: 'Distance from the helix axis to each poster, in pixels.' },
      { name: 'yStep', type: 'number', default: '56', description: 'Vertical spacing between adjacent posters along the helix.' },
      { name: 'turnDeg', type: 'number', default: '50', description: 'Rotation in degrees applied per poster around the Y axis.' },
      { name: 'idleSpeed', type: 'number', default: '0.05', description: 'Degrees of automatic drift per frame when the section is in view and not being dragged.' },
      { name: 'dragSensitivity', type: 'number', default: '0.18', description: 'Pixels-to-degrees conversion when dragging.' },
      { name: 'ease', type: 'number', default: '0.085', description: 'Easing factor for catching up to the target angle (0..1).' },
      { name: 'showGrain', type: 'boolean', default: 'true', description: 'Render the animated film-grain overlay.' },
      { name: 'showVignette', type: 'boolean', default: 'true', description: 'Render the radial + edge vignette overlay.' },
      { name: 'showAxis', type: 'boolean', default: 'true', description: 'Render the vertical axis line with five ticks.' },
      { name: 'showCounter', type: 'boolean', default: 'true', description: 'Show the "NN / NN" counter in the HUD.' },
      { name: 'showHint', type: 'boolean', default: 'true', description: 'Show the interaction hint in the HUD.' },
      { name: 'hint', type: 'string', default: "'Drag to twist · ←/→'", description: 'Text displayed under the counter as an interaction hint.' },
      { name: 'accentColor', type: 'string', default: '—', description: 'Override the highlight color around the active poster. Accepts any CSS color.' },
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
      codeObject={posterHelix}
      componentName="PosterHelix"
      flexProps={{ minH: '640px' }}
      preview={({ props, key }) => (
        <PosterHelix key={key} {...props} posters={SAMPLE_POSTERS} accentColor="var(--accent)" />
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
              min={220}
              max={520}
              step={10}
              value={props.radius}
              valueUnit="px"
              onChange={v => set('radius', v)}
            />
            <PreviewSlider
              title="Y step"
              min={40}
              max={140}
              step={2}
              value={props.yStep}
              valueUnit="px"
              onChange={v => set('yStep', v)}
            />
            <PreviewSlider
              title="Turn"
              min={20}
              max={90}
              step={1}
              value={props.turnDeg}
              valueUnit="°"
              onChange={v => set('turnDeg', v)}
            />
            <PreviewSlider
              title="Idle speed"
              min={0}
              max={0.2}
              step={0.01}
              value={props.idleSpeed}
              onChange={v => set('idleSpeed', v)}
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
            <PreviewSwitch
              title="Grain"
              isChecked={props.showGrain}
              onChange={v => set('showGrain', v)}
            />
            <PreviewSwitch
              title="Vignette"
              isChecked={props.showVignette}
              onChange={v => set('showVignette', v)}
            />
            <PreviewSwitch
              title="Axis"
              isChecked={props.showAxis}
              onChange={v => set('showAxis', v)}
            />
            <PreviewSwitch
              title="Counter"
              isChecked={props.showCounter}
              onChange={v => set('showCounter', v)}
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

export default PosterHelixDemo;
