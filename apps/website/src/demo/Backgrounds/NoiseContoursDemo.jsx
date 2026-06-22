import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import NoiseContours from '../../content/Backgrounds/NoiseContours/NoiseContours';
import { noiseContours } from '../../constants/code/Backgrounds/noiseContoursCode';

const DEFAULT_PROPS = {
  levels: 7,
  scale: 1,
  speed: 1
};

const NoiseContoursDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'color', type: 'string', default: "'#7aa2ff'", description: 'Stroke color for the contour lines.' },
      { name: 'surfaceColor', type: 'string', default: "'#06070d'", description: 'Backdrop fill color.' },
      { name: 'levels', type: 'number', default: '7', description: 'Number of stacked contour lines.' },
      { name: 'scale', type: 'number', default: '1', description: 'Horizontal frequency of the ridges.' },
      { name: 'speed', type: 'number', default: '1', description: 'Drift speed multiplier.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' },
      { name: 'children', type: 'ReactNode', default: '—', description: 'Optional content centered above the contours.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={noiseContours}
      componentName="NoiseContours"
      flexProps={{ padding: 0, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <NoiseContours key={key} levels={props.levels} scale={props.scale} speed={props.speed} />
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Levels"
              min={4}
              max={14}
              step={1}
              value={props.levels}
              onChange={val => set('levels', val)}
            />
            <PreviewSlider
              title="Scale"
              min={0.5}
              max={2}
              step={0.1}
              value={props.scale}
              onChange={val => set('scale', val)}
            />
            <PreviewSlider
              title="Speed"
              min={0.2}
              max={2}
              step={0.1}
              value={props.speed}
              onChange={val => set('speed', val)}
            />
          </>
        );
      }}
    />
  );
};

export default NoiseContoursDemo;
