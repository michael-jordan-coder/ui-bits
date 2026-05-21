import { useEffect, useRef, useState } from 'react';

const PALETTES = [
  { id: 'cherry', name: 'Cherry', primary: '#fc4d6e', accent: '#ffa0b2' },
  { id: 'amber', name: 'Amber', primary: '#f59e0b', accent: '#fcd34d' },
  { id: 'green', name: 'Green', primary: '#22c55e', accent: '#86efac' },
  { id: 'cyan', name: 'Cyan', primary: '#06b6d4', accent: '#67e8f9' },
  { id: 'coral', name: 'Coral', primary: '#f43f5e', accent: '#fda4af' },
  { id: 'blue', name: 'Blue', primary: '#3b82f6', accent: '#93c5fd' }
];

const STORAGE_KEY = 'ui-bits:accent';

const applyPalette = palette => {
  const root = document.documentElement;
  root.style.setProperty('--primary', palette.primary);
  root.style.setProperty('--accent', palette.accent);
};

const readStored = () => {
  if (typeof window === 'undefined') return PALETTES[0];
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return PALETTES.find(p => p.id === stored) ?? PALETTES[0];
};

const AccentPicker = () => {
  const [active, setActive] = useState(readStored);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  useEffect(() => {
    applyPalette(active);
    window.localStorage.setItem(STORAGE_KEY, active.id);
  }, [active]);

  useEffect(() => {
    if (!open) return undefined;
    const onClick = e => {
      if (!wrapRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = e => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="cb-accent-picker" ref={wrapRef}>
      <button
        type="button"
        className="cb-accent-picker-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Accent color: ${active.name}`}
        onClick={() => setOpen(v => !v)}
      >
        <span className="cb-accent-picker-swatch" style={{ background: active.primary }} />
        <span className="cb-accent-picker-name">{active.name}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
          <path d="M2 3.5 5 6.5 8 3.5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ul className="cb-accent-picker-menu" role="listbox">
          {PALETTES.map(palette => (
            <li key={palette.id}>
              <button
                type="button"
                role="option"
                aria-selected={palette.id === active.id}
                className={
                  'cb-accent-picker-option' +
                  (palette.id === active.id ? ' cb-accent-picker-option-active' : '')
                }
                onClick={() => {
                  setActive(palette);
                  setOpen(false);
                }}
              >
                <span className="cb-accent-picker-swatch" style={{ background: palette.primary }} />
                <span>{palette.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AccentPicker;
