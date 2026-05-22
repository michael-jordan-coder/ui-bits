const Logo = ({ size = 24, strokeWidth = 1, dotRadius = 1.1, className, ariaLabel = 'ui bits' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-label={ariaLabel}
    className={className}
  >
    <g transform="rotate(-12 12 12)">
      <rect x="1" y="9" width="22" height="6" rx="3" />
      <rect x="1" y="9" width="22" height="6" rx="3" transform="rotate(60 12 12)" />
      <rect x="1" y="9" width="22" height="6" rx="3" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r={dotRadius} fill="currentColor" stroke="none" />
    </g>
  </svg>
);

export default Logo;
