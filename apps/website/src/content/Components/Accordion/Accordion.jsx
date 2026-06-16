import { useId, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import './Accordion.css';

const join = (...classes) => classes.filter(Boolean).join(' ');

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
}) {
  const prefersReduced = useReducedMotion();
  const uid = useId();
  const headersRef = useRef([]);
  const [openSet, setOpenSet] = useState(() => new Set(defaultOpen != null && defaultOpen >= 0 ? [defaultOpen] : []));

  const toggle = index => {
    setOpenSet(prev => {
      const next = new Set(singleOpen ? [] : prev);
      if (prev.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleKeyDown = (event, index) => {
    const last = items.length - 1;
    let target;
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
    <div className={join('accordion-root', className)} {...rest}>
      {items.map((item, index) => {
        const open = openSet.has(index);
        const headerId = `${uid}-header-${index}`;
        const panelId = `${uid}-panel-${index}`;
        return (
          <div className={join('accordion-item', open && 'accordion-item--open')} key={index}>
            <h3 className="accordion-heading">
              <button
                ref={el => (headersRef.current[index] = el)}
                id={headerId}
                type="button"
                className="accordion-trigger"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                onKeyDown={event => handleKeyDown(event, index)}
              >
                <span className="accordion-title" style={open ? { color: accentColor } : undefined}>
                  {item.title}
                </span>
                <motion.span
                  className="accordion-chevron"
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
              className="accordion-panel"
              initial={false}
              animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
              transition={prefersReduced ? { duration: 0 } : { duration: 0.32, ease: [0.4, 0, 0.2, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <div className="accordion-content" aria-hidden={!open}>
                {item.content}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
