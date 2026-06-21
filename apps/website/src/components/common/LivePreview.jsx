import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { componentMetadata } from '../../constants/Information';
import { componentPreviews } from '../../constants/componentPreviews';
import PreviewErrorBoundary from './PreviewErrorBoundary';
import './LivePreview.css';

const pascalToKebab = name => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

// Auto-preview source: lazy-load every component straight from its content/
// implementation, keyed by slug. Curated entries in componentPreviews win over
// these; anything without either renders the typographic fallback.
const contentModules = import.meta.glob('../../content/**/*.jsx');
const lazyBySlug = Object.entries(componentMetadata).reduce((map, [metaKey, meta]) => {
  const folder = metaKey.split('/')[0];
  const loader = contentModules[`../../content/${folder}/${meta.name}/${meta.name}.jsx`];
  if (loader) map[pascalToKebab(meta.name)] = lazy(loader);
  return map;
}, {});

// Mount the (often animated/canvas) preview only once its card scrolls near the
// viewport, so 50+ live components don't all run at once.
const useInView = () => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, inView];
};

const LivePreview = ({ slug, name }) => {
  const [ref, inView] = useInView();
  const fallback = (
    <div className="live-preview-fallback">
      <span className="live-preview-fallback-name">{name}</span>
    </div>
  );

  const curated = componentPreviews[slug];
  const Lazy = lazyBySlug[slug];

  let content = fallback;
  if (inView) {
    if (curated) content = curated();
    else if (Lazy)
      content = (
        <Suspense fallback={fallback}>
          <Lazy />
        </Suspense>
      );
  }

  return (
    <div ref={ref} className="live-preview">
      <PreviewErrorBoundary fallback={fallback}>{content}</PreviewErrorBoundary>
    </div>
  );
};

export default LivePreview;
