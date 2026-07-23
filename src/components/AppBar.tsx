import { c, font } from '../theme'

/** Top bar shown on every screen except Home and Today: back button, kicker/title, roundel. */
export function AppBar({
  kicker,
  title,
  roundel,
  onBack,
}: {
  kicker: string
  title: string
  roundel: string
  onBack: () => void
}) {
  return (
    <div
      className="waw-noprint"
      style={{
        flex: '0 0 auto',
        position: 'relative',
        zIndex: 20,
        background: c.paperDeep,
        borderBottom: `1.5px solid ${c.ink}`,
        padding: '13px 14px 11px',
        display: 'flex',
        alignItems: 'center',
        gap: 11,
      }}
    >
      <button
        onClick={onBack}
        aria-label="Back"
        style={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          border: `1.5px solid ${c.ink}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '0 0 auto',
        }}
      >
        <span style={{ fontFamily: font.display, fontWeight: 600, fontSize: 19, lineHeight: 1, color: c.ink, marginTop: -2 }}>
          ‹
        </span>
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.18em', color: c.rust, textTransform: 'uppercase' }}>
          {kicker}
        </div>
        <div
          style={{
            fontFamily: font.display,
            fontWeight: 600,
            fontSize: 19,
            letterSpacing: '.02em',
            textTransform: 'uppercase',
            color: c.ink,
            lineHeight: 1.05,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontFamily: font.display,
          fontWeight: 700,
          fontSize: 15,
          color: c.paperDeep,
          background: c.ink,
          borderRadius: '50%',
          width: 34,
          height: 34,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: '0 0 auto',
        }}
      >
        {roundel}
      </div>
    </div>
  )
}
