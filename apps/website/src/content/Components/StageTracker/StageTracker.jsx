import { motion, useReducedMotion } from 'motion/react';
import { Check, Loader2 } from 'lucide-react';
import './StageTracker.css';

const DEFAULT_ACCENT = '#6366f1';

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

  return (
    <ol
      className={join('stage-tracker', `stage-tracker--${orientation}`, className)}
      aria-label="Progress"
      style={{ '--stage-accent': accent }}
    >
      {stages.map((stage, index) => {
        const state = stateForIndex(index, activeIndex);
        const isLast = index === stages.length - 1;
        // The connector leaving a node is "filled" once that node is complete;
        // the active node's outgoing connector shows the moving fill.
        const connectorFilled = index < activeIndex;
        const connectorActive = index === activeIndex && !isLast;

        return (
          <li
            key={index}
            className={join('stage-tracker__item', `is-${state}`)}
            aria-current={state === 'active' ? 'step' : undefined}
            aria-label={
              state === 'complete'
                ? `Completed: ${stage.label}`
                : state === 'active'
                  ? `In progress: ${stage.label}`
                  : `Pending: ${stage.label}`
            }
          >
            <div className="stage-tracker__rail">
              <span className="stage-tracker__node">
                {state === 'complete' && (
                  <motion.span
                    className="stage-tracker__node-fill"
                    initial={prefersReduced ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={prefersReduced ? { duration: 0 } : { type: 'spring', stiffness: 520, damping: 16 }}
                  >
                    <Check size={14} strokeWidth={3} aria-hidden="true" />
                  </motion.span>
                )}
                {state === 'active' && (
                  <span className="stage-tracker__node-active" aria-hidden="true">
                    {prefersReduced ? (
                      <span className="stage-tracker__node-ring" />
                    ) : (
                      <Loader2 className="stage-tracker__spinner" size={16} strokeWidth={2.5} />
                    )}
                  </span>
                )}
                {state === 'pending' && <span className="stage-tracker__node-index">{index + 1}</span>}
              </span>

              {!isLast && (
                <span
                  className={join(
                    'stage-tracker__connector',
                    connectorFilled && 'is-filled',
                    connectorActive && animateConnector && !prefersReduced && 'is-animated'
                  )}
                >
                  <span className="stage-tracker__connector-fill" />
                </span>
              )}
            </div>

            <div className="stage-tracker__content">
              <span className="stage-tracker__label">{stage.label}</span>
              {showDescriptions && stage.description && (
                <span className="stage-tracker__description">{stage.description}</span>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
