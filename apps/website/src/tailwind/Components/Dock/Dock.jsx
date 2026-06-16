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
      className="relative flex shrink-0 cursor-pointer items-center justify-center rounded-[0.85rem] border border-white/10 p-0 text-[#f4f4f5] outline-none [background:linear-gradient(160deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04))] [will-change:width,height] [-webkit-tap-highlight-color:transparent] focus-visible:[box-shadow:0_0_0_3px_rgba(255,255,255,0.85)] motion-reduce:[will-change:auto]"
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
            className="pointer-events-none absolute bottom-[calc(100%+12px)] left-1/2 whitespace-nowrap rounded-[0.5rem] border border-white/[0.14] bg-[#18181b] px-[0.6rem] py-[0.3rem] text-[0.78rem] font-semibold leading-none text-[#fafafa] [box-shadow:0_10px_24px_-12px_rgba(0,0,0,0.8)]"
            initial={{ opacity: 0, y: 8, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 8, x: '-50%' }}
            transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 360, damping: 26 }}
          >
            {item.label}
          </motion.span>
        )}
      </AnimatePresence>

      <motion.span
        className="absolute inset-0 flex items-center justify-center [will-change:transform] motion-reduce:[will-change:auto] [&_svg]:h-[46%] [&_svg]:w-[46%]"
        animate={controls}
      >
        {item.icon}
      </motion.span>

      <span
        className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full transition-opacity duration-200"
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
      className={join(
        'inline-flex items-end gap-[0.6rem] rounded-[1.4rem] border border-white/[0.12] bg-white/[0.06] px-[0.85rem] py-[0.7rem] backdrop-blur-[14px] [box-shadow:0_24px_60px_-24px_rgba(0,0,0,0.75),inset_0_1px_0_0_rgba(255,255,255,0.12)] [-webkit-backdrop-filter:blur(14px)]',
        className
      )}
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
