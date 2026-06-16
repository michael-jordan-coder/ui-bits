import { useEffect, useState } from 'react';
import { Reorder, useDragControls, useReducedMotion } from 'motion/react';
import { GripVertical } from 'lucide-react';

const join = (...classes) => classes.filter(Boolean).join(' ');

const DEFAULT_ITEMS = [
  { id: 'launch', label: 'Draft the launch announcement' },
  { id: 'review', label: 'Review open pull requests' },
  { id: 'onboarding', label: 'Polish the onboarding flow' },
  { id: 'metrics', label: 'Check yesterday’s metrics' },
  { id: 'changelog', label: 'Ship the changelog' }
];

function ReorderRow({ item, accentColor, surfaceColor, handleOnly, prefersReduced, onMove }) {
  const controls = useDragControls();

  const handleKeyDown = event => {
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
      className="relative flex select-none items-center gap-[0.6rem] rounded-[12px] border border-white/[0.08] px-[0.9rem] py-[0.85rem] text-[0.94rem] text-white"
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
        className="m-0 inline-flex flex-none items-center justify-center rounded-[6px] border-none bg-transparent p-0 opacity-65 transition-opacity duration-[120ms] ease-out hover:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current motion-reduce:transition-none"
        style={{ color: accentColor, cursor: handleOnly ? 'grab' : 'inherit' }}
        onPointerDown={handleOnly ? event => controls.start(event) : undefined}
        onKeyDown={handleKeyDown}
        aria-label={`Reorder ${item.label}. Use the arrow keys to move.`}
      >
        <GripVertical size={18} strokeWidth={2} aria-hidden="true" />
      </button>
      <span className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{item.label}</span>
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
  className = '',
  ...rest
}) {
  const prefersReduced = useReducedMotion();
  const [order, setOrder] = useState(items);

  useEffect(() => {
    setOrder(items);
  }, [items]);

  const handleReorder = next => {
    setOrder(next);
    onReorder?.(next);
  };

  const move = (item, direction) => {
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
      className={join('m-0 flex max-w-full list-none flex-col p-0', className)}
      style={{ width, gap }}
      {...rest}
    >
      {order.map(item => (
        <ReorderRow
          key={item.id}
          item={item}
          accentColor={accentColor}
          surfaceColor={surfaceColor}
          handleOnly={handleOnly}
          prefersReduced={prefersReduced}
          onMove={move}
        />
      ))}
    </Reorder.Group>
  );
}
