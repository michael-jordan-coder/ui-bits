import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import './Waves.css';

export interface WavesProps extends HTMLAttributes<HTMLDivElement> {
  lineCount?: number;
  amplitude?: number;
  frequency?: number;
  speed?: number;
  color?: string;
  surfaceColor?: string;
  lineWidth?: number;
  className?: string;
  children?: ReactNode;
}

// A full-bleed backdrop of flowing horizontal lines: a stack of sine waves whose
// phases are offset line-to-line so they weave like a drifting fabric. Rendered
// to a single canvas with one rAF loop — no per-line DOM. Lines fade toward the
// edges so the field reads as a soft band. Honors prefers-reduced-motion by
// painting one static frame instead of animating. Inspired by the ambient
// line-wave backgrounds catalogued on designspells.
export default function Waves({
  lineCount = 14,
  amplitude = 26,
  frequency = 1.3,
  speed = 1,
  color = '#5227FF',
  surfaceColor = '#08080c',
  lineWidth = 1.5,
  className = '',
  children,
  ...rest
}: WavesProps) {
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

    const paint = (elapsed: number) => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = surfaceColor;
      ctx.fillRect(0, 0, width, height);
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';

      const rows = Math.max(1, lineCount);
      const gap = height / (rows + 1);
      const step = Math.max(6, Math.floor(width / 80));
      const omega = (frequency * Math.PI * 2) / Math.max(width, 1);

      for (let i = 0; i < rows; i++) {
        const baseY = gap * (i + 1);
        const phase = elapsed * 0.0009 * speed + i * 0.45;
        const sway = 0.6 + 0.4 * Math.sin(i * 0.7);
        const edgeFade = 1 - Math.abs((i + 1) / (rows + 1) - 0.5) * 1.2;
        ctx.globalAlpha = Math.max(0.08, 0.5 * edgeFade);
        ctx.strokeStyle = color;
        ctx.beginPath();
        for (let x = 0; x <= width; x += step) {
          const y = baseY + Math.sin(x * omega + phase) * amplitude * sway;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
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
  }, [lineCount, amplitude, frequency, speed, color, surfaceColor, lineWidth, reduceMotion]);

  return (
    <div ref={wrapRef} className={`waves ${className}`.trim()} {...rest}>
      <canvas ref={canvasRef} className="waves-canvas" />
      {children != null && <div className="waves-content">{children}</div>}
    </div>
  );
}
