import { useState } from 'react';
import { motion } from 'motion/react';

const DEFAULT_TABS = ['Home', 'About', 'Productions', 'Contact'];
const DEFAULT_ACCENT = '#7a5236';

export interface PillNavProps {
  tabs?: string[];
  defaultActive?: string;
  accentColor?: string;
  animationDuration?: number;
  className?: string;
}

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

// Append an alpha channel to a 6-digit hex so the glow tracks the accent color.
const withAlpha = (hex: string, alpha = '4d') => (/^#[0-9a-fA-F]{6}$/.test(hex) ? `${hex}${alpha}` : hex);

export default function PillNav({
  tabs = DEFAULT_TABS,
  defaultActive,
  accentColor = DEFAULT_ACCENT,
  animationDuration = 300,
  className = ''
}: PillNavProps) {
  const [activeTab, setActiveTab] = useState(defaultActive ?? tabs[0]);
  const duration = Math.max(0, animationDuration) / 1000;

  return (
    <nav
      className={join(
        'inline-flex items-center gap-1 rounded-full bg-black p-1 shadow-2xl ring-1 ring-white/5',
        className
      )}
    >
      {tabs.map(tab => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={join(
              'relative z-10 cursor-pointer rounded-full px-6 py-2.5 font-sans text-sm font-medium transition-colors duration-300',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/50',
              isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200'
            )}
          >
            {isActive && (
              <motion.span
                layoutId="pill-nav-pill"
                aria-hidden
                className="absolute inset-0 -z-10 rounded-full"
                style={{ backgroundColor: accentColor, boxShadow: `0 0 15px ${withAlpha(accentColor)}` }}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: 'tween', ease: 'easeOut', duration }}
              />
            )}
            <span className="relative z-20">{tab}</span>
          </button>
        );
      })}
    </nav>
  );
}
