import useScrollToTop from '../hooks/useScrollToTop';
import DocsButtonBar from './DocsButtonBar';

const Introduction = () => {
  useScrollToTop();

  return (
    <section className="docs-section">
      <h3 className="docs-category-title">Introduction</h3>

      <p className="docs-paragraph dim">
        ui bits is a personal collection of animated, interactive React components, designed to be dropped into
        a project without pulling in a heavy dependency.
      </p>
      <p className="docs-paragraph">
        Each component is shipped as source code in four variants (JS/TS, CSS/Tailwind) so you can copy the one that
        fits your stack and own it from there.
      </p>

      <hr className="docs-separator" />

      <h3 className="docs-category-title">Principles</h3>

      <ul className="docs-list">
        <li className="docs-list-item">
          <span className="docs-highlight">Source over packages:</span> you own the code, no runtime dependency to keep
          updated.
        </li>
        <li className="docs-list-item">
          <span className="docs-highlight">Prop-first:</span> sensible defaults, expressive props, no hidden config.
        </li>
        <li className="docs-list-item">
          <span className="docs-highlight">Modular:</span> install only what you need.
        </li>
        <li className="docs-list-item">
          <span className="docs-highlight">Variant freedom:</span> pick JS or TS, CSS or Tailwind.
        </li>
      </ul>

      <DocsButtonBar next={{ label: 'Installation', route: '/get-started/installation' }} />
    </section>
  );
};

export default Introduction;
