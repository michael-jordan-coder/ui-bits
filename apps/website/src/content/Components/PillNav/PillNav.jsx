import { useState } from 'react';
import { motion } from 'motion/react';
import './PillNav.css';

const DEFAULT_TABS = ['Home', 'About', 'Productions', 'Contact'];
const DEFAULT_ACCENT = '#7a5236';

const join = (...classes) => classes.filter(Boolean).join(' ');

// Append an alpha channel to a 6-digit hex so the glow tracks the accent color.
const withAlpha = (hex, alpha = '4d') => (/^#[0-9a-fA-F]{6}$/.test(hex) ? `${hex}${alpha}` : hex);

export default function PillNav({
  tabs = DEFAULT_TABS,
  defaultActive,
  accentColor = DEFAULT_ACCENT,
  animationDuration = 300,
  className = ''
}) {
  const [activeTab, setActiveTab] = useState(defaultActive ?? tabs[0]);
  const duration = Math.max(0, animationDuration) / 1000;

  return (
    <nav className={join('pill-nav', className)}>
      {tabs.map(tab => {
        const isActive = tab === activeTab;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={join('pill-nav__tab', isActive && 'is-active')}
          >
            {isActive && (
              <motion.span
                layoutId="pill-nav-pill"
                aria-hidden
                className="pill-nav__pill"
                style={{ backgroundColor: accentColor, boxShadow: `0 0 15px ${withAlpha(accentColor)}` }}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ type: 'tween', ease: 'easeOut', duration }}
              />
            )}
            <span className="pill-nav__label">{tab}</span>
          </button>
        );
      })}
    </nav>
  );
}
