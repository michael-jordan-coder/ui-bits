import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const Customize = ({ children }) => {
  const [target, setTarget] = useState(null);

  useEffect(() => {
    setTarget(document.getElementById('customize-slot'));
  }, []);

  const content = (
    <div className="customize-panel">
      <h2 className="customize-panel-title">Customize</h2>
      <div className="customize-panel-body">{children}</div>
    </div>
  );

  if (!target) return null;
  return createPortal(content, target);
};

export default Customize;
