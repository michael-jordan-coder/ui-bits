import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import './Grid.css';

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  cellSize?: number;
  color?: string;
  surfaceColor?: string;
  glowColor?: string;
  speed?: number;
  lineWidth?: number;
  className?: string;
  children?: ReactNode;
}

// A full-bleed ambient line grid: thin vertical and horizontal rules drift
// slowly and wrap seamlessly, while a soft radial bloom travels a Lissajous
// path and lights the grid beneath it. Rendered to one canvas with a single
// rAF loop. Honors prefers-reduced-motion by painting one centered static
// frame. Inspired by the quiet grid backdrops catalogued on designspells.
export default function Grid({
  cellSize = 48,
  color = '#5227FF',
  surfaceColor = '#08080c',
  glowColor = '#7C8CFF',
  speed = 1,
  lineWidth = 1,
  className = '',
  children,
  ...rest
}: GridProps) {
  const reduceMotion = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduce = !!reduceMotion;
    let width = 0;
    let height = 0;
    let rafId = 0;
    let start = 0;

    const drawGrid = (drift: number) => {
      const size = Math.max(8, cellSize);
      const ox = ((drift * 0.6) % size + size) % size;
      const oy = ((drift * 0.4) % size + size) % size;
      ctx.strokeStyle = color;
      ctx.globalAlpha = 0.16;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      for (let x = -size + ox; x <= width; x += size) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, height);
      }
      for (let y = -size + oy; y <= height; y += size) {
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(width, Math.round(y) + 0.5);
      }
      ctx.stroke();
      ctx.globalAlpha = 1;
    };

    const drawGlow = (cx: number, cy: number) => {
      const radius = Math.max(120, Math.min(width, height) * 0.55);
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      gradient.addColorStop(0, glowColor);
      gradient.addColorStop(1, 'transparent');
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.22;
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    };

    const paint = (elapsed: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = surfaceColor;
      ctx.fillRect(0, 0, width, height);
      const drift = elapsed * 0.02 * speed;
      drawGrid(drift);
      const t = elapsed * 0.0004 * speed;
      const cx = width * (0.5 + 0.32 * Math.sin(t));
      const cy = height * (0.5 + 0.28 * Math.sin(t * 1.3 + 1));
      drawGlow(reduce ? width * 0.5 : cx, reduce ? height * 0.5 : cy);
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
      if (reduce) paint(0);
    };

    const step = (now: number) => {
      if (!start) start = now;
      paint(now - start);
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
  }, [cellSize, color, surfaceColor, glowColor, speed, lineWidth, reduceMotion]);

  return (
    <div ref={wrapRef} className={`grid-bg ${className}`.trim()} {...rest}>
      <canvas ref={canvasRef} className="grid-bg-canvas" />
      {children != null && <div className="grid-bg-content">{children}</div>}
    </div>
  );
}
