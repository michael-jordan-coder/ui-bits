import { motion } from 'motion/react';
import { House, Search, Bell, Settings, ChevronRight } from 'lucide-react';

const DEFAULT_ACCENT = '#3ecf8e';

const DEFAULT_ITEMS = [
  { id: 'home', label: 'Home', Icon: House },
  { id: 'search', label: 'Search', Icon: Search },
  { id: 'notifications', label: 'Notifications', Icon: Bell },
  { id: 'settings', label: 'Settings', Icon: Settings }
];

// The icon's hover gesture per animation style. Returned to rest when not hovered.
const ICON_MOTION = {
  bounce: { y: -3 },
  pop: { scale: 1.25 },
  rotate: { rotate: 18 },
  wiggle: { rotate: [0, -12, 10, -6, 0] }
};

const join = (...classes) => classes.filter(Boolean).join(' ');

export default function AnimatedMenu({
  items = DEFAULT_ITEMS,
  accentColor = DEFAULT_ACCENT,
  animation = 'bounce',
  className = ''
}) {
  const iconHover = ICON_MOTION[animation] ?? ICON_MOTION.bounce;

  return (
    <nav
      className={join(
        'flex w-60 flex-col gap-0.5 rounded-[0.875rem] border border-white/10 bg-white/[0.03] p-2',
        className
      )}
    >
      {items.map(({ id, label, Icon }) => (
        <motion.button
          key={id}
          type="button"
          className="flex w-full cursor-pointer items-center gap-3 rounded-[0.625rem] border-0 bg-transparent px-3 py-2.5 font-sans text-[0.9rem] font-medium text-gray-200 transition-colors duration-200 hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/40"
          initial="rest"
          animate="rest"
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            className="inline-flex text-gray-400"
            variants={{ rest: { color: '#9ca3af' }, hover: { ...iconHover, color: accentColor } }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          >
            {Icon && <Icon size={18} strokeWidth={2} />}
          </motion.span>
          <span className="flex-1 text-left">{label}</span>
          <motion.span
            className="inline-flex text-gray-500"
            variants={{ rest: { opacity: 0, x: -4 }, hover: { opacity: 1, x: 0 } }}
            transition={{ type: 'spring', stiffness: 400, damping: 24 }}
          >
            <ChevronRight size={16} strokeWidth={2} />
          </motion.span>
        </motion.button>
      ))}
    </nav>
  );
}
