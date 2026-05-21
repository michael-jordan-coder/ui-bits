import { useCallback, useEffect, useRef, type RefObject } from 'react';

export interface AppItem {
  label: string;
  color: string;
  glyph?: string;
  image?: string;
  imageFit?: 'cover' | 'contain';
  imageScale?: number;
  imagePosition?: string;
}

export interface HoneycombGridProps {
  apps?: AppItem[];
  wideCount?: number;
  fillFactor?: number;
  gapRatio?: number;
  fisheyeStrength?: number;
  enabled?: boolean;
  onSelect?: (app: AppItem, rect: DOMRect) => void;
  className?: string;
}

interface HexLayout {
  iconSize: number;
  gap: number;
  wideCount: number;
  colPitch: number;
  rowPitch: number;
}

interface VisibleCell {
  row: number;
  col: number;
  cx: number;
  cy: number;
}

interface CellEntry {
  el: HTMLButtonElement;
  app: AppItem;
}

const DEFAULT_APPS: AppItem[] = [
  { label: 'Mint', color: '#3CCB91' },
  { label: 'Violet', color: '#5227FF' },
  { label: 'Ember', color: '#F25C2A' },
  { label: 'Sky', color: '#3FA9F5' },
  { label: 'Rose', color: '#FF5C8A' },
  { label: 'Amber', color: '#F5B500' },
  { label: 'Ink', color: '#0F1115' },
  { label: 'Sage', color: '#8BB97A' },
  { label: 'Plum', color: '#7C4DFF' },
  { label: 'Coral', color: '#FF7A59' },
  { label: 'Teal', color: '#2EC4B6' },
  { label: 'Slate', color: '#475569' }
];

const CELL_CLASS =
  'absolute left-0 top-0 border-0 p-0 rounded-full flex items-center justify-center ' +
  'text-white font-semibold tracking-[-0.02em] cursor-[inherit] origin-center ' +
  'will-change-[transform,opacity] ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white';

function appForCell(apps: AppItem[], row: number, col: number): AppItem | null {
  if (!apps || apps.length === 0) return null;
  const raw = row * 31 + col * 17;
  const idx = ((raw % apps.length) + apps.length) % apps.length;
  return apps[idx];
}

function fitIconSize(
  width: number,
  wideCount: number,
  fillFactor: number,
  gapRatio: number
): { iconSize: number; gap: number } {
  const iconSize = (fillFactor * width) / (wideCount + (wideCount - 1) * gapRatio);
  return { iconSize, gap: iconSize * gapRatio };
}

function makeHexLayout(iconSize: number, gap: number, wideCount: number): HexLayout {
  const colPitch = iconSize + gap;
  const rowPitch = (colPitch * Math.sqrt(3)) / 2;
  return { iconSize, gap, wideCount, colPitch, rowPitch };
}

function visibleCells(layout: HexLayout, viewportHeight: number, scrollY: number): VisibleCell[] {
  const { rowPitch, colPitch, iconSize, wideCount } = layout;
  const margin = iconSize;
  const minRow = Math.floor((scrollY - viewportHeight / 2 - margin) / rowPitch);
  const maxRow = Math.ceil((scrollY + viewportHeight / 2 + margin) / rowPitch);
  const cells: VisibleCell[] = [];
  for (let r = minRow; r <= maxRow; r++) {
    const isWide = (((r % 2) + 2) % 2) === 0;
    const count = isWide ? wideCount : wideCount - 1;
    if (count < 1) continue;
    const halfWidth = ((count - 1) * colPitch) / 2;
    const cy = r * rowPitch - scrollY;
    for (let c = 0; c < count; c++) {
      const cx = c * colPitch - halfWidth;
      cells.push({ row: r, col: c, cx, cy });
    }
  }
  return cells;
}

function fisheyeTransform(
  cx: number,
  cy: number,
  viewport: { w: number; h: number },
  strength: number
): { scale: number; opacity: number } {
  const maxR = Math.hypot(viewport.w / 2, viewport.h / 2);
  if (maxR === 0) return { scale: 1, opacity: 1 };
  const t = Math.min(1, Math.hypot(cx, cy) / maxR);
  const scale = Math.max(0.1, 1 - strength * t * t);
  const opacity = Math.max(0, 1 - t * t * Math.min(1, strength + 0.2));
  return { scale, opacity };
}

