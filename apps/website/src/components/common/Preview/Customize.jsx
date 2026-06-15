import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import useIsMobile from '../../../hooks/useIsMobile';

const CustomizePanel = ({ children }) => (
  <div className="customize-panel">
    <h2 className="customize-panel-title">Customize</h2>
    <div className="customize-panel-body">{children}</div>
  </div>
);

// Desktop: portal the controls into the right shell panel (#customize-slot).
const DesktopCustomize = ({ children }) => {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    setTarget(document.getElementById('customize-slot'));
  }, []);

  if (!target) return null;
  return createPortal(<CustomizePanel>{children}</CustomizePanel>, target);
};

// Mobile: a floating trigger that opens a bottom-sheet drawer with the controls.
const MobileCustomize = ({ children }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    document.body.classList.add('mobile-sheet-open');
    const onKey = event => event.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.classList.remove('mobile-sheet-open');
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="customize-fab"
        onClick={() => setOpen(true)}
        aria-label="Customize component"
      >
        <SlidersHorizontal size={16} strokeWidth={1.75} />
        <span>Customize</span>
      </button>

      {createPortal(
        <div className={`customize-sheet${open ? ' customize-sheet--open' : ''}`} aria-hidden={!open}>
          <div className="customize-sheet-backdrop" onClick={() => setOpen(false)} />
          <div className="customize-sheet-panel" role="dialog" aria-label="Customize component">
            <div className="customize-sheet-handle" aria-hidden="true" />
            <div className="customize-sheet-header">
              <h2 className="customize-panel-title">Customize</h2>
              <button
                type="button"
                className="customize-sheet-close"
                onClick={() => setOpen(false)}
                aria-label="Close customize"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>
            <div className="customize-sheet-body">{children}</div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

const Customize = ({ children }) => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileCustomize>{children}</MobileCustomize> : <DesktopCustomize>{children}</DesktopCustomize>;
};

export default Customize;
