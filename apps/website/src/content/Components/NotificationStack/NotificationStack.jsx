import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Bell, X } from 'lucide-react';
import './NotificationStack.css';

const join = (...classes) => classes.filter(Boolean).join(' ');

const DEFAULT_NOTIFICATIONS = [
  { id: 'n1', title: 'New comment', body: 'Maya replied to your thread.' },
  { id: 'n2', title: 'Build passed', body: 'Deploy to production finished.' },
  { id: 'n3', title: 'Weekly summary', body: 'Your activity report is ready.' }
];

// An iOS-style collapsible notification stack. Collapsed, the top card is fully
// visible and the rest peek out behind it (smaller scale, vertical offset, lower
// opacity). Expanding fans the cards into a readable list with a spring stagger;
// collapsing tucks them back. Each card dismisses individually via AnimatePresence
// and the remaining cards re-flow. With reduced motion every transition is instant.
export default function NotificationStack({
  notifications = DEFAULT_NOTIFICATIONS,
  accent = '#3ecf8e',
  collapsedByDefault = true,
  className = ''
}) {
  const prefersReduced = useReducedMotion();
  const [items, setItems] = useState(notifications);
  const [expanded, setExpanded] = useState(!collapsedByDefault);

  const dismiss = id => {
    setItems(current => current.filter(item => item.id !== id));
  };

  const toggle = () => {
    if (items.length <= 1) return;
    setExpanded(value => !value);
  };

  const spring = prefersReduced
    ? { duration: 0 }
    : { type: 'spring', stiffness: 520, damping: 34, mass: 0.7 };

  const fade = prefersReduced ? { duration: 0 } : { duration: 0.22, ease: 'easeOut' };

  const collapsedInteractive = !expanded && items.length > 1;

  return (
    <div className={join('notification-stack', className)} style={{ '--notification-stack-accent': accent }}>
      <div className="notification-stack__head">
        <span className="notification-stack__count">
          {items.length === 0
            ? 'no notifications'
            : `${items.length} ${items.length === 1 ? 'notification' : 'notifications'}`}
        </span>
        {items.length > 1 && (
          <button type="button" className="notification-stack__toggle" onClick={toggle}>
            {expanded ? 'collapse' : 'show all'}
          </button>
        )}
      </div>

      <ul
        className={join('notification-stack__list', expanded && 'is-expanded')}
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
                className="notification-stack__item"
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
                data-interactive={collapsedInteractive ? 'true' : undefined}
                onClick={collapsedInteractive ? toggle : undefined}
              >
                <span className="notification-stack__icon" aria-hidden="true">
                  <Bell size={16} strokeWidth={2} />
                </span>
                <span className="notification-stack__text">
                  <span className="notification-stack__title">{item.title}</span>
                  <span className="notification-stack__body">{item.body}</span>
                </span>
                <motion.button
                  type="button"
                  className="notification-stack__dismiss"
                  aria-label={`Dismiss ${item.title}`}
                  onClick={event => {
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
