import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import useIsMobile from '../../../hooks/useIsMobile';
import MobileNav from '../../navs/MobileNav';
// import AccentPicker from './AccentPicker';

const NAV_LINKS = [
  { label: 'Docs', to: '/get-started/introduction', match: '/get-started' },
  { label: 'Components', to: '/components/index', match: '/components' }
];

const Navbar = ({ showDocs }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const isActive = match => location.pathname.startsWith(match);

  return (
    <header className="cb-navbar">
      <Link to="/" className="cb-navbar-brand">
        ui bits
      </Link>
      <nav className="cb-navbar-links" aria-label="Primary">
        {NAV_LINKS.map(({ label, to, match }) => (
          <Link key={to} to={to} className={isActive(match) ? 'cb-navbar-link-active' : undefined}>
            {label}
          </Link>
        ))}
        {/* <AccentPicker /> */}
      </nav>
      <button
        type="button"
        className="cb-navbar-toggle"
        onClick={() => setMenuOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={menuOpen}
      >
        <Menu size={20} strokeWidth={1.75} />
      </button>
      {isMobile ? <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} /> : null}
      {showDocs ? null : null}
    </header>
  );
};

export default Navbar;
