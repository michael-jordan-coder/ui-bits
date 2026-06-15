import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSelect from '../../components/common/Preview/PreviewSelect';

import AnimatedMenu from '../../content/Components/AnimatedMenu/AnimatedMenu';
import { animatedMenu } from '../../constants/code/Components/animatedMenuCode';

const DEFAULT_PROPS = {
  accentColor: '#3ecf8e',
  animation: 'bounce'
};

const ANIMATION_OPTIONS = [
  { label: 'Bounce', value: 'bounce' },
  { label: 'Pop', value: 'pop' },
  { label: 'Rotate', value: 'rotate' },
  { label: 'Wiggle', value: 'wiggle' }
];

const ACCENT_OPTIONS = [
  { label: 'Supabase Green', value: '#3ecf8e' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Amber', value: '#f59e0b' }
];

const AnimatedMenuDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'items',
        type: '{ id, label, Icon }[]',
        default: 'Home / Search / Notifications / Settings',
        description: 'Menu rows. Each may include a lucide icon component.'
      },
      { name: 'accentColor', type: 'string', default: '#3ecf8e', description: 'Icon color on hover.' },
      {
        name: 'animation',
        type: "'bounce' | 'pop' | 'rotate' | 'wiggle'",
        default: "'bounce'",
        description: 'The micro-animation each row icon plays on hover.'
      },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root element.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={['motion', 'lucide-react']}
      codeObject={animatedMenu}
      componentName="AnimatedMenu"
      preview={({ props, key }) => <AnimatedMenu key={key} {...props} />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSelect
              title="Animation"
              name="animatedmenu-animation"
              value={props.animation}
              options={ANIMATION_OPTIONS}
              onChange={v => set('animation', v)}
            />
            <PreviewSelect
              title="Accent color"
              name="animatedmenu-accent"
              value={props.accentColor}
              options={ACCENT_OPTIONS}
              onChange={v => set('accentColor', v)}
            />
          </>
        );
      }}
    />
  );
};

export default AnimatedMenuDemo;
