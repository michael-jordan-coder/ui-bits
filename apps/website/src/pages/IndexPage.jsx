import { useMemo } from 'react';
import { showcaseItems } from '../constants/showcaseItems';
import ComponentCard from '../components/common/ComponentCard';
import BackToTopButton from '../components/common/BackToTopButton';

const CATEGORY_ORDER = ['Components', '3D', 'Scroll'];

const IndexPage = () => {
  const sections = useMemo(() => {
    const byCategory = new Map();
    for (const item of showcaseItems) {
      if (!byCategory.has(item.category)) byCategory.set(item.category, []);
      byCategory.get(item.category).push(item);
    }
    return CATEGORY_ORDER.filter(name => byCategory.has(name)).map(name => ({
      name,
      items: byCategory.get(name)
    }));
  }, []);

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
