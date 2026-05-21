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
  const [key, forceRerender] = useForceRerender();
  const { props, updateProp, resetProps, hasChanges } = useComponentProps(DEFAULT_PROPS);
  const { radius, itemWidth, itemHeight, idleSpeed, dragSensitivity, enableInertia, showHud } =
    props;

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
      {
        name: 'itemWidth',
        type: 'number',
        default: '240',
        description: 'Poster width in px.'
      },
      {
        name: 'itemHeight',
        type: 'number',
        default: '340',
        description: 'Poster height in px.'
      },
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
            minH="640px"
            h="640px"
            position="relative"
            className="demo-container"
          >
            <PosterDrum
              key={key}
              radius={radius}
              itemWidth={itemWidth}
              itemHeight={itemHeight}
              idleSpeed={idleSpeed}
              dragSensitivity={dragSensitivity}
              enableInertia={enableInertia}
              showHud={showHud}
            />
            <FullscreenButton />
            <RefreshButton onClick={forceRerender} />
          </Flex>

          <Customize>
            <PreviewSlider
              title="Radius"
              min={320}
              max={760}
              step={10}
              value={radius}
              valueUnit="px"
              onChange={val => {
                updateProp('radius', val);
                forceRerender();
              }}
            />
            <PreviewSlider
              title="Poster width"
              min={160}
              max={320}
              step={4}
              value={itemWidth}
              valueUnit="px"
              onChange={val => {
                updateProp('itemWidth', val);
                forceRerender();
              }}
            />
            <PreviewSlider
              title="Poster height"
              min={220}
              max={440}
              step={4}
              value={itemHeight}
              valueUnit="px"
              onChange={val => {
                updateProp('itemHeight', val);
                forceRerender();
              }}
            />
            <PreviewSlider
              title="Idle speed"
              min={0}
              max={0.18}
              step={0.005}
              value={idleSpeed}
              onChange={val => {
                updateProp('idleSpeed', val);
                forceRerender();
              }}
            />
            <PreviewSlider
              title="Drag sensitivity"
              min={0.06}
              max={0.4}
              step={0.01}
              value={dragSensitivity}
              onChange={val => {
                updateProp('dragSensitivity', val);
                forceRerender();
              }}
            />
            <PreviewSwitch
              title="Drag inertia"
              isChecked={enableInertia}
              onChange={checked => {
                updateProp('enableInertia', checked);
                forceRerender();
              }}
            />
            <PreviewSwitch
              title="Show HUD"
              isChecked={showHud}
              onChange={checked => {
                updateProp('showHud', checked);
                forceRerender();
              }}
            />
          </Customize>

          <PropTable data={propData} />
          <Dependencies dependencyList={[]} />
        </PreviewTab>

        <CodeTab>
          <CodeExample codeObject={posterDrum} componentName="PosterDrum" />
        </CodeTab>
      </TabsLayout>
    </ComponentPropsProvider>
  );
};

export default PosterDrumDemo;
