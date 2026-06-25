import { useCallback, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from '../navs/Sidebar';
import MobileNav from '../navs/MobileNav';
import Logo from '../common/Logo';
import useIsMobile from '../../hooks/useIsMobile';
import { useOptions } from '../context/OptionsContext/useOptions';

const STORAGE_KEY = 'ui-bits:chrome-sidebar-collapsed';

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

  const { editorOpen, setEditorOpen } = useOptions();

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
            <Link to="/" className="chrome-mobilebar-brand" aria-label="ui bits home">
              <Logo size={18} strokeWidth={1.4} dotRadius={1.3} />
              <span>ui bits</span>
            </Link>
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
