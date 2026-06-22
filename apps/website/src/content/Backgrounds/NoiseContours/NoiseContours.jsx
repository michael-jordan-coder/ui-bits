import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import './NoiseContours.css';

const hexToRgb = hex => {
  const v = hex.replace('#', '');
  const n = v.length === 3 ? v.split('').map(c => c + c).join('') : v;
  const int = parseInt(n, 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
};

// A flowing topographic-map backdrop: a stack of `levels` horizontal contour
// lines drifting across the surface. Each line is a smooth polyline whose y at
// a given x is its base offset plus an amplitude-scaled sum of three sine
// octaves with differing frequency, phase and drift speed — that layering keeps
// the ridge organic and non-repetitive. Advancing `time` flows the ridges
// sideways; lines nearer the bottom edge read slightly brighter to suggest
// depth. Single rAF loop, dpr-scaled canvas, ResizeObserver. Honors
// prefers-reduced-motion by painting one static frame instead of looping.
export default function NoiseContours({
  color = '#7aa2ff',
  surfaceColor = '#06070d',
  levels = 7,
  scale = 1,
  speed = 1,
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
    const lineCount = Math.max(1, Math.round(levels));
    const [cr, cg, cb] = hexToRgb(color);

    let width = 0;
    let height = 0;
    let rafId = 0;
    let start = 0;

    // Three sine octaves per contour. Higher octaves add finer detail at lower
    // amplitude; each drifts at its own rate so the ridge never repeats.
    const octaves = [
      { freq: 1.6, amp: 1, phase: 0, drift: 0.6 },
      { freq: 3.7, amp: 0.45, phase: 1.7, drift: -0.9 },
      { freq: 7.3, amp: 0.22, phase: 4.2, drift: 1.4 }
    ];

    const heightAt = (xNorm, lineIndex, t) => {
      let sum = 0;
      for (let o = 0; o < octaves.length; o++) {
        const oct = octaves[o];
        const angle =
          xNorm * oct.freq * scale * Math.PI * 2 + oct.phase + lineIndex * 0.9 + t * oct.drift;
        sum += Math.sin(angle) * oct.amp;
      }
      return sum;
    };

    const paint = elapsed => {
      const t = elapsed * 0.001 * speed;
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.fillStyle = surfaceColor;
      ctx.fillRect(0, 0, width, height);

      // Leave vertical headroom so the topmost and bottommost ridges never clip.
      const margin = height * 0.12;
      const usable = height - margin * 2;
      const gap = lineCount > 1 ? usable / (lineCount - 1) : 0;
      const amplitude = Math.min(gap * 0.72, height * 0.09);
      const step = Math.max(2, Math.floor(width / 160));

      ctx.lineWidth = 1.1;
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      for (let i = 0; i < lineCount; i++) {
        const baseY = margin + gap * i;
        // Lines toward the bottom sit "closer" — brighter to suggest depth.
        const depth = lineCount > 1 ? i / (lineCount - 1) : 1;
        const alpha = 0.12 + depth * 0.34;
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${alpha})`;
        ctx.beginPath();
        for (let x = 0; x <= width; x += step) {
          const xNorm = width > 0 ? x / width : 0;
          const y = baseY + heightAt(xNorm, i, t) * amplitude;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
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
      if (reduce) paint(0);
    };

    const frame = now => {
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
  }, [color, surfaceColor, levels, scale, speed, reduceMotion]);

  return (
    <div ref={wrapRef} className={`noise-contours ${className}`.trim()} {...rest}>
      <canvas ref={canvasRef} className="noise-contours-canvas" />
      {children != null && <div className="noise-contours-content">{children}</div>}
    </div>
  );
}
