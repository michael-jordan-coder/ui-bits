import { useEffect, useRef, useState, type HTMLAttributes } from 'react';
import { useReducedMotion } from 'motion/react';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

const DEFAULT_SECTIONS = [
  { id: 'overview', label: 'Overview', title: 'Overview', body: 'A quick orientation to what the panel covers before you dive into the details below.' },
  { id: 'setup', label: 'Setup', title: 'Setup', body: 'Drop the component in, pass your sections, and the rail wires itself to the scroll position.' },
  { id: 'behavior', label: 'Behavior', title: 'Behavior', body: 'The active link tracks whichever section sits in the middle of the viewport as you scroll.' },
  { id: 'styling', label: 'Styling', title: 'Styling', body: 'Everything is plain class names and inline color, so it adapts to whatever surface it lands on.' },
  { id: 'wrap-up', label: 'Wrap-up', title: 'Wrap-up', body: 'Click any link to glide to its section; the rail and the content always stay in sync.' }
];

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
    <div
      {...rest}
      className={join(
        'mx-auto box-border flex w-full max-w-[620px] gap-5 rounded-[18px] bg-[#08080c] p-[18px]',
        className
      )}
      style={{ height, ...rest.style }}
    >
      <nav className="sticky top-[18px] flex w-[132px] flex-none flex-col gap-0.5 self-start" aria-label="Section navigation">
        {sections.map(s => {
          const active = s.id === activeId;
          return (
            <button
              key={s.id}
              type="button"
              className={join(
                'flex items-center gap-2.5 rounded-[9px] px-2.5 py-2 text-left text-sm transition-colors duration-150 ease-out',
                active
                  ? 'bg-white/[0.06] font-semibold'
                  : 'bg-transparent font-medium text-[#fafafa]/[0.55] hover:bg-white/[0.04] hover:text-[#fafafa]/[0.85]'
              )}
              style={active ? { color: activeColor } : undefined}
              onClick={() => goTo(s.id)}
              aria-current={active ? 'true' : undefined}
            >
              <span
                className={join('h-[7px] w-[7px] flex-none rounded-full transition-transform duration-150 ease-out', active && 'scale-125')}
                style={active ? { background: activeColor } : { background: 'rgba(250,250,250,0.3)' }}
              />
              {s.label}
            </button>
          );
        })}
      </nav>

      <div className="h-full min-w-0 flex-1 overflow-y-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" ref={scrollRef}>
        {sections.map((s, i) => (
          <section
            key={s.id}
            data-spy-id={s.id}
            ref={el => {
              sectionRefs.current[s.id] = el;
            }}
            className={join(
              'mb-4 flex flex-col gap-2.5 rounded-[14px] border border-white/[0.06] bg-[#131318] px-[18px] pb-[22px] pt-[18px]',
              i === sections.length - 1 && 'mb-0 min-h-[70%]'
            )}
          >
            <h3 className="m-0 text-xl font-semibold leading-[1.15] tracking-[-0.02em] text-[#fafafa]">{s.title}</h3>
            <p className="m-0 text-sm leading-[1.55] text-[#fafafa]/[0.66]">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
