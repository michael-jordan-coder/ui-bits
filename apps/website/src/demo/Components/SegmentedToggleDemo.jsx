import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import SegmentedToggle from '../../content/Components/SegmentedToggle/SegmentedToggle';
import { segmentedToggle } from '../../constants/code/Components/segmentedToggleCode';

const DEFAULT_PROPS = {
  accentColor: '#ff385c',
  size: 'md'
};

const ACCENT_OPTIONS = [
  { label: 'Airbnb Red', value: '#ff385c' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Green', value: '#22c55e' },
  { label: 'White', value: '#fafafa' }
];

const SIZE_OPTIONS = [
  { label: 'md', value: 'md' },
  { label: 'sm', value: 'sm' }
];

const SegmentedToggleDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'options',
        type: '{ id, label, Icon }[]',
        default: 'Travelling / Hosting',
        description: 'Segments to render. Each may include a lucide icon component.'
      },
      { name: 'defaultValue', type: 'string', default: 'options[0].id', description: 'Id of the segment selected first.' },
      { name: 'accentColor', type: 'string', default: '#ff385c', description: 'Fill color of the sliding pill.' },
      { name: 'size', type: "'sm' | 'md'", default: "'md'", description: 'Padding and type scale.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={segmentedToggle}
      componentName="SegmentedToggle"
      preview={({ props, key }) => <SegmentedToggle key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect
              title="Accent color"
              name="segmented-accent"
              value={props.accentColor}
              options={ACCENT_OPTIONS}
              onChange={v => set('accentColor', v)}
            />
            <PreviewSelect
              title="Size"
              name="segmented-size"
              value={props.size}
              options={SIZE_OPTIONS}
              onChange={v => set('size', v)}
            />
          </>
        );
      }}
    />
  );
};

export default SegmentedToggleDemo;
