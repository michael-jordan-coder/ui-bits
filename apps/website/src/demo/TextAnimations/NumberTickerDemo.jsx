import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';
import PreviewInput from '../../components/common/Preview/PreviewInput';

import NumberTicker from '../../content/TextAnimations/NumberTicker/NumberTicker';
import { numberTicker } from '../../constants/code/TextAnimations/numberTickerCode';

const DEFAULT_PROPS = {
  value: 1234,
  decimals: 0,
  group: true,
  prefix: '',
  suffix: '',
  duration: 0.9,
  color: '#fafafa',
  fontSize: 64
};

const PREFIXES = [
  { value: '', label: 'None' },
  { value: '$', label: 'Dollar ($)' },
  { value: '€', label: 'Euro (€)' },
  { value: '#', label: 'Hash (#)' }
];

const COLORS = [
  { value: '#fafafa', label: 'White' },
  { value: '#fbbf24', label: 'Amber' },
  { value: '#38bdf8', label: 'Sky' },
  { value: '#22c55e', label: 'Green' }
];

const NumberTickerDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'value', type: 'number', default: '0', description: 'The number to display; rolls when it changes.' },
      { name: 'decimals', type: 'number', default: '0', description: 'Fixed number of decimal places.' },
      { name: 'group', type: 'boolean', default: 'true', description: 'Insert thousands separators (commas).' },
      { name: 'prefix', type: 'string', default: "''", description: 'Static text rendered before the number.' },
      { name: 'suffix', type: 'string', default: "''", description: 'Static text rendered after the number.' },
      { name: 'duration', type: 'number', default: '0.9', description: 'Roll duration per reel, in seconds.' },
      { name: 'color', type: 'string', default: "'#fafafa'", description: 'Text color of the digits.' },
      { name: 'fontSize', type: 'number', default: '64', description: 'Font size of the number, in px.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={numberTicker}
      componentName="NumberTicker"
      preview={({ props, key }) => <NumberTicker key={key} {...props} />}
      controls={({ props, updateProp }) => {
        // No forceRerender: keep the element mounted so value changes roll.
        const set = (name, val) => updateProp(name, val);
        return (
          <>
            <PreviewInput
              title="Value"
              value={String(props.value)}
              placeholder="Type a number…"
              inputMode="decimal"
              maxLength={12}
              onChange={v => {
                const n = Number(v.replace(/[^0-9.-]/g, ''));
                set('value', Number.isFinite(n) ? n : 0);
              }}
            />
            <PreviewSlider title="Value" min={0} max={99999} value={props.value} onChange={v => set('value', v)} />
            <PreviewSlider title="Decimals" min={0} max={2} value={props.decimals} onChange={v => set('decimals', v)} />
            <PreviewSlider
              title="Duration"
              min={0.3}
              max={2}
              step={0.1}
              value={props.duration}
              valueUnit="s"
              onChange={v => set('duration', v)}
            />
            <PreviewSlider
              title="Font size"
              min={32}
              max={96}
              value={props.fontSize}
              valueUnit="px"
              onChange={v => set('fontSize', v)}
            />
            <PreviewSelect title="Prefix" options={PREFIXES} value={props.prefix} onChange={v => set('prefix', v)} />
            <PreviewSelect title="Color" options={COLORS} value={props.color} onChange={v => set('color', v)} />
            <PreviewSwitch title="Group (commas)" isChecked={props.group} onChange={v => set('group', v)} />
          </>
        );
      }}
    />
  );
};

export default NumberTickerDemo;
