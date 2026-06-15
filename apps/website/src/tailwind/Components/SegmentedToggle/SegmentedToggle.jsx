import { useId, useState } from 'react';
import { motion } from 'motion/react';
import { Plane, House } from 'lucide-react';

const DEFAULT_ACCENT = '#ff385c';

const DEFAULT_OPTIONS = [
  { id: 'travel', label: 'Travelling', Icon: Plane },
  { id: 'host', label: 'Hosting', Icon: House }
];

const join = (...classes) => classes.filter(Boolean).join(' ');

// Black or white label, picked from the accent's luminance so it stays readable.
const readableTextColor = hex => {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex);
  if (!m) return '#fff';
  const int = parseInt(m[1], 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.55 ? '#000' : '#fff';
};

const SIZE_CLASSES = {
  sm: 'px-3 py-1.5 text-[0.8125rem]',
  md: 'px-4 py-2 text-sm'
};

export default function SegmentedToggle({
  options = DEFAULT_OPTIONS,
  defaultValue,
  accentColor = DEFAULT_ACCENT,
  size = 'md',
  className = ''
}) {
  const pillId = useId();
  const [value, setValue] = useState(defaultValue ?? options[0]?.id);
  const activeColor = readableTextColor(accentColor);
  const iconSize = size === 'sm' ? 16 : 18;

  return (
    <div
      role="tablist"
      className={join(
        'inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.06] p-[0.3rem]',
        className
      )}
    >
      {options.map(({ id, label, Icon }) => {
        const isActive = id === value;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setValue(id)}
            className={join(
              'relative z-[1] inline-flex cursor-pointer items-center gap-2 rounded-full border-0 bg-transparent font-sans font-semibold transition-colors duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/50',
              SIZE_CLASSES[size],
              isActive ? '' : 'text-gray-400 hover:text-gray-200'
            )}
            style={{ color: isActive ? activeColor : undefined }}
          >
            {isActive && (
              <motion.span
                layoutId={`${pillId}-pill`}
                aria-hidden
                className="absolute inset-0 -z-10 rounded-full"
                style={{ backgroundColor: accentColor }}
                transition={{ type: 'spring', stiffness: 480, damping: 38 }}
              />
            )}
            {Icon && (
              <motion.span
                key={isActive ? `active-${value}` : id}
                className="inline-flex"
                initial={isActive ? { scale: 0.6 } : false}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 16 }}
              >
                <Icon size={iconSize} strokeWidth={2.2} />
              </motion.span>
            )}
            <span className="relative">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
