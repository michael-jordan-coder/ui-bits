import { useRef, useState, useEffect, useCallback } from 'react';
import { useReducedMotion } from 'motion/react';

const join = (...classes) => classes.filter(Boolean).join(' ');

// Flat, accent-tinted fill for panel `index`: each panel mixes the base accent
// down toward the dark base by a decreasing amount, so the rail reads as one
// hue family deepening panel to panel rather than a random palette.
function panelFill(accent, index) {
  return `color-mix(in oklch, ${accent} ${Math.max(20, 78 - index * 9)}%, #0e0e10)`;
}

// A vertical scroll-snap pager. The internal container snaps between full-height
// panels; a fixed dot rail on the right tracks and jumps to the active panel.
// Self-contained — it owns its own scroll container, so it never hijacks the
// page. Reduced-motion users still get snapping (CSS), just without animated
// indicator transitions or smooth-scrolled jumps.
export default function ScrollSnap({ panels = 4, accent = '#3ecf8e', height = 460, className = '', ...rest }) {
  const containerRef = useRef(null);
  const panelRefs = useRef([]);
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState(0);

  const total = Math.max(1, Math.floor(panels));
  panelRefs.current = panelRefs.current.slice(0, total);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(Number(entry.target.dataset.index));
          }
        }
      },
      { root, threshold: 0.6 }
    );

    for (const panel of panelRefs.current) {
      if (panel) observer.observe(panel);
    }

    return () => observer.disconnect();
  }, [total]);

  const goTo = useCallback(
    index => {
      const panel = panelRefs.current[index];
      if (!panel) return;
      panel.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    },
    [reduce]
  );

  return (
    <div
      {...rest}
      className={join('relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[18px]', className)}
      style={{ height, ...rest.style }}
    >
      <div
        ref={containerRef}
        className="h-full overflow-x-hidden overflow-y-auto [container-type:inline-size] [-ms-overflow-style:none] [scrollbar-width:none] [scroll-snap-type:y_mandatory] [&::-webkit-scrollbar]:hidden"
      >
        {Array.from({ length: total }, (_, i) => (
          <section
            key={i}
            data-index={i}
            ref={el => {
              panelRefs.current[i] = el;
            }}
            className="box-border flex h-full flex-col items-start justify-end gap-1.5 p-[clamp(20px,6%,36px)] text-[#fafafa] [scroll-snap-align:start] [scroll-snap-stop:always]"
            style={{ background: panelFill(accent, i % 6) }}
          >
            <span className="text-[12px] font-medium tracking-[0.04em] text-[#fafafa]/70">{`Panel ${String(i + 1).padStart(2, '0')}`}</span>
            <h3 className="m-0 text-[clamp(26px,6cqi,34px)] font-semibold leading-[1.15] tracking-[-0.02em]">
              Section {i + 1}
            </h3>
            <p className="m-0 max-w-[34ch] text-[14px] leading-[1.5] text-[#fafafa]/[0.78]">
              Scroll or tap a dot to snap between panels.
            </p>
          </section>
        ))}
      </div>

      <div
        role="tablist"
        aria-label="Panels"
        aria-orientation="vertical"
        className="absolute right-[14px] top-1/2 flex -translate-y-1/2 flex-col gap-2.5 rounded-full bg-[#0e0e10]/[0.32] p-[8px_6px] [backdrop-filter:blur(6px)]"
      >
        {Array.from({ length: total }, (_, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-label={`Go to panel ${i + 1}`}
              aria-current={isActive ? 'true' : undefined}
              aria-selected={isActive}
              className={join(
                'w-[9px] cursor-pointer rounded-full border-none p-0 outline-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:[outline-color:var(--scroll-snap-accent)]',
                reduce ? 'transition-none' : 'transition-[transform,background-color,height] duration-200 ease-out',
                isActive ? 'h-[22px]' : 'h-[9px] bg-[#fafafa]/[0.42] hover:bg-[#fafafa]/[0.72]'
              )}
              style={{
                '--scroll-snap-accent': accent,
                background: isActive ? accent : undefined
              }}
              onClick={() => goTo(i)}
            />
          );
        })}
      </div>
    </div>
  );
}
