import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { countdownParts } from '../lib/countdown'
import { useMap } from '../hooks/useMap'
import { MapSVG, MapLegend } from '../components/MapSVG'

const cell: React.CSSProperties = {
  border: `1.5px solid ${c.ink}`,
  background: c.paper,
  borderRadius: 9,
  padding: '9px 5px',
  minWidth: 50,
}

function CdCell({ n, label }: { n: string | number; label: string }) {
  return (
    <div style={cell}>
      <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 24, color: c.rust, lineHeight: 0.9 }}>{n}</div>
      <div style={{ fontFamily: font.mono, fontSize: 7, letterSpacing: '.1em', color: c.inkFainter, textTransform: 'uppercase', marginTop: 5 }}>
        {label}
      </div>
    </div>
  )
}

/** Landing gate: countdown, title, map, and the brother/guest choice. */
export function Gate() {
  const s = useStore()
  const { nowTs, pwOpen, pwVal, pwErr, chooseBrother, chooseGuest, cancelPw, setPw, submitPw } = s
  const meta = tripData.meta
  const cd = countdownParts(meta.depart, nowTs)
  const { geo } = useMap()

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 80,
        background: c.paperDeep,
        overflowY: 'auto',
        animation: 'waw-fade .3s ease both',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          opacity: 0.05,
          backgroundImage:
            'repeating-linear-gradient(0deg,rgba(40,32,22,.4) 0,rgba(40,32,22,.4) 0.5px,transparent 0.5px,transparent 4px),repeating-linear-gradient(90deg,rgba(40,32,22,.4) 0,rgba(40,32,22,.4) 0.5px,transparent 0.5px,transparent 4px)',
        }}
      />
      <div
        style={{
          position: 'relative',
          minHeight: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '32px 26px 34px',
        }}
      >
        <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: '.26em', color: c.rust, textTransform: 'uppercase' }}>
          Bald(ing) Brothers · Aug 2026
        </div>
        <div
          style={{
            fontFamily: font.display,
            fontWeight: 700,
            fontSize: 42,
            letterSpacing: '.01em',
            textTransform: 'uppercase',
            color: c.rust,
            lineHeight: 0.88,
            margin: '12px 0 0',
          }}
        >
          Wild
          <br />
          Atlantic Way
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 12 }}>
          <div style={{ height: 1.5, width: 24, background: c.line }} />
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 13.5, color: '#5a4f3b' }}>{meta.route}</div>
          <div style={{ height: 1.5, width: 24, background: c.line }} />
        </div>
        <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 13, color: c.inkFaint, marginTop: 3 }}>
          {meta.dates}
        </div>

        <div style={{ display: 'flex', gap: 6, marginTop: 20 }}>
          <CdCell n={cd.days} label="Days" />
          <CdCell n={cd.hrs} label="Hrs" />
          <CdCell n={cd.mins} label="Min" />
          <CdCell n={cd.secs} label="Sec" />
        </div>

        <div
          style={{
            width: '100%',
            marginTop: 20,
            border: `1.5px solid ${c.ink}`,
            borderRadius: 10,
            background: c.paperMap,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 12px',
              borderBottom: `1.5px solid ${c.ink}`,
              background: c.paperMuted,
            }}
          >
            <span style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.16em', color: c.ink, textTransform: 'uppercase' }}>
              The shape of the journey
            </span>
            <span style={{ fontFamily: font.mono, fontSize: 9, color: c.inkFainter, letterSpacing: '.06em' }}>
              Malin Head → Kinsale
            </span>
          </div>
          <div style={{ padding: '6px 6px 0' }}>
            <MapSVG geo={geo} />
          </div>
          <MapLegend style={{ gap: '9px 14px' }} />
        </div>

        {!pwOpen && (
          <div style={{ width: '100%', maxWidth: 300, marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={chooseBrother}
              style={{
                width: '100%',
                border: `1.5px solid ${c.ink}`,
                borderRadius: 9,
                background: c.ink,
                color: c.paper,
                padding: 14,
                textAlign: 'center',
                fontFamily: font.display,
                fontWeight: 700,
                fontSize: 15,
                textTransform: 'uppercase',
                letterSpacing: '.05em',
              }}
            >
              I’m a brother
            </button>
            <button
              onClick={chooseGuest}
              style={{
                width: '100%',
                border: `1.5px solid ${c.ink}`,
                borderRadius: 9,
                background: 'transparent',
                color: c.ink,
                padding: 14,
                textAlign: 'center',
                fontFamily: font.display,
                fontWeight: 600,
                fontSize: 15,
                textTransform: 'uppercase',
                letterSpacing: '.05em',
              }}
            >
              I’m a guest
            </button>
            <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 12, color: c.inkFainter, marginTop: 2, lineHeight: 1.5 }}>
              Brothers get the full planner. Guests can follow the ride and leave a message.
            </div>
          </div>
        )}

        {pwOpen && (
          <div style={{ width: '100%', maxWidth: 300, marginTop: 24, textAlign: 'left' }}>
            <div style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.16em', color: c.inkFaintest, textTransform: 'uppercase', marginBottom: 7 }}>
              Brothers only · the password
            </div>
            <input
              value={pwVal}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitPw()
              }}
              placeholder="Password"
              style={{
                width: '100%',
                border: `1.5px solid ${c.ink}`,
                borderRadius: 8,
                background: c.inputBg,
                padding: '12px 13px',
                fontFamily: font.display,
                fontWeight: 600,
                fontSize: 16,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
                color: c.ink,
                outline: 'none',
              }}
            />
            {pwErr && (
              <div style={{ fontFamily: font.mono, fontSize: 9.5, letterSpacing: '.03em', color: c.rust, marginTop: 7 }}>
                Not quite — try again.
              </div>
            )}
            <div style={{ display: 'flex', gap: 8, marginTop: 11 }}>
              <button
                onClick={cancelPw}
                style={{
                  flex: '0 0 auto',
                  border: `1.5px solid ${c.ink}`,
                  borderRadius: 8,
                  background: 'transparent',
                  color: c.ink,
                  padding: '12px 18px',
                  fontFamily: font.display,
                  fontWeight: 600,
                  fontSize: 13,
                  textTransform: 'uppercase',
                  letterSpacing: '.05em',
                }}
              >
                Back
              </button>
              <button
                onClick={submitPw}
                style={{
                  flex: 1,
                  border: `1.5px solid ${c.ink}`,
                  borderRadius: 8,
                  background: c.rust,
                  color: c.cream,
                  padding: 12,
                  textAlign: 'center',
                  fontFamily: font.display,
                  fontWeight: 700,
                  fontSize: 14,
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                }}
              >
                Unlock
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
