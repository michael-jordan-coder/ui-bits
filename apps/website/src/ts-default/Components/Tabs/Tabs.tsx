import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import './Tabs.css';

export interface TabItem {
  label: string;
  content: string;
}

export interface TabsProps {
  items?: TabItem[];
  defaultIndex?: number;
  variant?: 'underline' | 'pill';
  accentColor?: string;
  surfaceColor?: string;
  onChange?: (index: number) => void;
  className?: string;
}

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

const DEFAULT_ITEMS: TabItem[] = [
  { label: 'Overview', content: 'A quick summary of what this panel is about, shown the moment the tab becomes active.' },
  { label: 'Activity', content: 'Recent events and updates stream into this panel as soon as you switch to it.' },
  { label: 'Settings', content: 'Tweak preferences here — each tab crossfades smoothly into the next one.' }
];

// Animated, data-driven tabs. The active indicator is a single shared layoutId
// element so it physically slides between tabs, and panels crossfade on change.
export default function Tabs({
  items = DEFAULT_ITEMS,
  defaultIndex = 0,
  variant = 'underline',
  accentColor = '#6366f1',
  surfaceColor = '#1c1c22',
  onChange,
  className = ''
}: TabsProps) {
  const prefersReduced = useReducedMotion();
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState<number>(() => {
    if (items.length === 0) return 0;
    return Math.min(Math.max(defaultIndex, 0), items.length - 1);
  });

  const select = (index: number) => {
    if (index === active) return;
    setActive(index);
    onChange?.(index);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const last = items.length - 1;
    let next: number | null = null;
    if (event.key === 'ArrowRight') next = active === last ? 0 : active + 1;
    else if (event.key === 'ArrowLeft') next = active === 0 ? last : active - 1;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = last;
    if (next === null) return;
    event.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  const indicatorTransition = prefersReduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 520, damping: 38 };
  const slide = prefersReduced ? 0 : 8;
  const current = items[active];

  return (
    <div className={join('tabs-root', className)} style={{ background: surfaceColor }}>
      <div className={join('tabs-list', variant === 'pill' && 'tabs-list--pill')} role="tablist">
        {items.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={item.label}
              ref={el => {
                tabRefs.current[index] = el;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${index}`}
              tabIndex={selected ? 0 : -1}
              className={join('tabs-tab', selected && 'tabs-tab--active')}
              style={selected ? { color: variant === 'pill' ? '#fff' : accentColor } : undefined}
              onClick={() => select(index)}
              onKeyDown={handleKeyDown}
            >
              {variant === 'pill' && selected && (
                <motion.span
                  layoutId={`${baseId}-indicator`}
                  className="tabs-pill"
                  style={{ background: accentColor }}
                  transition={indicatorTransition}
                  aria-hidden="true"
                />
              )}
              <span className="tabs-tab-label">{item.label}</span>
              {variant === 'underline' && selected && (
                <motion.span
                  layoutId={`${baseId}-indicator`}
                  className="tabs-underline"
                  style={{ background: accentColor }}
                  transition={indicatorTransition}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="tabs-panels">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            role="tabpanel"
            id={`${baseId}-panel-${active}`}
            aria-labelledby={`${baseId}-tab-${active}`}
            tabIndex={0}
            className="tabs-panel"
            initial={{ opacity: 0, x: slide }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -slide }}
            transition={prefersReduced ? { duration: 0 } : { duration: 0.18, ease: 'easeOut' }}
          >
            {current ? current.content : null}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
