import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NuqsAdapter } from 'nuqs/adapters/react-router/v6';
import { Analytics } from '@vercel/analytics/react';

import Providers from './components/layout/Providers';
import SidebarLayout from './components/layout/SidebarLayout';
import { ActiveRouteProvider } from './components/context/ActiveRouteContext/ActiveRouteContext';
import { forceChakraDarkTheme } from './utils/utils';

import LandingPage from './pages/LandingPage';
import CategoryPage from './pages/CategoryPage';
import ShowcasePage from './pages/ShowcasePage';
import SponsorsPage from './pages/SponsorsPage';
import ToolsPage from './pages/ToolsPage';
import FavoritesPage from './pages/FavoritesPage';

function AppContent() {
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/showcase" element={<ShowcasePage />} />
        <Route path="/sponsors" element={<SponsorsPage />} />
        <Route path="/tools/:toolId?" element={<ToolsPage />} />
        <Route
          path="/favorites"
          element={
            <SidebarLayout>
              <FavoritesPage />
            </SidebarLayout>
          }
        />
        <Route
          path="/:category/:subcategory"
          element={
            <SidebarLayout>
              <CategoryPage />
            </SidebarLayout>
          }
        />
      </Routes>
    </Providers>
  );
}

export default function App() {
  useEffect(() => {
    forceChakraDarkTheme();
  }, []);

  return (
    <Router>
      <NuqsAdapter>
        <ActiveRouteProvider>
          <AppContent />
          <Analytics />
        </ActiveRouteProvider>
      </NuqsAdapter>
    </Router>
  );
}
