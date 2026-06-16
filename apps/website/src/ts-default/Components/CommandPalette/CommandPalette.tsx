import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  Search,
  CornerDownLeft,
  FilePlus,
  FolderPlus,
  LayoutDashboard,
  Settings,
  CreditCard,
  SunMoon,
  LogOut,
  type LucideIcon
} from 'lucide-react';
import './CommandPalette.css';

export interface CommandItem {
  id: string;
  label: string;
  group?: string;
  shortcut?: string;
  icon?: LucideIcon;
}

export interface CommandPaletteProps {
  commands?: CommandItem[];
  placeholder?: string;
  accentColor?: string;
  surfaceColor?: string;
  emptyMessage?: string;
  showShortcuts?: boolean;
  width?: number;
  onSelect?: (id: string) => void;
  className?: string;
}

interface MatchedCommand extends CommandItem {
  matchIndex: number;
}

interface IndexedCommand extends MatchedCommand {
  index: number;
}

interface CommandGroup {
  group: string;
  items: IndexedCommand[];
}

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

const DEFAULT_COMMANDS: CommandItem[] = [
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
const buildGroups = (matches: MatchedCommand[]): { groups: CommandGroup[]; flat: IndexedCommand[] } => {
  const order: string[] = [];
  const map = new Map<string, MatchedCommand[]>();
  matches.forEach(command => {
    const key = command.group ?? '';
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(command);
  });
  const flat: IndexedCommand[] = [];
  const groups = order.map(key => ({
    group: key,
    items: (map.get(key) ?? []).map(command => {
      const item: IndexedCommand = { ...command, index: flat.length };
      flat.push(item);
      return item;
    })
  }));
  return { groups, flat };
};

const renderLabel = (label: string, matchIndex: number, queryLength: number, accentColor: string) => {
  if (matchIndex < 0 || queryLength === 0) return label;
  return (
    <>
      {label.slice(0, matchIndex)}
      <mark className="command-palette-mark" style={{ color: accentColor }}>
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
  className = ''
}: CommandPaletteProps) {
  const prefersReduced = useReducedMotion();
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRef = useRef<HTMLButtonElement>(null);

  const trimmed = query.trim().toLowerCase();

  const { groups, flat } = useMemo(() => {
    const matches: MatchedCommand[] = commands
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

  const select = (id: string) => onSelect?.(id);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
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

  const highlightTransition = prefersReduced
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 600, damping: 42 };
  const active = flat[activeIndex];

  return (
    <div className={join('command-palette-root', className)} style={{ width, background: surfaceColor }}>
      <div className="command-palette-search">
        <Search className="command-palette-search-icon" size={18} strokeWidth={2} aria-hidden="true" />
        <input
          className="command-palette-input"
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

      <div className="command-palette-list" id="command-palette-list" role="listbox" aria-label="Commands">
        {flat.length === 0 ? (
          <div className="command-palette-empty">{emptyMessage}</div>
        ) : (
          groups.map(group => (
            <div className="command-palette-group" key={group.group} role="presentation">
              {group.group && <div className="command-palette-group-label">{group.group}</div>}
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
                    className="command-palette-item"
                    onMouseMove={() => setActiveIndex(item.index)}
                    onClick={() => select(item.id)}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="command-palette-active"
                        className="command-palette-active"
                        style={{ background: accentColor, opacity: 0.16 }}
                        transition={highlightTransition}
                      />
                    )}
                    {Icon && <Icon className="command-palette-item-icon" size={17} strokeWidth={2} aria-hidden="true" />}
                    <span className="command-palette-item-label">
                      {renderLabel(item.label, item.matchIndex, trimmed.length, accentColor)}
                    </span>
                    {showShortcuts && item.shortcut && <kbd className="command-palette-item-shortcut">{item.shortcut}</kbd>}
                    {isActive && (
                      <CornerDownLeft className="command-palette-item-enter" size={14} strokeWidth={2} aria-hidden="true" />
                    )}
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>

      <div className="command-palette-footer">
        <span className="command-palette-hint">
          <kbd>↑</kbd>
          <kbd>↓</kbd>
          navigate
        </span>
        <span className="command-palette-hint">
          <kbd>↵</kbd>
          select
        </span>
        <span className="command-palette-hint">
          <kbd>esc</kbd>
          clear
        </span>
      </div>
    </div>
  );
}
