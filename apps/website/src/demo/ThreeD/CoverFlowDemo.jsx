import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import CoverFlow from '../../content/ThreeD/CoverFlow/CoverFlow';
import { coverFlow } from '../../constants/code/ThreeD/coverFlowCode';

const SAMPLE_ITEMS = [
  { id: 'c01', image: 'https://picsum.photos/seed/aurora/480/640', title: 'Aurora Drift', meta: 'Slowcore · 2019' },
  { id: 'c02', image: 'https://picsum.photos/seed/longshore/480/640', title: 'Longshore', meta: 'Ambient · 2021' },
  { id: 'c03', image: 'https://picsum.photos/seed/halflit/480/640', title: 'Half-Lit Rooms', meta: 'Dream pop · 2020' },
  { id: 'c04', image: 'https://picsum.photos/seed/embers/480/640', title: 'Embers', meta: 'Post-rock · 2018' },
  { id: 'c05', image: 'https://picsum.photos/seed/northern/480/640', title: 'Northern Light', meta: 'Folk · 2022' },
  { id: 'c06', image: 'https://picsum.photos/seed/cobalt/480/640', title: 'Cobalt Sea', meta: 'Electronic · 2023' },
  { id: 'c07', image: 'https://picsum.photos/seed/silvercut/480/640', title: 'Silver Cut', meta: 'Trip-hop · 2017' },
  { id: 'c08', image: 'https://picsum.photos/seed/parallax/480/640', title: 'Parallax', meta: 'Synthwave · 2021' },
  { id: 'c09', image: 'https://picsum.photos/seed/heliodore/480/640', title: 'Heliodore', meta: 'Shoegaze · 2019' },
  { id: 'c10', image: 'https://picsum.photos/seed/oxblood/480/640', title: 'Oxblood', meta: 'Industrial · 2020' }
];

const DEFAULT_PROPS = {
  rotation: 55,
  spacing: 120,
  depth: 180,
  idleSpeed: 0,
  height: 560,
  showReflection: true,
  showCaption: true,
  showHint: true
};

const CoverFlowDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'items',
        type: 'CoverFlowItem[]',
        default: '[]',
        description: 'Array of covers. Each item needs `id`, `image`, `title`; `meta` is an optional caption line.'
      },
      { name: 'rotation', type: 'number', default: '55', description: 'Degrees each side cover hinges toward the center.' },
      { name: 'spacing', type: 'number', default: '120', description: 'Horizontal distance between adjacent covers, in pixels.' },
      { name: 'depth', type: 'number', default: '180', description: 'translateZ falloff per step — how far side covers recede.' },
      {
        name: 'idleSpeed',
        type: 'number',
        default: '0',
        description: 'Auto-advance drift per frame when in view and not dragging. 0 disables it.'
      },
      { name: 'dragSensitivity', type: 'number', default: '0.012', description: 'Pixels-to-index conversion when dragging.' },
      { name: 'ease', type: 'number', default: '0.12', description: 'Easing factor for catching up to the target offset (0..1).' },
      { name: 'showReflection', type: 'boolean', default: 'true', description: 'Render the mirrored reflection beneath each cover.' },
      { name: 'showCaption', type: 'boolean', default: 'true', description: 'Show the active cover’s title and meta in the HUD.' },
      { name: 'showHint', type: 'boolean', default: 'true', description: 'Show the interaction hint in the HUD.' },
      { name: 'hint', type: 'string', default: "'Drag or ←/→'", description: 'Text displayed under the counter as an interaction hint.' },
      { name: 'accentColor', type: 'string', default: '—', description: 'Override the highlight color around the active cover. Accepts any CSS color.' },
      { name: 'height', type: 'number | string', default: '560', description: 'Height of the scene. Numbers are treated as px.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={[]}
      codeObject={coverFlow}
      componentName="CoverFlow"
      flexProps={{ alignItems: 'stretch', minH: '560px' }}
      preview={({ props, key }) => (
        <CoverFlow key={key} {...props} items={SAMPLE_ITEMS} accentColor="var(--accent)" />
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Rotation"
              min={20}
              max={80}
              step={1}
              value={props.rotation}
              valueUnit="°"
              onChange={v => set('rotation', v)}
            />
            <PreviewSlider
              title="Spacing"
              min={70}
              max={200}
              step={2}
              value={props.spacing}
              valueUnit="px"
              onChange={v => set('spacing', v)}
            />
            <PreviewSlider
              title="Depth"
              min={60}
              max={320}
              step={10}
              value={props.depth}
              valueUnit="px"
              onChange={v => set('depth', v)}
            />
            <PreviewSlider
              title="Idle speed"
              min={0}
              max={0.04}
              step={0.002}
              value={props.idleSpeed}
              onChange={v => set('idleSpeed', v)}
            />
            <PreviewSlider
              title="Height"
              min={420}
              max={760}
              step={20}
              value={props.height}
              valueUnit="px"
              onChange={v => set('height', v)}
            />
            <PreviewSwitch title="Reflection" isChecked={props.showReflection} onChange={v => set('showReflection', v)} />
            <PreviewSwitch title="Caption" isChecked={props.showCaption} onChange={v => set('showCaption', v)} />
            <PreviewSwitch title="Hint" isChecked={props.showHint} onChange={v => set('showHint', v)} />
          </>
        );
      }}
    />
  );
};

export default CoverFlowDemo;
