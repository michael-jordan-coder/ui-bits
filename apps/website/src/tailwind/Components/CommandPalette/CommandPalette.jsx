import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Search, CornerDownLeft, FilePlus, FolderPlus, LayoutDashboard, Settings, CreditCard, SunMoon, LogOut } from 'lucide-react';

const join = (...classes) => classes.filter(Boolean).join(' ');

const DEFAULT_COMMANDS = [
  { id: 'new-file', label: 'New file', group: 'Actions', shortcut: '⌘N', icon: FilePlus },
  { id: 'new-folder', label: 'New folder', group: 'Actions', shortcut: '⌘⇧N', icon: FolderPlus },
  { id: 'dashboard', label: 'Go to dashboard', group: 'Navigation', icon: LayoutDashboard },
  { id: 'settings', label: 'Open settings', group: 'Navigation', shortcut: '⌘,', icon: Settings },
  { id: 'billing', label: 'Manage billing', group: 'Navigation', icon: CreditCard },
  { id: 'theme', label: 'Switch theme', group: 'Account', icon: SunMoon },
  { id: 'sign-out', label: 'Sign out', group: 'Account', icon: LogOut }
];

// Buckets the matched commands back into their groups while preserving the
// order groups first appear in, and stamps each item with its flat index so
// keyboard navigation can address a single linear list.
const buildGroups = matches => {
  const order = [];
  const map = new Map();
  matches.forEach(command => {
    const key = command.group ?? '';
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key).push(command);
  });
  const flat = [];
  const groups = order.map(key => ({
    group: key,
    items: map.get(key).map(command => {
      const item = { ...command, index: flat.length };
      flat.push(item);
      return item;
    })
  }));
  return { groups, flat };
};

const renderLabel = (label, matchIndex, queryLength, accentColor) => {
  if (matchIndex < 0 || queryLength === 0) return label;
  return (
    <>
      {label.slice(0, matchIndex)}
      <mark className="bg-transparent font-semibold" style={{ color: accentColor }}>
        {label.slice(matchIndex, matchIndex + queryLength)}
      </mark>
      {label.slice(matchIndex + queryLength)}
    </>
  );
};

