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
import './Dropdown.css';

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

const join = (...classes: Array<string | false | null | undefined>): string =>
  classes.filter(Boolean).join(' ');

const findFirstEnabled = (options: DropdownOption[]): number =>
  options.findIndex(o => !o.disabled);

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
    '--ui-dropdown-surface': surfaceColor
  } as CSSProperties;

  return (
    <div
      className={join(
        'ui-dropdown',
        open && 'ui-dropdown--open',
        disabled && 'ui-dropdown--disabled',
        className
      )}
      style={rootStyle}
    >
      <button
        ref={triggerRef}
        id={buttonId}
        type="button"
        className="ui-dropdown__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-activedescendant={open && activeIndex >= 0 ? `${listboxId}-${activeIndex}` : undefined}
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        onKeyDown={handleKeyDown}
      >
        <span
          className={join('ui-dropdown__value', !selectedOption && 'ui-dropdown__value--placeholder')}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown size={16} strokeWidth={2} className="ui-dropdown__chevron" aria-hidden="true" />
      </button>

      {open && (
        <div
          ref={panelRef}
          id={listboxId}
          role="listbox"
          aria-labelledby={buttonId}
          className="ui-dropdown__panel"
        >
          {options.map((opt, i) => {
            const isSelected = opt.value === value;
            const isActive = i === activeIndex;
            return (
              <div
                key={opt.value}
                id={`${listboxId}-${i}`}
                data-ui-dropdown-index={i}
                role="option"
                aria-selected={isSelected}
                aria-disabled={opt.disabled || undefined}
                className={join(
                  'ui-dropdown__option',
                  isActive && 'ui-dropdown__option--active',
                  isSelected && 'ui-dropdown__option--selected',
                  opt.disabled && 'ui-dropdown__option--disabled'
                )}
                onMouseEnter={() => !opt.disabled && setActiveIndex(i)}
                onMouseDown={(e: ReactMouseEvent) => e.preventDefault()}
                onClick={() => !opt.disabled && commitValue(opt.value)}
              >
                <div className="ui-dropdown__option-text">
                  <span className="ui-dropdown__option-label">{opt.label}</span>
                  {opt.description && (
                    <span className="ui-dropdown__option-desc">{opt.description}</span>
                  )}
                </div>
                <Check
                  size={14}
                  strokeWidth={2.25}
                  className="ui-dropdown__option-check"
                  aria-hidden="true"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
