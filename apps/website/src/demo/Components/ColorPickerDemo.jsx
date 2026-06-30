import { useMemo, useState } from 'react';
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

// The `swatches` array is the picker's real customization surface, but arrays
// don't round-trip through the URL-backed prop system — so the palette lives in
// local state and is injected via the preview callback.
const PALETTES = {
  vibrant: ['#3ecf8e', '#7aa2ff', '#f59e0b', '#f43f5e', '#a78bfa', '#22c55e'],
  pastel: ['#a7f3d0', '#bfdbfe', '#fde68a', '#fecaca', '#ddd6fe', '#bbf7d0'],
  sunset: ['#fb7185', '#f97316', '#fbbf24', '#f43f5e', '#e11d48', '#fb923c'],
  earth: ['#84cc16', '#65a30d', '#ca8a04', '#a16207', '#78716c', '#57534e'],
  mono: ['#fafafa', '#d4d4d8', '#a1a1aa', '#71717a', '#52525b', '#27272a']
};

const PALETTE_OPTIONS = [
  { value: 'vibrant', label: 'Vibrant' },
  { value: 'pastel', label: 'Pastel' },
  { value: 'sunset', label: 'Sunset' },
  { value: 'earth', label: 'Earth' },
  { value: 'mono', label: 'Mono' }
];

const ColorPickerDemo = () => {
  const [palette, setPalette] = useState('vibrant');

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
      preview={({ props, key }) => <ColorPicker key={key} {...props} swatches={PALETTES[palette]} />}
      controls={({ props, updateProp, forceRerender }) => (
        <>
          <PreviewSelect
            title="Start color"
            options={START_COLORS}
            value={props.value}
            onChange={v => {
              updateProp('value', v);
              forceRerender();
            }}
          />
          <PreviewSelect title="Swatch palette" options={PALETTE_OPTIONS} value={palette} onChange={setPalette} />
        </>
      )}
    />
  );
};

export default ColorPickerDemo;
