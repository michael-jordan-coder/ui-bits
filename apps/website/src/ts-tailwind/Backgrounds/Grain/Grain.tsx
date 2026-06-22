import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';

const hexToRgb = (hex: string): [number, number, number] => {
  const v = hex.replace('#', '');
  const n = v.length === 3 ? v.split('').map(c => c + c).join('') : v;
  const int = parseInt(n, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

// Canvas drawing is identical to the CSS variant; only the wrapper uses Tailwind
// utility classes. A tinted noise speckle is regenerated into a small offscreen
// buffer and laid over a flat surface at a tasteful frame rate. Honors prefers-reduced-motion.
export interface GrainProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  color?: string;
  surfaceColor?: string;
  intensity?: number;
  grainSize?: number;
  speed?: number;
  className?: string;
  children?: ReactNode;
}

export default function Grain({
  color = '#ffffff',
  surfaceColor = '#08080c',
  intensity = 0.12,
  grainSize = 1.6,
  speed = 1,
  className = '',
  children,
  ...rest
}: GrainProps) {
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
