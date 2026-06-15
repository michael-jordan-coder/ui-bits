import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';

import { CATEGORIES, NEW, UPDATED } from '../../constants/Categories';
import { componentMap } from '../../constants/Components';
import { useTransition } from '../../hooks/useTransition';
import { slug } from '../../utils/utils';
import Logo from '../common/Logo';

const PRIMARY_LINKS = [
  { label: 'Docs', to: '/get-started/introduction', match: '/get-started' },
  { label: 'Components', to: '/components/index', match: '/components' },
  { label: 'Showcase', to: '/showcase', match: '/showcase' },
  { label: 'Sponsors', to: '/sponsors', match: '/sponsors' },
  { label: 'Tools', to: '/tools', match: '/tools' }
];

/**
 * Off-canvas navigation drawer shown only on mobile (mounted by Navbar when
 * the viewport is mobile-sized). Mirrors the desktop Sidebar's category logic
 * (Sidebar.jsx) using the same constants, but is fully self-contained so the
 * desktop sidebar stays untouched.
 */
const MobileNav = ({ open, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startTransition, isTransitioning } = useTransition();
  const [query, setQuery] = useState('');

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return undefined;
    document.body.classList.add('mobile-nav-open');
    return () => document.body.classList.remove('mobile-nav-open');
  }, [open]);

  // Close on route change.
  useEffect(() => {
    onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = event => event.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const categoriesWithItems = useMemo(
    () =>
      CATEGORIES.map(category => {
        const items = category.subcategories
          .map(sub => {
            const path = `/${slug(category.name)}/${slug(sub)}`;
            return {
              sub,
              path,
              isActive: location.pathname === path,
              isNew: NEW.includes(sub),
              isUpdated: UPDATED.includes(sub)
            };
          })
          .filter(({ sub }) => (query ? sub.toLowerCase().includes(query.toLowerCase()) : true));
        return { category, items };
      }),
    [location.pathname, query]
  );

  const handleNavigation = async (path, subcategory) => {
    if (isTransitioning || location.pathname === path) {
      onClose?.();
      return;
    }
    await startTransition(slug(subcategory), componentMap, () => {
      navigate(path);
      window.scrollTo(0, 0);
    });
  };

  const content = (
    <div className={`mobile-nav${open ? ' mobile-nav--open' : ''}`} aria-hidden={!open}>
      <div className="mobile-nav-backdrop" onClick={onClose} />
      <nav className="mobile-nav-panel" aria-label="Mobile navigation">
        <div className="mobile-nav-header">
          <Link to="/" className="mobile-nav-brand" onClick={onClose}>
            <Logo size={18} strokeWidth={1.4} dotRadius={1.3} />
            <span>ui bits</span>
          </Link>
          <button type="button" className="mobile-nav-close" onClick={onClose} aria-label="Close navigation">
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <div className="mobile-nav-search">
          <Search size={15} strokeWidth={2} className="sidebar-search-icon" aria-hidden="true" />
          <input
            type="text"
            placeholder="Search components"
            value={query}
            onChange={e => setQuery(e.target.value)}
            aria-label="Search components"
          />
        </div>

        <div className="mobile-nav-body">
          <div className="mobile-nav-section">
            {PRIMARY_LINKS.map(({ label, to, match }) => {
              const isActive = location.pathname.startsWith(match);
              return (
                <Link
                  key={to}
                  to={to}
                  className={`sidebar-item sidebar-item--top ${isActive ? 'active-sidebar-item' : ''}`}
                  onClick={onClose}
                >
                  <span className="sidebar-item-label">{label}</span>
                </Link>
              );
            })}
          </div>

          {categoriesWithItems.map(({ category, items }) =>
            items.length === 0 ? null : (
              <div className="mobile-nav-section" key={category.name}>
                <div className="sidebar-section-header">{category.name}</div>
                {items.map(({ sub, path, isActive, isNew, isUpdated }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`sidebar-item ${isActive ? 'active-sidebar-item' : ''}`}
                    onClick={e => {
                      e.preventDefault();
                      handleNavigation(path, sub);
                    }}
                  >
                    <span className="sidebar-item-dot" aria-hidden="true" />
                    <span className="sidebar-item-label">{sub}</span>
                    {isNew && <span className="new-tag">New</span>}
                    {isUpdated && <span className="updated-tag">Updated</span>}
                  </Link>
                ))}
              </div>
            )
          )}
        </div>
      </nav>
    </div>
  );

  return createPortal(content, document.body);
};

export default MobileNav;
