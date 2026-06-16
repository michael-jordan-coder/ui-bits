import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle, type LucideIcon } from 'lucide-react';
import './Toast.css';

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

type ToastType = 'success' | 'info' | 'warning' | 'error';
type Position = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';

interface ToastData {
  id: number;
  type: ToastType;
  title: string;
  description: string;
}

export interface ToastProps {
  position?: Position;
  maxVisible?: number;
  duration?: number;
  expandOnHover?: boolean;
  triggerLabel?: string;
  className?: string;
}

const TOAST_W = 340;
const TOAST_H = 74;
const GAP = 14;
const PEEK = 16;
const STACK_LIMIT = 5;

const TYPES: Record<ToastType, { color: string; Icon: LucideIcon }> = {
  success: { color: '#22c55e', Icon: CheckCircle2 },
  info: { color: '#38bdf8', Icon: Info },
  warning: { color: '#f59e0b', Icon: AlertTriangle },
  error: { color: '#f43f5e', Icon: XCircle }
};

const SAMPLES: Omit<ToastData, 'id'>[] = [
  { type: 'success', title: 'Changes saved', description: 'Your project has been updated.' },
  { type: 'info', title: 'New comment', description: 'Dana mentioned you in “Roadmap”.' },
  { type: 'warning', title: 'Storage almost full', description: 'You have used 92% of your quota.' },
  { type: 'error', title: 'Upload failed', description: 'We couldn’t process avatar.png.' },
  { type: 'success', title: 'Invite sent', description: 'We emailed the link to your teammate.' }
];

// A stacked notification toaster: toasts pile up at a corner, peeking behind the
// newest, fan out on hover, pause their countdown while hovered, and can be
// swiped away or auto-dismissed. Inspired by Sonner's stacked toast interaction.
export default function Toast({
  position = 'bottom-right',
  maxVisible = 3,
  duration = 4000,
  expandOnHover = true,
  triggerLabel = 'Send notification',
  className = '',
  ...rest
}: ToastProps) {
  const prefersReduced = useReducedMotion();
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const [expanded, setExpanded] = useState(false);

  const idRef = useRef(0);
  const seqRef = useRef(0);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastsRef = useRef<ToastData[]>(toasts);
  toastsRef.current = toasts;

  const dismiss = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
    const handle = timers.current.get(id);
    if (handle) {
      clearTimeout(handle);
      timers.current.delete(id);
    }
  };

  const arm = (id: number) => {
    const existing = timers.current.get(id);
    if (existing) clearTimeout(existing);
    timers.current.set(
      id,
      setTimeout(() => dismiss(id), duration)
    );
  };

  const disarmAll = () => {
    timers.current.forEach(clearTimeout);
    timers.current.clear();
  };

  const push = () => {
    const sample = SAMPLES[seqRef.current % SAMPLES.length];
    seqRef.current += 1;
    const id = idRef.current++;
    setToasts(prev => [{ id, ...sample }, ...prev].slice(0, STACK_LIMIT));
    if (!expanded) arm(id);
  };

  const handleEnter = () => {
    clearTimeout(collapseTimer.current ?? undefined);
    if (!expandOnHover) return;
    setExpanded(true);
    disarmAll();
  };

  const handleLeave = () => {
    if (!expandOnHover) return;
    clearTimeout(collapseTimer.current ?? undefined);
    collapseTimer.current = setTimeout(() => {
      setExpanded(false);
      toastsRef.current.forEach(toast => arm(toast.id));
    }, 90);
  };

  useEffect(() => {
    const map = timers.current;
    const collapse = collapseTimer;
    return () => {
      map.forEach(clearTimeout);
      map.clear();
      clearTimeout(collapse.current ?? undefined);
    };
  }, []);

  const isTop = position.startsWith('top');
  const isLeft = position.endsWith('left');
  const dir = isTop ? 1 : -1;
  const regionStyle: CSSProperties = {
    width: TOAST_W,
    [isTop ? 'top' : 'bottom']: 20,
    [isLeft ? 'left' : 'right']: 20
  };
  const anchorStyle: CSSProperties = { width: TOAST_W, [isTop ? 'top' : 'bottom']: 0, left: 0, right: 0 };
  const spring = prefersReduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 320, damping: 32 };

  return (
    <div className={join('toast-root', className)} {...rest}>
      <button type="button" className="toast-trigger" onClick={push}>
        {triggerLabel}
      </button>

      <ul className="toast-region" style={regionStyle} aria-live="polite" aria-label="Notifications">
        <AnimatePresence initial={false}>
          {toasts.map((toast, index) => {
            const { color, Icon } = TYPES[toast.type] || TYPES.info;
            const collapsed = !expanded;
            const y = collapsed ? dir * index * PEEK : dir * index * (TOAST_H + GAP);
            const scale = collapsed ? Math.max(1 - index * 0.05, 0.9) : 1;
            const opacity = collapsed ? (index < maxVisible ? 1 : 0) : 1;
            return (
              <motion.li
                key={toast.id}
                className="toast-item"
                style={{ ...anchorStyle, zIndex: toasts.length - index }}
                role="status"
                drag={prefersReduced ? false : 'x'}
                dragSnapToOrigin
                dragElastic={0.6}
                onDragEnd={(_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
                  if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 600) dismiss(toast.id);
                }}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -dir * 44, scale: 0.92 }}
                animate={{ opacity, y, scale }}
                exit={prefersReduced ? { opacity: 0 } : { opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
                transition={spring}
              >
                <div
                  className="toast-card"
                  style={{ boxShadow: `inset 3px 0 0 ${color}, 0 16px 34px -14px rgba(0, 0, 0, 0.6)` }}
                >
                  <span className="toast-icon" style={{ color }}>
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <div className="toast-body">
                    <p className="toast-title">{toast.title}</p>
                    <p className="toast-desc">{toast.description}</p>
                  </div>
                  <button
                    type="button"
                    className="toast-close"
                    onClick={() => dismiss(toast.id)}
                    onPointerDown={event => event.stopPropagation()}
                    aria-label="Dismiss notification"
                  >
                    <X size={14} strokeWidth={2.4} />
                  </button>
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
