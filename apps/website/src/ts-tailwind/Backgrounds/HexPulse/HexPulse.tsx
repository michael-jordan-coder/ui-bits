import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';

const hexToRgb = (hex: string): [number, number, number] => {
  const v = hex.replace('#', '');
  const n = v.length === 3 ? v.split('').map(c => c + c).join('') : v;
  const int = parseInt(n, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

const TAU = Math.PI * 2;

// Three staggered waves so several rings are lit at once for a richer field.
const WAVES = [
  { offset: 0, gain: 1 },
  { offset: 2.4, gain: 0.6 },
  { offset: 4.8, gain: 0.4 }
];

interface HexCell {
  cx: number;
  cy: number;
}

// Canvas drawing is identical to the CSS variant; only the wrapper uses Tailwind
// utility classes. A flat-top hexagon tessellation with pulse waves expanding
// from a slowly orbiting origin. Single rAF loop, dpr-scaled canvas,
// ResizeObserver. Honors prefers-reduced-motion by painting one static frame.
export interface HexPulseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  size?: number;
  color?: string;
  surfaceColor?: string;
  speed?: number;
  waveWidth?: number;
  className?: string;
  children?: ReactNode;
}

export default function HexPulse({
  size = 26,
  color = '#3ecf8e',
  surfaceColor = '#06070d',
  speed = 1,
  waveWidth = 1,
  className = '',
  children,
  ...rest
}: HexPulseProps) {
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
    const radius = Math.max(8, size);
    const [r, g, b] = hexToRgb(color);
    const rgb = `${r}, ${g}, ${b}`;

    let width = 0;
    let height = 0;
    let cells: HexCell[] = [];
    let originX = 0;
    let originY = 0;
    let maxDist = 1;
    let rafId = 0;
    let start = 0;

    // Flat-top hex geometry: width = 2R, height = sqrt(3)*R. Columns step by
    // 3/4 of the width; odd columns are offset down by half a row.
    const drawHex = (cx: number, cy: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (TAU / 6) * i;
        const px = cx + radius * Math.cos(a);
        const py = cy + radius * Math.sin(a);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
    };

    const buildCells = () => {
      cells = [];
      const horiz = radius * 1.5;
      const vert = radius * Math.sqrt(3);
      const cols = Math.ceil(width / horiz) + 2;
      const rows = Math.ceil(height / vert) + 2;
      for (let col = -1; col < cols; col++) {
        const cx = col * horiz;
        const yOffset = (col & 1) === 0 ? 0 : vert / 2;
        for (let row = -1; row < rows; row++) {
          const cy = row * vert + yOffset;
          cells.push({ cx, cy });
        }
      }
      originX = width / 2;
      originY = height / 2;
      maxDist = Math.hypot(width, height);
    };

    // Raised-cosine band: 1 at the crest, smoothly down to 0 at ±band, else 0.
    const band = Math.max(0.001, waveWidth) * radius * 4;
    const pulse = (phase: number) => {
      const x = phase / band;
      if (x < -1 || x > 1) return 0;
      return 0.5 + 0.5 * Math.cos(x * Math.PI);
    };

    const paint = (elapsed: number) => {
      const t = elapsed * 0.001 * speed;
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = surfaceColor;
      ctx.fillRect(0, 0, width, height);

      // Origin drifts on a slow ellipse so the wave source never sits still.
      const ox = originX + Math.cos(t * 0.18) * width * 0.28;
      const oy = originY + Math.sin(t * 0.13) * height * 0.28;
      const front = (t * 0.16 * maxDist) % (maxDist * 1.4);

      ctx.lineWidth = 1;
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        const dist = Math.hypot(cell.cx - ox, cell.cy - oy);

        let lit = 0;
        for (let w = 0; w < WAVES.length; w++) {
          const wave = WAVES[w];
          const phase = dist - (front - wave.offset * maxDist * 0.12);
          lit += pulse(phase) * wave.gain;
        }
        lit = lit > 1 ? 1 : lit;

        drawHex(cell.cx, cell.cy);
        ctx.strokeStyle = `rgba(${rgb}, 0.07)`;
        ctx.stroke();
        if (lit > 0.001) {
          ctx.fillStyle = `rgba(${rgb}, ${lit * 0.85})`;
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
      buildCells();
      // Fixed phase so the static frame already has several rings lit.
      if (reduce) paint(3200 / Math.max(0.001, speed));
    };

    const frame = (now: number) => {
      if (!start) start = now;
      paint(now - start);
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
  }, [size, color, surfaceColor, speed, waveWidth, reduceMotion]);

  return (
    <div
      ref={wrapRef}
      className={`relative h-full min-h-[200px] w-full overflow-hidden bg-[#06070d] ${className}`.trim()}
      {...rest}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
      {children != null && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">{children}</div>
      )}
    </div>
  );
}
