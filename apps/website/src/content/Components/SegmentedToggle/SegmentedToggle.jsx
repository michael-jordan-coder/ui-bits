import { useId, useState } from 'react';
import { motion } from 'motion/react';
import { Plane, House } from 'lucide-react';
import './SegmentedToggle.css';

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
    <div className={join('segmented-toggle', `segmented-toggle--${size}`, className)} role="tablist">
      {options.map(({ id, label, Icon }) => {
        const isActive = id === value;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setValue(id)}
            className={join('segmented-toggle__option', isActive && 'is-active')}
            style={{ color: isActive ? activeColor : undefined }}
          >
            {isActive && (
              <motion.span
                layoutId={`${pillId}-pill`}
                aria-hidden
                className="segmented-toggle__pill"
                style={{ backgroundColor: accentColor }}
                transition={{ type: 'spring', stiffness: 480, damping: 38 }}
              />
            )}
            {Icon && (
              <motion.span
                key={isActive ? `active-${value}` : id}
                className="segmented-toggle__icon"
                initial={isActive ? { scale: 0.6 } : false}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 16 }}
              >
                <Icon size={iconSize} strokeWidth={2.2} />
              </motion.span>
            )}
            <span className="segmented-toggle__label">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
