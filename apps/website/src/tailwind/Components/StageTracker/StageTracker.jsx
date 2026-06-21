import { motion, useReducedMotion } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';

const DEFAULT_ACCENT = '#6366f1';
const TRACK = 'rgba(255,255,255,0.12)';

const DEFAULT_STAGES = [
  { label: 'Connect source' },
  { label: 'Import data' },
  { label: 'Map fields' },
  { label: 'Finish up' }
];

const join = (...classes) => classes.filter(Boolean).join(' ');

const stateForIndex = (index, activeIndex) => {
  if (index < activeIndex) return 'complete';
  if (index === activeIndex) return 'active';
  return 'pending';
};

const KEYFRAMES = `
@keyframes stage-tracker-flow-v { 0% { background-position: 50% -110%; } 100% { background-position: 50% 210%; } }
@keyframes stage-tracker-flow-h { 0% { background-position: -110% 50%; } 100% { background-position: 210% 50%; } }
`;

// A multi-stage progress tracker for sequential processes (imports, onboarding,
// multi-step jobs). Each stage is a node with a connector to the next; the
// connector flowing out of the active stage animates a shimmer to signal work in
// progress, and a just-completed node pops to a check. Purely controlled by
// activeIndex — no internal timer. Inspired by Linear's import-assistant indicator.
export default function StageTracker({
  stages = DEFAULT_STAGES,
  activeIndex = 1,
  orientation = 'vertical',
  accent = DEFAULT_ACCENT,
  showDescriptions = true,
  animateConnector = true,
  className = ''
}) {
  const prefersReduced = useReducedMotion();
  const isHorizontal = orientation === 'horizontal';

  return (
    <ol
      className={join(
        'm-0 flex list-none p-0 font-sans',
        isHorizontal ? 'flex-row items-start' : 'flex-col',
        className
      )}
      aria-label="Progress"
    >
      <style>{KEYFRAMES}</style>
      {stages.map((stage, index) => {
        const state = stateForIndex(index, activeIndex);
        const isLast = index === stages.length - 1;
        const connectorFilled = index < activeIndex;
        const connectorActive = index === activeIndex && !isLast && animateConnector && !prefersReduced;

        return (
          <li
            key={index}
            className={join(
              'relative flex',
              isHorizontal ? 'min-w-0 flex-1 flex-col gap-2.5' : 'flex-row gap-3.5'
            )}
            aria-current={state === 'active' ? 'step' : undefined}
            aria-label={
              state === 'complete'
                ? `Completed: ${stage.label}`
                : state === 'active'
                  ? `In progress: ${stage.label}`
                  : `Pending: ${stage.label}`
            }
          >
            <div className={join('flex flex-shrink-0 items-center', isHorizontal ? 'w-full flex-row' : 'flex-col')}>
              <span
                className="relative box-border inline-flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200"
                style={{
                  borderColor: state === 'pending' ? TRACK : accent,
                  backgroundColor: state === 'complete' ? accent : 'transparent',
                  color: state === 'complete' ? '#fff' : state === 'active' ? accent : '#9ca3af'
                }}
              >
                {state === 'complete' && (
                  <motion.span
                    className="inline-flex items-center justify-center"
                    initial={prefersReduced ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 16 }}
                  >
                    <Check size={14} strokeWidth={3} aria-hidden="true" />
                  </motion.span>
                )}
                {state === 'active' && (
                  <span className="inline-flex items-center justify-center" style={{ color: accent }} aria-hidden="true">
                    {prefersReduced ? (
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
                    ) : (
                      <Loader2 className="animate-spin" size={16} strokeWidth={2.5} />
                    )}
                  </span>
                )}
                {state === 'pending' && (
                  <span className="text-xs font-semibold leading-none text-gray-500 [font-variant-numeric:tabular-nums]">
                    {index + 1}
                  </span>
                )}
              </span>

              {!isLast && (
                <span
                  className={join(
                    'relative overflow-hidden rounded-full',
                    isHorizontal ? 'mx-2 h-0.5 min-w-[20px] flex-1' : 'my-1 min-h-[20px] w-0.5 flex-1'
                  )}
                  style={{ backgroundColor: TRACK }}
                >
                  <span
                    className="absolute inset-0"
                    style={
                      connectorActive
                        ? {
                            background: isHorizontal
                              ? `linear-gradient(90deg, transparent 0%, ${accent} 45%, ${accent} 55%, transparent 100%)`
                              : `linear-gradient(180deg, transparent 0%, ${accent} 45%, ${accent} 55%, transparent 100%)`,
                            backgroundSize: isHorizontal ? '220% 100%' : '100% 220%',
                            animation: `${isHorizontal ? 'stage-tracker-flow-h' : 'stage-tracker-flow-v'} 1.4s ease-in-out infinite`
                          }
                        : {
                            backgroundColor: accent,
                            transformOrigin: isHorizontal ? 'left center' : 'top center',
                            transform: connectorFilled
                              ? 'none'
                              : isHorizontal
                                ? 'scaleX(0)'
                                : 'scaleY(0)',
                            transition: prefersReduced ? 'none' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                          }
                    }
                  />
                </span>
              )}
            </div>

            <div
              className={join(
                'flex min-w-0 flex-col gap-0.5',
                !isHorizontal && (isLast ? 'pt-1' : 'pb-5 pt-1')
              )}
            >
              <span
                className="text-[0.9rem] font-semibold leading-tight transition-colors duration-200"
                style={{ color: state === 'pending' ? '#9ca3af' : '#e5e7eb' }}
              >
                {stage.label}
              </span>
              {showDescriptions && stage.description && (
                <span className="text-[0.8rem] leading-snug text-gray-500">{stage.description}</span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
