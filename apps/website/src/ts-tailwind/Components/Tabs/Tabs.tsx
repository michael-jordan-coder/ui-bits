import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

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
    <div
      className={join('flex w-full max-w-[380px] flex-col rounded-2xl border border-white/[0.08] p-2 text-white', className)}
      style={{ background: surfaceColor }}
    >
      <div
        className={join(
          'relative flex items-stretch gap-1',
          variant === 'pill'
            ? 'rounded-full bg-white/[0.04] p-1'
            : 'border-b border-white/[0.08]'
        )}
        role="tablist"
      >
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
              className={join(
                'relative inline-flex flex-1 cursor-pointer items-center justify-center rounded-full border-none bg-transparent px-3 py-[0.55rem] text-[0.9rem] font-semibold transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
                selected ? '' : 'text-white/60 hover:text-white/85'
              )}
              style={selected ? { color: variant === 'pill' ? '#fff' : accentColor } : undefined}
              onClick={() => select(index)}
              onKeyDown={handleKeyDown}
            >
              {variant === 'pill' && selected && (
                <motion.span
                  layoutId={`${baseId}-indicator`}
                  className="absolute inset-0 z-0 rounded-full"
                  style={{ background: accentColor }}
                  transition={indicatorTransition}
                  aria-hidden="true"
                />
              )}
              <span className="relative z-[1]">{item.label}</span>
              {variant === 'underline' && selected && (
                <motion.span
                  layoutId={`${baseId}-indicator`}
                  className="absolute inset-x-3 -bottom-px h-0.5 rounded-full"
                  style={{ background: accentColor }}
                  transition={indicatorTransition}
                  aria-hidden="true"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="relative min-h-[88px] px-2 pb-1.5 pt-[0.85rem]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            role="tabpanel"
            id={`${baseId}-panel-${active}`}
            aria-labelledby={`${baseId}-tab-${active}`}
            tabIndex={0}
            className="m-0 text-sm leading-normal text-white/[0.78] focus-visible:rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current"
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
