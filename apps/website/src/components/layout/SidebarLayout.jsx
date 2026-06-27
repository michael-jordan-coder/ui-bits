import { useCallback, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import Sidebar from '../navs/Sidebar';
import MobileNav from '../navs/MobileNav';
import Logo from '../common/Logo';
import useIsMobile from '../../hooks/useIsMobile';
import { useOptions } from '../context/OptionsContext/useOptions';
import { CATEGORIES } from '../../constants/Categories';
import { slug } from '../../utils/utils';

const STORAGE_KEY = 'ui-bits:chrome-sidebar-collapsed';

// Flat ordered list matching the sidebar order — used for prev/next navigation.
const ALL_COMPONENTS = CATEGORIES.flatMap(cat =>
  cat.subcategories.map(sub => ({
    path: `/${slug(cat.name)}/${slug(sub)}`,
    label: sub,
  }))
);

export default function SidebarLayout({ children }) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? '1' : '0');
  }, [collapsed]);

  const toggle = useCallback(() => setCollapsed(prev => !prev), []);
  const expand = useCallback(() => setCollapsed(false), []);

  const isMobile = useIsMobile();
  const [navOpen, setNavOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { editorOpen, setEditorOpen } = useOptions();

  // Resolve current component position for prev/next arrows.
  const currentIdx = ALL_COMPONENTS.findIndex(c => c.path === location.pathname);
  const isComponentPage = currentIdx >= 0;
  const prev = currentIdx > 0 ? ALL_COMPONENTS[currentIdx - 1] : null;
  const next = currentIdx < ALL_COMPONENTS.length - 1 ? ALL_COMPONENTS[currentIdx + 1] : null;

  const wrapperClass = [
    'category-wrapper',
    collapsed && 'category-wrapper--collapsed',
    editorOpen && 'category-wrapper--editor-open'
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <main className="app-container app-container--chrome">
      <section className={wrapperClass}>
        <Sidebar collapsed={collapsed} onToggle={toggle} onExpand={expand} />
        <Box className="chrome-main" minW={0}>
          <div className="chrome-mobilebar">
            <button
              type="button"
              className="chrome-mobilebar-toggle"
              onClick={() => setNavOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={navOpen}
            >
              <Menu size={20} strokeWidth={1.75} />
            </button>

            {isComponentPage ? (
              <span className="chrome-mobilebar-title">
                {ALL_COMPONENTS[currentIdx].label}
              </span>
            ) : (
              <Link to="/" className="chrome-mobilebar-brand" aria-label="ui bits home">
                <Logo size={18} strokeWidth={1.4} dotRadius={1.3} />
                <span>ui bits</span>
              </Link>
            )}

            {isComponentPage && (
              <nav className="chrome-mobilebar-nav" aria-label="Component navigation">
                <button
                  type="button"
                  className="chrome-mobilebar-navbtn"
                  disabled={!prev}
                  onClick={() => prev && navigate(prev.path)}
                  aria-label={prev ? `Previous: ${prev.label}` : 'No previous component'}
                >
                  <ChevronLeft size={18} strokeWidth={1.75} />
                </button>
                <button
                  type="button"
                  className="chrome-mobilebar-navbtn"
                  disabled={!next}
                  onClick={() => next && navigate(next.path)}
                  aria-label={next ? `Next: ${next.label}` : 'No next component'}
                >
                  <ChevronRight size={18} strokeWidth={1.75} />
                </button>
              </nav>
            )}
          </div>
          {children}
        </Box>
        <aside
          className={`right-panel${editorOpen ? ' right-panel--open' : ''}`}
          aria-label="Component editor panel"
          aria-hidden={!editorOpen}
        >
          <button
            type="button"
            className="editor-panel-close"
            onClick={() => setEditorOpen(false)}
            aria-label="Close editor"
          >
            <X size={16} strokeWidth={1.75} />
          </button>
          <div id="customize-slot" className="right-panel-slot" />
        </aside>
      </section>
      {isMobile && <MobileNav open={navOpen} onClose={() => setNavOpen(false)} />}
    </main>
  );
}
