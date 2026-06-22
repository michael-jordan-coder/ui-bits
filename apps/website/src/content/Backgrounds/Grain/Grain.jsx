import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import './Grain.css';

const hexToRgb = hex => {
  const v = hex.replace('#', '');
  const n = v.length === 3 ? v.split('').map(c => c + c).join('') : v;
  const int = parseInt(n, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

// A full-bleed film-grain backdrop: a tinted noise speckle is regenerated into a
// small offscreen buffer and laid over a flat surface, shimmering at a tasteful
// frame rate instead of a harsh 60fps flicker. One rAF loop with throttled noise
// regeneration, ResizeObserver, reduced-motion single static frame. Inspired by
// the film-grain / noise overlays catalogued on designspells.
export default function Grain({
  color = '#ffffff',
  surfaceColor = '#08080c',
  intensity = 0.12,
  grainSize = 1.6,
  speed = 1,
  className = '',
  children,
  ...rest
}) {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduce = !!reduceMotion;
    const noise = document.createElement('canvas');
    const nctx = noise.getContext('2d');
    if (!nctx) return undefined;

    const [tR, tG, tB] = hexToRgb(color);
    let width = 0;
    let height = 0;
    let nw = 1;
    let nh = 1;
    let image = null;
    let rafId = 0;
    let last = 0;
    let acc = 0;

    const regen = () => {
      if (!image) return;
      const data = image.data;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = tR;
        data[i + 1] = tG;
        data[i + 2] = tB;
        data[i + 3] = Math.random() * 255;
      }
      nctx.putImageData(image, 0, 0);
    };

    const compose = () => {
      ctx.globalAlpha = 1;
      ctx.fillStyle = surfaceColor;
      ctx.fillRect(0, 0, width, height);
      ctx.globalAlpha = Math.max(0, Math.min(1, intensity));
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(noise, 0, 0, nw, nh, 0, 0, width, height);
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width <= 0 || height <= 0) return;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      const size = Math.max(1, grainSize);
      nw = Math.max(2, Math.round(width / size));
      nh = Math.max(2, Math.round(height / size));
      noise.width = nw;
      noise.height = nh;
      image = nctx.createImageData(nw, nh);
      regen();
      compose();
    };

    const frame = now => {
      if (!last) last = now;
      acc += now - last;
      last = now;
      const interval = 1000 / (24 * Math.max(0.1, speed));
      if (acc >= interval) {
        acc = 0;
        regen();
      }
      compose();
      rafId = requestAnimationFrame(frame);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    if (!reduce) {
      rafId = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [color, surfaceColor, intensity, grainSize, speed, reduceMotion]);

  return (
    <div ref={wrapRef} className={`grain ${className}`.trim()} {...rest}>
      <canvas ref={canvasRef} className="grain-canvas" />
      {children != null && <div className="grain-content">{children}</div>}
    </div>
  );
}
