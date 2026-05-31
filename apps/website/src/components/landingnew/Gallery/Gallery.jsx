import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';

import PosterHelix from '../../../content/ThreeD/PosterHelix/PosterHelix';
import PosterDrum from '../../../content/ThreeD/PosterDrum/PosterDrum';
import HoneycombGrid from '../../../content/Scroll/HoneycombGrid/HoneycombGrid';
import FillButton from '../../../content/Components/FillButton/FillButton';
import Dropdown from '../../../content/Components/Dropdown/Dropdown';
import Sidebar from '../../../content/Components/Sidebar/Sidebar';

import './Gallery.css';

const HELIX_POSTERS = [
  { id: 'p01', image: 'https://picsum.photos/seed/aurora/360/480', title: 'Aurora Drift' },
  { id: 'p02', image: 'https://picsum.photos/seed/longshore/360/480', title: 'Longshore' },
  { id: 'p03', image: 'https://picsum.photos/seed/embers/360/480', title: 'Embers' },
  { id: 'p04', image: 'https://picsum.photos/seed/cobalt/360/480', title: 'Cobalt Sea' },
  { id: 'p05', image: 'https://picsum.photos/seed/parallax/360/480', title: 'Parallax' },
  { id: 'p06', image: 'https://picsum.photos/seed/oxblood/360/480', title: 'Oxblood' }
];

const ITEMS = [
  {
    area: 'helix',
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
    area: 'honey',
    name: 'Honeycomb Grid',
    category: 'Scroll',
    route: '/scroll/honeycomb-grid',
    tags: ['grid', 'hex', 'fisheye'],
    render: () => <HoneycombGrid wideCount={5} fisheyeStrength={0.72} />
  },
  {
    area: 'drum',
    name: 'Poster Drum',
    category: '3D',
    route: '/3-d/poster-drum',
    tags: ['3d', 'carousel', 'cinema'],
    render: () => (
      <PosterDrum radius={230} itemWidth={120} itemHeight={170} idleSpeed={0.05} showHud={false} />
    )
  },
  {
    area: 'fill',
    name: 'Fill Button',
    category: 'Components',
    route: '/components/fill-button',
    tags: ['button', 'gsap', 'hover'],
    render: () => (
      <div className="gallery-center">
        <FillButton filled fillColor="#5227FF">
          Get started
        </FillButton>
      </div>
    )
  },
  {
    area: 'drop',
    name: 'Dropdown',
    category: 'Components',
    route: '/components/dropdown',
    tags: ['select', 'keyboard', 'a11y'],
    render: () => (
      <div className="gallery-center">
        <Dropdown defaultValue="fra1" placeholder="Select a region" />
      </div>
    )
  },
  {
    area: 'side',
    name: 'Sidebar',
    category: 'Components',
    route: '/components/sidebar',
    tags: ['nav', 'layout', 'collapsible'],
    render: () => (
      <div className="gallery-sidebar-wrap">
        <Sidebar defaultWidth={232} />
      </div>
    )
  }
];

const Gallery = () => (
  <section id="gallery" className="gallery">
    <header className="gallery-head">
      <h2 className="gallery-title">Browse the collection</h2>
      <Link to="/components/index" className="gallery-all">
        All components <FaArrowRight size={11} />
      </Link>
    </header>

    <div className="gallery-grid">
      {ITEMS.map(item => (
        <Link key={item.route} to={item.route} className="gallery-card" style={{ gridArea: item.area }}>
          <div className="gallery-card-preview" aria-hidden="true">
            {item.render()}
          </div>
          <div className="gallery-card-blur" aria-hidden="true">
            <div />
            <div />
            <div />
            <div />
            <div />
          </div>
          <span className="gallery-card-go" aria-hidden="true">
            <FaArrowRight size={12} />
          </span>
          <div className="gallery-card-overlay">
            <div className="gallery-card-row">
              <span className="gallery-card-name">{item.name}</span>
              <span className="gallery-card-cat">{item.category}</span>
            </div>
            <div className="gallery-card-tags">
              {item.tags.map(tag => (
                <span key={tag} className="gallery-card-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

export default Gallery;
