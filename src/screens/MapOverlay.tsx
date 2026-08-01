import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'
import { useMap } from '../hooks/useMap'
import { MapSVG } from '../components/MapSVG'

/** Full-screen route map (screen === 'map'). */
export function MapOverlay() {
  const { nav } = useStore()
  const { geo } = useMap()
  const close = () => nav({ screen: 'home' })

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 60,
        background: c.paperDeep,
        display: 'flex',
        flexDirection: 'column',
        animation: 'waw-fade .25s ease both',
      }}
    >
      <div
        style={{
          flex: '0 0 auto',
          background: c.ink,
          color: c.paper,
          padding: '13px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.18em', color: c.gold, textTransform: 'uppercase' }}>
            The shape of the journey
          </div>
          <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 18, letterSpacing: '.02em', textTransform: 'uppercase' }}>
            Muff → Kinsale
          </div>
        </div>
        <button
          onClick={close}
          aria-label="Close"
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: `1.5px solid ${c.paper}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: c.paper,
            fontFamily: font.display,
            fontSize: 20,
            lineHeight: 1,
            flex: '0 0 auto',
          }}
        >
          ×
        </button>
      </div>
      <div style={{ flex: 1, overflow: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 6, background: c.paperMap }}>
        <MapSVG geo={geo} maxWidth={560} />
      </div>
      <div
        style={{
          flex: '0 0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '9px 16px',
          padding: '11px 16px',
          borderTop: `1.5px solid ${c.ink}`,
          background: c.paperMuted,
        }}
      >
        {[
          { sw: <span style={{ width: 16, height: 2.6, background: c.rust, display: 'inline-block', borderRadius: 2 }} />, t: 'Official WAW' },
          { sw: <span style={{ width: 16, borderTop: `2px dashed ${c.leadIn}`, display: 'inline-block' }} />, t: 'Lead-in' },
          { sw: <span style={{ width: 9, height: 9, borderRadius: '50%', background: c.landmark, display: 'inline-block' }} />, t: 'WAW landmark' },
          { sw: <span style={{ width: 9, height: 9, borderRadius: '50%', background: c.townDot, display: 'inline-block' }} />, t: 'Town' },
        ].map((it, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: font.mono, fontSize: 9, color: '#5a4f3b' }}>
            {it.sw}
            {it.t}
          </span>
        ))}
      </div>
    </div>
  )
}