interface ScrollHookArgs {
  targetRef: RefObject<HTMLDivElement | null>;
  onFrame: (scrollY: number) => void;
  onTap?: (x: number, y: number) => void;
  enabled: boolean;
}

function useHoneycombScroll({ targetRef, onFrame, onTap, enabled }: ScrollHookArgs) {
  const onFrameRef = useRef(onFrame);
  const onTapRef = useRef(onTap);
  onFrameRef.current = onFrame;
  onTapRef.current = onTap;

  useEffect(() => {
    const el = targetRef.current;
    if (!el || !enabled) return;

    let scrollY = 0;
    let velocity = 0;
    let dragging = false;
    let lastY = 0;
    let lastT = 0;
    let downX = 0;
    let downY = 0;
    let downT = 0;
    let moved = false;
    let raf = 0;
    let alive = true;

    const loop = () => {
      if (!alive) return;
      if (!dragging && Math.abs(velocity) > 0.05) {
        scrollY += velocity;
        velocity *= 0.94;
      }
      onFrameRef.current(scrollY);
      raf = requestAnimationFrame(loop);
    };

    const onPointerDown = (e: PointerEvent) => {
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        // pointer capture can throw if the pointer isn't active yet
      }
      dragging = true;
      moved = false;
      lastY = e.clientY;
      lastT = performance.now();
      downX = e.clientX;
      downY = e.clientY;
      downT = lastT;
      velocity = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const now = performance.now();
      const dy = e.clientY - lastY;
      scrollY -= dy;
      const dt = Math.max(1, now - lastT);
      velocity = (-dy * 16.67) / dt;
      lastY = e.clientY;
      lastT = now;
      if (!moved && (Math.abs(e.clientX - downX) > 5 || Math.abs(e.clientY - downY) > 5)) {
        moved = true;
      }
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {
        // releasing a capture we never owned isn't fatal
      }
      const elapsed = performance.now() - downT;
      if (!moved && elapsed < 300) {
        velocity = 0;
        onTapRef.current?.(e.clientX, e.clientY);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollY += e.deltaY;
      velocity = 0;
    };

    el.addEventListener('pointerdown', onPointerDown);
    el.addEventListener('pointermove', onPointerMove);
    el.addEventListener('pointerup', onPointerUp);
    el.addEventListener('pointercancel', onPointerUp);
    el.addEventListener('wheel', onWheel, { passive: false });

    raf = requestAnimationFrame(loop);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      el.removeEventListener('pointerdown', onPointerDown);
      el.removeEventListener('pointermove', onPointerMove);
      el.removeEventListener('pointerup', onPointerUp);
      el.removeEventListener('pointercancel', onPointerUp);
      el.removeEventListener('wheel', onWheel);
    };
  }, [targetRef, enabled]);
}

