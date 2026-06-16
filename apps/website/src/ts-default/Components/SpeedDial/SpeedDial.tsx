import { useEffect, useState, type ComponentType } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Plus, Share2, Copy, Heart, Star, Trash2, Pencil, Download, type LucideProps } from 'lucide-react';
import './SpeedDial.css';

export type IconName = 'share' | 'copy' | 'heart' | 'star' | 'trash' | 'edit' | 'download' | 'plus';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface Action {
  label: string;
  icon: IconName;
}

export interface SpeedDialProps {
  actions?: Action[];
  direction?: Direction;
  openOnHover?: boolean;
  accentColor?: string;
  surfaceColor?: string;
  onAction?: (index: number) => void;
  className?: string;
}

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

// Lucide glyphs are referenced by name in the data-driven `actions` prop so the
// config stays serializable. Unknown names fall back to a neutral plus.
const ICONS: Record<IconName, ComponentType<LucideProps>> = {
  share: Share2,
  copy: Copy,
  heart: Heart,
  star: Star,
  trash: Trash2,
  edit: Pencil,
  download: Download,
  plus: Plus
};

const DEFAULT_ACTIONS: Action[] = [
  { label: 'Share', icon: 'share' },
  { label: 'Copy', icon: 'copy' },
  { label: 'Favorite', icon: 'heart' },
  { label: 'Edit', icon: 'edit' }
];

// Per-direction geometry: the unit axis the actions travel along, plus where the
// tooltip label sits relative to each action button.
const AXIS: Record<Direction, { x: number; y: number; tooltip: 'side' | 'top' }> = {
  up: { x: 0, y: -1, tooltip: 'side' },
  down: { x: 0, y: 1, tooltip: 'side' },
  left: { x: -1, y: 0, tooltip: 'top' },
  right: { x: 1, y: 0, tooltip: 'top' }
};

const STEP = 64;
const HALF = 22;

// A floating-action-button speed dial that fans data-driven actions out along a
// chosen axis. Inspired by the Material speed dial pattern.
export default function SpeedDial({
  actions = DEFAULT_ACTIONS,
  direction = 'up',
  openOnHover = false,
  accentColor = '#6366f1',
  surfaceColor = '#1c1c22',
  onAction,
  className = ''
}: SpeedDialProps) {
  const prefersReduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const axis = AXIS[direction] || AXIS.up;

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const handleAction = (index: number) => {
    onAction?.(index);
    setOpen(false);
  };

  const hoverProps = openOnHover
    ? { onPointerEnter: () => setOpen(true), onPointerLeave: () => setOpen(false) }
    : {};

  const transition = prefersReduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 520, damping: 30 };

  return (
    <div className={join('speed-dial-root', className)} {...hoverProps}>
      <AnimatePresence>
        {open && (
          <motion.ul className="speed-dial-actions" role="menu" aria-label="Actions">
            {actions.map((action, index) => {
              const Icon = ICONS[action.icon] || Plus;
              const distance = STEP * (index + 1);
              return (
                <motion.li
                  key={action.label}
                  className="speed-dial-action-item"
                  initial={{ opacity: 0, scale: 0.4, x: -HALF, y: -HALF }}
                  animate={{ opacity: 1, scale: 1, x: axis.x * distance - HALF, y: axis.y * distance - HALF }}
                  exit={{ opacity: 0, scale: 0.4, x: -HALF, y: -HALF }}
                  transition={{ ...transition, delay: prefersReduced ? 0 : index * 0.04 }}
                >
                  <button
                    type="button"
                    className="speed-dial-action"
                    style={{ background: surfaceColor }}
                    aria-label={action.label}
                    role="menuitem"
                    onClick={() => handleAction(index)}
                  >
                    <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
                  </button>
                  <span
                    className={join(
                      'speed-dial-tooltip',
                      axis.tooltip === 'side' ? 'speed-dial-tooltip--side' : 'speed-dial-tooltip--top'
                    )}
                    style={{ background: surfaceColor }}
                    aria-hidden="true"
                  >
                    {action.label}
                  </span>
                </motion.li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        className="speed-dial-fab"
        style={{ background: accentColor }}
        aria-label={open ? 'Close actions' : 'Open actions'}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => !openOnHover && setOpen(value => !value)}
        whileTap={prefersReduced ? undefined : { scale: 0.9 }}
      >
        <motion.span
          className="speed-dial-fab-icon"
          animate={{ rotate: open ? 45 : 0 }}
          transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 26 }}
        >
          <Plus size={26} strokeWidth={2.4} aria-hidden="true" />
        </motion.span>
      </motion.button>
    </div>
  );
}
