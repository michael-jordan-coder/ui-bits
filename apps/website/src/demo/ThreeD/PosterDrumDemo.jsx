import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import PosterDrum from '../../content/ThreeD/PosterDrum/PosterDrum';
import { posterDrum } from '../../constants/code/ThreeD/posterDrumCode';

const DEFAULT_PROPS = {
  radius: 410,
  itemWidth: 240,
  itemHeight: 340,
  idleSpeed: 0.045,
  dragSensitivity: 0.18,
  enableInertia: true,
  showHud: true
};

const PosterDrumDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'items',
        type: 'PosterItem[]',
        default: '10 curated films',
        description: 'Posters to render. Each: `{ id, title, year?, tag?, src? }`.'
      },
      {
        name: 'radius',
        type: 'number',
        default: '410',
        description: 'Cylinder radius in px. Auto-bumped if chord < itemWidth so adjacent posters never intersect.'
      },
      { name: 'itemWidth', type: 'number', default: '240', description: 'Poster width in px.' },
      { name: 'itemHeight', type: 'number', default: '340', description: 'Poster height in px.' },
      {
        name: 'idleSpeed',
        type: 'number',
        default: '0.045',
        description: 'Degrees per 60fps frame when idle and in view. 0 disables drift.'
      },
      {
        name: 'dragSensitivity',
        type: 'number',
        default: '0.18',
        description: 'Degrees rotated per pixel of pointer drag.'
      },
      {
        name: 'enableInertia',
        type: 'boolean',
        default: 'true',
        description: 'Apply velocity decay after pointer release.'
      },
      {
        name: 'showHud',
        type: 'boolean',
        default: 'true',
        description: 'Show the index counter (top-right) and active-item title (bottom-left).'
      },
      {
        name: 'activeIndex',
        type: 'number',
        default: '—',
        description: 'Controlled active index. Disables idle drift and drag when set.'
      },
      {
        name: 'onActiveChange',
        type: '(item, index) => void',
        default: '—',
        description: 'Fired when the front-facing poster changes.'
      },
      {
        name: 'renderItem',
        type: '(item, isActive, index) => ReactNode',
        default: '—',
        description: 'Custom poster renderer. Defaults to the built-in cinema card.'
      },
      {
        name: 'className',
        type: 'string',
        default: "''",
        description: 'Additional classes merged onto the root section.'
      }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={[]}
      codeObject={posterDrum}
      componentName="PosterDrum"
      flexProps={{ minH: '640px', h: '640px' }}
      preview={({ props, key }) => <PosterDrum key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Radius"
              min={320}
              max={760}
              step={10}
              value={props.radius}
              valueUnit="px"
              onChange={v => set('radius', v)}
            />
            <PreviewSlider
              title="Poster width"
              min={160}
              max={320}
              step={4}
              value={props.itemWidth}
              valueUnit="px"
              onChange={v => set('itemWidth', v)}
            />
            <PreviewSlider
              title="Poster height"
              min={220}
              max={440}
              step={4}
              value={props.itemHeight}
              valueUnit="px"
              onChange={v => set('itemHeight', v)}
            />
            <PreviewSlider
              title="Idle speed"
              min={0}
              max={0.18}
              step={0.005}
              value={props.idleSpeed}
              onChange={v => set('idleSpeed', v)}
            />
            <PreviewSlider
              title="Drag sensitivity"
              min={0.06}
              max={0.4}
              step={0.01}
              value={props.dragSensitivity}
              onChange={v => set('dragSensitivity', v)}
            />
            <PreviewSwitch
              title="Drag inertia"
              isChecked={props.enableInertia}
              onChange={v => set('enableInertia', v)}
            />
            <PreviewSwitch
              title="Show HUD"
              isChecked={props.showHud}
              onChange={v => set('showHud', v)}
            />
          </>
        );
      }}
    />
  );
};

export default PosterDrumDemo;
