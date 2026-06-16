import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';
import PreviewSwitch from '../../components/common/Preview/PreviewSwitch';

import ShinyText from '../../content/TextAnimations/ShinyText/ShinyText';
import { shinyText } from '../../constants/code/TextAnimations/shinyTextCode';

const BASE_COLOR_OPTIONS = [
  { value: '#6b7280', label: 'Slate' },
  { value: '#52525b', label: 'Zinc' },
  { value: '#78716c', label: 'Stone' },
  { value: '#7c6f5b', label: 'Bronze' }
];

const SHINE_COLOR_OPTIONS = [
  { value: '#ffffff', label: 'White' },
  { value: '#fde68a', label: 'Gold' },
  { value: '#bae6fd', label: 'Ice' },
  { value: '#f5d0fe', label: 'Orchid' }
];

const DEFAULT_PROPS = {
  text: 'Shiny Text',
  speed: 4,
  baseColor: '#6b7280',
  shineColor: '#ffffff',
  disabled: false
};

const ShinyTextDemo = () => {
  const propData = useMemo(
    () => [
      { name: 'text', type: 'string', default: "'Shiny Text'", description: 'Text to render (ignored if children are passed).' },
      { name: 'children', type: 'ReactNode', default: '—', description: 'Optional content, takes precedence over text.' },
      { name: 'speed', type: 'number', default: '4', description: 'Seconds per shimmer sweep.' },
      { name: 'baseColor', type: 'string', default: "'#6b7280'", description: 'Muted color the text rests in.' },
      { name: 'shineColor', type: 'string', default: "'#ffffff'", description: 'Bright color of the moving highlight.' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Render static muted text with no shimmer.' },
      { name: 'className', type: 'string', default: "''", description: 'Optional class applied to the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion']}
      codeObject={shinyText}
      componentName="ShinyText"
      preview={({ props, key }) => (
        <ShinyText key={key} {...props} style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', letterSpacing: '-0.02em' }} />
      )}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Speed"
              min={1}
              max={10}
              step={0.5}
              value={props.speed}
              valueUnit="s"
              onChange={val => set('speed', val)}
            />
            <PreviewSelect
              title="Base color"
              options={BASE_COLOR_OPTIONS}
              value={props.baseColor}
              onChange={val => set('baseColor', val)}
            />
            <PreviewSelect
              title="Shine color"
              options={SHINE_COLOR_OPTIONS}
              value={props.shineColor}
              onChange={val => set('shineColor', val)}
            />
            <PreviewSwitch title="Disabled" isChecked={props.disabled} onChange={val => set('disabled', val)} />
          </>
        );
      }}
    />
  );
};

export default ShinyTextDemo;
