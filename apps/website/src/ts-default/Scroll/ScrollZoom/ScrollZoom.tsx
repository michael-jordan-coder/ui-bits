import { useRef, type HTMLAttributes } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import './ScrollZoom.css';

const join = (...classes: Array<string | false | undefined>) => classes.filter(Boolean).join(' ');

// A scroll-driven panel that zooms into place and holds: as you scroll the inner
// track, a centered panel scales up from `from` to 1 and fades in, bound to the
// container's scroll progress, then sits pinned at full size before the track
// ends. A faint surrounding frame counter-fades as the panel arrives.
// Self-contained — it owns an internal scroll container, so it works anywhere
// without a page-level scroll rig. Reduced-motion users get the settled panel
// with no movement.
export interface ScrollZoomProps extends HTMLAttributes<HTMLDivElement> {
  height?: number;
  from?: number;
  accent?: string;
  className?: string;
}

export default function ScrollZoom({ height = 460, from = 0.6, accent = '#3ecf8e', className = '', ...rest }: ScrollZoomProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ container: ref });

  // Panel zooms and fades over the first ~70% of the track, then holds pinned.
  const scale = useTransform(scrollYProgress, [0, 0.7], [from, 1], { clamp: true });
  const opacity = useTransform(scrollYProgress, [0, 0.55], [0.4, 1], { clamp: true });
  // Surrounding frame fades out as the panel fills the stage.
  const frameOpacity = useTransform(scrollYProgress, [0, 0.7], [0.5, 0], { clamp: true });

  return (
    <div {...rest} ref={ref} className={join('scroll-zoom', className)} style={{ height, ...rest.style }}>
      <div className="scroll-zoom-track" style={{ height: height * 2.4 }}>
        <div className="scroll-zoom-stage" style={{ height }}>
          <motion.div
            className="scroll-zoom-frame"
            style={{ borderColor: accent, opacity: reduce ? 0 : frameOpacity }}
          />
          <motion.div
            className="scroll-zoom-panel"
            style={{
              background: `linear-gradient(135deg, ${accent} 0%, #1c1f26 100%)`,
              scale: reduce ? 1 : scale,
              opacity: reduce ? 1 : opacity
            }}
          >
            <span className="scroll-zoom-caption">Scroll to zoom in</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
