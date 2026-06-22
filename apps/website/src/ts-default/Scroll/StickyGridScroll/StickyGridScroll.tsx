import { useRef, type HTMLAttributes } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'motion/react';
import './StickyGridScroll.css';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

// Spread of progress over which tile reveals START (each tile then animates over
// REVEAL_WINDOW), so earlier tiles lead and the grid assembles as a cascade.
const STAGGER_SPREAD = 0.5;
const REVEAL_WINDOW = 0.25;

interface GridTileProps {
  index: number;
  total: number;
  progress: MotionValue<number>;
  travel: number;
  accent: string;
  reduce: boolean;
}

// One grid tile. Its reveal window is a slice of the shared scroll progress keyed
// to its index, so tiles rise, fade, and scale into place in a staggered cascade.
function GridTile({ index, total, progress, travel, accent, reduce }: GridTileProps) {
  const start = total > 1 ? (index / (total - 1)) * STAGGER_SPREAD : 0;
  const end = start + REVEAL_WINDOW;

  const y = useTransform(progress, [start, end], [travel, 0], { clamp: true });
  const opacity = useTransform(progress, [start, end], [0, 1], { clamp: true });
  const scale = useTransform(progress, [start, end], [0.8, 1], { clamp: true });

  return (
    <motion.div
      className="sticky-grid-scroll-tile"
      style={{
        background: accent,
        y: reduce ? 0 : y,
        opacity: reduce ? 1 : opacity,
        scale: reduce ? 1 : scale
      }}
    >
      <span className="sticky-grid-scroll-num">{String(index + 1).padStart(2, '0')}</span>
    </motion.div>
  );
}

// A scroll-driven grid that stays pinned while it assembles: as you scroll the
// panel, the whole grid eases down from a slight zoom and its tiles cascade up
// into place column by column, then hold. Inspired by Codrops' "Sticky Grid
// Scroll". Self-contained — it owns an internal scroll container, so it works
// anywhere without a page-level scroll rig. Reduced-motion users get the settled
// grid with no movement.
export interface StickyGridScrollProps extends HTMLAttributes<HTMLDivElement> {
  tiles?: number;
  columns?: number;
  gap?: number;
  travel?: number;
  zoom?: number;
  height?: number;
  className?: string;
}

export default function StickyGridScroll({
  tiles = 9,
  columns = 3,
  gap = 12,
  travel = 64,
  zoom = 1.12,
  height = 460,
  className = '',
  ...rest
}: StickyGridScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ container: ref });
  const total = Math.max(1, Math.floor(tiles));

  const stageScale = useTransform(scrollYProgress, [0, 0.7], [zoom, 1], { clamp: true });

  const cells = Array.from({ length: total }, (_, i) => ({
    accent: `hsl(${210 + (i / Math.max(1, total - 1)) * 140}, 68%, 60%)`
  }));

  return (
    <div {...rest} ref={ref} className={join('sticky-grid-scroll', className)} style={{ height, ...rest.style }}>
      <div className="sticky-grid-scroll-track" style={{ height: height * 2.4 }}>
        <div className="sticky-grid-scroll-stage" style={{ height }}>
          <motion.div
            className="sticky-grid-scroll-grid"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
              gap,
              scale: reduce ? 1 : stageScale
            }}
          >
            {cells.map((cell, i) => (
              <GridTile
                key={i}
                index={i}
                total={total}
                progress={scrollYProgress}
                travel={travel}
                accent={cell.accent}
                reduce={reduce}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
