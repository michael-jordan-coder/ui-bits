import { useEffect, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { Reorder, useDragControls, useReducedMotion } from 'motion/react';
import { GripVertical } from 'lucide-react';
import './ReorderList.css';

export interface ReorderListItem {
  id: string;
  label: string;
}

export interface ReorderListProps {
  items?: ReorderListItem[];
  accentColor?: string;
  surfaceColor?: string;
  gap?: number;
  width?: number;
  handleOnly?: boolean;
  onReorder?: (items: ReorderListItem[]) => void;
  className?: string;
}

interface ReorderRowProps {
  item: ReorderListItem;
  accentColor: string;
  surfaceColor: string;
  handleOnly: boolean;
  prefersReduced: boolean;
  onMove: (item: ReorderListItem, direction: number) => void;
}

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

const DEFAULT_ITEMS: ReorderListItem[] = [
  { id: 'launch', label: 'Draft the launch announcement' },
  { id: 'review', label: 'Review open pull requests' },
  { id: 'onboarding', label: 'Polish the onboarding flow' },
  { id: 'metrics', label: 'Check yesterday’s metrics' },
  { id: 'changelog', label: 'Ship the changelog' }
];

function ReorderRow({ item, accentColor, surfaceColor, handleOnly, prefersReduced, onMove }: ReorderRowProps) {
  const controls = useDragControls();

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      onMove(item, -1);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      onMove(item, 1);
    }
  };

  return (
    <Reorder.Item
      value={item}
      dragListener={!handleOnly}
      dragControls={controls}
      className="reorder-list-item"
      style={{ background: surfaceColor, cursor: handleOnly ? 'default' : 'grab' }}
      whileDrag={{
        scale: prefersReduced ? 1 : 1.03,
        boxShadow: '0 18px 40px -12px rgba(0, 0, 0, 0.6)',
        cursor: 'grabbing'
      }}
      transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 600, damping: 44 }}
    >
      <button
        type="button"
        className="reorder-list-handle"
        style={{ color: accentColor, cursor: handleOnly ? 'grab' : 'inherit' }}
        onPointerDown={handleOnly ? (event: PointerEvent<HTMLButtonElement>) => controls.start(event) : undefined}
        onKeyDown={handleKeyDown}
        aria-label={`Reorder ${item.label}. Use the arrow keys to move.`}
      >
        <GripVertical size={18} strokeWidth={2} aria-hidden="true" />
      </button>
      <span className="reorder-list-label">{item.label}</span>
    </Reorder.Item>
  );
}

// A drag-to-reorder list built on motion's Reorder primitives: rows lift on grab
// and spring into their new place, with arrow-key reordering for keyboard users.
// Inspired by the drag-to-reorder list interaction documented on reactbits.dev.
export default function ReorderList({
  items = DEFAULT_ITEMS,
  accentColor = '#6366f1',
  surfaceColor = '#1c1c22',
  gap = 10,
  width = 380,
  handleOnly = false,
  onReorder,
  className = ''
}: ReorderListProps) {
  const prefersReduced = useReducedMotion();
  const [order, setOrder] = useState<ReorderListItem[]>(items);

  useEffect(() => {
    setOrder(items);
  }, [items]);

  const handleReorder = (next: ReorderListItem[]) => {
    setOrder(next);
    onReorder?.(next);
  };

  const move = (item: ReorderListItem, direction: number) => {
    setOrder(prev => {
      const index = prev.findIndex(entry => entry.id === item.id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      const [removed] = next.splice(index, 1);
      next.splice(target, 0, removed);
      onReorder?.(next);
      return next;
    });
  };

  return (
    <Reorder.Group
      axis="y"
      values={order}
      onReorder={handleReorder}
      className={join('reorder-list-root', className)}
      style={{ width, gap }}
    >
      {order.map(item => (
        <ReorderRow
          key={item.id}
          item={item}
          accentColor={accentColor}
          surfaceColor={surfaceColor}
          handleOnly={handleOnly}
          prefersReduced={Boolean(prefersReduced)}
          onMove={move}
        />
      ))}
    </Reorder.Group>
  );
}
