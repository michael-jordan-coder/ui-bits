import { useMemo } from 'react';
import DemoShell from '../../components/common/Preview/DemoShell';
import PreviewSlider from '../../components/common/Preview/PreviewSlider';

import TagSphere from '../../content/ThreeD/TagSphere/TagSphere';
import { tagSphere } from '../../constants/code/ThreeD/tagSphereCode';

const SAMPLE_TAGS = [
  'React',
  'TypeScript',
  'Vite',
  'Tailwind',
  'Chakra',
  'Framer Motion',
  'GSAP',
  'Three.js',
  'WebGL',
  'Node',
  'Bun',
  'Deno',
  'GraphQL',
  'tRPC',
  'Prisma',
  'Postgres',
  'Redis',
  'Docker',
  'Vercel',
  'Fly.io',
  'Zod',
  'Vitest',
  'Playwright',
  'Storybook',
  'pnpm',
  'Turbo',
  'ESLint',
  'Prettier',
  'Rust',
  'WASM',
  'Figma',
  'Linear',
  'Sanity',
  'Stripe',
  'Resend',
  'Clerk'
];

const DEFAULT_PROPS = {
  radius: 150,
  idleSpeed: 0.0022,
  dragSensitivity: 0.18,
  friction: 0.94,
  maxFontSize: 22,
  minFontSize: 11,
  height: 420
};

const TagSphereDemo = () => {
  const propData = useMemo(
    () => [
      {
        name: 'tags',
        type: 'string[] | { label, value?, href? }[]',
        default: '[]',
        description:
          'Tags distributed over the sphere. Pass plain strings, or objects with `label` and optional `value` / `href` (renders an anchor instead of a button).'
      },
      { name: 'radius', type: 'number', default: '150', description: 'Sphere radius in pixels — distance from center to each label.' },
      {
        name: 'idleSpeed',
        type: 'number',
        default: '0.0022',
        description: 'Radians of automatic yaw drift per frame when in view, not dragging, and motion is allowed.'
      },
      { name: 'dragSensitivity', type: 'number', default: '0.18', description: 'Degrees of rotation applied per pixel dragged.' },
      {
        name: 'friction',
        type: 'number',
        default: '0.94',
        description: 'Inertial decay multiplier after release (0..1). Lower stops sooner, higher coasts longer.'
      },
      { name: 'maxFontSize', type: 'number', default: '22', description: 'Font size in pixels for front-facing labels.' },
      { name: 'minFontSize', type: 'number', default: '11', description: 'Font size in pixels for labels at the back of the sphere.' },
      { name: 'accentColor', type: 'string', default: '—', description: 'Highlight color on hover / focus. Accepts any CSS color.' },
      { name: 'height', type: 'number | string', default: '420', description: 'Height of the scene. Numbers are treated as px.' },
      { name: 'className', type: 'string', default: "''", description: 'Additional classes merged onto the root element.' },
      { name: 'ariaLabel', type: 'string', default: "'Tag cloud'", description: 'Accessible label for the interactive sphere group.' }
    ],
    []
  );

  return (
    <DemoShell
      defaultProps={DEFAULT_PROPS}
      propData={propData}
      dependencies={[]}
      codeObject={tagSphere}
      componentName="TagSphere"
      flexProps={{ alignItems: 'stretch', minH: '480px' }}
      preview={({ props, key }) => <TagSphere key={key} {...props} tags={SAMPLE_TAGS} accentColor="var(--accent)" />}
      controls={({ props, updateProp, forceRerender }) => {
        const set = (name, val) => {
          updateProp(name, val);
          forceRerender();
        };
        return (
          <>
            <PreviewSlider
              title="Radius"
              min={100}
              max={240}
              step={5}
              value={props.radius}
              valueUnit="px"
              onChange={v => set('radius', v)}
            />
            <PreviewSlider
              title="Idle speed"
              min={0}
              max={0.01}
              step={0.0005}
              value={props.idleSpeed}
              onChange={v => set('idleSpeed', v)}
            />
            <PreviewSlider
              title="Drag sensitivity"
              min={0.05}
              max={0.5}
              step={0.01}
              value={props.dragSensitivity}
              onChange={v => set('dragSensitivity', v)}
            />
            <PreviewSlider
              title="Friction"
              min={0.8}
              max={0.99}
              step={0.01}
              value={props.friction}
              onChange={v => set('friction', v)}
            />
            <PreviewSlider
              title="Max font"
              min={16}
              max={36}
              step={1}
              value={props.maxFontSize}
              valueUnit="px"
              onChange={v => set('maxFontSize', v)}
            />
            <PreviewSlider
              title="Min font"
              min={8}
              max={18}
              step={1}
              value={props.minFontSize}
              valueUnit="px"
              onChange={v => set('minFontSize', v)}
            />
            <PreviewSlider
              title="Height"
              min={320}
              max={640}
              step={20}
              value={props.height}
              valueUnit="px"
              onChange={v => set('height', v)}
            />
          </>
        );
      }}
    />
  );
};

export default TagSphereDemo;
