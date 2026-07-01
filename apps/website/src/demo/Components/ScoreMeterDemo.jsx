import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import ScoreMeter from '../../content/Components/ScoreMeter/ScoreMeter';
import { scoreMeter } from '../../constants/code/Components/scoreMeterCode';

const DEFAULT_PROPS = {
  score: 87,
  max: 100,
  size: 200,
  thickness: 14,
  duration: 1.6,
  label: 'Security score',
  showValue: true,
  showMax: false
};

const ScoreMeterDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'score', type: 'number', default: '87', description: 'Target value the meter counts up to.' },
      { name: 'max', type: 'number', default: '100', description: 'Value that represents a full ring.' },
      { name: 'size', type: 'number', default: '200', description: 'Diameter of the gauge, in px.' },
      { name: 'thickness', type: 'number', default: '14', description: 'Stroke width of the ring, in px.' },
      { name: 'duration', type: 'number', default: '1.6', description: 'Count-up / sweep duration, in seconds.' },
      { name: 'label', type: 'string', default: "'Security score'", description: 'Caption shown under the value.' },
      { name: 'showValue', type: 'boolean', default: 'true', description: 'Toggle the numeric value in the center.' },
      { name: 'showMax', type: 'boolean', default: 'false', description: 'Append “/max” after the value.' },
      { name: 'trackColor', type: 'string', default: "'rgba(255,255,255,0.1)'", description: 'Color of the unfilled track.' },
      { name: 'lowColor', type: 'string', default: "'#f43f5e'", description: 'Ring color at the bottom of the range.' },
      { name: 'midColor', type: 'string', default: "'#f59e0b'", description: 'Ring color at the middle of the range.' },
      { name: 'highColor', type: 'string', default: "'#22c55e'", description: 'Ring color at the top of the range.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={scoreMeter}
      componentName="ScoreMeter"
      preview={({ props, key }) => <ScoreMeter key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Score" min={0} max={props.max} value={props.score} onChange={v => set('score', v)} />
            <PreviewSlider
              title="Max"
              min={10}
              max={300}
              step={10}
              value={props.max}
              onChange={v => { updateProp('max', v); updateProp('score', Math.min(props.score, v)); forceRerender(); }}
            />
            <PreviewSlider title="Size" min={120} max={280} value={props.size} valueUnit="px" onChange={v => set('size', v)} />
            <PreviewSlider title="Thickness" min={6} max={28} value={props.thickness} valueUnit="px" onChange={v => set('thickness', v)} />
            <PreviewSlider
              title="Duration"
              min={0}
              max={3}
              step={0.1}
              value={props.duration}
              valueUnit="s"
              onChange={v => set('duration', v)}
            />
            <PreviewSwitch title="Show value" isChecked={props.showValue} onChange={v => set('showValue', v)} />
            <PreviewSwitch title="Show /max" isChecked={props.showMax} onChange={v => set('showMax', v)} />
          </>
        );
      }}
    />
  );
};

export default ScoreMeterDemo;
