import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import ImageCompare from '../../content/Components/ImageCompare/ImageCompare';
import { imageCompare } from '../../constants/code/Components/imageCompareCode';

const DEFAULT_PROPS = {
  value: 50,
  beforeLabel: 'before',
  afterLabel: 'after',
  accent: '#ffffff'
};

const ACCENTS = [
  { value: '#ffffff', label: 'White' },
  { value: '#6366f1', label: 'Indigo' },
  { value: '#22c55e', label: 'Green' },
  { value: '#f8fafc', label: 'Off-white' }
];

const ImageCompareDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'value', type: 'number', default: '50', description: 'Initial split position, 0–100.' },
      { name: 'beforeLabel', type: 'string', default: "'before'", description: 'Corner label on the top panel.' },
      { name: 'afterLabel', type: 'string', default: "'after'", description: 'Corner label on the bottom panel.' },
      { name: 'before', type: 'string', default: 'undefined', description: 'Optional image URL for the top panel.' },
      { name: 'after', type: 'string', default: 'undefined', description: 'Optional image URL for the bottom panel.' },
      { name: 'accent', type: 'string', default: "'#ffffff'", description: 'Divider and handle color.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the frame.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['lucide-react']}
      codeObject={imageCompare}
      componentName="ImageCompare"
      preview={({ props, key }) => <ImageCompare key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Value"
              min={0}
              max={100}
              step={1}
              value={props.value}
              valueUnit="%"
              onChange={v => set('value', v)}
            />
            <PreviewSelect title="Accent" options={ACCENTS} value={props.accent} onChange={v => set('accent', v)} />
          </>
        );
      }}
    />
  );
};

export default ImageCompareDemo;
