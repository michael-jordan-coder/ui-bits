import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import './FlowField.css';

const TAU = Math.PI * 2;

const hexToRgb = hex => {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const int = parseInt(full, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

// An ambient flow field: hundreds of particles drift along a smooth, slowly
// evolving vector field and leave fading trails, so the canvas reads as a field
// of flowing filaments. The field angle at each point comes from layered sines
// (a cheap, dependency-free noise) that breathe over time. Each frame paints a
// translucent veil of the surface color instead of clearing, which is what
// produces the trails. Honors prefers-reduced-motion by painting one static
// frame of short streaks.
export default function FlowField({
  count = 700,
  color = '#7aa2ff',
  surfaceColor = '#06070d',
  speed = 1,
  scale = 1,
  trail = 0.92,
  lineWidth = 1.1,
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
    const [sr, sg, sb] = hexToRgb(surfaceColor);
    const fade = Math.max(0.02, 1 - Math.min(0.99, trail));
    let particles = [];
    let width = 0;
    let height = 0;
    let rafId = 0;
    let t = 0;

    const freq = 0.0016 * scale;
    const angleAt = (x, y) =>
      (Math.sin(x * freq + t) +
        Math.cos(y * freq * 1.3 - t * 0.6) +
        Math.sin((x + y) * freq * 0.7 + t * 0.4)) *
      0.9 *
      TAU;

    const spawn = p => {
      p.x = Math.random() * width;
      p.y = Math.random() * height;
      p.life = 80 + Math.random() * 160;
    };

    const buildParticles = () => {
      particles = [];
      for (let i = 0; i < count; i++) {
        const p = { x: 0, y: 0, life: 0 };
        spawn(p);
        p.life = Math.random() * 240;
        particles.push(p);
      }
    };

    const veil = () => {
      ctx.fillStyle = `rgba(${sr}, ${sg}, ${sb}, ${fade})`;
      ctx.fillRect(0, 0, width, height);
    };

    const advance = step => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const a = angleAt(p.x, p.y);
        const nx = p.x + Math.cos(a) * speed * step;
        const ny = p.y + Math.sin(a) * speed * step;
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
        p.x = nx;
        p.y = ny;
        p.life -= 1;
        if (p.life <= 0 || p.x < 0 || p.x > width || p.y < 0 || p.y > height) spawn(p);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const paintStatic = () => {
      ctx.fillStyle = surfaceColor;
      ctx.fillRect(0, 0, width, height);
      for (let s = 0; s < 14; s++) advance(2.2);
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
      buildParticles();
      ctx.fillStyle = surfaceColor;
      ctx.fillRect(0, 0, width, height);
      if (reduce) paintStatic();
    };

    const step = () => {
      t += 0.0009;
      veil();
      advance(3);
      rafId = requestAnimationFrame(step);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    if (!reduce) rafId = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [count, color, surfaceColor, speed, scale, trail, lineWidth, reduceMotion]);

  return (
    <div ref={wrapRef} className={`flow-field ${className}`.trim()} {...rest}>
      <canvas ref={canvasRef} className="flow-field-canvas" />
      {children != null && <div className="flow-field-content">{children}</div>}
    </div>
  );
}
