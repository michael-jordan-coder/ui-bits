import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { useReducedMotion } from 'motion/react';

const hexToRgb = (hex: string): [number, number, number] => {
  const v = hex.replace('#', '');
  const n = v.length === 3 ? v.split('').map(c => c + c).join('') : v;
  const int = parseInt(n, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

// Canvas drawing is identical to the CSS variant; only the wrapper uses Tailwind
// utility classes. N nodes drift and wrap at the edges, faint lines connect
// pairs closer than linkDistance (alpha fades to 0 at the threshold), and the
// pointer gently attracts nearby nodes. Single rAF loop, dpr-scaled canvas,
// ResizeObserver. Honors prefers-reduced-motion with one static frame.
export interface ConstellationProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  count?: number;
  color?: string;
  surfaceColor?: string;
  linkDistance?: number;
  speed?: number;
  className?: string;
  children?: ReactNode;
}

export default function Constellation({
  count = 70,
  color = '#7aa2ff',
  surfaceColor = '#06070d',
  linkDistance = 130,
  speed = 1,
  className = '',
  children,
  ...rest
}: ConstellationProps) {
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
    const [cr, cg, cb] = hexToRgb(color);
    const rgb = `${cr}, ${cg}, ${cb}`;
    const TAU = Math.PI * 2;
    const POINTER_RADIUS = 120;
    const POINTER_PULL = 0.04;

    let width = 0;
    let height = 0;
    let nodes: Node[] = [];
    let rafId = 0;
    const pointer = { x: 0, y: 0, active: false };

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const buildNodes = () => {
      nodes = [];
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: rand(-0.4, 0.4),
          vy: rand(-0.4, 0.4)
        });
      }
    };

    const step = () => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx * speed;
        node.y += node.vy * speed;

        if (pointer.active) {
          const dx = pointer.x - node.x;
          const dy = pointer.y - node.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0 && dist < POINTER_RADIUS) {
            const force = (1 - dist / POINTER_RADIUS) * POINTER_PULL;
            node.x += dx * force;
            node.y += dy * force;
          }
        }

        if (node.x < 0) node.x += width;
        else if (node.x > width) node.x -= width;
        if (node.y < 0) node.y += height;
        else if (node.y > height) node.y -= height;
      }
    };

    const draw = () => {
      ctx.fillStyle = surfaceColor;
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDistance) {
            const alpha = (1 - dist / linkDistance) * 0.5;
            ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const grad = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 4);
        grad.addColorStop(0, `rgba(${rgb}, 0.9)`);
        grad.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, TAU);
        ctx.fill();
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
      if (reduce) draw();
    };

    const frame = () => {
      step();
      draw();
      rafId = requestAnimationFrame(frame);
    };

    const onPointerMove = (event: PointerEvent) => {
      const rect = wrap.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    buildNodes();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    if (!reduce) {
      wrap.addEventListener('pointermove', onPointerMove);
      wrap.addEventListener('pointerleave', onPointerLeave);
      rafId = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      wrap.removeEventListener('pointermove', onPointerMove);
      wrap.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [count, color, surfaceColor, linkDistance, speed, reduceMotion]);

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
