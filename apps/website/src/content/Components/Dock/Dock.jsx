import { useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform
} from 'motion/react';
import { Folder, Home, Image, Music, Search, Settings } from 'lucide-react';
import './Dock.css';

const join = (...classes) => classes.filter(Boolean).join(' ');

const DEFAULT_ITEMS = [
  { id: 'home', label: 'Home', icon: <Home />, active: true },
  { id: 'search', label: 'Search', icon: <Search /> },
  { id: 'music', label: 'Music', icon: <Music />, active: true },
  { id: 'photos', label: 'Photos', icon: <Image /> },
  { id: 'files', label: 'Files', icon: <Folder /> },
  { id: 'settings', label: 'Settings', icon: <Settings /> }
];

// A single dock tile. It measures its own center on every pointer frame and maps
// the cursor's distance to a spring-driven size, so neighbours swell as the
// pointer sweeps past — the magnification curve from Apple's macOS Dock.
function DockItem({ item, mouseX, baseItemSize, magnification, distance, accentColor, showLabels, prefersReduced }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const controls = useAnimationControls();

  const mouseDistance = useTransform(mouseX, value => {
    const bounds = ref.current?.getBoundingClientRect();
    const center = bounds ? bounds.x + bounds.width / 2 : 0;
    return value - center;
  });

  const sizeTarget = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(sizeTarget, { stiffness: 300, damping: 24, mass: 0.2 });
  const itemSize = prefersReduced ? baseItemSize : size;

  const handleClick = () => {
    if (!prefersReduced) {
      controls.start({
        y: [0, -baseItemSize * 0.45, 0],
        transition: { duration: 0.55, times: [0, 0.35, 1], ease: 'easeOut' }
      });
    }
    item.onClick?.();
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      className="dock-item"
      style={{ width: itemSize, height: itemSize }}
      aria-label={item.label}
      onClick={handleClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <AnimatePresence>
        {showLabels && hovered && (
          <motion.span
            className="dock-label"
            initial={{ opacity: 0, y: 8, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 8, x: '-50%' }}
            transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 26 }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.span className="dock-icon" animate={controls}>
        {item.icon}
      </motion.span>

      <span
        className="dock-dot"
        style={{ backgroundColor: accentColor, opacity: item.active ? 1 : 0 }}
        aria-hidden="true"
      />
    </motion.button>
  );
}

// A magnifying app dock: tiles scale toward the cursor with fluid spring physics,
// raise a tooltip on hover, bounce on click, and mark "running" apps with an
// accent dot. Inspired by the magnification effect in Apple's macOS Dock.
export default function Dock({
  items = DEFAULT_ITEMS,
  baseItemSize = 48,
  magnification = 80,
  distance = 150,
  accentColor = '#6366f1',
  showLabels = true,
  className = '',
  ariaLabel = 'Application dock',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      className={join('dock-panel', className)}
      role="toolbar"
      aria-label={ariaLabel}
      style={{ minHeight: magnification }}
      onPointerMove={event => mouseX.set(event.clientX)}
      onPointerLeave={() => mouseX.set(Infinity)}
      {...rest}
    >
      {items.map((item, index) => (
        <DockItem
          key={item.id ?? index}
          item={item}
          mouseX={mouseX}
          baseItemSize={baseItemSize}
          magnification={magnification}
          distance={distance}
          accentColor={accentColor}
          showLabels={showLabels}
          prefersReduced={prefersReduced}
        />
      ))}
    </div>
  );
}
