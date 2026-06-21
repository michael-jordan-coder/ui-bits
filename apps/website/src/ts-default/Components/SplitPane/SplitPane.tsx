import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode
} from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { GripVertical, GripHorizontal } from 'lucide-react';
import './SplitPane.css';

export type SplitPaneOrientation = 'horizontal' | 'vertical';

export interface SplitPaneProps {
  orientation?: SplitPaneOrientation;
  defaultSize?: number;
  min?: number;
  max?: number;
  snapPoints?: number[];
  snapThreshold?: number;
  keyboardStep?: number;
  dividerSize?: number;
  first?: ReactNode;
  second?: ReactNode;
  onResize?: (size: number) => void;
  className?: string;
}

interface AnimateTarget {
  value: number;
  transition: typeof SETTLE_TRANSITION;
}

const join = (...classes: Array<string | false | undefined>): string => classes.filter(Boolean).join(' ');
const clamp = (val: number, min: number, max: number): number => Math.min(Math.max(val, min), max);

// Pulls the dragged value toward a nearby snap point when within threshold.
const applySnap = (value: number, snapPoints: number[], threshold: number): number => {
  for (const point of snapPoints) {
    if (Math.abs(value - point) <= threshold) return point;
  }
  return value;
};

const SETTLE_TRANSITION = { type: 'spring', stiffness: 420, damping: 34 } as const;
const RESET_TRANSITION = { type: 'spring', stiffness: 260, damping: 30 } as const;

export default function SplitPane({
  orientation = 'horizontal',
  defaultSize = 50,
  min = 15,
  max = 85,
  snapPoints = [50],
  snapThreshold = 4,
  keyboardStep = 4,
  dividerSize = 12,
  first,
  second,
  onResize,
  className = ''
}: SplitPaneProps) {
  const isHorizontal = orientation === 'horizontal';
  const reduceMotion = useReducedMotion();

  const [size, setSize] = useState<number>(() => clamp(defaultSize, min, max));
  const [isDragging, setIsDragging] = useState<boolean>(false);
  // When set, the first pane animates toward this value (snap settle or reset).
  const [animateTo, setAnimateTo] = useState<AnimateTarget | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  const commitSize = useCallback(
    (next: number): void => {
      setSize(next);
      onResize?.(next);
    },
    [onResize]
  );

  const handlePointerDown = useCallback((e: PointerEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setAnimateTo(null);
    setIsDragging(true);
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>): void => {
      if (!isDragging) return;
      const container = containerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const ratio = isHorizontal ? (e.clientX - rect.left) / rect.width : (e.clientY - rect.top) / rect.height;
      commitSize(clamp(ratio * 100, min, max));
    },
    [isDragging, isHorizontal, min, max, commitSize]
  );

  const endDrag = useCallback(
    (e: PointerEvent<HTMLDivElement>): void => {
      if (!isDragging) return;
      e.currentTarget.releasePointerCapture?.(e.pointerId);
      setIsDragging(false);
      const snapped = clamp(applySnap(size, snapPoints, snapThreshold), min, max);
      if (snapped === size) return;
      if (!reduceMotion) setAnimateTo({ value: snapped, transition: SETTLE_TRANSITION });
      commitSize(snapped);
    },
    [isDragging, size, snapPoints, snapThreshold, min, max, reduceMotion, commitSize]
  );

  const handleDoubleClick = useCallback((): void => {
    const target = clamp(defaultSize, min, max);
    if (target === size) return;
    if (!reduceMotion) setAnimateTo({ value: target, transition: RESET_TRANSITION });
    commitSize(target);
  }, [defaultSize, min, max, size, reduceMotion, commitSize]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>): void => {
      const decKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';
      const incKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
      let next: number;
      switch (e.key) {
        case decKey:
          next = size - keyboardStep;
          break;
        case incKey:
          next = size + keyboardStep;
          break;
        case 'Home':
          next = min;
          break;
        case 'End':
          next = max;
          break;
        default:
          return;
      }
      e.preventDefault();
      setAnimateTo(null);
      commitSize(clamp(next, min, max));
    },
    [isHorizontal, size, keyboardStep, min, max, commitSize]
  );

  // Release the animation target after the settle so subsequent drags track 1:1.
  useEffect(() => {
    if (animateTo == null) return undefined;
    const id = window.setTimeout(() => setAnimateTo(null), 360);
    return () => window.clearTimeout(id);
  }, [animateTo]);

  const animatedBasis = animateTo ? { flexBasis: `${animateTo.value}%` } : undefined;
  const transition = animateTo ? animateTo.transition : ({ duration: 0 } as const);
  const rounded = Math.round(size);

  return (
    <div
      ref={containerRef}
      className={join(
        'ui-split',
        isHorizontal ? 'ui-split--horizontal' : 'ui-split--vertical',
        isDragging && 'ui-split--dragging',
        className
      )}
    >
      <motion.div
        className="ui-split__pane"
        style={{ flexBasis: `${size}%` } as CSSProperties}
        animate={animatedBasis}
        transition={transition}
      >
        {first}
      </motion.div>

      <div
        className="ui-split__divider"
        style={{ flexBasis: `${dividerSize}px` } as CSSProperties}
        role="separator"
        aria-orientation={isHorizontal ? 'vertical' : 'horizontal'}
        aria-valuenow={rounded}
        aria-valuemin={Math.round(min)}
        aria-valuemax={Math.round(max)}
        aria-label="Resize panes"
        tabIndex={0}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={handleDoubleClick}
        onKeyDown={handleKeyDown}
      >
        <span className="ui-split__grip" aria-hidden="true">
          {isHorizontal ? <GripVertical size={16} strokeWidth={2} /> : <GripHorizontal size={16} strokeWidth={2} />}
        </span>
      </div>

      <div className="ui-split__pane">{second}</div>
    </div>
  );
}
