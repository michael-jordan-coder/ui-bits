import { useCallback, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ImageCompare.css';

const join = (...classes) => classes.filter(Boolean).join(' ');

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const DEFAULT_BEFORE = 'linear-gradient(135deg, #1e293b 0%, #334155 55%, #475569 100%)';
const DEFAULT_AFTER = 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)';

// A before/after comparison slider. Two layered panels fill a fixed-aspect frame;
// the top ("before") panel is clipped to the left of a draggable vertical divider,
// so dragging reveals more or less of the bottom ("after") panel. The divider
// handle is a real slider: focus it and use arrow keys (or Home/End) to move the
// split. Dragging is direct manipulation, so it stays live regardless of
// reduced-motion; only the handle's hover affordance is a decorative transition.
export default function ImageCompare({
  value = 50,
  beforeLabel = 'before',
  afterLabel = 'after',
  before,
  after,
  accent = '#ffffff',
  className = '',
  ...rest
}) {
  const frameRef = useRef(null);
  const draggingRef = useRef(false);
  const [split, setSplit] = useState(() => clamp(value, 0, 100));

  const moveTo = useCallback(clientX => {
    const node = frameRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    if (rect.width === 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setSplit(clamp(next, 0, 100));
  }, []);

  const handlePointerDown = event => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    moveTo(event.clientX);
  };

  const handlePointerMove = event => {
    if (!draggingRef.current) return;
    moveTo(event.clientX);
  };

  const endDrag = event => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const handleKeyDown = event => {
    let next = null;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') next = split - 2;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') next = split + 2;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 100;
    if (next === null) return;
    event.preventDefault();
    setSplit(clamp(next, 0, 100));
  };

  const beforeStyle = before ? undefined : { backgroundImage: DEFAULT_BEFORE };
  const afterStyle = after ? undefined : { backgroundImage: DEFAULT_AFTER };

  return (
    <div
      ref={frameRef}
      className={join('image-compare', className)}
      style={{ '--image-compare-accent': accent, '--image-compare-split': `${split}%` }}
      {...rest}
    >
      <div className="image-compare__panel image-compare__panel--after" style={afterStyle}>
        {after ? <img src={after} alt={afterLabel} className="image-compare__img" /> : null}
        <span className="image-compare__label image-compare__label--after">{afterLabel}</span>
      </div>

      <div className="image-compare__panel image-compare__panel--before" style={beforeStyle}>
        {before ? <img src={before} alt={beforeLabel} className="image-compare__img" /> : null}
        <span className="image-compare__label image-compare__label--before">{beforeLabel}</span>
      </div>

      <div
        className="image-compare__divider"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        <button
          type="button"
          className="image-compare__handle"
          role="slider"
          aria-label="comparison position"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(split)}
          onKeyDown={handleKeyDown}
        >
          <ChevronLeft className="image-compare__chevron" aria-hidden="true" />
          <ChevronRight className="image-compare__chevron" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
