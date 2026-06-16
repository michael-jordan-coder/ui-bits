import { useRef, type ReactNode } from 'react';
import { animate, motion, useMotionValue, useReducedMotion, type PanInfo } from 'motion/react';
import { Archive, Trash2, type LucideIcon } from 'lucide-react';
import './SwipeAction.css';

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

export interface SwipeActionItem {
  id: string;
  label: string;
  color: string;
  icon?: LucideIcon;
}

export interface SwipeActionProps {
  children?: ReactNode;
  actions?: SwipeActionItem[];
  actionWidth?: number;
  surfaceColor?: string;
  width?: number;
  fullSwipe?: boolean;
  onAction?: (id: string) => void;
  className?: string;
}

const DEFAULT_ACTIONS: SwipeActionItem[] = [
  { id: 'archive', label: 'Archive', color: '#3b82f6', icon: Archive },
  { id: 'delete', label: 'Delete', color: '#ef4444', icon: Trash2 }
];

// A row you drag aside to reveal trailing actions: it snaps open at the halfway
// point and, if you fling it far enough, full-swipes to fire the primary action.
// Inspired by the swipe-to-reveal interaction documented on designspells.com.
export default function SwipeAction({
  children,
  actions = DEFAULT_ACTIONS,
  actionWidth = 80,
  surfaceColor = '#1c1c22',
  width = 360,
  fullSwipe = true,
  onAction,
  className = '',
  ...rest
}: SwipeActionProps) {
  const prefersReduced = useReducedMotion();
  const rowRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const openWidth = actions.length * actionWidth;

  const snapTransition = prefersReduced
    ? { duration: 0 }
    : ({ type: 'spring', stiffness: 500, damping: 44 } as const);
  const settle = (target: number) => animate(x, target, snapTransition);

  const fireAndClose = (id: string) => {
    onAction?.(id);
    settle(0);
  };

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const pos = x.get();
    const velocity = info.velocity.x;
    if (fullSwipe && actions.length && (pos < -(openWidth + actionWidth * 0.9) || velocity < -900)) {
      const primary = actions[0].id;
      if (prefersReduced) {
        onAction?.(primary);
        x.set(0);
        return;
      }
      const fullWidth = rowRef.current?.offsetWidth ?? openWidth + 320;
      animate(x, -fullWidth, {
        type: 'spring',
        stiffness: 340,
        damping: 40,
        onComplete: () => {
          onAction?.(primary);
          x.set(0);
        }
      });
      return;
    }
    const open = pos < -openWidth / 2 || velocity < -500;
    settle(open ? -openWidth : 0);
  };

  return (
    <div className={join('swipe-action-root', className)} ref={rowRef} style={{ width }} {...rest}>
      <motion.div
        className="swipe-action-content"
        style={{ x, background: surfaceColor }}
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -openWidth, right: 0 }}
        dragElastic={{ left: fullSwipe ? 0.5 : 0.06, right: 0.12 }}
        onDragEnd={handleDragEnd}
        onClick={() => {
          if (x.get() !== 0) settle(0);
        }}
      >
        {children}
      </motion.div>

      <div className="swipe-action-actions" style={{ width: openWidth }}>
        {actions.map(action => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              className="swipe-action-action"
              style={{ width: actionWidth, background: action.color }}
              aria-label={action.label}
              onFocus={() => settle(-openWidth)}
              onClick={() => fireAndClose(action.id)}
            >
              {Icon && <Icon size={20} strokeWidth={1.8} aria-hidden="true" />}
              <span className="swipe-action-action-label">{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
