import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';

export default function Particles({
  count = 80,
  color = '#ffffff',
  surfaceColor = '#08080c',
  speed = 0.4,
  minSize = 1,
  maxSize = 3,
  connect = false,
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
    let particles = [];
    let width = 0;
    let height = 0;
    let rafId = 0;

    const rand = (min, max) => min + Math.random() * (max - min);

    const buildParticles = () => {
      const lo = Math.min(minSize, maxSize);
      const hi = Math.max(minSize, maxSize);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: rand(lo, hi),
          vx: rand(-0.5, 0.5),
          vy: rand(-0.5, 0.5),
          phase: Math.random() * Math.PI * 2,
          twinkle: rand(0.4, 1.2),
          baseAlpha: rand(0.35, 0.9)
        });
      }
    };

    const drawParticle = p => {
      const alpha = reduce ? p.baseAlpha : p.baseAlpha * (0.55 + 0.45 * Math.sin(p.phase));
      ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    };

    const drawConnections = () => {
      const linkDist = 120;
      const linkDist2 = linkDist * linkDist;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < linkDist2) {
            ctx.globalAlpha = (1 - dist2 / linkDist2) * 0.18;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
    };

    const paint = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = surfaceColor;
      ctx.fillRect(0, 0, width, height);
      if (connect) drawConnections();
      for (let i = 0; i < particles.length; i++) {
        drawParticle(particles[i]);
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
      buildParticles();
      if (reduce) paint();
    };

    const step = () => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx * speed;
        p.y += p.vy * speed;
        p.phase += 0.02 * p.twinkle;
        if (p.x < -p.r) p.x = width + p.r;
        else if (p.x > width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = height + p.r;
        else if (p.y > height + p.r) p.y = -p.r;
      }
      paint();
      rafId = requestAnimationFrame(step);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    if (!reduce) {
      rafId = requestAnimationFrame(step);
    }

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [count, color, surfaceColor, speed, minSize, maxSize, connect, reduceMotion]);

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
