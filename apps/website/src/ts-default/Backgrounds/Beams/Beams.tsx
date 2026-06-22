import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';
import './Beams.css';

export interface BeamsProps extends HTMLAttributes<HTMLDivElement> {
  beamCount?: number;
  color?: string;
  surfaceColor?: string;
  speed?: number;
  intensity?: number;
  beamWidth?: number;
  className?: string;
  children?: ReactNode;
}

interface Beam {
  x: number;
  width: number;
  alpha: number;
  drift: number;
  phase: number;
  breathe: number;
}

// A calm field of soft vertical light beams: blurred columns drift sideways,
// wrap at the edges, and breathe their opacity so the surface feels lit from
// behind. Drawn to one canvas with additive blending so overlaps brighten, and
// a single rAF loop. Honors prefers-reduced-motion by painting one static frame.
// Inspired by the ambient light-beam backdrops catalogued on designspells.
export default function Beams({
  beamCount = 9,
  color = '#5227FF',
  surfaceColor = '#08080c',
  speed = 1,
  intensity = 0.5,
  beamWidth = 120,
  className = '',
  children,
  ...rest
}: BeamsProps) {
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
    let beams: Beam[] = [];
    let width = 0;
    let height = 0;
    let rafId = 0;
    let last = 0;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const buildBeams = () => {
      const count = Math.max(1, beamCount);
      beams = [];
      for (let i = 0; i < count; i++) {
        beams.push({
          x: ((i + 0.5) / count) * width + rand(-width / count / 2, width / count / 2),
          width: beamWidth * rand(0.6, 1.4),
          alpha: intensity * rand(0.5, 1),
          drift: rand(6, 22) * (Math.random() < 0.5 ? -1 : 1),
          phase: Math.random() * Math.PI * 2,
          breathe: rand(0.3, 0.8)
        });
      }
    };

    const drawBeam = (b: Beam) => {
      const half = b.width / 2;
      const gradient = ctx.createLinearGradient(b.x - half, 0, b.x + half, 0);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, color);
      gradient.addColorStop(1, 'transparent');
      const breath = reduce ? 0.8 : 0.55 + 0.45 * Math.sin(b.phase);
      ctx.globalAlpha = Math.max(0, Math.min(1, b.alpha * breath));
      ctx.fillStyle = gradient;
      ctx.fillRect(b.x - half, 0, b.width, height);
    };

    const paint = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = surfaceColor;
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < beams.length; i++) drawBeam(beams[i]);
      ctx.globalCompositeOperation = 'source-over';
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
      buildBeams();
      if (reduce) paint();
    };

    const step = (now: number) => {
      if (!last) last = now;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      for (let i = 0; i < beams.length; i++) {
        const b = beams[i];
        b.x += b.drift * speed * dt;
        b.phase += b.breathe * speed * dt;
        const edge = b.width;
        if (b.x < -edge) b.x = width + edge;
        else if (b.x > width + edge) b.x = -edge;
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
  }, [beamCount, color, surfaceColor, speed, intensity, beamWidth, reduceMotion]);

  return (
    <div ref={wrapRef} className={`beams ${className}`.trim()} {...rest}>
      <canvas ref={canvasRef} className="beams-canvas" />
      {children != null && <div className="beams-content">{children}</div>}
    </div>
  );
}
