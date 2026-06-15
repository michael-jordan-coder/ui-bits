import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import './AvatarStack.css';

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');
const PALETTE = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9', '#8b5cf6', '#ef4444'];

export interface Avatar {
  name: string;
  src?: string;
  color?: string;
}

export interface AvatarStackProps {
  avatars?: Avatar[];
  max?: number;
  size?: number;
  overlap?: number;
  spread?: boolean;
  ring?: string;
  showName?: boolean;
  className?: string;
}

const initials = (name: string) =>
  name
    .split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

const colorFor = (name: string, color?: string) => {
  if (color) return color;
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
};

interface Slot {
  type: 'avatar' | 'chip';
  data: Avatar;
  key: string;
}

// An overlapping facepile that fans apart on hover and lifts the avatar under
// the cursor while the others dim, with a "+N" overflow chip. Inspired by the
// collaborator avatar stacks in apps like Linear and Slack.
export default function AvatarStack({
  avatars = [],
  max = 5,
  size = 48,
  overlap = 16,
  spread = true,
  ring = '#0a0a0a',
  showName = true,
  className = '',
  ...rest
}: AvatarStackProps) {
  const prefersReduced = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const visible = avatars.slice(0, max);
  const overflow = avatars.length - visible.length;

  // Each slot is an avatar; an optional trailing chip counts the overflow.
  const slots: Slot[] = [
    ...visible.map((a, i) => ({ type: 'avatar' as const, data: a, key: `a-${i}` })),
    ...(overflow > 0 ? [{ type: 'chip' as const, data: { name: `+${overflow}` }, key: 'chip' }] : [])
  ];

  const step = size - overlap;
  const spreadStep = size + 6;
  const open = spread && hovered && !prefersReduced;
  const activeStep = open ? spreadStep : step;
  const width = slots.length > 0 ? (slots.length - 1) * activeStep + size : 0;

  const spring = prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 30 };

  return (
    <motion.div
      className={join('avatar-stack-root', className)}
      style={{ height: size }}
      animate={{ width }}
      transition={spring}
      role="group"
      aria-label={`${avatars.length} people`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setActiveIndex(null);
      }}
      {...rest}
    >
      {slots.map((slot, i) => {
        const isActive = activeIndex === i;
        const dimmed = activeIndex !== null && !isActive;
        const bg = slot.type === 'chip' ? 'rgba(255,255,255,0.12)' : colorFor(slot.data.name, slot.data.color);
        return (
          <motion.div
            key={slot.key}
            className="avatar-stack-item"
            style={{ width: size, height: size, borderColor: ring, zIndex: isActive ? slots.length + 1 : i }}
            animate={{
              x: i * activeStep,
              scale: isActive ? 1.14 : 1,
              y: isActive ? -size * 0.12 : 0,
              opacity: dimmed ? 0.6 : 1
            }}
            transition={spring}
            onMouseEnter={() => setActiveIndex(i)}
          >
            {slot.type === 'avatar' && slot.data.src ? (
              <img className="avatar-stack-img" src={slot.data.src} alt={slot.data.name} />
            ) : (
              <span className="avatar-stack-fallback" style={{ background: bg, fontSize: size * 0.34 }}>
                {slot.type === 'chip' ? slot.data.name : initials(slot.data.name)}
              </span>
            )}
          </motion.div>
        );
      })}

      <AnimatePresence>
        {showName && open && activeIndex !== null && slots[activeIndex]?.type === 'avatar' && (
          <motion.div
            className="avatar-stack-name"
            style={{ left: activeIndex * activeStep + size / 2 }}
            initial={{ opacity: 0, y: 4, scale: 0.9, x: '-50%' }}
            animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
            exit={{ opacity: 0, y: 4, scale: 0.9, x: '-50%' }}
            transition={{ duration: 0.16 }}
          >
            {slots[activeIndex].data.name}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
