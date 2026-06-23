import { useCallback, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { X } from 'lucide-react';
import Sidebar from '../navs/Sidebar';
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
    </main>
  );
}
