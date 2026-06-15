import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';

const DEFAULT_COLOR = '#ff3b5c';

export interface LikeButtonProps {
  defaultLiked?: boolean;
  count?: number;
  color?: string;
  particleCount?: number;
  size?: number;
  showCount?: boolean;
  className?: string;
}

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

// Even radial spread, with a little distance variation so the burst feels organic.
const buildParticles = (count: number) =>
  Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const distance = 22 + (i % 3) * 7;
    return { id: i, x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
  });

export default function LikeButton({
  defaultLiked = false,
  count = 128,
  color = DEFAULT_COLOR,
  particleCount = 8,
  size = 28,
  showCount = true,
  className = ''
}: LikeButtonProps) {
  const [liked, setLiked] = useState(defaultLiked);
  const [actionId, setActionId] = useState(0);
  const [bursts, setBursts] = useState<number[]>([]);

  const particles = buildParticles(particleCount);
  const displayCount = count + (liked ? 1 : 0);

  const toggle = () => {
    const next = !liked;
    setLiked(next);
    setActionId(a => a + 1);
    if (next) {
      const id = Date.now();
      setBursts(b => [...b, id]);
      window.setTimeout(() => setBursts(b => b.filter(x => x !== id)), 900);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={liked}
      aria-label={liked ? 'Unlike' : 'Like'}
      className={join(
        'inline-flex cursor-pointer items-center gap-2 rounded-lg border-0 bg-transparent p-1 font-sans text-[0.95rem] font-semibold text-gray-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/40',
        className
      )}
    >
      <span className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        {bursts.map(burstId => (
          <span key={burstId} className="pointer-events-none absolute inset-0 block" aria-hidden>
            {particles.map(p => (
              <motion.span
                key={p.id}
                className="absolute left-1/2 top-1/2 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: color }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{ x: p.x, y: p.y, scale: 0, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            ))}
          </span>
        ))}
        <motion.span
          key={actionId}
          className="inline-flex"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 520, damping: 14 }}
        >
          <Heart size={size} strokeWidth={2} color={liked ? color : 'currentColor'} fill={liked ? color : 'transparent'} />
        </motion.span>
      </span>
      {showCount && (
        <span className="[font-variant-numeric:tabular-nums] transition-colors duration-200" style={{ color: liked ? color : undefined }}>
          {displayCount}
        </span>
      )}
    </button>
  );
}
