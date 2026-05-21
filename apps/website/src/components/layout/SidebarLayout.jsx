import { useCallback, useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from '../landingnew/Navbar/Navbar';
import Sidebar from '../navs/Sidebar';

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

  return (
    <main className="app-container">
      <Navbar showDocs />
      <section className={`category-wrapper${collapsed ? ' category-wrapper--collapsed' : ''}`}>
        <Sidebar collapsed={collapsed} onToggle={toggle} onExpand={expand} />
        <Box minW={0}>{children}</Box>
        <aside className="right-panel" aria-label="Component customize panel">
          <div id="customize-slot" className="right-panel-slot" />
        </aside>
      </section>
    </main>
  );
}