export default function HoneycombGrid({
  apps = DEFAULT_APPS,
  wideCount = 4,
  fillFactor = 0.92,
  gapRatio = 0.18,
  fisheyeStrength = 0.7,
  enabled = true,
  onSelect,
  className = ''
}: HoneycombGridProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const poolRef = useRef<Map<string, CellEntry>>(new Map());
  const lastWideCountRef = useRef<number>(-1);
  const lastIconSizeRef = useRef<number>(-1);
  const lastAppsRef = useRef<AppItem[]>(apps);
  const iconSizeRef = useRef<number>(0);
  const appsRef = useRef<AppItem[]>(apps);
  appsRef.current = apps;

  const handleSelect = useCallback(
    (app: AppItem, el: HTMLElement) => {
      onSelect?.(app, el.getBoundingClientRect());
    },
    [onSelect]
  );

  const createCell = useCallback((row: number, col: number): CellEntry | null => {
    const app = appForCell(appsRef.current, row, col);
    if (!app) return null;
    const size = iconSizeRef.current;
    const el = document.createElement('button');
    el.className = CELL_CLASS;
    el.type = 'button';
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.fontSize = `${size * 0.42}px`;
    el.setAttribute('aria-label', app.label);

    if (app.image) {
      const fit = app.imageFit ?? 'cover';
      const scale = app.imageScale ?? 1;
      el.style.backgroundColor = app.color;
      el.style.backgroundImage = `url("${app.image}")`;
      el.style.backgroundSize =
        scale !== 1 ? `${scale * 100}% auto` : fit === 'contain' ? 'contain' : 'cover';
      el.style.backgroundPosition = app.imagePosition ?? 'center';
      el.style.backgroundRepeat = 'no-repeat';
    } else {
      el.style.background = app.color;
      if (app.glyph) {
        const span = document.createElement('span');
        span.textContent = app.glyph;
        span.setAttribute('aria-hidden', 'true');
        el.appendChild(span);
      }
    }

    canvasRef.current?.appendChild(el);
    return { el, app };
  }, []);

  const handleTap = useCallback(
    (x: number, y: number) => {
      const target = document.elementFromPoint(x, y);
      if (!target) return;
      const btn = (target as Element).closest('button');
      if (!btn) return;
      for (const [, entry] of poolRef.current) {
        if (entry.el === btn) {
          handleSelect(entry.app, entry.el);
          return;
        }
      }
    },
    [handleSelect]
  );

  const onFrame = useCallback(
    (scrollY: number) => {
      const frame = frameRef.current;
      if (!frame) return;
      const w = frame.clientWidth;
      const h = frame.clientHeight;
      if (w === 0 || h === 0) return;
      const viewport = { w, h };

      const { iconSize, gap } = fitIconSize(w, wideCount, fillFactor, gapRatio);
      iconSizeRef.current = iconSize;
      const layout = makeHexLayout(iconSize, gap, wideCount);

      const sizeChanged = Math.abs(iconSize - lastIconSizeRef.current) > 0.5;
      if (
        layout.wideCount !== lastWideCountRef.current ||
        sizeChanged ||
        apps !== lastAppsRef.current
      ) {
        for (const [, entry] of poolRef.current) entry.el.remove();
        poolRef.current.clear();
        lastWideCountRef.current = layout.wideCount;
        lastIconSizeRef.current = iconSize;
        lastAppsRef.current = apps;
      }

      const cells = visibleCells(layout, h, scrollY);
      const seen = new Set<string>();
      const half = iconSize / 2;

      for (const c of cells) {
        const key = `${c.row}:${c.col}`;
        seen.add(key);
        let entry = poolRef.current.get(key);
        if (!entry) {
          const created = createCell(c.row, c.col);
          if (!created) continue;
          entry = created;
          poolRef.current.set(key, entry);
        }
        const { scale, opacity } = fisheyeTransform(c.cx, c.cy, viewport, fisheyeStrength);
        const x = c.cx - half;
        const y = c.cy - half;
        entry.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale.toFixed(3)})`;
        entry.el.style.opacity = opacity.toFixed(3);
      }

      if (poolRef.current.size > 400) {
        for (const [key, entry] of poolRef.current) {
          if (!seen.has(key)) {
            entry.el.remove();
            poolRef.current.delete(key);
          }
        }
      }
    },
    [apps, createCell, fisheyeStrength, wideCount, fillFactor, gapRatio]
  );

  useHoneycombScroll({
    targetRef: frameRef,
    onFrame,
    onTap: handleTap,
    enabled
  });

  useEffect(() => {
    const pool = poolRef.current;
    return () => {
      for (const [, entry] of pool) entry.el.remove();
      pool.clear();
    };
  }, []);

  return (
    <div
      ref={frameRef}
      role="grid"
      aria-label="Honeycomb grid"
      className={[
        'relative w-full h-full bg-[#0a0a0a] overflow-hidden touch-none select-none cursor-grab active:cursor-grabbing',
        className
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div ref={canvasRef} className="absolute left-1/2 top-1/2 z-[1] will-change-transform" />
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-[2] bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]"
      />
    </div>
  );
}
