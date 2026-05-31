import PosterHelix from '../content/ThreeD/PosterHelix/PosterHelix';
import PosterDrum from '../content/ThreeD/PosterDrum/PosterDrum';
import HoneycombGrid from '../content/Scroll/HoneycombGrid/HoneycombGrid';
import FillButton from '../content/Components/FillButton/FillButton';
import Dropdown from '../content/Components/Dropdown/Dropdown';
import Sidebar from '../content/Components/Sidebar/Sidebar';

const HELIX_POSTERS = [
  { id: 'p01', image: 'https://picsum.photos/seed/aurora/360/480', title: 'Aurora Drift' },
  { id: 'p02', image: 'https://picsum.photos/seed/longshore/360/480', title: 'Longshore' },
  { id: 'p03', image: 'https://picsum.photos/seed/embers/360/480', title: 'Embers' },
  { id: 'p04', image: 'https://picsum.photos/seed/cobalt/360/480', title: 'Cobalt Sea' },
  { id: 'p05', image: 'https://picsum.photos/seed/parallax/360/480', title: 'Parallax' },
  { id: 'p06', image: 'https://picsum.photos/seed/oxblood/360/480', title: 'Oxblood' }
];

// Single source of truth for the live component cards shown in both the landing
// hero gallery and the /components/index catalog.
export const showcaseItems = [
  {
    key: 'poster-helix',
    name: 'Poster Helix',
    category: '3D',
    route: '/3-d/poster-helix',
    tags: ['3d', 'helix', 'drag'],
    render: () => (
      <PosterHelix
        posters={HELIX_POSTERS}
        radius={200}
        yStep={36}
        turnDeg={45}
        idleSpeed={0.06}
        height="100%"
        showAxis={false}
        showGrain={false}
        showCounter={false}
        showHint={false}
        accentColor="var(--accent)"
      />
    )
  },
  {
    key: 'honeycomb-grid',
    name: 'Honeycomb Grid',
    category: 'Scroll',
    route: '/scroll/honeycomb-grid',
    tags: ['grid', 'hex', 'fisheye'],
    render: () => <HoneycombGrid wideCount={5} fisheyeStrength={0.72} />
  },
  {
    key: 'poster-drum',
    name: 'Poster Drum',
    category: '3D',
    route: '/3-d/poster-drum',
    tags: ['3d', 'carousel', 'cinema'],
    render: () => (
      <PosterDrum radius={230} itemWidth={120} itemHeight={170} idleSpeed={0.05} showHud={false} />
    )
  },
  {
    key: 'fill-button',
    name: 'Fill Button',
    category: 'Components',
    route: '/components/fill-button',
    tags: ['button', 'gsap', 'hover'],
    render: () => (
      <div className="component-card-center">
        <FillButton filled fillColor="#5227FF">
          Get started
        </FillButton>
      </div>
    )
  },
  {
    key: 'dropdown',
    name: 'Dropdown',
    category: 'Components',
    route: '/components/dropdown',
    tags: ['select', 'keyboard', 'a11y'],
    render: () => (
      <div className="component-card-center">
        <Dropdown defaultValue="fra1" placeholder="Select a region" />
      </div>
    )
  },
  {
    key: 'sidebar',
    name: 'Sidebar',
    category: 'Components',
    route: '/components/sidebar',
    tags: ['nav', 'layout', 'collapsible'],
    render: () => (
      <div className="component-card-sidebar">
        <Sidebar defaultWidth={232} />
      </div>
    )
  }
];
