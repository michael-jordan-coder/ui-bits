import { useRef, type CSSProperties, type HTMLAttributes } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'motion/react';
import './ScrollStack.css';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

export interface ScrollStackItem {
  title: string;
  description?: string;
  accent: string;
}

export interface ScrollStackProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  items?: ScrollStackItem[];
  peek?: number;
  gap?: number;
  cardHeight?: number;
  scaleStep?: number;
  minScale?: number;
  dim?: number;
  height?: number;
  className?: string;
}

const DEFAULT_ITEMS: ScrollStackItem[] = [
  { title: 'Capture', description: 'Drop any idea in and keep moving — sorting can wait.', accent: '#5227FF' },
  { title: 'Organize', description: 'Group related thoughts so the shape of the work appears.', accent: '#0EA5E9' },
  { title: 'Refine', description: 'Trim the noise until only the decisions remain.', accent: '#10B981' },
  { title: 'Ship', description: 'Hand it off with everything it needs to stand on its own.', accent: '#F59E0B' },
  { title: 'Reflect', description: 'Look back at what worked and feed it into the next pass.', accent: '#EF4444' }
];

interface StackCardProps {
  index: number;
  total: number;
  item: ScrollStackItem;
  scrollY: MotionValue<number>;
  peek: number;
  gap: number;
  cardHeight: number;
  scaleStep: number;
  minScale: number;
  dim: number;
  reduce: boolean;
}

// One pinned card. It sticks at `pinTop` and, as the scroll travels past its pin
// point, shrinks toward a depth-based scale and dims — so cards landing on top
// read as a physical stack. Scale/opacity derive from the shared container scroll
// via motion's useTransform; reduced-motion users get a plain static stack.
function StackCard({ index, total, item, scrollY, peek, gap, cardHeight, scaleStep, minScale, dim, reduce }: StackCardProps) {
  const stride = cardHeight + gap;
  const pinTop = peek * index;
  const pinStart = index * stride - pinTop;
  const range = stride * 2.5;
  const depthScale = Math.max(minScale, 1 - scaleStep * (total - 1 - index) * 2);

  const scale = useTransform(scrollY, [pinStart, pinStart + range], [1, depthScale], { clamp: true });
  const opacity = useTransform(scrollY, [pinStart, pinStart + range], [1, 1 - dim], { clamp: true });

  return (
    <motion.div
      className="scroll-stack-card"
      style={
        {
          top: pinTop,
          height: cardHeight,
          zIndex: index,
          scale: reduce ? 1 : scale,
          opacity: reduce ? 1 : opacity,
          '--scroll-stack-accent': item.accent
        } as CSSProperties
      }
    >
      <span className="scroll-stack-index">{String(index + 1).padStart(2, '0')}</span>
      <div className="scroll-stack-body">
        <h3 className="scroll-stack-title">{item.title}</h3>
        {item.description != null && <p className="scroll-stack-desc">{item.description}</p>}
      </div>
    </motion.div>
  );
}

// A self-contained scrolling column of cards that pin and stack as they reach the
// top. Inspired by the sticky "stacking cards" scroll interaction catalogued on
// designspells (Apple-style pinned card stacks). Each card peeks below the one
// above by `peek` pixels; deeper cards scale down so the stack reads with depth.
export default function ScrollStack({
  items = DEFAULT_ITEMS,
  peek = 22,
  gap = 18,
  cardHeight = 190,
  scaleStep = 0.04,
  minScale = 0.82,
  dim = 0.35,
  height = 460,
  className = '',
  ...rest
}: ScrollStackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollY } = useScroll({ container: ref });
  const total = items.length;
  const tailSpace = Math.max(cardHeight, height - peek * Math.max(0, total - 1));

  return (
    <div {...rest} ref={ref} className={join('scroll-stack', className)} style={{ height, ...rest.style }}>
      <div className="scroll-stack-track">
        {items.map((item, i) => (
          <StackCard
            key={i}
            index={i}
            total={total}
            item={item}
            scrollY={scrollY}
            peek={peek}
            gap={gap}
            cardHeight={cardHeight}
            scaleStep={scaleStep}
            minScale={minScale}
            dim={dim}
            reduce={reduce}
          />
        ))}
        <div className="scroll-stack-tail" style={{ height: tailSpace }} aria-hidden="true" />
      </div>
    </div>
  );
}
