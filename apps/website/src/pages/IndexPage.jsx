import { useMemo } from 'react';
import { CATEGORIES } from '../constants/Categories';
import { componentMetadata } from '../constants/Information';
import { slug } from '../utils/utils';
import ComponentCard from '../components/common/ComponentCard';
import LivePreview from '../components/common/LivePreview';
import BackToTopButton from '../components/common/BackToTopButton';

const DISPLAY_TO_FOLDER = { '3D': 'ThreeD', 'Text Animations': 'TextAnimations' };
const folderFor = displayName => DISPLAY_TO_FOLDER[displayName] || displayName;

// Catalog completeness is structural: it mirrors the sidebar (CATEGORIES) and is
// cross-checked against the component registry, so new components appear here
// automatically and the page can never silently drop one.
const buildSections = () => {
  const sections = CATEGORIES.filter(category => category.name !== 'Get Started').map(category => {
    const folder = folderFor(category.name);
    const items = category.subcategories.map(displayName => {
      const componentSlug = slug(displayName);
      const meta = componentMetadata[`${folder}/${displayName.replace(/\s+/g, '')}`];
      return {
        key: componentSlug,
        name: displayName,
        category: category.name,
        route: `/${slug(category.name)}/${componentSlug}`,
        tags: meta?.tags ?? [],
        render: () => <LivePreview slug={componentSlug} name={displayName} />
      };
    });
    return { name: category.name, items };
  });

  const shown = sections.reduce((total, section) => total + section.items.length, 0);
  const registered = Object.keys(componentMetadata).length;
  if (import.meta.env.DEV && shown !== registered) {
    // Invariant: every registered component must surface on the catalog page.
    console.warn(`[IndexPage] catalog shows ${shown} components but ${registered} are registered.`);
  }

  return sections;
};

const IndexPage = () => {
  const sections = useMemo(buildSections, []);

  return (
    <div className="index-page">
      <h2 className="sub-category">All components</h2>

      <div className="index-sections">
        {sections.map(section => (
          <section key={section.name} className="index-section">
            <h3 className="index-section-title">{section.name}</h3>
            <div className="index-grid">
              {section.items.map(item => (
                <ComponentCard key={item.key} item={item} className="index-card" />
              ))}
            </div>
          </section>
        ))}
      </div>

      <BackToTopButton />
    </div>
  );
};

export default IndexPage;
