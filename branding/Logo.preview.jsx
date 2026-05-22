const Logo = ({ size = 24, strokeWidth = 1, dotRadius = 1.1 }) => (
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
    aria-label="ui bits"
  >
    <g transform="rotate(-12 12 12)">
      <rect x="1" y="9" width="22" height="6" rx="3" />
      <rect x="1" y="9" width="22" height="6" rx="3" transform="rotate(60 12 12)" />
      <rect x="1" y="9" width="22" height="6" rx="3" transform="rotate(120 12 12)" />
      <circle cx="12" cy="12" r={dotRadius} fill="currentColor" stroke="none" />
    </g>
  </svg>
);

const SIZES = [16, 24, 48, 128, 512];

const CONTEXTS = [
  { label: 'On dark', bg: '#0a0a0a', fg: '#fafafa' },
  { label: 'On light', bg: '#ffffff', fg: '#0a0a0a' }
];

const LogoPreview = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 32,
      padding: 48,
      fontFamily: "'Geist', system-ui, sans-serif",
      background: '#161616',
      minHeight: '100vh'
    }}
  >
    <header>
      <h1 style={{ margin: 0, fontSize: 18, color: '#fafafa', fontWeight: 600 }}>ui bits — logo preview</h1>
      <p style={{ margin: '6px 0 0', fontSize: 13, color: '#a3a3a3' }}>
        Rendered at five sizes on light and dark surfaces. Mark uses currentColor.
      </p>
    </header>

    {CONTEXTS.map(ctx => (
      <section key={ctx.label}>
        <div style={{ marginBottom: 10, fontSize: 12, color: '#a3a3a3', letterSpacing: 0.4 }}>
          {ctx.label}
        </div>
        <div
          style={{
            background: ctx.bg,
            color: ctx.fg,
            padding: 40,
            borderRadius: 14,
            border: '1px solid #262626',
            display: 'flex',
            alignItems: 'flex-end',
            gap: 48,
            flexWrap: 'wrap'
          }}
        >
          {SIZES.map(s => (
            <div key={s} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
              <Logo size={s} strokeWidth={s <= 16 ? 1.4 : 1} dotRadius={s <= 16 ? 1.3 : 1.1} />
              <span style={{ fontSize: 11, color: ctx.fg, opacity: 0.55 }}>{s}px</span>
            </div>
          ))}
        </div>
      </section>
    ))}

    <section>
      <div style={{ marginBottom: 10, fontSize: 12, color: '#a3a3a3', letterSpacing: 0.4 }}>
        Lockup with wordmark
      </div>
      <div
        style={{
          background: '#0a0a0a',
          color: '#fafafa',
          padding: 32,
          borderRadius: 14,
          border: '1px solid #262626',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}
      >
        <Logo size={28} />
        <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.3 }}>ui bits</span>
      </div>
    </section>
  </div>
);

export default LogoPreview;
