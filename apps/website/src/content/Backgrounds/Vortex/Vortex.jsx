import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import './Vortex.css';

const hexToRgb = hex => {
  const v = hex.replace('#', '');
  const n = v.length === 3 ? v.split('').map(c => c + c).join('') : v;
  const int = parseInt(n, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

// A swirling particle vortex. Each particle lives in polar coordinates (angle,
// radius) around the canvas center. Per frame the angle advances faster the
// closer it sits to the core (twist controls the ramp) while the radius slowly
// contracts; when it reaches the core it respawns at the outer edge at a random
// angle, producing a continuous spiral inflow like a galaxy or whirlpool. The
// surface is veiled each frame with a low-alpha surfaceColor fill instead of a
// hard clear, leaving motion trails. Single rAF loop, dpr-scaled canvas,
// ResizeObserver. Honors prefers-reduced-motion by painting one static frame.
export default function Vortex({
  count = 400,
  color = '#a78bfa',
  surfaceColor = '#06070d',
  speed = 1,
  twist = 1,
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

    const reduce = !!reduceMotion;
    const TAU = Math.PI * 2;
    const [cr, cg, cb] = hexToRgb(color);
    const rgb = `${cr}, ${cg}, ${cb}`;

    let width = 0;
    let height = 0;
    let parts = [];
    let rafId = 0;

    const rand = (min, max) => min + Math.random() * (max - min);

    const spawn = atEdge => ({
      angle: rand(0, TAU),
      // radius is normalized 0..1 against the vortex extent; spread across the
      // disk on build, pinned to the rim on respawn.
      radius: atEdge ? rand(0.92, 1) : Math.sqrt(rand(0, 1)),
      size: rand(0.6, 1.8),
      drift: rand(0.6, 1.4)
    });

    const buildParticles = () => {
      parts = [];
      for (let i = 0; i < count; i++) parts.push(spawn(false));
    };

    const step = dt => {
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        // Angular speed ramps up as radius shrinks; twist sets how steep.
        const proximity = 1 - p.radius;
        const angular = (0.6 + proximity * proximity * 2.4 * twist) * p.drift;
        p.angle += angular * dt * speed;
        p.radius -= (0.06 + proximity * 0.18) * p.drift * dt * speed;
        if (p.radius <= 0.01) Object.assign(p, spawn(true));
      }
    };

    const draw = () => {
      const cx = width / 2;
      const cy = height / 2;
      const extent = Math.min(width, height) * 0.46;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        const r = p.radius * extent;
        const x = cx + Math.cos(p.angle) * r;
        const y = cy + Math.sin(p.angle) * r;
        // Fade toward the very center so the core stays bright but soft.
        const alpha = Math.min(1, p.radius * 1.6) * 0.9;
        ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, TAU);
        ctx.fill();
      }
    };

    const veil = alpha => {
      const [sr, sg, sb] = hexToRgb(surfaceColor);
      ctx.fillStyle = `rgba(${sr}, ${sg}, ${sb}, ${alpha})`;
      ctx.fillRect(0, 0, width, height);
    };

    const paintStatic = () => {
      const [sr, sg, sb] = hexToRgb(surfaceColor);
      ctx.fillStyle = `rgb(${sr}, ${sg}, ${sb})`;
      ctx.fillRect(0, 0, width, height);
      // Trace each particle along a short stretch of its spiral so the static
      // frame still reads as an inflowing vortex.
      const cx = width / 2;
      const cy = height / 2;
      const extent = Math.min(width, height) * 0.46;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        for (let s = 0; s < 14; s++) {
          const radius = p.radius - s * 0.012;
          if (radius <= 0.01) break;
          const proximity = 1 - radius;
          const angle = p.angle - s * (0.18 + proximity * 0.4 * twist);
          const r = radius * extent;
          const x = cx + Math.cos(angle) * r;
          const y = cy + Math.sin(angle) * r;
          const alpha = Math.min(1, radius * 1.6) * 0.9 * (1 - s / 14);
          ctx.fillStyle = `rgba(${rgb}, ${alpha})`;
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, TAU);
          ctx.fill();
        }
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
      if (reduce) paintStatic();
    };

    let last = 0;
    const frame = now => {
      if (!last) last = now;
      const dt = Math.min((now - last) * 0.001, 0.05);
      last = now;
      veil(0.16);
      step(dt);
      draw();
      rafId = requestAnimationFrame(frame);
    };

    buildParticles();
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
  }, [count, color, surfaceColor, speed, twist, reduceMotion]);

  return (
    <div ref={wrapRef} className={`vortex ${className}`.trim()} {...rest}>
      <canvas ref={canvasRef} className="vortex-canvas" />
    </div>
  );
}
