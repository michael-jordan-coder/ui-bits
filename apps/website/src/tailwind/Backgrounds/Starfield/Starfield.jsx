import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

// Canvas drawing is identical to the CSS variant; only the wrapper uses Tailwind
// utility classes. Projected stars fly toward the viewer, streaking and
// resetting at the far plane. Honors prefers-reduced-motion with a still scatter.
export default function Starfield({
  count = 220,
  color = '#ffffff',
  surfaceColor = '#08080c',
  speed = 1,
  streak = true,
  maxSize = 2.4,
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
    let stars = [];
    let width = 0;
    let height = 0;
    let rafId = 0;
    let last = 0;

    const rand = (min, max) => min + Math.random() * (max - min);

    const buildStars = () => {
      stars = [];
      for (let i = 0; i < Math.max(1, count); i++) {
        stars.push({ x: rand(-1, 1), y: rand(-1, 1), z: rand(0.05, 1) });
      }
    };

    const project = (s, z, cx, cy) => ({ x: cx + (s.x / z) * cx, y: cy + (s.y / z) * cy });

    const paint = step => {
      const cx = width / 2;
      const cy = height / 2;
      ctx.fillStyle = surfaceColor;
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const cur = project(s, s.z, cx, cy);
        const depth = 1 - s.z;
        const size = depth * maxSize + 0.3;
        ctx.globalAlpha = Math.max(0, Math.min(1, 0.2 + depth * 0.9));
        if (streak && step > 0) {
          const prev = project(s, Math.min(1, s.z + step), cx, cy);
          ctx.lineWidth = size;
          ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(cur.x, cur.y);
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(cur.x, cur.y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
      if (reduce) paint(0);
    };

    const frame = now => {
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const step = 0.35 * speed * dt;
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.z -= step;
        if (s.z <= 0.02) {
          s.x = rand(-1, 1);
          s.y = rand(-1, 1);
          s.z = 1;
        }
      }
      paint(step);
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
  }, [count, color, surfaceColor, speed, streak, maxSize, reduceMotion]);

  return (
    <div
      ref={wrapRef}
      className={`relative h-full min-h-[200px] w-full overflow-hidden bg-[#08080c] ${className}`.trim()}
      {...rest}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      {children != null && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">{children}</div>
      )}
    </div>
  );
}
