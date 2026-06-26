import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import ThinkingTools from '../../content/Components/ThinkingTools/ThinkingTools';
import { thinkingTools } from '../../constants/code/Components/thinkingToolsCode';

const DEFAULT_PROPS = {
  tools: ['Searching the web', 'Reading sources', 'Preparing answer'],
  interval: 1600,
  dotColor: '#a1a1aa',
  textColor: '#a1a1aa',
  completedColor: '#52525b',
};

const PRESET_TOOLS = [
  { value: 'web', label: 'Web search' },
  { value: 'code', label: 'Code analysis' },
  { value: 'file', label: 'File reading' },
];

const TOOLS_PRESETS = {
  web: ['Searching the web', 'Reading sources', 'Preparing answer'],
  code: ['Reading files', 'Analyzing code', 'Preparing answer'],
  file: ['Opening attachment', 'Parsing content', 'Preparing answer'],
};

const ThinkingToolsDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'tools', type: 'string[]', default: "['Searching the web', ...]", description: 'Tool activity labels; the active one pulses, completed ones dim.' },
      { name: 'interval', type: 'number', default: '1600', description: 'Milliseconds each tool stays active before advancing.' },
      { name: 'dotColor', type: 'string', default: "'#a1a1aa'", description: 'Color of the active dot.' },
      { name: 'textColor', type: 'string', default: "'#a1a1aa'", description: 'Color of the active label.' },
      { name: 'completedColor', type: 'string', default: "'#52525b'", description: 'Color used for completed and queued rows.' },
      { name: 'className', type: 'string', default: "''", description: 'Extra class applied to the root element.' },
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={thinkingTools}
      componentName="ThinkingTools"
      preview={({ props, key }) => <ThinkingTools key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => { updateProp(name, val); forceRerender(); };
        return (
          <>
            <PreviewSelect
              title="Preset"
              options={PRESET_TOOLS}
              value={
                PRESET_TOOLS.find(p => JSON.stringify(TOOLS_PRESETS[p.value]) === JSON.stringify(props.tools))?.value ?? 'web'
              }
              onChange={v => set('tools', TOOLS_PRESETS[v])}
            />
            <PreviewSlider
              title="Interval"
              min={600}
              max={3600}
              step={200}
              value={props.interval}
              valueUnit="ms"
              onChange={v => set('interval', v)}
            />
          </>
        );
      }}
    />
  );
};

export default ThinkingToolsDemo;
