import { useId, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import './TagInput.css';

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

  const fieldStyle = { background: surfaceColor, '--tag-input-accent': accentColor } as CSSProperties;

  return (
    <div className={join('tag-input', className)}>
      <span id={labelId} className="tag-input-label">
        Tags
      </span>
      <div
        className={join('tag-input-field', focused && 'tag-input-field--focused', isFull && 'tag-input-field--full')}
        style={fieldStyle}
        onClick={() => inputRef.current?.focus()}
        role="presentation"
      >
        <ul className="tag-input-chips" aria-labelledby={labelId}>
          <AnimatePresence initial={false}>
            {tags.map((tag, index) => (
              <motion.li
                key={`${tag}-${index}`}
                layout={!prefersReduced}
                className="tag-input-chip"
                style={{ background: tint(accentColor, 0.16), borderColor: tint(accentColor, 0.4) }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={spring}
              >
                <span className="tag-input-chip-text">{tag}</span>
                <button
                  type="button"
                  className="tag-input-chip-remove"
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
            <li className="tag-input-entry">
              <input
                ref={inputRef}
                type="text"
                className="tag-input-control"
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
      <span className="tag-input-hint" aria-live="polite">
        {isFull ? 'Max tags reached' : `${tags.length} / ${maxTags}`}
      </span>
    </div>
  );
}
