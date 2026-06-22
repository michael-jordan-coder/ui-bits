import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import Grid from '../../content/Backgrounds/Grid/Grid';
import { grid } from '../../constants/code/Backgrounds/gridCode';

const DEFAULT_PROPS = {
  cellSize: 48,
  speed: 1,
  lineWidth: 1
};

const GridDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'cellSize', type: 'number', default: '48', description: 'Spacing between grid lines in pixels.' },
      { name: 'speed', type: 'number', default: '1', description: 'Drift + bloom speed multiplier.' },
      { name: 'lineWidth', type: 'number', default: '1', description: 'Stroke width of the grid lines.' },
      { name: 'color', type: 'string', default: "'#5227FF'", description: 'Grid line color.' },
      { name: 'glowColor', type: 'string', default: "'#7C8CFF'", description: 'Color of the travelling bloom.' },
      { name: 'surfaceColor', type: 'string', default: "'#08080c'", description: 'Backdrop fill behind the grid.' },
      {
        name: 'children',
        type: 'ReactNode',
        default: 'undefined',
        description: 'Optional content centered above the grid.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={grid}
      componentName="Grid"
      flexProps={{ padding: 0, height: 420, overflow: 'hidden' }}
      preview={({ props, key }) => (
        <Grid key={key} {...props}>
          <span
            style={{
              fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: '#fff'
            }}
          >
            Grid
          </span>
        </Grid>
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Cell size" min={24} max={96} step={2} value={props.cellSize} valueUnit="px" onChange={v => set('cellSize', v)} />
            <PreviewSlider title="Speed" min={0} max={3} step={0.1} value={props.speed} onChange={v => set('speed', v)} />
            <PreviewSlider title="Line width" min={0.5} max={3} step={0.5} value={props.lineWidth} valueUnit="px" onChange={v => set('lineWidth', v)} />
          </>
        );
      }}
    />
  );
};

export default GridDemo;
