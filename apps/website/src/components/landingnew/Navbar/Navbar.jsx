import { Link, useLocation } from 'react-router-dom';
// import AccentPicker from './AccentPicker';

const NAV_LINKS = [
  { label: 'Docs', to: '/get-started/introduction', match: '/get-started' },
  { label: 'Components', to: '/components/index', match: '/components' }
];

const Navbar = ({ showDocs }) => {
  const location = useLocation();
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
      {showDocs ? null : null}
    </header>
  );
};

export default Navbar;
