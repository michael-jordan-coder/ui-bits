import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

export interface AccordionItem {
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps {
  items?: AccordionItem[];
  singleOpen?: boolean;
  defaultOpen?: number | null;
  accentColor?: string;
  className?: string;
}

// An animated disclosure list: each panel collapses its height to zero and the
// chevron rotates as it closes. `singleOpen` keeps just one panel open at a time;
// Arrow/Home/End move focus between headers. Inspired by the WAI-ARIA accordion
// pattern as refined by libraries like Radix UI.
export default function Accordion({
  items = [],
  singleOpen = true,
  defaultOpen = 0,
  accentColor = '#6366f1',
  className = '',
  ...rest
}: AccordionProps) {
  const prefersReduced = useReducedMotion();
  const uid = useId();
  const headersRef = useRef<(HTMLButtonElement | null)[]>([]);
  const [openSet, setOpenSet] = useState<Set<number>>(
    () => new Set(defaultOpen != null && defaultOpen >= 0 ? [defaultOpen] : [])
  );

  const toggle = (index: number) => {
    setOpenSet(prev => {
      const next = new Set(singleOpen ? [] : prev);
      if (prev.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1;
    let target: number;
    switch (event.key) {
      case 'ArrowDown':
        target = index === last ? 0 : index + 1;
        break;
      case 'ArrowUp':
        target = index === 0 ? last : index - 1;
        break;
      case 'Home':
        target = 0;
        break;
      case 'End':
        target = last;
        break;
      default:
        return;
    }
    event.preventDefault();
    headersRef.current[target]?.focus();
  };

  return (
    <div
      className={join(
        'flex w-[min(440px,100%)] flex-col overflow-hidden rounded-[14px] border border-white/[0.12] bg-white/[0.03]',
        className
      )}
      {...rest}
    >
      {items.map((item, index) => {
        const open = openSet.has(index);
        const headerId = `${uid}-header-${index}`;
        const panelId = `${uid}-panel-${index}`;
        return (
          <div className="border-b border-white/10 last:border-b-0" key={index}>
            <h3 className="m-0 text-[length:inherit] font-[inherit]">
              <button
                ref={el => (headersRef.current[index] = el)}
                id={headerId}
                type="button"
                className="flex w-full cursor-pointer items-center justify-between gap-4 border-none bg-transparent px-5 py-[1.05rem] text-left text-[0.95rem] font-semibold text-[#fafafa] outline-none transition-[background] duration-200 [-webkit-tap-highlight-color:transparent] hover:bg-white/[0.04] focus-visible:shadow-[inset_0_0_0_2px_rgba(255,255,255,0.4)]"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                onKeyDown={event => handleKeyDown(event, index)}
              >
                <span className="transition-colors duration-200" style={open ? { color: accentColor } : undefined}>
                  {item.title}
                </span>
                <motion.span
                  className="inline-flex flex-shrink-0 leading-[0] text-[#a6a6a6]"
                  style={open ? { color: accentColor } : undefined}
                  animate={{ rotate: open ? 180 : 0 }}
                  transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 26 }}
                  aria-hidden="true"
                >
                  <ChevronDown size={18} strokeWidth={2.4} />
                </motion.span>
              </button>
            </h3>
            <motion.div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              initial={false}
              animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
              transition={prefersReduced ? { duration: 0 } : { duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="px-5 pb-[1.15rem] text-[0.9rem] leading-[1.6] text-[#b5b5b5]" aria-hidden={!open}>
                {item.content}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
