import { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue
} from 'motion/react';

const DEFAULT_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

export interface ReactionBarProps {
  emojis?: string[];
  defaultSelected?: string | null;
  baseSize?: number;
  magnification?: number;
  range?: number;
  count?: number;
  showCount?: boolean;
  onReact?: (emoji: string | null) => void;
  className?: string;
}

interface ReactionItemProps {
  emoji: string;
  index: number;
  pointerX: MotionValue<number>;
  baseSize: number;
  magnification: number;
  range: number;
  selected: boolean;
  prefersReduced: boolean | null;
  onSelect: (emoji: string) => void;
  registerRef: (index: number, node: HTMLSpanElement | null) => void;
  onArrow: (index: number, direction: number) => void;
}

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

// A single emoji. It measures its own center on every pointer frame and maps the
// cursor's horizontal distance to a spring-driven scale — the closer the cursor,
// the larger the glyph — while neighbours ease back down. The lift + rotateX make
// the row appear to curve toward the pointer (Telegram's 3D reaction-picker warp).
function ReactionItem({
  emoji,
  index,
  pointerX,
  baseSize,
  magnification,
  range,
  selected,
  prefersReduced,
  onSelect,
  registerRef,
  onArrow
}: ReactionItemProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  const distance = useTransform(pointerX, value => {
    if (value === Infinity) return range;
    const bounds = ref.current?.getBoundingClientRect();
    const center = bounds ? bounds.x + bounds.width / 2 : 0;
    return value - center;
  });

  const scaleTarget = useTransform(distance, [-range, 0, range], [1, magnification, 1], { clamp: true });
  const liftTarget = useTransform(distance, [-range, 0, range], [0, -baseSize * 0.32, 0], { clamp: true });
  const tiltTarget = useTransform(distance, [-range, 0, range], [14, 0, -14], { clamp: true });

  const scale = useSpring(scaleTarget, { stiffness: 320, damping: 22, mass: 0.2 });
  const lift = useSpring(liftTarget, { stiffness: 320, damping: 22, mass: 0.2 });
  const tilt = useSpring(tiltTarget, { stiffness: 320, damping: 22, mass: 0.2 });

  const setRef = (node: HTMLSpanElement | null) => {
    ref.current = node;
    registerRef(index, node);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect(emoji);
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault();
      onArrow(index, event.key === 'ArrowRight' ? 1 : -1);
    }
  };

  return (
    <motion.span
      ref={setRef}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`React with ${emoji}`}
      className={join(
        'relative inline-flex h-[2.2em] w-[2.2em] cursor-pointer select-none items-center justify-center leading-none',
        'origin-bottom [transform-style:preserve-3d]',
        'focus-visible:outline-none focus-visible:rounded-full focus-visible:shadow-[0_0_0_2px_#000,0_0_0_4px_rgba(255,255,255,0.4)]'
      )}
      style={{
        fontSize: baseSize,
        scale: prefersReduced ? 1 : scale,
        y: prefersReduced ? 0 : lift,
        rotateX: prefersReduced ? 0 : tilt
      }}
      initial={prefersReduced ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={
        prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 18, delay: index * 0.045 }
      }
      onClick={() => onSelect(emoji)}
      onKeyDown={handleKeyDown}
    >
      {selected && (
        <motion.span
          layoutId="reaction-bar__pill"
          className="absolute inset-0 z-0 rounded-full bg-white/[0.14]"
          aria-hidden="true"
          transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 30 }}
        />
      )}
      <motion.span
        className="relative z-[1] inline-flex"
        animate={selected && !prefersReduced ? { scale: [1, 1.35, 1] } : { scale: 1 }}
        transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 600, damping: 14 }}
      >
        {emoji}
      </motion.span>
    </motion.span>
  );
}

// A horizontal emoji reaction picker: glyphs magnify and tilt toward the cursor
// for a lens-like 3D warp, a single emoji can be selected (toggle) with a springy
// pop and a persistent pill highlight, and an optional running count tracks the
// active reaction. Inspired by Telegram's magnifying emoji reaction picker.
export default function ReactionBar({
  emojis = DEFAULT_EMOJIS,
  defaultSelected = null,
  baseSize = 28,
  magnification = 1.8,
  range = 90,
  count = 0,
  showCount = true,
  onReact,
  className = ''
}: ReactionBarProps) {
  const prefersReduced = useReducedMotion();
  const pointerX = useMotionValue(Infinity);
  const [selected, setSelected] = useState<string | null>(defaultSelected);
  const itemRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const registerRef = (index: number, node: HTMLSpanElement | null) => {
    itemRefs.current[index] = node;
  };

  const handleArrow = (index: number, direction: number) => {
    const next = (index + direction + emojis.length) % emojis.length;
    itemRefs.current[next]?.focus();
  };

  const handleSelect = (emoji: string) => {
    const next = selected === emoji ? null : emoji;
    setSelected(next);
    onReact?.(next);
  };

  const displayCount = count + (selected ? 1 : 0);

  return (
    <div className={join('inline-flex items-center gap-3 font-sans text-gray-200', className)}>
      <div
        className="inline-flex items-end gap-[0.35rem] rounded-full border border-white/[0.08] bg-white/[0.05] px-[0.6rem] py-[0.4rem] [perspective:520px]"
        role="group"
        aria-label="Emoji reactions"
        onPointerMove={event => pointerX.set(event.clientX)}
        onPointerLeave={() => pointerX.set(Infinity)}
      >
        {emojis.map((emoji, index) => (
          <ReactionItem
            key={emoji}
            emoji={emoji}
            index={index}
            pointerX={pointerX}
            baseSize={baseSize}
            magnification={magnification}
            range={range}
            selected={selected === emoji}
            prefersReduced={prefersReduced}
            onSelect={handleSelect}
            registerRef={registerRef}
            onArrow={handleArrow}
          />
        ))}
      </div>
      {showCount && (
        <span
          className={join(
            'text-[0.95rem] font-semibold [font-variant-numeric:tabular-nums] transition-colors duration-200',
            selected ? 'text-gray-200' : 'text-gray-400'
          )}
        >
          {displayCount}
        </span>
      )}
    </div>
  );
}
