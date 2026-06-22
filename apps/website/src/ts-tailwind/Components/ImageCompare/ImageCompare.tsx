import {
  useCallback,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent
} from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const DEFAULT_BEFORE = 'linear-gradient(135deg, #1e293b 0%, #334155 55%, #475569 100%)';
const DEFAULT_AFTER = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)';

// A before/after comparison slider. Two layered panels fill a fixed-aspect frame;
// the top ("before") panel is clipped to the left of a draggable vertical divider,
// so dragging reveals more or less of the bottom ("after") panel. The divider
// handle is a real slider: focus it and use arrow keys (or Home/End) to move the
// split. Dragging is direct manipulation, so it stays live regardless of
// reduced-motion; only the handle's hover affordance is a decorative transition.
export interface ImageCompareProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  beforeLabel?: string;
  afterLabel?: string;
  before?: string;
  after?: string;
  accent?: string;
  className?: string;
}

export default function ImageCompare({
  value = 50,
  beforeLabel = 'before',
  afterLabel = 'after',
  before,
  after,
  accent = '#ffffff',
  className = '',
  ...rest
}: ImageCompareProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const [split, setSplit] = useState(() => clamp(value, 0, 100));

  const moveTo = useCallback((clientX: number) => {
    const node = frameRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    if (rect.width === 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setSplit(clamp(next, 0, 100));
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    moveTo(event.clientX);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    moveTo(event.clientX);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let next: number | null = null;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = split - 2;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = split + 2;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 100;
    if (next === null) return;
    event.preventDefault();
    setSplit(clamp(next, 0, 100));
  };

  const beforeStyle = {
    clipPath: `inset(0 ${100 - split}% 0 0)`,
    ...(before ? null : { backgroundImage: DEFAULT_BEFORE })
  };
  const afterStyle = after ? undefined : { backgroundImage: DEFAULT_AFTER };

  const labelClass =
    'pointer-events-none absolute bottom-3 rounded-lg bg-slate-900/55 px-2.5 py-1 text-xs font-medium tracking-[-0.01em] text-slate-50 backdrop-blur-md';

  return (
    <div
      ref={frameRef}
      className={join(
        'relative aspect-[4/3] w-full max-w-[32rem] touch-none select-none overflow-hidden rounded-2xl bg-slate-900',
        className
      )}
      {...rest}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={afterStyle}
      >
        {after ? <img src={after} alt={afterLabel} className="block h-full w-full object-cover" /> : null}
        <span className={join(labelClass, 'right-3')}>{afterLabel}</span>
      </div>

      <div className="absolute inset-0 bg-cover bg-center" style={beforeStyle}>
        {before ? <img src={before} alt={beforeLabel} className="block h-full w-full object-cover" /> : null}
        <span className={join(labelClass, 'left-3')}>{beforeLabel}</span>
      </div>

      <div
        className="absolute top-0 bottom-0 w-0.5 -translate-x-px cursor-ew-resize touch-none"
        style={{ left: `${split}%`, background: accent }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <button
          type="button"
          className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-slate-900/55 p-0 backdrop-blur-md transition-transform duration-[120ms] ease-out outline-none motion-safe:hover:scale-[1.08] focus-visible:[box-shadow:0_0_0_3px_rgba(248,250,252,0.55)]"
          style={{ borderColor: accent, color: accent }}
          role="slider"
          aria-label="comparison position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(split)}
          onKeyDown={handleKeyDown}
        >
          <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
