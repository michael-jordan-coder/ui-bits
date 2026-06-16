import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';

export interface TagInputProps {
  defaultTags?: string[];
  placeholder?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  accentColor?: string;
  surfaceColor?: string;
  onChange?: (tags: string[]) => void;
  className?: string;
}

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

// Convert a hex accent into a translucent rgba string so chips share a single
// tinted family regardless of the accent the consumer passes in.
const tint = (hex: string, alpha: number): string => {
  const value = hex.replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map(c => c + c)
          .join('')
      : value;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// A chip / tag input. Commit a tag with Enter or comma, remove with a chip's ×
// button or Backspace on an empty field. New chips spring in and removed chips
// animate out via AnimatePresence.
export default function TagInput({
  defaultTags = ['design', 'react', 'motion'],
  placeholder = 'Add a tag…',
  maxTags = 8,
  allowDuplicates = false,
  accentColor = '#6366f1',
  surfaceColor = '#1c1c22',
  onChange,
  className = ''
}: TagInputProps) {
  const prefersReduced = useReducedMotion();
  const [tags, setTags] = useState<string[]>(() => defaultTags.slice(0, maxTags));
  const [draft, setDraft] = useState('');
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const labelId = useId();

  const isFull = tags.length >= maxTags;

  const commit = (raw: string) => {
    const tag = raw.trim();
    if (!tag) return;
    if (tags.length >= maxTags) return;
    if (!allowDuplicates && tags.includes(tag)) return;
    const next = [...tags, tag];
    setTags(next);
    setDraft('');
    onChange?.(next);
  };

  const removeAt = (index: number) => {
    const next = tags.filter((_, i) => i !== index);
    setTags(next);
    onChange?.(next);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      commit(draft);
    } else if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
      event.preventDefault();
      removeAt(tags.length - 1);
    }
  };

  const spring = prefersReduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 600, damping: 32 };

  return (
    <div className={join('flex w-[360px] max-w-full flex-col gap-[0.4rem] text-white', className)}>
      <span id={labelId} className="text-[0.8rem] font-semibold tracking-[0.02em] text-white/70">
        Tags
      </span>
      <div
        className={join(
          'flex min-h-[48px] cursor-text items-center rounded-xl border px-2 py-[0.35rem] transition-[border-color,box-shadow] duration-150',
          focused ? 'border-current' : 'border-white/10',
          isFull && 'cursor-default'
        )}
        style={{
          background: surfaceColor,
          color: focused ? accentColor : undefined,
          boxShadow: focused ? `0 0 0 3px ${tint(accentColor, 0.28)}` : undefined
        }}
        onClick={() => inputRef.current?.focus()}
        role="presentation"
      >
        <ul className="m-0 flex w-full flex-wrap items-center gap-[0.4rem] p-0" aria-labelledby={labelId}>
          <AnimatePresence initial={false}>
            {tags.map((tag, index) => (
              <motion.li
                key={`${tag}-${index}`}
                layout={!prefersReduced}
                className="inline-flex h-7 items-center gap-[0.3rem] whitespace-nowrap rounded-[9999px] border py-0 pl-[0.6rem] pr-[0.35rem] text-[0.82rem] font-medium text-white"
                style={{ background: tint(accentColor, 0.16), borderColor: tint(accentColor, 0.4) }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={spring}
              >
                <span className="leading-none">{tag}</span>
                <button
                  type="button"
                  className="inline-flex h-[18px] w-[18px] flex-none cursor-pointer items-center justify-center rounded-[9999px] border-none bg-white/[0.12] p-0 text-inherit transition-colors duration-150 hover:bg-white/[0.28]"
                  aria-label={`Remove ${tag}`}
                  onClick={event => {
                    event.stopPropagation();
                    removeAt(index);
                  }}
                >
                  <X size={13} strokeWidth={2.6} aria-hidden="true" />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>

          {!isFull && (
            <li className="flex min-w-[80px] flex-[1_1_80px]">
              <input
                ref={inputRef}
                type="text"
                className="h-7 w-full min-w-0 border-none bg-transparent px-1 py-0 font-[inherit] text-[0.88rem] text-white outline-none placeholder:text-white/40"
                value={draft}
                placeholder={tags.length === 0 ? placeholder : ''}
                aria-label={placeholder}
                onChange={event => setDraft(event.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
              />
            </li>
          )}
        </ul>
      </div>
      <span className="text-[0.72rem] tracking-[0.02em] tabular-nums text-white/45" aria-live="polite">
        {isFull ? 'Max tags reached' : `${tags.length} / ${maxTags}`}
      </span>
    </div>
  );
}
