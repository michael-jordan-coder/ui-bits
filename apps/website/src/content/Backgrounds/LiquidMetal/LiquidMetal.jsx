import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import './LiquidMetal.css';

const hexToRgb = hex => {
  const v = hex.replace('#', '');
  const n = v.length === 3 ? v.split('').map(c => c + c).join('') : v;
  const int = parseInt(n, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

const GRID_STEP = 4;
const THRESHOLD = 1;

// A mercury / liquid-metal surface built from metaballs. N blobs drift and bounce
// softly off the bounds; for every cell of a downscaled grid we sum radius²/dist²
// over all blobs into a scalar field, threshold it to carve the merged metal mass,
// then shade that mass with a vertical brightness ramp plus a bright specular band
// near the field's leading edge, tinted by `color`. The small grid is rendered to
// an offscreen buffer and scaled up smoothly. Single rAF loop, dpr-scaled canvas,
// ResizeObserver. Honors prefers-reduced-motion by painting one static frame.
export default function LiquidMetal({
  count = 6,
  color = '#c8d0e0',
  surfaceColor = '#05060a',
  speed = 1,
  scale = 1,
  className = '',
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

    const buffer = document.createElement('canvas');
    const bufferCtx = buffer.getContext('2d');
    if (!bufferCtx) return undefined;

    const reduce = !!reduceMotion;
    const [cr, cg, cb] = hexToRgb(color);
    const [sr, sg, sb] = hexToRgb(surfaceColor);

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let field = new Float32Array(0);
    let image = null;
    let blobs = [];
    let rafId = 0;
    let prev = 0;

    const rand = (min, max) => min + Math.random() * (max - min);

    const buildBlobs = () => {
      blobs = [];
      for (let i = 0; i < count; i++) {
        const radius = rand(0.16, 0.26) * scale;
        const dir = rand(0, Math.PI * 2);
        const v = rand(0.04, 0.1) * speed;
        blobs.push({
          x: rand(0.25, 0.75),
          y: rand(0.25, 0.75),
          vx: Math.cos(dir) * v,
          vy: Math.sin(dir) * v,
          radius
        });
      }
    };

    const advance = dt => {
      for (let i = 0; i < blobs.length; i++) {
        const blob = blobs[i];
        blob.x += blob.vx * dt;
        blob.y += blob.vy * dt;
        if (blob.x < blob.radius) {
          blob.x = blob.radius;
          blob.vx = Math.abs(blob.vx);
        } else if (blob.x > 1 - blob.radius) {
          blob.x = 1 - blob.radius;
          blob.vx = -Math.abs(blob.vx);
        }
        if (blob.y < blob.radius) {
          blob.y = blob.radius;
          blob.vy = Math.abs(blob.vy);
        } else if (blob.y > 1 - blob.radius) {
          blob.y = 1 - blob.radius;
          blob.vy = -Math.abs(blob.vy);
        }
      }
    };

    const paint = () => {
      if (!image) return;
      const denomX = cols - 1 || 1;
      const denomY = rows - 1 || 1;
      for (let gy = 0; gy < rows; gy++) {
        const py = gy / denomY;
        for (let gx = 0; gx < cols; gx++) {
          const px = gx / denomX;
          let sum = 0;
          for (let i = 0; i < blobs.length; i++) {
            const blob = blobs[i];
            const dx = px - blob.x;
            const dy = py - blob.y;
            const d2 = dx * dx + dy * dy + 0.00012;
            sum += (blob.radius * blob.radius) / d2;
          }
          field[gy * cols + gx] = sum;
        }
      }

      const data = image.data;
      for (let gy = 0; gy < rows; gy++) {
        for (let gx = 0; gx < cols; gx++) {
          const f = field[gy * cols + gx];
          const idx = (gy * cols + gx) * 4;
          if (f < THRESHOLD) {
            data[idx] = sr;
            data[idx + 1] = sg;
            data[idx + 2] = sb;
            data[idx + 3] = 255;
            continue;
          }
          // Vertical brightness ramp: lighter at the top, darker toward the base.
          const ramp = 0.42 + (1 - gy / denomY) * 0.5;
          // Specular band near the field's leading edge (just past the threshold)
          // reads as the bright highlight of polished metal.
          const edge = Math.max(0, 1 - Math.abs(f - (THRESHOLD + 0.9)) / 0.9);
          const spec = edge * edge * 0.85;
          const shade = Math.min(1, ramp + spec);
          data[idx] = Math.min(255, cr * shade + spec * 60);
          data[idx + 1] = Math.min(255, cg * shade + spec * 60);
          data[idx + 2] = Math.min(255, cb * shade + spec * 60);
          data[idx + 3] = 255;
        }
      }

      bufferCtx.putImageData(image, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(buffer, 0, 0, cols, rows, 0, 0, canvas.width, canvas.height);
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width <= 0 || height <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.imageSmoothingEnabled = true;
      cols = Math.max(2, Math.floor(canvas.width / GRID_STEP));
      rows = Math.max(2, Math.floor(canvas.height / GRID_STEP));
      buffer.width = cols;
      buffer.height = rows;
      field = new Float32Array(cols * rows);
      image = bufferCtx.createImageData(cols, rows);
      if (reduce) paint();
    };

    const frame = now => {
      const dt = prev ? Math.min((now - prev) / 1000, 0.05) : 0;
      prev = now;
      advance(dt);
      paint();
      rafId = requestAnimationFrame(frame);
    };

    buildBlobs();
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
  }, [count, color, surfaceColor, speed, scale, reduceMotion]);

  return (
    <div ref={wrapRef} className={`liquid-metal ${className}`.trim()} {...rest}>
      <canvas ref={canvasRef} className="liquid-metal-canvas" />
    </div>
  );
}
