import { useEffect, useState, type ComponentType } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Plus, Share2, Copy, Heart, Star, Trash2, Pencil, Download, type LucideProps } from 'lucide-react';

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
    <div
      className={join('relative flex h-[320px] w-[320px] items-center justify-center text-white', className)}
      {...hoverProps}
    >
      <AnimatePresence>
        {open && (
          <motion.ul className="absolute left-1/2 top-1/2 z-[1] m-0 h-0 w-0 list-none p-0" role="menu" aria-label="Actions">
            {actions.map((action, index) => {
              const Icon = ICONS[action.icon] || Plus;
              const distance = STEP * (index + 1);
              return (
                <motion.li
                  key={action.label}
                  className="absolute left-0 top-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.4, x: -HALF, y: -HALF }}
                  animate={{ opacity: 1, scale: 1, x: axis.x * distance - HALF, y: axis.y * distance - HALF }}
                  exit={{ opacity: 0, scale: 0.4, x: -HALF, y: -HALF }}
                  transition={{ ...transition, delay: prefersReduced ? 0 : index * 0.04 }}
                >
                  <button
                    type="button"
                    className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-[9999px] border border-white/10 p-0 text-white shadow-[0_6px_18px_rgba(0,0,0,0.3)] hover:border-white/[0.28] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    style={{ background: surfaceColor }}
                    aria-label={action.label}
                    role="menuitem"
                    onClick={() => handleAction(index)}
                  >
                    <Icon size={18} strokeWidth={2.2} aria-hidden="true" />
                  </button>
                  <span
                    className={join(
                      'pointer-events-none absolute whitespace-nowrap rounded-md border border-white/10 px-2 py-1 text-xs font-medium text-white',
                      axis.tooltip === 'side'
                        ? 'right-[calc(100%+0.5rem)] top-1/2 -translate-y-1/2'
                        : 'bottom-[calc(100%+0.5rem)] left-1/2 -translate-x-1/2'
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
        className="relative z-[2] inline-flex h-14 w-14 cursor-pointer items-center justify-center rounded-[9999px] border-none p-0 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-white"
        style={{ background: accentColor }}
        aria-label={open ? 'Close actions' : 'Open actions'}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => !openOnHover && setOpen(value => !value)}
        whileTap={prefersReduced ? undefined : { scale: 0.9 }}
      >
        <motion.span
          className="inline-flex items-center justify-center"
          animate={{ rotate: open ? 45 : 0 }}
          transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 26 }}
        >
          <Plus size={26} strokeWidth={2.4} aria-hidden="true" />
        </motion.span>
      </motion.button>
    </div>
  );
}
