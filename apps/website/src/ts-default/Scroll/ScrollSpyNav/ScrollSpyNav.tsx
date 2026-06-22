import { useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { useReducedMotion } from 'motion/react';
import './ScrollSpyNav.css';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

const DEFAULT_SECTIONS = [
  { id: 'overview', label: 'Overview', title: 'Overview', body: 'A quick orientation to what the panel covers before you dive into the details below.' },
  { id: 'setup', label: 'Setup', title: 'Setup', body: 'Drop the component in, pass your sections, and the rail wires itself to the scroll position.' },
  { id: 'behavior', label: 'Behavior', title: 'Behavior', body: 'The active link tracks whichever section sits in the middle of the viewport as you scroll.' },
  { id: 'styling', label: 'Styling', title: 'Styling', body: 'Everything is plain class names and inline color, so it adapts to whatever surface it lands on.' },
  { id: 'wrap-up', label: 'Wrap-up', title: 'Wrap-up', body: 'Click any link to glide to its section; the rail and the content always stay in sync.' }
];

// A self-contained reading panel with a sticky side rail that tracks the section
// currently in view: an IntersectionObserver (scoped to the scroll container)
// lights the active link, and clicking a link glides to its section. Inspired by
// the scroll-spy / docs-nav interactions catalogued on designspells. Honors
// prefers-reduced-motion by jumping instead of smooth-scrolling.
export interface ScrollSpyNavSection {
  id: string;
  label: string;
  title: string;
  body: string;
}

export interface ScrollSpyNavProps extends HTMLAttributes<HTMLDivElement> {
  sections?: ScrollSpyNavSection[];
  activeColor?: string;
  height?: number;
  className?: string;
}

export default function ScrollSpyNav({
  sections = DEFAULT_SECTIONS,
  activeColor = '#5227FF',
  height = 460,
  className = '',
  ...rest
}: ScrollSpyNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const reduce = !!useReducedMotion();
  const [activeId, setActiveId] = useState(sections[0]?.id);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return undefined;
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.dataset.spyId);
      },
      { root, rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    );
    Object.values(sectionRefs.current).forEach(el => el && observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const goTo = id => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <div {...rest} className={join('spynav', className)} style={{ height, ...rest.style }}>
      <nav className="spynav-rail" aria-label="Section navigation">
        {sections.map(s => {
          const active = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
              className={join('spynav-link', active && 'spynav-link--active')}
              style={active ? { color: activeColor } : undefined}
              onClick={() => goTo(s.id)}
              aria-current={active ? 'true' : undefined}
            >
              <span className="spynav-dot" style={active ? { background: activeColor } : undefined} />
              {s.label}
            </button>
          );
        })}
      </nav>

      <div ref={scrollRef} className="spynav-scroll">
        {sections.map(s => (
          <section
            key={s.id}
            data-spy-id={s.id}
            ref={el => {
              sectionRefs.current[s.id] = el;
            }}
            className="spynav-section"
          >
            <h3 className="spynav-title">{s.title}</h3>
            <p className="spynav-body">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
