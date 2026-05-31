import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa6';

import { showcaseItems } from '../../../constants/showcaseItems';
import ComponentCard from '../../common/ComponentCard';

import './Gallery.css';

// Bento placement — the 3D pieces get the big tiles.
const AREA_BY_KEY = {
  'poster-helix': 'helix',
  'honeycomb-grid': 'honey',
  'poster-drum': 'drum',
  'fill-button': 'fill',
  dropdown: 'drop',
  sidebar: 'side'
};

const Gallery = () => (
  <section id="gallery" className="gallery">
    <header className="gallery-head">
      <h2 className="gallery-title">Browse the collection</h2>
      <Link to="/components/index" className="gallery-all">
        All components <FaArrowRight size={11} />
      </Link>
    </header>

    <div className="gallery-grid">
      {showcaseItems.map(item => (
        <ComponentCard key={item.key} item={item} style={{ gridArea: AREA_BY_KEY[item.key] }} />
      ))}
    </div>
  </section>
);

export default Gallery;
