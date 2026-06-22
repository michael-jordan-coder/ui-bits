import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import './Rain.css';

const hexToRgb = hex => {
  const v = hex.replace('#', '');
  const n = v.length === 3 ? v.split('').map(c => c + c).join('') : v;
  const int = parseInt(n, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

// Three depth layers. Far drops are short, thin, faint and slow; near drops are
// long, thick, bright and fast. Each entry tunes that parallax band.
const LAYERS = [
  { lenScale: 0.5, width: 0.6, alpha: 0.18, speedScale: 0.45 },
  { lenScale: 0.8, width: 1.0, alpha: 0.4, speedScale: 0.75 },
  { lenScale: 1.2, width: 1.6, alpha: 0.7, speedScale: 1.15 }
];

// Parallax rainfall on canvas. `count` drops are spread across three depth
// layers and fall at a slight wind angle, each wrapping back to the top with a
// fresh random x once it clears the bottom. Layers render back-to-front so near
// drops sit over far ones. Single rAF loop, dpr-scaled canvas, ResizeObserver.
// Honors prefers-reduced-motion by painting one static frame instead of looping.
export default function Rain({
  count = 300,
  color = '#7aa2ff',
  surfaceColor = '#06070d',
  speed = 1,
  angle = 12,
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
    const drops = [];
    const [r, g, b] = hexToRgb(color);
    const rgb = `${r}, ${g}, ${b}`;

    let width = 0;
    let height = 0;
    let rafId = 0;
    let last = 0;

    const rand = (min, max) => min + Math.random() * (max - min);

    const buildDrops = () => {
      drops.length = 0;
      const safeCount = Math.max(0, Math.floor(count));
      for (let i = 0; i < safeCount; i++) {
        const layer = i % LAYERS.length;
        drops.push({
          x: Math.random(),
          y: Math.random(),
          len: rand(0.04, 0.08),
          speed: rand(0.55, 0.85),
          layer
        });
      }
    };

    // Wind blows along x as drops fall along y. dx/dy is constant per frame so
    // each drop's streak stays parallel to its travel direction.
    const radians = (angle * Math.PI) / 180;
    const windX = Math.tan(radians);

    const paint = dt => {
      ctx.fillStyle = surfaceColor;
      ctx.fillRect(0, 0, width, height);
      ctx.lineCap = 'round';

      for (let li = 0; li < LAYERS.length; li++) {
        const band = LAYERS[li];
        ctx.strokeStyle = `rgba(${rgb}, ${band.alpha})`;
        ctx.lineWidth = band.width;
        ctx.beginPath();
        for (let i = 0; i < drops.length; i++) {
          const drop = drops[i];
          if (drop.layer !== li) continue;
          if (dt > 0) {
            drop.y += drop.speed * band.speedScale * speed * dt;
            if (drop.y > 1.1) {
              drop.y = -0.1;
              drop.x = Math.random();
            }
          }
          const px = drop.x * width;
          const py = drop.y * height;
          const segLen = drop.len * band.lenScale * height;
          ctx.moveTo(px, py);
          ctx.lineTo(px - windX * segLen, py - segLen);
        }
        ctx.stroke();
      }
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduce) paint(0);
    };

    const frame = now => {
      if (!last) last = now;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      paint(dt);
      rafId = requestAnimationFrame(frame);
    };

    buildDrops();
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
  }, [count, color, surfaceColor, speed, angle, reduceMotion]);

  return (
    <div ref={wrapRef} className={`rain ${className}`.trim()} {...rest}>
      <canvas ref={canvasRef} className="rain-canvas" />
      {children != null && <div className="rain-content">{children}</div>}
    </div>
  );
}
