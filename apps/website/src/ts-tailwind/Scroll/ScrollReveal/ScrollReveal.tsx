import { Children, useRef, type HTMLAttributes, type ReactNode, type RefObject } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

export type ScrollRevealDirection = 'up' | 'down' | 'left' | 'right' | 'none';

export interface ScrollRevealProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  distance?: number;
  direction?: ScrollRevealDirection;
  blur?: number;
  duration?: number;
  stagger?: number;
  once?: boolean;
  amount?: number;
  height?: number;
  className?: string;
}

const OFFSETS: Record<ScrollRevealDirection, { x: number; y: number }> = {
  up: { x: 0, y: 1 },
  down: { x: 0, y: -1 },
  left: { x: 1, y: 0 },
  right: { x: -1, y: 0 },
  none: { x: 0, y: 0 }
};

const SAMPLE = [
  { eyebrow: 'Plan', title: 'Sketch the shape', body: 'Map the flow before a single pixel goes down.' },
  { eyebrow: 'Draft', title: 'Build the skeleton', body: 'Rough structure first — polish comes later.' },
  { eyebrow: 'Refine', title: 'Tune the details', body: 'Spacing, motion, and copy earn their place.' },
  { eyebrow: 'Review', title: 'Pressure-test it', body: 'Edge cases and empty states get the same care.' },
  { eyebrow: 'Ship', title: 'Send it out', body: 'Done is a feature; perfect is a moving target.' }
];

interface RevealItemProps {
  children: ReactNode;
  root: RefObject<HTMLDivElement>;
  index: number;
  distance: number;
  direction: ScrollRevealDirection;
  blur: number;
  duration: number;
  stagger: number;
  once: boolean;
  amount: number;
  reduce: boolean;
}

function RevealItem({ children, root, index, distance, direction, blur, duration, stagger, once, amount, reduce }: RevealItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { root, once, amount });
  const off = OFFSETS[direction] ?? OFFSETS.up;
  const hidden = { opacity: 0, x: off.x * distance, y: off.y * distance, filter: `blur(${blur}px)` };
  const shown = { opacity: 1, x: 0, y: 0, filter: 'blur(0px)' };

  if (reduce) {
    return (
      <div ref={ref} className="w-full">
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className="w-full"
      initial={hidden}
      animate={inView ? shown : hidden}
      transition={{ duration, delay: inView ? Math.min(index * stagger, 0.4) : 0, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function ScrollReveal({
  children,
  distance = 40,
  direction = 'up',
  blur = 6,
  duration = 0.6,
  stagger = 0.08,
  once = true,
  amount = 0.4,
  height = 460,
  className = '',
  ...rest
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const provided = Children.toArray(children);
  const nodes: ReactNode[] = provided.length
    ? provided
    : SAMPLE.map((s, i) => (
        <article
          className="flex flex-col gap-2 rounded-2xl border border-white/[0.08] bg-[#131318] px-6 py-[22px]"
          key={i}
        >
          <span className="text-xs font-semibold tracking-[0.04em] text-[#7c8cff]">{s.eyebrow}</span>
          <h3 className="m-0 text-xl font-semibold leading-[1.15] tracking-[-0.02em] text-[#fafafa]">{s.title}</h3>
          <p className="m-0 text-sm leading-relaxed text-[#fafafa]/[0.66]">{s.body}</p>
        </article>
      ));

  return (
    <div
      {...rest}
      ref={ref}
      className={join(
        'relative mx-auto w-full max-w-[520px] overflow-y-auto overflow-x-hidden rounded-[18px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
      style={{ height, ...rest.style }}
    >
      <div className="flex flex-col gap-4 px-1 py-2">
        {nodes.map((node, i) => (
          <RevealItem
            key={i}
            root={ref}
            index={i}
            distance={distance}
            direction={direction}
            blur={blur}
            duration={duration}
            stagger={stagger}
            once={once}
            amount={amount}
            reduce={reduce}
          >
            {node}
          </RevealItem>
        ))}
      </div>
    </div>
  );
}
