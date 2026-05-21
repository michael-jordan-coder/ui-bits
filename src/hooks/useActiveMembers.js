import { useEffect, useState } from 'react';

const computeDummyCount = (now = new Date()) => {
  const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) >>> 0;
  }
  const dailyFloor = 90 + (hash % 80);
  const hourProgress = now.getHours() + now.getMinutes() / 60;
  const accumulated = Math.round(hourProgress * 6);
  return dailyFloor + accumulated;
};

const useActiveMembers = () => {
  const [count, setCount] = useState(() => computeDummyCount());

  useEffect(() => {
    const id = setInterval(() => setCount(computeDummyCount()), 60_000);
    return () => clearInterval(id);
  }, []);

  return { count };
};

export default useActiveMembers;
