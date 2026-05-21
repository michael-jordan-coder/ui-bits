import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import HoneycombGrid from '../../content/Scroll/HoneycombGrid/HoneycombGrid';
import { honeycombGrid } from '../../constants/code/Scroll/honeycombGridCode';

const DEFAULT_PROPS = {
  wideCount: 4,
  fillFactor: 0.92,
  gapRatio: 0.18,
  fisheyeStrength: 0.7,
  enabled: true
};

const HoneycombGridDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'apps',
        type: 'AppItem[]',
        default: '12-color built-in palette',
        description:
          'List of cells to render. Cycled by row+col hash so any length tiles the infinite grid. Each item: `{ label, color, glyph?, image? }`.'
      },
      {
        name: 'wideCount',
        type: 'number',
        default: '4',
        description: 'Cells in a wide row. Narrow rows have `wideCount - 1`. Default alternates 4 / 3.'
      },
      {
        name: 'fillFactor',
        type: 'number',
        default: '0.92',
        description: 'Fraction of viewport width the wide row spans.'
      },
      {
        name: 'gapRatio',
        type: 'number',
        default: '0.18',
        description: 'Gap between cells, as a fraction of icon size.'
      },
      {
        name: 'fisheyeStrength',
        type: 'number',
        default: '0.7',
        description: '0 = uniform scale, 1 = aggressive edge shrink. Quadratic falloff from center.'
      },
      {
        name: 'enabled',
        type: 'boolean',
        default: 'true',
        description: 'Toggle pointer/wheel interaction and the rAF loop.'
      },
      {
        name: 'onSelect',
        type: '(app, rect) => void',
        default: '—',
        description: 'Fired when a cell is tapped (drag gestures are filtered out).'
      },
      {
        name: 'className',
        type: 'string',
        default: "''",
        description: 'Additional classes merged onto the root frame.'
      }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={[]}
      codeObject={honeycombGrid}
      componentName="HoneycombGrid"
      flexProps={{ minH: '600px', h: '600px' }}
      preview={({ props, key }) => <HoneycombGrid key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Wide row count"
              min={3}
              max={7}
              step={1}
              value={props.wideCount}
              onChange={v => set('wideCount', v)}
            />
            <PreviewSlider
              title="Fill factor"
              min={0.5}
              max={1}
              step={0.02}
              value={props.fillFactor}
              onChange={v => set('fillFactor', v)}
            />
            <PreviewSlider
              title="Gap ratio"
              min={0}
              max={0.4}
              step={0.01}
              value={props.gapRatio}
              onChange={v => set('gapRatio', v)}
            />
            <PreviewSlider
              title="Fisheye strength"
              min={0}
              max={1}
              step={0.05}
              value={props.fisheyeStrength}
              onChange={v => set('fisheyeStrength', v)}
            />
            <PreviewSwitch
              title="Interactive"
              isChecked={props.enabled}
              onChange={v => set('enabled', v)}
            />
          </>
        );
      }}
    />
  );
};

export default HoneycombGridDemo;
