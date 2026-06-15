import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import StarRating from '../../content/Components/StarRating/StarRating';
import { starRating } from '../../constants/code/Components/starRatingCode';

const DEFAULT_PROPS = {
  count: 5,
  defaultValue: 4,
  size: 44,
  color: '#fbbf24',
  showLabel: true,
  readOnly: false
};

const COLORS = [
  { value: '#fbbf24', label: 'Gold' },
  { value: '#f43f5e', label: 'Rose' },
  { value: '#38bdf8', label: 'Sky' },
  { value: '#22c55e', label: 'Green' },
  { value: '#a855f7', label: 'Violet' }
];

const StarRatingDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'count', type: 'number', default: '5', description: 'Number of stars to render.' },
      { name: 'defaultValue', type: 'number', default: '0', description: 'Initial rating (0 = unrated).' },
      { name: 'size', type: 'number', default: '40', description: 'Size of each star, in px.' },
      { name: 'color', type: 'string', default: "'#fbbf24'", description: 'Fill color of selected stars and label.' },
      {
        name: 'emptyColor',
        type: 'string',
        default: "'rgba(255,255,255,0.18)'",
        description: 'Outline color of unselected stars.'
      },
      {
        name: 'labels',
        type: 'string[]',
        default: "['Hated it', …]",
        description: 'Captions shown per rating, indexed by value.'
      },
      { name: 'showLabel', type: 'boolean', default: 'true', description: 'Toggle the pop-in caption under the stars.' },
      { name: 'readOnly', type: 'boolean', default: 'false', description: 'Render as a static, non-interactive display.' },
      {
        name: 'onChange',
        type: '(value: number) => void',
        default: 'undefined',
        description: 'Fires when the rating changes.'
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
      codeObject={starRating}
      componentName="StarRating"
      preview={({ props, key }) => <StarRating key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider title="Stars" min={3} max={7} value={props.count} onChange={v => set('count', v)} />
            <PreviewSlider
              title="Default value"
              min={0}
              max={props.count}
              value={props.defaultValue}
              onChange={v => set('defaultValue', v)}
            />
            <PreviewSlider
              title="Size"
              min={28}
              max={64}
              value={props.size}
              valueUnit="px"
              onChange={v => set('size', v)}
            />
            <PreviewSelect title="Color" options={COLORS} value={props.color} onChange={v => set('color', v)} />
            <PreviewSwitch title="Show label" isChecked={props.showLabel} onChange={v => set('showLabel', v)} />
            <PreviewSwitch title="Read only" isChecked={props.readOnly} onChange={v => set('readOnly', v)} />
          </>
        );
      }}
    />
  );
};

export default StarRatingDemo;
