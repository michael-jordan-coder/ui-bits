import { Fragment, memo, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Box, Stack, Text } from '@chakra-ui/react';
import { Search, LayoutGrid, BookOpen } from 'lucide-react';

import { CATEGORIES, NEW, UPDATED } from '../../constants/Categories';
import { componentMap } from '../../constants/Components';
import { useTransition } from '../../hooks/useTransition';
import { slug } from '../../utils/utils';

const Category = memo(({ category, location, handleNavigation, isTransitioning, items }) => {
  if (items.length === 0) {
    return (
      <div className="sidebar-section">
        <div className="sidebar-section-header">{category.name}</div>
        <Text className="sidebar-empty" fontSize="13px" color="var(--text-muted)" px={2.5}>
          No items yet
        </Text>
      </div>
    );
  }

  return (
    <div className="sidebar-section">
      <div className="sidebar-section-header">{category.name}</div>
      <Stack spacing={0.5} position="relative">
        {items.map(({ sub, path, isActive, isNew, isUpdated }) => (
          <Link
            key={path}
            to={path}
            className={`sidebar-item ${isActive ? 'active-sidebar-item' : ''} ${isTransitioning ? 'transitioning' : ''}`}
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
      </Stack>
    </div>
  );
});

Category.displayName = 'Category';

const TOP_LINKS = [
  { label: 'All components', to: '/components/index', match: '/components/index', icon: LayoutGrid },
  { label: 'Get started', to: '/get-started/introduction', match: '/get-started', icon: BookOpen }
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { startTransition, isTransitioning } = useTransition();
  const [query, setQuery] = useState('');

  const handleNavigation = async (path, subcategory) => {
    if (isTransitioning || location.pathname === path) return;
    await startTransition(slug(subcategory), componentMap, () => {
      navigate(path);
      window.scrollTo(0, 0);
    });
  };

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

  return (
    <Box as="nav" className="sidebar">
      <div className="sidebar-search">
        <Search size={14} strokeWidth={2} className="sidebar-search-icon" aria-hidden="true" />
        <input
          type="text"
          className="sidebar-search-input"
          placeholder="Search components"
          value={query}
          onChange={e => setQuery(e.target.value)}
          aria-label="Search components"
        />
        <kbd className="sidebar-search-kbd">⌘K</kbd>
      </div>

      <div className="sidebar-section">
        <Stack spacing={0.5}>
          {TOP_LINKS.map(({ label, to, match, icon: Icon }) => {
            const isActive = location.pathname.startsWith(match);
            return (
              <Link
                key={to}
                to={to}
                className={`sidebar-item sidebar-item--top ${isActive ? 'active-sidebar-item' : ''}`}
              >
                <Icon size={15} strokeWidth={1.75} className="sidebar-item-icon" />
                <span className="sidebar-item-label">{label}</span>
              </Link>
            );
          })}
        </Stack>
      </div>

      <div className="sidebar-divider" aria-hidden="true" />

      <div className="sidebar-sections">
        {categoriesWithItems.map(({ category, items }) => (
          <Fragment key={category.name}>
            <Category
              category={category}
              location={location}
              handleNavigation={handleNavigation}
              isTransitioning={isTransitioning}
              items={items}
            />
          </Fragment>
        ))}
      </div>

      <div className="sidebar-footer">
        <span className="sidebar-footer-brand">ui bits</span>
        <span className="sidebar-footer-version">v0.1</span>
      </div>
    </Box>
  );
};

export default Sidebar;
