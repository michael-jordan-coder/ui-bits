import { useState, type CSSProperties, type MouseEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion, type Transition } from 'motion/react';
import { Bell, X } from 'lucide-react';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

export interface Notification {
  id: string;
  title: string;
  body: string;
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'New comment', body: 'Maya replied to your thread.' },
  { id: 'n2', title: 'Build passed', body: 'Deploy to production finished.' },
  { id: 'n3', title: 'Weekly summary', body: 'Your activity report is ready.' }
];

// An iOS-style collapsible notification stack. Collapsed, the top card is fully
// visible and the rest peek out behind it (smaller scale, vertical offset, lower
// opacity). Expanding fans the cards into a readable list with a spring stagger;
// collapsing tucks them back. Each card dismisses individually via AnimatePresence
// and the remaining cards re-flow. With reduced motion every transition is instant.
export interface NotificationStackProps {
  notifications?: Notification[];
  accent?: string;
  collapsedByDefault?: boolean;
  className?: string;
}

export default function NotificationStack({
  notifications = DEFAULT_NOTIFICATIONS,
  accent = '#3ecf8e',
  collapsedByDefault = true,
  className = ''
}: NotificationStackProps) {
  const prefersReduced = useReducedMotion();
  const [items, setItems] = useState<Notification[]>(notifications);
  const [expanded, setExpanded] = useState(!collapsedByDefault);

  const dismiss = (id: string) => {
    setItems(current => current.filter(item => item.id !== id));
  };

  const toggle = () => {
    if (items.length <= 1) return;
    setExpanded(value => !value);
  };

  const spring: Transition = prefersReduced
    ? { duration: 0 }
    : { type: 'spring', stiffness: 520, damping: 34, mass: 0.7 };

  const fade: Transition = prefersReduced ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' };

  const collapsedInteractive = !expanded && items.length > 1;

  return (
    <div
      className={join('flex w-full max-w-[22rem] flex-col gap-3 font-[inherit] text-[#fafafa]', className)}
      style={{ '--notification-stack-accent': accent } as CSSProperties}
    >
      <div className="flex items-center justify-between gap-4 px-1">
        <span className="text-[0.8125rem] text-[#fafafa]/55">
          {items.length === 0
            ? 'no notifications'
            : `${items.length} ${items.length === 1 ? 'notification' : 'notifications'}`}
        </span>
        {items.length > 1 && (
          <button
            type="button"
            className="-mx-2 -my-1 rounded-lg bg-transparent px-2 py-1 text-[0.8125rem] font-semibold text-[var(--notification-stack-accent)] outline-none [-webkit-tap-highlight-color:transparent] focus-visible:[box-shadow:0_0_0_2px_rgba(250,250,250,0.7)]"
            onClick={toggle}
          >
            {expanded ? 'collapse' : 'show all'}
          </button>
        )}
      </div>

      <ul
        className={join(
          'relative m-0 flex list-none flex-col p-0',
          expanded ? 'gap-2' : 'gap-0'
        )}
        role="region"
        aria-label="notifications"
      >
        <AnimatePresence initial={false}>
          {items.map((item, index) => {
            const depth = expanded ? 0 : Math.min(index, 2);
            const collapsedHidden = !expanded && index > 2;

            return (
              <motion.li
                key={item.id}
                className={join(
                  'relative flex origin-top items-center gap-3 rounded-[0.875rem] border border-[#fafafa]/[0.08] bg-[#1c1c1f] px-4 py-3.5 will-change-[transform,opacity]',
                  expanded ? 'mt-0' : index === 0 ? 'mt-0' : '-mt-[3.25rem]',
                  collapsedInteractive && 'cursor-pointer'
                )}
                layout={!prefersReduced}
                style={{ zIndex: items.length - index }}
                initial={false}
                animate={{
                  y: expanded ? 0 : depth * 10,
                  scale: expanded ? 1 : 1 - depth * 0.05,
                  opacity: collapsedHidden ? 0 : 1 - depth * 0.15
                }}
                exit={{ opacity: 0, scale: prefersReduced ? 1 : 0.9 }}
                transition={spring}
                onClick={collapsedInteractive ? toggle : undefined}
              >
                <span
                  className="inline-flex h-[1.875rem] w-[1.875rem] flex-shrink-0 items-center justify-center rounded-[0.625rem] text-[var(--notification-stack-accent)]"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--notification-stack-accent) 18%, transparent)'
                  }}
                  aria-hidden="true"
                >
                  <Bell size={16} strokeWidth={2} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="text-sm font-semibold text-[#fafafa]">{item.title}</span>
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.8125rem] text-[#fafafa]/55">
                    {item.body}
                  </span>
                </span>
                <motion.button
                  type="button"
                  className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-transparent text-[#fafafa]/50 outline-none transition-colors duration-[120ms] ease-out [-webkit-tap-highlight-color:transparent] hover:bg-[#fafafa]/[0.08] hover:text-[#fafafa] focus-visible:[box-shadow:0_0_0_2px_rgba(250,250,250,0.7)]"
                  aria-label={`Dismiss ${item.title}`}
                  onClick={(event: MouseEvent<HTMLButtonElement>) => {
                    event.stopPropagation();
                    dismiss(item.id);
                  }}
                  initial={false}
                  animate={{ opacity: expanded || index === 0 ? 1 : 0 }}
                  transition={fade}
                  tabIndex={expanded || index === 0 ? 0 : -1}
                >
                  <X size={14} strokeWidth={2.4} />
                </motion.button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
