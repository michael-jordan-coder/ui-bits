import { useEffect, useState } from 'react';

const MOBILE_QUERY = '(max-width: 960px)';

/**
 * Single source of truth for "are we on a mobile-sized viewport".
 * Drives every JS-level mobile branch so that, above the breakpoint,
 * components render exactly as they did before any mobile work.
 */
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia(MOBILE_QUERY).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const mql = window.matchMedia(MOBILE_QUERY);
    const onChange = event => setIsMobile(event.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return isMobile;
};

export default useIsMobile;
