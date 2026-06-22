import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import ColorPicker from '../../content/Components/ColorPicker/ColorPicker';
import { colorPicker } from '../../constants/code/Components/colorPickerCode';

const DEFAULT_PROPS = {
  value: '#3ecf8e'
};

const START_COLORS = [
  { value: '#3ecf8e', label: 'Emerald' },
  { value: '#7aa2ff', label: 'Periwinkle' },
  { value: '#f43f5e', label: 'Rose' },
  { value: '#a78bfa', label: 'Violet' }
];

const ColorPickerDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'value', type: 'string', default: "'#3ecf8e'", description: 'Initial selected color, hex.' },
      {
        name: 'swatches',
        type: 'string[]',
        default: "['#3ecf8e', …]",
        description: 'Preset colors shown as quick-pick buttons.'
      },
      {
        name: 'onChange',
        type: '(hex: string) => void',
        default: 'undefined',
        description: 'Fires with the new hex on drag or swatch pick.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={colorPicker}
      componentName="ColorPicker"
      preview={({ props, key }) => <ColorPicker key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => (
        <PreviewSelect
          title="Start color"
          options={START_COLORS}
          value={props.value}
          onChange={v => {
            updateProp('value', v);
            forceRerender();
          }}
        />
      )}
    />
  );
};

export default ColorPickerDemo;
