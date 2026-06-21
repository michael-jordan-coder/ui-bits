import PosterHelix from '../content/ThreeD/PosterHelix/PosterHelix';
import PosterDrum from '../content/ThreeD/PosterDrum/PosterDrum';
import HoneycombGrid from '../content/Scroll/HoneycombGrid/HoneycombGrid';
import FillButton from '../content/Components/FillButton/FillButton';
import Dropdown from '../content/Components/Dropdown/Dropdown';
import Sidebar from '../content/Components/Sidebar/Sidebar';
import ScrambleText from '../content/TextAnimations/ScrambleText/ScrambleText';
import DotGrid from '../content/Backgrounds/DotGrid/DotGrid';

const HELIX_POSTERS = [
  { id: 'p01', image: 'https://picsum.photos/seed/aurora/360/480', title: 'Aurora Drift' },
  { id: 'p02', image: 'https://picsum.photos/seed/longshore/360/480', title: 'Longshore' },
  { id: 'p03', image: 'https://picsum.photos/seed/embers/360/480', title: 'Embers' },
  { id: 'p04', image: 'https://picsum.photos/seed/cobalt/360/480', title: 'Cobalt Sea' },
  { id: 'p05', image: 'https://picsum.photos/seed/parallax/360/480', title: 'Parallax' },
  { id: 'p06', image: 'https://picsum.photos/seed/oxblood/360/480', title: 'Oxblood' }
];

// Bespoke live previews, keyed by component slug. The single source of truth for
// card previews on both the landing-hero Gallery and the /components/index catalog.
// Any slug NOT present here falls back to an auto preview rendered from the
// component's own content/ implementation (see LivePreview).
export const componentPreviews = {
  'poster-helix': () => (
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
  ),
  'honeycomb-grid': () => <HoneycombGrid wideCount={5} fisheyeStrength={0.72} />,
  'poster-drum': () => (
    <PosterDrum radius={230} itemWidth={120} itemHeight={170} idleSpeed={0.05} showHud={false} />
  ),
  'fill-button': () => (
    <div className="component-card-center">
      <FillButton filled>Get started</FillButton>
    </div>
  ),
  dropdown: () => (
    <div className="component-card-center">
      <Dropdown defaultValue="fra1" placeholder="Select a region" />
    </div>
  ),
  sidebar: () => (
    <div className="component-card-sidebar">
      <Sidebar defaultWidth={232} />
    </div>
  ),
  'scramble-text': () => (
    <div className="component-card-center">
      <ScrambleText text="ui bits" trigger="view" duration={1100} />
    </div>
  ),
  'dot-grid': () => (
    <div style={{ position: 'absolute', inset: 0 }}>
      <DotGrid gap={28} dotSize={2} proximity={110} />
    </div>
  )
};
