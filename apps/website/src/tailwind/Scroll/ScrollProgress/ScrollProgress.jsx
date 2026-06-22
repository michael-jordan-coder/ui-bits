import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';

const join = (...classes) => classes.filter(Boolean).join(' ');

const SAMPLE = [
  { heading: 'A small idea', body: 'Most good work starts narrow — one clear thought you can hold in your head without notes.' },
  { heading: 'Give it a shape', body: 'Turn the thought into something with edges: a sketch, an outline, a single screen you can point at.' },
  { heading: 'Make it move', body: 'Build the smallest version that actually runs. Friction you can feel beats a plan you can only imagine.' },
  { heading: 'Cut what drifts', body: 'Anything that does not earn its place gets removed. The shape gets sharper every time you subtract.' },
  { heading: 'Hand it over', body: 'Ship it to one real person and watch. Their first ten seconds tell you more than a week of guessing.' }
];

export default function ScrollProgress({
  children,
  barColor = '#5227FF',
  trackColor = 'rgba(255, 255, 255, 0.1)',
  barHeight = 4,
  circular = true,
  showPercent = true,
  height = 460,
  className = '',
  ...rest
}) {
  const ref = useRef(null);
  const [percent, setPercent] = useState(0);
  const { scrollYProgress } = useScroll({ container: ref });
  useMotionValueEvent(scrollYProgress, 'change', v => setPercent(Math.round(v * 100)));

  const content =
    children != null
      ? children
      : SAMPLE.map((s, i) => (
          <section className="flex flex-col gap-2" key={i}>
            <h3 className="m-0 text-[22px] font-semibold leading-[1.15] tracking-[-0.02em] text-[#fafafa]">
              {s.heading}
            </h3>
            <p className="m-0 text-[15px] leading-[1.6] text-[#fafafa]/[0.66]">{s.body}</p>
          </section>
        ));

  return (
    <div
      {...rest}
      ref={ref}
      className={join(
        'relative mx-auto w-full max-w-[560px] overflow-y-auto overflow-x-hidden rounded-[18px] bg-[#08080c] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className
      )}
      style={{ height, ...rest.style }}
    >
      <div
        className="sticky top-0 z-[2] w-full overflow-hidden"
        style={{ height: barHeight, background: trackColor }}
      >
        <motion.div
          className="h-full w-full origin-left"
          style={{ scaleX: scrollYProgress, background: barColor }}
        />
      </div>

      {circular && (
        <div
          className="sticky top-[18px] z-[2] mt-[14px] mr-[18px] ml-auto grid h-11 w-11 place-items-center"
          aria-hidden="true"
        >
          <svg viewBox="0 0 44 44" width="44" height="44" className="absolute inset-0">
            <circle cx="22" cy="22" r="19" fill="none" stroke={trackColor} strokeWidth="4" />
            <motion.circle
              cx="22"
              cy="22"
              r="19"
              fill="none"
              stroke={barColor}
              strokeWidth="4"
              strokeLinecap="round"
              transform="rotate(-90 22 22)"
              style={{ pathLength: scrollYProgress }}
            />
          </svg>
          {showPercent && (
            <span className="text-[11px] font-semibold tabular-nums tracking-tight text-[#fafafa]">{percent}%</span>
          )}
        </div>
      )}

      <div className="-mt-[22px] flex flex-col gap-[22px] px-7 pb-8 pt-1">{content}</div>
    </div>
  );
}
