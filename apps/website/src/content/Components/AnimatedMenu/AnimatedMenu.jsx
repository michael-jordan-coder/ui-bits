import { motion } from 'motion/react';
import { House, Search, Bell, Settings, ChevronRight } from 'lucide-react';
import './AnimatedMenu.css';

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
    <nav className={join('animated-menu', className)}>
      {items.map(({ id, label, Icon }) => (
        <motion.button
          key={id}
          type="button"
          className="animated-menu__item"
          initial="rest"
          animate="rest"
          whileHover="hover"
          whileTap={{ scale: 0.98 }}
        >
          <motion.span
            className="animated-menu__icon"
            variants={{ rest: { color: '#9ca3af' }, hover: { ...iconHover, color: accentColor } }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          >
            {Icon && <Icon size={18} strokeWidth={2} />}
          </motion.span>
          <span className="animated-menu__label">{label}</span>
          <motion.span
            className="animated-menu__chevron"
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
