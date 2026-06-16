import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Eye, EyeOff } from 'lucide-react';

const join = (...classes: (string | false | undefined)[]) => classes.filter(Boolean).join(' ');

export interface PeekPasswordProps {
  emailPlaceholder?: string;
  passwordPlaceholder?: string;
  accentColor?: string;
  mascotColor?: string;
  size?: number;
  width?: number;
  onEmailChange?: (value: string) => void;
  onPasswordChange?: (value: string) => void;
  className?: string;
}

// Soften a hex color into an rgba glow without pulling in a color dependency.
const withAlpha = (color: string, alpha: number) => {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(color);
  if (!match) return color;
  let hex = match[1];
  if (hex.length === 3)
    hex = hex
      .split('')
      .map(c => c + c)
      .join('');
  const n = parseInt(hex, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

// A login pair guarded by a mascot: its eyes follow the caret while you type the
// email, then its paws rise to cover its eyes the moment the password field is
// focused — and part to peek when you reveal the password. Inspired by the
// TunnelBear sign-in bear documented on designspells.com.
export default function PeekPassword({
  emailPlaceholder = 'you@example.com',
  passwordPlaceholder = 'Password',
  accentColor = '#5b8def',
  mascotColor = '#a9744f',
  size = 104,
  width = 300,
  onEmailChange,
  onPasswordChange,
  className = '',
  ...rest
}: PeekPasswordProps) {
  const prefersReduced = useReducedMotion();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusField, setFocusField] = useState<'email' | 'password' | null>(null);
  const [pupil, setPupil] = useState<{ x: number; y: number }>({ x: 0, y: size * 0.02 });

  const passwordFocused = focusField === 'password';
  const pawY = passwordFocused ? (showPassword ? size * 0.16 : 0) : size * 0.5;

  const pawTransition = prefersReduced ? { duration: 0 } : ({ type: 'spring', stiffness: 320, damping: 30 } as const);
  const pupilTransition = prefersReduced
    ? { duration: 0 }
    : ({ type: 'spring', stiffness: 500, damping: 30 } as const);

  // Aim the pupils along the email as the caret moves; idle gaze rests forward.
  const trackCaret = (e: React.SyntheticEvent<HTMLInputElement>) => {
    if (prefersReduced) return;
    const el = e.currentTarget;
    const len = el.value.length;
    const caret = el.selectionStart ?? len;
    const ratio = len ? caret / len : 0.5;
    const max = size * 0.045;
    setPupil({ x: len === 0 ? 0 : (ratio - 0.5) * 2 * max, y: size * 0.03 });
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    onEmailChange?.(e.target.value);
    trackCaret(e);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    onPasswordChange?.(e.target.value);
  };

  return (
    <div className={join('inline-flex flex-col items-center gap-5 text-white', className)} {...rest}>
      <div className="relative flex-none" style={{ width: size, height: size }} aria-hidden="true">
        <div className="absolute top-[-8%] h-[30%] w-[30%] rounded-full" style={{ background: mascotColor, left: '4%' }} />
        <div className="absolute top-[-8%] h-[30%] w-[30%] rounded-full" style={{ background: mascotColor, right: '4%' }} />
        <div
          className="absolute inset-0 [border-radius:48%_48%_46%_46%/52%_52%_48%_48%]"
          style={{ background: mascotColor, boxShadow: `0 18px 36px -18px ${withAlpha(mascotColor, 0.7)}` }}
        />

        <div className="absolute top-[33%] grid h-[23%] w-[20%] place-items-center overflow-hidden rounded-full bg-white" style={{ left: '26%' }}>
          <motion.div
            className="h-[52%] w-[52%] rounded-full bg-[#2b2b2b] will-change-transform"
            animate={{ x: pupil.x, y: pupil.y }}
            transition={pupilTransition}
          />
        </div>
        <div className="absolute top-[33%] grid h-[23%] w-[20%] place-items-center overflow-hidden rounded-full bg-white" style={{ right: '26%' }}>
          <motion.div
            className="h-[52%] w-[52%] rounded-full bg-[#2b2b2b] will-change-transform"
            animate={{ x: pupil.x, y: pupil.y }}
            transition={pupilTransition}
          />
        </div>

        <div className="absolute bottom-[11%] left-[28%] h-[33%] w-[44%] rounded-full bg-white/85">
          <div className="absolute left-[35%] top-[14%] h-[24%] w-[30%] rounded-full bg-[#3a2a22]" />
        </div>

        <motion.div
          className="pointer-events-none absolute inset-0 will-change-transform"
          animate={{ y: pawY }}
          transition={pawTransition}
        >
          <div
            className="absolute top-[30%] h-[30%] w-[33%] [border-radius:50%_50%_46%_46%/58%_58%_42%_42%]"
            style={{ left: '20%', background: mascotColor, boxShadow: '0 3px 8px rgba(0, 0, 0, 0.25)' }}
          />
          <div
            className="absolute top-[30%] h-[30%] w-[33%] [border-radius:50%_50%_46%_46%/58%_58%_42%_42%]"
            style={{ right: '20%', background: mascotColor, boxShadow: '0 3px 8px rgba(0, 0, 0, 0.25)' }}
          />
        </motion.div>
      </div>

      <div className="flex flex-col gap-[0.6rem]" style={{ width }}>
        <div className="relative w-full">
          <input
            className="box-border w-full rounded-xl border-[1.5px] bg-white/5 px-[0.9rem] py-[0.7rem] font-[inherit] text-[0.95rem] text-white outline-none transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-white/40"
            type="email"
            autoComplete="email"
            aria-label="Email"
            placeholder={emailPlaceholder}
            value={email}
            onChange={handleEmail}
            onSelect={trackCaret}
            onKeyUp={trackCaret}
            onClick={trackCaret}
            onFocus={e => {
              setFocusField('email');
              trackCaret(e);
            }}
            onBlur={() => {
              setFocusField(null);
              setPupil({ x: 0, y: size * 0.02 });
            }}
            style={{
              borderColor: focusField === 'email' ? accentColor : 'rgba(255, 255, 255, 0.14)',
              boxShadow: focusField === 'email' ? `0 0 0 3px ${withAlpha(accentColor, 0.3)}` : 'none'
            }}
          />
        </div>

        <div className="relative w-full">
          <input
            className="box-border w-full rounded-xl border-[1.5px] bg-white/5 py-[0.7rem] pl-[0.9rem] pr-[2.6rem] font-[inherit] text-[0.95rem] text-white outline-none transition-[border-color,box-shadow] duration-150 ease-out placeholder:text-white/40"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            aria-label="Password"
            placeholder={passwordPlaceholder}
            value={password}
            onChange={handlePassword}
            onFocus={() => setFocusField('password')}
            onBlur={() => setFocusField(null)}
            style={{
              borderColor: focusField === 'password' ? accentColor : 'rgba(255, 255, 255, 0.14)',
              boxShadow: focusField === 'password' ? `0 0 0 3px ${withAlpha(accentColor, 0.3)}` : 'none'
            }}
          />
          <button
            type="button"
            className="absolute right-[0.55rem] top-1/2 grid h-[1.9rem] w-[1.9rem] -translate-y-1/2 cursor-pointer place-items-center rounded-lg border-none bg-none p-0 text-white/60 outline-none hover:text-white focus-visible:shadow-[0_0_0_2px_rgba(255,255,255,0.45)]"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            onMouseDown={e => e.preventDefault()}
            onClick={() => setShowPassword(s => !s)}
          >
            {showPassword ? <EyeOff size={18} strokeWidth={1.8} /> : <Eye size={18} strokeWidth={1.8} />}
          </button>
        </div>
      </div>
    </div>
  );
}
