import {
  CSSProperties,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export interface DropdownOption {
  label: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options?: DropdownOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  accentColor?: string;
  surfaceColor?: string;
  disabled?: boolean;
  className?: string;
}

const DEFAULT_OPTIONS: DropdownOption[] = [
  { label: 'Frankfurt (eu-central-1)', value: 'fra1', description: 'Lowest latency in Europe' },
  { label: 'Washington D.C. (us-east-1)', value: 'iad1', description: 'Default for the Americas' },
  { label: 'San Francisco (us-west-1)', value: 'sfo1', description: 'Edge near the West Coast' },
  { label: 'Singapore (ap-southeast-1)', value: 'sin1', description: 'Best for Southeast Asia' },
  { label: 'Sydney (ap-southeast-2)', value: 'syd1', description: 'Australia and New Zealand', disabled: true }
];

const findFirstEnabled = (options: DropdownOption[]): number => options.findIndex(o => !o.disabled);
const findLastEnabled = (options: DropdownOption[]): number => {
  for (let i = options.length - 1; i >= 0; i--) if (!options[i].disabled) return i;
  return -1;
};

export default function Dropdown({
  options = DEFAULT_OPTIONS,
  value: valueProp,
  defaultValue,
  onChange,
  placeholder = 'Select an option',
  accentColor = '#ffffff',
  surfaceColor = '#141415',
  disabled = false,
  className = ''
}: DropdownProps) {
  const isControlled = valueProp !== undefined;
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? null);
  const value = isControlled ? valueProp : internalValue;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const reactId = useId();
  const listboxId = `${reactId}listbox`;
  const buttonId = `${reactId}button`;

  const selectedOption = useMemo(() => options.find(o => o.value === value), [options, value]);
  const selectedIndex = useMemo(() => options.findIndex(o => o.value === value), [options, value]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const primed =
      selectedIndex >= 0 && !options[selectedIndex].disabled ? selectedIndex : findFirstEnabled(options);
    setActiveIndex(primed);
  }, [open, selectedIndex, options]);

  useEffect(() => {
    if (!open || activeIndex < 0 || !panelRef.current) return;
    const el = panelRef.current.querySelector<HTMLElement>(
      `[data-ui-dropdown-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex]);

  const moveActive = useCallback(
    (step: number) => {
      if (!options.length) return;
      setActiveIndex(prev => {
        let next = prev < 0 ? (step > 0 ? -1 : options.length) : prev;
        for (let i = 0; i < options.length; i++) {
          next = (next + step + options.length) % options.length;
          if (!options[next].disabled) return next;
        }
        return prev;
      });
    },
    [options]
  );

  const commitValue = useCallback(
    (nextValue: string) => {
      if (!isControlled) setInternalValue(nextValue);
      onChange?.(nextValue);
      setOpen(false);
      requestAnimationFrame(() => triggerRef.current?.focus());
    },
    [isControlled, onChange]
  );

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        moveActive(1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        moveActive(-1);
        break;
      case 'Home':
        e.preventDefault();
        setActiveIndex(findFirstEnabled(options));
        break;
      case 'End':
        e.preventDefault();
        setActiveIndex(findLastEnabled(options));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeIndex >= 0 && !options[activeIndex].disabled) {
          commitValue(options[activeIndex].value);
        }
        break;
      case 'Tab':
        setOpen(false);
        break;
      default:
        break;
    }
  };

  const rootStyle = {
    '--ui-dropdown-accent': accentColor,
    '--ui-dropdown-surface': surfaceColor,
    '--ui-dropdown-elevated': `color-mix(in oklch, ${surfaceColor} 88%, #ffffff 6%)`,
    '--ui-dropdown-border': `color-mix(in oklch, ${accentColor} 10%, #1f1f21)`,
    '--ui-dropdown-border-strong': `color-mix(in oklch, ${accentColor} 28%, #1f1f21)`,
    '--ui-dropdown-hover': `color-mix(in oklch, #ffffff 8%, ${surfaceColor})`,
    '--ui-dropdown-selected': `color-mix(in oklch, #ffffff 14%, ${surfaceColor})`,
    '--ui-dropdown-selected-hover': `color-mix(in oklch, #ffffff 20%, ${surfaceColor})`
  } as CSSProperties;

  return (
    <div
      className={twMerge('relative inline-block min-w-[260px] font-[inherit] text-white', className)}
      style={rootStyle}
    >
      <button
        ref={triggerRef}
        id={buttonId}
        type="button"
        className={twMerge(
          'flex w-full cursor-pointer items-center justify-between gap-2.5 rounded-full border bg-[var(--ui-dropdown-surface)] px-4 py-[11px] text-left text-sm text-white font-[inherit]',
          'border-[var(--ui-dropdown-border)] transition-colors duration-150',
          'hover:border-[var(--ui-dropdown-border-strong)]',
          'focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-[1px] focus-visible:outline-[var(--ui-dropdown-accent)]',
          open && 'border-[var(--ui-dropdown-accent)] hover:border-[var(--ui-dropdown-accent)]',
          disabled && 'cursor-not-allowed opacity-55 hover:border-[var(--ui-dropdown-border)]'
        )}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={open && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        onKeyDown={handleKeyDown}
      >
        <span
          className={twMerge(
            'min-w-0 flex-1 truncate',
            !selectedOption && 'text-[#c9c6cf]'
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={2}
          aria-hidden="true"
          className={twMerge(
            'flex-none text-[#c9c6cf] transition-transform duration-150 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none',
            open && 'rotate-180 text-[var(--ui-dropdown-accent)]'
          )}
        />
      </button>

      {open && (
        <div
          ref={panelRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={buttonId}
          className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-[280px] overflow-y-auto rounded-[18px] border border-[var(--ui-dropdown-border)] bg-[var(--ui-dropdown-elevated)] p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.45)] [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.14)_transparent] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/15 [&::-webkit-scrollbar-thumb:hover]:bg-white/25 [&::-webkit-scrollbar-track]:bg-transparent"
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isActive = i === activeIndex;
            const isOptDisabled = !!opt.disabled;
            return (
              <div
                key={opt.value}
                id={`${listboxId}-${i}`}
                data-ui-dropdown-index={i}
                role="option"
                aria-selected={isSelected}
                aria-disabled={isOptDisabled || undefined}
                className={twMerge(
                  'flex cursor-pointer items-center gap-3 rounded-[10px] px-3 py-[9px] text-[#c9c6cf] transition-colors duration-100 ease-out motion-reduce:transition-none',
                  isActive && 'bg-[var(--ui-dropdown-hover)] text-white',
                  isSelected && 'bg-[var(--ui-dropdown-selected)] text-white',
                  isSelected && isActive && 'bg-[var(--ui-dropdown-selected-hover)]',
                  isOptDisabled && 'cursor-not-allowed opacity-40'
                )}
                onMouseEnter={() => !isOptDisabled && setActiveIndex(i)}
                onMouseDown={(e: ReactMouseEvent) => e.preventDefault()}
                onClick={() => !isOptDisabled && commitValue(opt.value)}
              >
                <div className="flex min-w-0 flex-1 flex-col gap-[2px]">
                  <span className="truncate text-[13.5px] font-medium">{opt.label}</span>
                  {opt.description && (
                    <span className="truncate text-xs text-[#8b8995]">{opt.description}</span>
                  )}
                </div>
                <Check
                  size={14}
                  strokeWidth={2.25}
                  aria-hidden="true"
                  className={twMerge(
                    'flex-none text-[var(--ui-dropdown-accent)] opacity-0 transition-opacity duration-100 ease-out motion-reduce:transition-none',
                    isSelected && 'opacity-100'
                  )}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
