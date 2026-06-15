import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart } from 'lucide-react';
import './LikeButton.css';

const DEFAULT_COLOR = '#ff3b5c';

const join = (...classes) => classes.filter(Boolean).join(' ');

// Particle geometry is tuned for the default 28px icon and scales from there.
const BASE_SIZE = 28;
const BASE_PARTICLE = 6;

// Even radial spread, with a little distance variation so the burst feels organic.
const buildParticles = (count, scale) =>
  Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2;
    const distance = (22 + (i % 3) * 7) * scale;
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
}) {
  const [liked, setLiked] = useState(defaultLiked);
  const [actionId, setActionId] = useState(0);
  const [bursts, setBursts] = useState([]);

  const scale = size / BASE_SIZE;
  const particleSize = BASE_PARTICLE * scale;
  const particles = buildParticles(particleCount, scale);
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
      className={join('like-button', liked && 'is-liked', className)}
    >
      <span className="like-button__icon" style={{ width: size, height: size }}>
        {bursts.map(burstId => (
          <span key={burstId} className="like-button__burst" aria-hidden>
            {particles.map(p => (
              <motion.span
                key={p.id}
                className="like-button__particle"
                style={{
                  backgroundColor: color,
                  width: particleSize,
                  height: particleSize,
                  margin: `${-particleSize / 2}px 0 0 ${-particleSize / 2}px`
                }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{ x: p.x, y: p.y, scale: 0, opacity: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            ))}
          </span>
        ))}
        <motion.span
          key={actionId}
          className="like-button__heart"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 520, damping: 14 }}
        >
          <Heart size={size} strokeWidth={2} color={liked ? color : 'currentColor'} fill={liked ? color : 'transparent'} />
        </motion.span>
      </span>
      {showCount && (
        <span className="like-button__count" style={{ color: liked ? color : undefined }}>
          {displayCount}
        </span>
      )}
    </button>
  );
}
