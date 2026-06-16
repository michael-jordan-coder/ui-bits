import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import CubeShowcase from '../../content/ThreeD/CubeShowcase/CubeShowcase';
import { cubeShowcase } from '../../constants/code/ThreeD/cubeShowcaseCode';

const SAMPLE_FACES = [
  { id: 'f01', image: 'https://picsum.photos/seed/atlas/560/560', title: 'Atlas', meta: 'Spatial UI kit' },
  { id: 'f02', image: 'https://picsum.photos/seed/relay/560/560', title: 'Relay', meta: 'Realtime sync' },
  { id: 'f03', image: 'https://picsum.photos/seed/grain/560/560', title: 'Grain', meta: 'Texture pack' },
  { id: 'f04', image: 'https://picsum.photos/seed/pulse/560/560', title: 'Pulse', meta: 'Motion system' },
  { id: 'f05', image: 'https://picsum.photos/seed/cobalt/560/560', title: 'Cobalt', meta: 'Color engine' },
  { id: 'f06', image: 'https://picsum.photos/seed/halftone/560/560', title: 'Halftone', meta: 'Print toolkit' }
];

const DEFAULT_PROPS = {
  size: 280,
  idleSpeed: 0.08,
  dragSensitivity: 0.32,
  ease: 0.1,
  height: 520,
  showTopBottom: false,
  showCounter: true,
  showHint: true
};

const CubeShowcaseDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'faces',
        type: 'CubeFace[]',
        default: '[]',
        description:
          'Faces mapped onto the cube. Each needs `id` and `title`; `image`, `meta`, and `color` are optional. The first 4 (or 6 with `showTopBottom`) are used.'
      },
      { name: 'size', type: 'number', default: '280', description: 'Cube edge length in pixels. Perspective scales with it.' },
      {
        name: 'idleSpeed',
        type: 'number',
        default: '0.08',
        description: 'Degrees of automatic Y rotation per frame when in view and not being dragged.'
      },
      {
        name: 'dragSensitivity',
        type: 'number',
        default: '0.32',
        description: 'Pixels-to-degrees conversion while dragging on both axes.'
      },
      { name: 'ease', type: 'number', default: '0.1', description: 'Easing factor for catching up to the target rotation (0..1).' },
      {
        name: 'showTopBottom',
        type: 'boolean',
        default: 'false',
        description: 'Render the top and bottom faces for a full 6-face cube instead of 4 sides.'
      },
      { name: 'showCounter', type: 'boolean', default: 'true', description: 'Show the "NN / NN" face counter in the HUD.' },
      { name: 'showHint', type: 'boolean', default: 'true', description: 'Show the interaction hint in the HUD.' },
      { name: 'hint', type: 'string', default: "'Drag to spin · ←/→'", description: 'Text displayed under the counter as an interaction hint.' },
      { name: 'accentColor', type: 'string', default: '—', description: 'Override the highlight color of the front-facing face. Accepts any CSS color.' },
      { name: 'height', type: 'number | string', default: '520', description: 'Height of the scene. Numbers are treated as px.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={[]}
      codeObject={cubeShowcase}
      componentName="CubeShowcase"
      flexProps={{ alignItems: 'stretch', minH: '520px' }}
      preview={({ props, key }) => <CubeShowcase key={key} {...props} faces={SAMPLE_FACES} accentColor="var(--accent)" />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Size" min={180} max={360} step={10} value={props.size} valueUnit="px" onChange={v => set('size', v)} />
            <PreviewSlider
              title="Idle speed"
              min={0}
              max={0.3}
              step={0.01}
              value={props.idleSpeed}
              onChange={v => set('idleSpeed', v)}
            />
            <PreviewSlider
              title="Drag sensitivity"
              min={0.1}
              max={0.6}
              step={0.02}
              value={props.dragSensitivity}
              onChange={v => set('dragSensitivity', v)}
            />
            <PreviewSlider title="Ease" min={0.04} max={0.2} step={0.01} value={props.ease} onChange={v => set('ease', v)} />
            <PreviewSlider title="Height" min={420} max={760} step={20} value={props.height} valueUnit="px" onChange={v => set('height', v)} />
            <PreviewSwitch title="Top & bottom faces" isChecked={props.showTopBottom} onChange={v => set('showTopBottom', v)} />
            <PreviewSwitch title="Counter" isChecked={props.showCounter} onChange={v => set('showCounter', v)} />
            <PreviewSwitch title="Hint" isChecked={props.showHint} onChange={v => set('showHint', v)} />
          </>
        );
      }}
    />
  );
};

export default CubeShowcaseDemo;
