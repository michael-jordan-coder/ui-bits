import { useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import './ScrollProgress.css';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

export interface ScrollProgressProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
  barColor?: string;
  trackColor?: string;
  barHeight?: number;
  circular?: boolean;
  showPercent?: boolean;
  height?: number;
  className?: string;
}

const SAMPLE = [
  { heading: 'A small idea', body: 'Most good work starts narrow — one clear thought you can hold in your head without notes.' },
  { heading: 'Give it a shape', body: 'Turn the thought into something with edges: a sketch, an outline, a single screen you can point at.' },
  { heading: 'Make it move', body: 'Build the smallest version that actually runs. Friction you can feel beats a plan you can only imagine.' },
  { heading: 'Cut what drifts', body: 'Anything that does not earn its place gets removed. The shape gets sharper every time you subtract.' },
  { heading: 'Hand it over', body: 'Ship it to one real person and watch. Their first ten seconds tell you more than a week of guessing.' }
];

// A self-contained reading panel with a sticky progress rail and an optional
// circular percentage dial, both driven by the container's scroll progress.
// Inspired by the reading-progress indicators catalogued on designspells. Pass
// your own children, or it renders a short sample article so the bar has travel.
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
}: ScrollProgressProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [percent, setPercent] = useState(0);
  const { scrollYProgress } = useScroll({ container: ref });
  useMotionValueEvent(scrollYProgress, 'change', v => setPercent(Math.round(v * 100)));

  const content =
    children != null
      ? children
      : SAMPLE.map((s, i) => (
          <section className="scroll-progress-block" key={i}>
            <h3 className="scroll-progress-heading">{s.heading}</h3>
            <p className="scroll-progress-text">{s.body}</p>
          </section>
        ));

  return (
    <div {...rest} ref={ref} className={join('scroll-progress', className)} style={{ height, ...rest.style }}>
      <div className="scroll-progress-rail" style={{ height: barHeight, background: trackColor }}>
        <motion.div className="scroll-progress-fill" style={{ scaleX: scrollYProgress, background: barColor }} />
      </div>

      {circular && (
        <div className="scroll-progress-ring" aria-hidden="true">
          <svg viewBox="0 0 44 44" width="44" height="44">
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
          {showPercent && <span className="scroll-progress-percent">{percent}%</span>}
        </div>
      )}

      <div className="scroll-progress-content">{content}</div>
    </div>
  );
}
