import { useRef, useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from 'motion/react';
import './ScrollSnap.css';

const join = (...classes) => classes.filter(Boolean).join(' ');

// Flat, accent-tinted fill for panel `index`: each panel mixes the base accent
// down toward the dark base by a decreasing amount, so the rail reads as one
// hue family deepening panel to panel rather than a random palette.
function panelFill(accent, index) {
  return `color-mix(in oklch, ${accent} ${Math.max(20, 78 - index * 9)}%, #0e0e10)`;
}

// A vertical scroll-snap pager. The internal container snaps between full-height
// panels; a fixed dot rail on the right tracks and jumps to the active panel.
// Self-contained — it owns its own scroll container, so it never hijacks the
// page. Reduced-motion users still get snapping (CSS), just without animated
// indicator transitions or smooth-scrolled jumps.
export default function ScrollSnap({ panels = 4, accent = '#3ecf8e', height = 460, className = '', ...rest }) {
  const containerRef = useRef(null);
  const panelRefs = useRef([]);
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);

  const total = Math.max(1, Math.floor(panels));
  panelRefs.current = panelRefs.current.slice(0, total);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number(entry.target.dataset.index));
          }
        }
      },
      { root, threshold: 0.6 }
    );

    for (const panel of panelRefs.current) {
      if (panel) observer.observe(panel);
    }

    return () => observer.disconnect();
  }, [total]);

  const goTo = useCallback(
    index => {
      const panel = panelRefs.current[index];
      if (!panel) return;
      panel.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    },
    [reduce]
  );

  return (
    <div {...rest} className={join('scroll-snap', className)} style={{ height, ...rest.style }}>
      <div ref={containerRef} className="scroll-snap-viewport">
        {Array.from({ length: total }, (_, i) => (
          <section
            key={i}
            data-index={i}
            ref={el => {
              panelRefs.current[i] = el;
            }}
            className="scroll-snap-panel"
            style={{ background: panelFill(accent, i % 6) }}
          >
            <span className="scroll-snap-eyebrow">{`Panel ${String(i + 1).padStart(2, '0')}`}</span>
            <h3 className="scroll-snap-heading">Section {i + 1}</h3>
            <p className="scroll-snap-caption">Scroll or tap a dot to snap between panels.</p>
          </section>
        ))}
      </div>

      <div className="scroll-snap-rail" role="tablist" aria-label="Panels" aria-orientation="vertical">
        {Array.from({ length: total }, (_, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-label={`Go to panel ${i + 1}`}
              aria-current={isActive ? 'true' : undefined}
              aria-selected={isActive}
              className={join('scroll-snap-dot', isActive && 'is-active', reduce && 'is-static')}
              style={{ '--scroll-snap-accent': accent }}
              onClick={() => goTo(i)}
            />
          );
        })}
      </div>
    </div>
  );
}
