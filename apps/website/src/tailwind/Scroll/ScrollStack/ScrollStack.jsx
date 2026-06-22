import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';

const join = (...classes) => classes.filter(Boolean).join(' ');

const DEFAULT_ITEMS = [
  { title: 'Capture', description: 'Drop any idea in and keep moving — sorting can wait.', accent: '#5227FF' },
  { title: 'Organize', description: 'Group related thoughts so the shape of the work appears.', accent: '#0EA5E9' },
  { title: 'Refine', description: 'Trim the noise until only the decisions remain.', accent: '#10B981' },
  { title: 'Ship', description: 'Hand it off with everything it needs to stand on its own.', accent: '#F59E0B' },
  { title: 'Reflect', description: 'Look back at what worked and feed it into the next pass.', accent: '#EF4444' }
];

function StackCard({ index, total, item, scrollY, peek, gap, cardHeight, scaleStep, minScale, dim, reduce }) {
  const stride = cardHeight + gap;
  const pinTop = peek * index;
  const pinStart = index * stride - pinTop;
  const range = stride * 2.5;
  const depthScale = Math.max(minScale, 1 - scaleStep * (total - 1 - index) * 2);

  const scale = useTransform(scrollY, [pinStart, pinStart + range], [1, depthScale], { clamp: true });
  const opacity = useTransform(scrollY, [pinStart, pinStart + range], [1, 1 - dim], { clamp: true });

  return (
    <motion.div
      className="sticky mb-[18px] box-border flex items-start gap-[18px] rounded-2xl px-[26px] py-6 text-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.65)] [transform-origin:50%_0%] [will-change:transform,opacity]"
      style={{
        top: pinTop,
        height: cardHeight,
        zIndex: index,
        background: item.accent,
        scale: reduce ? 1 : scale,
        opacity: reduce ? 1 : opacity
      }}
    >
      <span className="shrink-0 rounded-full bg-white/15 px-2.5 py-1 text-[13px] font-semibold tabular-nums tracking-tight text-white/90">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="flex min-w-0 flex-col gap-2">
        <h3 className="m-0 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em]">{item.title}</h3>
        {item.description != null && <p className="m-0 text-sm leading-relaxed text-white/80">{item.description}</p>}
      </div>
    </motion.div>
  );
}

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
}) {
  const ref = useRef(null);
  const reduce = !!useReducedMotion();
  const { scrollY } = useScroll({ container: ref });
  const total = items.length;
  const tailSpace = Math.max(cardHeight, height - peek * Math.max(0, total - 1));

  return (
    <div
      {...rest}
      ref={ref}
      className={join(
        'relative mx-auto w-full max-w-[540px] overflow-y-auto overflow-x-hidden rounded-[18px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
      style={{ height, ...rest.style }}
    >
      <div className="relative flex flex-col px-1">
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
        <div className="shrink-0" style={{ height: tailSpace }} aria-hidden="true" />
      </div>
    </div>
  );
}