// An inline ⌘K command menu: live substring filtering, keyboard navigation, and
// a selection highlight that magic-moves between rows. Inspired by the Raycast /
// Linear command menus catalogued on designspells.com.
export default function CommandPalette({
  commands = DEFAULT_COMMANDS,
  placeholder = 'Type a command or search…',
  accentColor = '#6366f1',
  surfaceColor = '#16181d',
  emptyMessage = 'No results found.',
  showShortcuts = true,
  width = 420,
  onSelect,
  className = '',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRef = useRef(null);

  const trimmed = query.trim().toLowerCase();

  const { groups, flat } = useMemo(() => {
    const matches = commands
      .map(command => ({ ...command, matchIndex: command.label.toLowerCase().indexOf(trimmed) }))
      .filter(command => trimmed === '' || command.matchIndex !== -1);
    return buildGroups(matches);
  }, [commands, trimmed]);

  useEffect(() => {
    setActiveIndex(0);
  }, [trimmed]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex]);

  const select = id => onSelect?.(id);

  const handleKeyDown = event => {
    if (!flat.length) {
      if (event.key === 'Escape') setQuery('');
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex(i => (i + 1) % flat.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(i => (i - 1 + flat.length) % flat.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = flat[activeIndex];
      if (item) select(item.id);
    } else if (event.key === 'Escape') {
      setQuery('');
    }
  };

  const highlightTransition = prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 600, damping: 42 };
  const active = flat[activeIndex];

  return (
    <div
      className={join(
        'flex max-w-full flex-col overflow-hidden rounded-[14px] border border-white/[0.08] text-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.7)]',
        className
      )}
      style={{ width, background: surfaceColor }}
      {...rest}
    >
      <div className="flex h-[52px] items-center gap-[0.7rem] border-b border-white/[0.07] px-4">
        <Search className="shrink-0 text-white/40" size={18} strokeWidth={2} aria-hidden="true" />
        <input
          className="h-full min-w-0 flex-1 border-none bg-transparent text-[0.98rem] text-white outline-none placeholder:text-white/[0.34]"
          value={query}
          onChange={event => setQuery(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded="true"
          aria-controls="command-palette-list"
          aria-activedescendant={active ? `command-palette-item-${active.id}` : undefined}
          aria-label="Search commands"
        />
      </div>

      <div
        className="flex max-h-[320px] flex-col gap-[0.1rem] overflow-y-auto p-[0.4rem]"
        id="command-palette-list"
        role="listbox"
        aria-label="Commands"
      >
        {flat.length === 0 ? (
          <div className="px-4 py-[2.2rem] text-center text-[0.9rem] text-white/40">{emptyMessage}</div>
        ) : (
          groups.map(group => (
            <div className="flex flex-col [&+&]:mt-[0.35rem]" key={group.group} role="presentation">
              {group.group && (
                <div className="px-[0.65rem] pb-[0.3rem] pt-2 text-[0.72rem] font-semibold tracking-[0.01em] text-white/[0.36]">
                  {group.group}
                </div>
              )}
              {group.items.map(item => {
                const isActive = item.index === activeIndex;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    ref={isActive ? activeRef : null}
                    type="button"
                    id={`command-palette-item-${item.id}`}
                    role="option"
                    aria-selected={isActive}
                    className="relative flex w-full cursor-pointer items-center gap-[0.7rem] rounded-[9px] border-none bg-transparent px-[0.65rem] py-[0.6rem] text-left text-[0.92rem] text-white/[0.74] aria-selected:text-white"
                    onMouseMove={() => setActiveIndex(item.index)}
                    onClick={() => select(item.id)}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="command-palette-active"
                        className="pointer-events-none absolute inset-0 z-0 rounded-[9px]"
                        style={{ background: accentColor, opacity: 0.16 }}
                        transition={highlightTransition}
                      />
                    )}
                    {Icon && <Icon className="relative z-[1] shrink-0 opacity-[0.85]" size={17} strokeWidth={2} aria-hidden="true" />}
                    <span className="relative z-[1] min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      {renderLabel(item.label, item.matchIndex, trimmed.length, accentColor)}
                    </span>
                    {showShortcuts && item.shortcut && (
                      <kbd className="relative z-[1] shrink-0 rounded-[5px] border border-white/[0.08] bg-white/[0.07] px-[0.4rem] py-[0.1rem] font-mono text-[0.72rem] text-white/50">
                        {item.shortcut}
                      </kbd>
                    )}
                    {isActive && <CornerDownLeft className="relative z-[1] shrink-0 text-white/55" size={14} strokeWidth={2} aria-hidden="true" />}
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>

      <div className="flex items-center gap-4 border-t border-white/[0.07] px-4 py-[0.55rem] text-[0.74rem] text-white/40">
        <span className="inline-flex items-center gap-[0.3rem]">
          <kbd className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[4px] border border-white/[0.09] bg-white/[0.06] px-[0.3rem] text-[0.72rem] text-white/60">↑</kbd>
          <kbd className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[4px] border border-white/[0.09] bg-white/[0.06] px-[0.3rem] text-[0.72rem] text-white/60">↓</kbd>
          navigate
        </span>
        <span className="inline-flex items-center gap-[0.3rem]">
          <kbd className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[4px] border border-white/[0.09] bg-white/[0.06] px-[0.3rem] text-[0.72rem] text-white/60">↵</kbd>
          select
        </span>
        <span className="inline-flex items-center gap-[0.3rem]">
          <kbd className="inline-flex h-[18px] min-w-[18px] items-center justify-center rounded-[4px] border border-white/[0.09] bg-white/[0.06] px-[0.3rem] text-[0.72rem] text-white/60">esc</kbd>
          clear
        </span>
      </div>
    </div>
  );
}
