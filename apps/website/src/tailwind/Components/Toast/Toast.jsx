import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';

const join = (...classes) => classes.filter(Boolean).join(' ');

const TOAST_W = 340;
const TOAST_H = 74;
const GAP = 14;
const PEEK = 16;
const STACK_LIMIT = 5;

const TYPES = {
  success: { color: '#22c55e', Icon: CheckCircle2 },
  info: { color: '#38bdf8', Icon: Info },
  warning: { color: '#f59e0b', Icon: AlertTriangle },
  error: { color: '#f43f5e', Icon: XCircle }
};

const SAMPLES = [
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
}) {
  const prefersReduced = useReducedMotion();
  const [toasts, setToasts] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const idRef = useRef(0);
  const seqRef = useRef(0);
  const timers = useRef(new Map());
  const collapseTimer = useRef(null);
  const toastsRef = useRef(toasts);
  toastsRef.current = toasts;

  const dismiss = id => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
    const handle = timers.current.get(id);
    if (handle) {
      clearTimeout(handle);
      timers.current.delete(id);
    }
  };

  const arm = id => {
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
    clearTimeout(collapseTimer.current);
    if (!expandOnHover) return;
    setExpanded(true);
    disarmAll();
  };

  const handleLeave = () => {
    if (!expandOnHover) return;
    clearTimeout(collapseTimer.current);
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
      clearTimeout(collapse.current);
    };
  }, []);

  const isTop = position.startsWith('top');
  const isLeft = position.endsWith('left');
  const dir = isTop ? 1 : -1;
  const regionStyle = {
    width: TOAST_W,
    [isTop ? 'top' : 'bottom']: 20,
    [isLeft ? 'left' : 'right']: 20
  };
  const anchorStyle = { width: TOAST_W, [isTop ? 'top' : 'bottom']: 0, left: 0, right: 0 };
  const spring = prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 32 };

  return (
    <div className={join('absolute inset-0 flex items-center justify-center', className)} {...rest}>
      <button
        type="button"
        className="cursor-pointer rounded-[10px] border border-white/[0.18] bg-white/[0.06] px-[1.3rem] py-[0.7rem] text-[0.9rem] font-semibold text-[#fafafa] outline-none transition-[background] duration-200 [-webkit-tap-highlight-color:transparent] hover:bg-white/10 focus-visible:shadow-[0_0_0_3px_rgba(255,255,255,0.25)]"
        onClick={push}
      >
        {triggerLabel}
      </button>

      <ul
        className="pointer-events-none absolute m-0 list-none p-0"
        style={regionStyle}
        aria-live="polite"
        aria-label="Notifications"
      >
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
                className="pointer-events-auto absolute cursor-grab [will-change:transform] active:cursor-grabbing"
                style={{ ...anchorStyle, zIndex: toasts.length - index }}
                role="status"
                drag={prefersReduced ? false : 'x'}
                dragSnapToOrigin
                dragElastic={0.6}
                onDragEnd={(_event, info) => {
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
                  className="relative box-border flex h-[74px] items-start gap-[0.7rem] overflow-hidden rounded-xl border border-white/[0.08] bg-[rgba(24,24,27,0.92)] px-[0.9rem] py-[0.85rem] text-[#fafafa] backdrop-blur-[8px]"
                  style={{ boxShadow: `inset 3px 0 0 ${color}, 0 16px 34px -14px rgba(0, 0, 0, 0.6)` }}
                >
                  <span className="mt-px grid flex-shrink-0 place-items-center leading-[0]" style={{ color }}>
                    <Icon size={18} strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="m-0 truncate text-[0.875rem] font-semibold leading-[1.3]">{toast.title}</p>
                    <p className="mb-0 mt-[0.15rem] truncate text-[0.8rem] leading-[1.35] text-[#a1a1aa]">
                      {toast.description}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="-mr-0.5 -mt-0.5 grid h-[22px] w-[22px] flex-shrink-0 cursor-pointer place-items-center rounded-md border-none bg-transparent p-0 text-[#8b8b94] outline-none transition-[color,background] duration-150 hover:bg-white/[0.08] hover:text-[#fafafa] focus-visible:shadow-[0_0_0_2px_rgba(255,255,255,0.4)]"
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
