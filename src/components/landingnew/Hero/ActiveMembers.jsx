import { useEffect, useState } from 'react';
import useActiveMembers from '../../../hooks/useActiveMembers';

const formatter = new Intl.NumberFormat('en-US');

const Digit = ({ value }) => {
  const isComma = value === ',';
  const target = isComma ? null : Number(value);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (target === null) return undefined;
    const id = requestAnimationFrame(() => setShown(target));
    return () => cancelAnimationFrame(id);
  }, [target]);

  if (isComma) {
    return <span className="cb-hero-active-comma">,</span>;
  }

  return (
    <span className="cb-hero-active-digit" aria-hidden="true">
      <span className="cb-hero-active-digit-roll" style={{ transform: `translateY(-${shown}em)` }}>
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i}>{i}</span>
        ))}
      </span>
    </span>
  );
};

const ActiveMembers = () => {
  const { count } = useActiveMembers();
  const formatted = formatter.format(count);
  const chars = formatted.split('');

  return (
    <div className="cb-hero-active" role="status" aria-live="polite">
      <span className="cb-hero-active-number" aria-label={`${formatted} members active today`}>
        {chars.map((c, i) => (
          <Digit key={chars.length - 1 - i} value={c} />
        ))}
      </span>
      <span className="cb-hero-active-label">active today</span>
    </div>
  );
};

export default ActiveMembers;
