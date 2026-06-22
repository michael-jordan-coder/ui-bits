import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';
import './ColorPicker.css';

const join = (...classes) => classes.filter(Boolean).join(' ');

// Saturation and lightness are pinned so hue alone produces vivid, evenly bright
// colors — the strip is a pure hue scan rather than a full hsl plane.
const FIXED_SATURATION = 65;
const FIXED_LIGHTNESS = 60;
const HUE_MAX = 360;

const hslToHex = (h, s, l) => {
  const sFrac = s / 100;
  const lFrac = l / 100;
  const chroma = (1 - Math.abs(2 * lFrac - 1)) * sFrac;
  const hPrime = h / 60;
  const x = chroma * (1 - Math.abs((hPrime % 2) - 1));
  let r = 0;
  let g = 0;
  let b = 0;
  if (hPrime >= 0 && hPrime < 1) [r, g, b] = [chroma, x, 0];
  else if (hPrime < 2) [r, g, b] = [x, chroma, 0];
  else if (hPrime < 3) [r, g, b] = [0, chroma, x];
  else if (hPrime < 4) [r, g, b] = [0, x, chroma];
  else if (hPrime < 5) [r, g, b] = [x, 0, chroma];
  else [r, g, b] = [chroma, 0, x];
  const m = lFrac - chroma / 2;
  const toHex = channel =>
    Math.round((channel + m) * 255)
      .toString(16)
      .padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

const hexToHue = hex => {
  const stripped = hex.replace('#', '');
  const r = parseInt(stripped.slice(0, 2), 16) / 255;
  const g = parseInt(stripped.slice(2, 4), 16) / 255;
  const b = parseInt(stripped.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  if (delta === 0) return 0;
  let hue;
  if (max === r) hue = ((g - b) / delta) % 6;
  else if (max === g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;
  hue = Math.round(hue * 60);
  return hue < 0 ? hue + HUE_MAX : hue;
};

// A horizontal hue strip with a draggable thumb selects the hue; a row of preset
// swatches offers quick picks; a preview chip echoes the current color and its
// lowercase hex. Saturation and lightness stay fixed (see constants) so dragging
// the hue alone yields consistently vivid colors. Arrow keys nudge the hue and
// the strip is a real slider for assistive tech.
export default function ColorPicker({
  value = '#3ecf8e',
  swatches = ['#3ecf8e', '#7aa2ff', '#f59e0b', '#f43f5e', '#a78bfa', '#22c55e'],
  onChange,
  className = '',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const trackRef = useRef(null);
  const draggingRef = useRef(false);
  const [hue, setHue] = useState(() => hexToHue(value));
  const [selected, setSelected] = useState(value);
  const [trackWidth, setTrackWidth] = useState(0);

  // Re-seed from a controlled value change unless the user is mid-drag.
  useEffect(() => {
    if (draggingRef.current) return;
    setHue(hexToHue(value));
    setSelected(value);
  }, [value]);

  // Measure the track so the thumb can ride along the x axis in pixels — we
  // animate transform, never the layout-triggering `left`.
  useEffect(() => {
    const node = trackRef.current;
    if (!node) return undefined;
    const measure = () => setTrackWidth(node.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const commitHue = nextHue => {
    const clamped = Math.min(HUE_MAX, Math.max(0, nextHue));
    const hex = hslToHex(clamped, FIXED_SATURATION, FIXED_LIGHTNESS);
    setHue(clamped);
    setSelected(hex);
    onChange?.(hex);
  };

  const hueFromClientX = clientX => {
    const node = trackRef.current;
    if (!node) return hue;
    const rect = node.getBoundingClientRect();
    const ratio = (clientX - rect.left) / rect.width;
    return Math.round(Math.min(1, Math.max(0, ratio)) * HUE_MAX);
  };

  const handlePointerDown = event => {
    draggingRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    commitHue(hueFromClientX(event.clientX));
  };

  const handlePointerMove = event => {
    if (!draggingRef.current) return;
    commitHue(hueFromClientX(event.clientX));
  };

  const handlePointerUp = event => {
    draggingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const handleKeyDown = event => {
    const step = event.shiftKey ? 10 : 1;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      commitHue(hue + step);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      commitHue(hue - step);
    } else if (event.key === 'Home') {
      event.preventDefault();
      commitHue(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      commitHue(HUE_MAX);
    }
  };

  const selectSwatch = hex => {
    setHue(hexToHue(hex));
    setSelected(hex);
    onChange?.(hex);
  };

  const thumbTransition = prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 700, damping: 40 };
  const ringTransition = prefersReduced ? { duration: 0 } : { duration: 0.15, ease: 'easeOut' };

  return (
    <div className={join('color-picker', className)} {...rest}>
      <div className="color-picker__preview">
        <span className="color-picker__chip" style={{ backgroundColor: selected }} aria-hidden="true" />
        <span className="color-picker__hex">{selected}</span>
      </div>

      <div
        ref={trackRef}
        className="color-picker__track"
        role="slider"
        tabIndex={0}
        aria-label="hue"
        aria-valuemin={0}
        aria-valuemax={HUE_MAX}
        aria-valuenow={hue}
        aria-valuetext={`${hue} degrees`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
      >
        <motion.span
          className="color-picker__thumb"
          style={{ backgroundColor: selected }}
          animate={{ x: (hue / HUE_MAX) * trackWidth }}
          transition={thumbTransition}
        />
      </div>

      <div className="color-picker__swatches" role="group" aria-label="preset colors">
        {swatches.map(swatch => {
          const isSelected = swatch.toLowerCase() === selected.toLowerCase();
          return (
            <button
              key={swatch}
              type="button"
              className="color-picker__swatch"
              style={{ backgroundColor: swatch }}
              aria-label={swatch}
              aria-pressed={isSelected}
              onClick={() => selectSwatch(swatch)}
            >
              {isSelected && (
                <motion.span
                  className="color-picker__ring"
                  initial={prefersReduced ? false : { scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={ringTransition}
                >
                  <Check className="color-picker__check" strokeWidth={3} aria-hidden="true" />
                </motion.span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
