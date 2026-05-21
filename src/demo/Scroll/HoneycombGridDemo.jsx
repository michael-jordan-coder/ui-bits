import { useMemo } from 'react';
import { Flex } from '@chakra-ui/react';
import { CodeTab, PreviewTab, TabsLayout } from '../../components/common/TabsLayout';
import Customize from '../../components/common/Preview/Customize';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';
import CodeExample from '../../components/code/CodeExample';
import RefreshButton from '../../components/common/Preview/RefreshButton';
import FullscreenButton from '../../components/common/Preview/FullscreenButton';
import PropTable from '../../components/common/Preview/PropTable';
import Dependencies from '../../components/code/Dependencies';
import useForceRerender from '../../hooks/useForceRerender';
import useComponentProps from '../../hooks/useComponentProps';
import { ComponentPropsProvider } from '../../components/context/ComponentPropsContext';

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
  const [key, forceRerender] = useForceRerender();
  const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
  const { wideCount, fillFactor, gapRatio, fisheyeStrength, enabled } = props;

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
    <ComponentPropsProvider
      props={props}
      defaultProps={DEFAULT_PROPS}
      resetProps={resetProps}
      hasChanges={hasChanges}
    >
      <TabsLayout>
        <PreviewTab>
          <Flex
            overflow="hidden"
            justifyContent="center"
            alignItems="center"
            minH="600px"
            h="600px"
            position="relative"
            className="demo-container"
          >
            <HoneycombGrid
              key={key}
              wideCount={wideCount}
              fillFactor={fillFactor}
              gapRatio={gapRatio}
              fisheyeStrength={fisheyeStrength}
              enabled={enabled}
            />
            <FullscreenButton />
            <RefreshButton onClick={forceRerender} />
          </Flex>

          <Customize>
            <PreviewSlider
              title="Wide row count"
              min={3}
              max={7}
              step={1}
              value={wideCount}
              onChange={val => {
                updateProp('wideCount', val);
                forceRerender();
              }}
            />
            <PreviewSlider
              title="Fill factor"
              min={0.5}
              max={1}
              step={0.02}
              value={fillFactor}
              onChange={val => {
                updateProp('fillFactor', val);
                forceRerender();
              }}
            />
            <PreviewSlider
              title="Gap ratio"
              min={0}
              max={0.4}
              step={0.01}
              value={gapRatio}
              onChange={val => {
                updateProp('gapRatio', val);
                forceRerender();
              }}
            />
            <PreviewSlider
              title="Fisheye strength"
              min={0}
              max={1}
              step={0.05}
              value={fisheyeStrength}
              onChange={val => {
                updateProp('fisheyeStrength', val);
                forceRerender();
              }}
            />
            <PreviewSwitch
              title="Interactive"
              isChecked={enabled}
              onChange={checked => {
                updateProp('enabled', checked);
                forceRerender();
              }}
            />
          </Customize>

          <PropTable data={propData} />
          <Dependencies dependencyList={[]} />
        </PreviewTab>

        <CodeTab>
          <CodeExample codeObject={honeycombGrid} componentName="HoneycombGrid" />
        </CodeTab>
      </TabsLayout>
    </ComponentPropsProvider>
  );
};

export default HoneycombGridDemo;
