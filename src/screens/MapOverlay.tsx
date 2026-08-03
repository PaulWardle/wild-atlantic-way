import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'
import { useMap } from '../hooks/useMap'
import { MapSVG, MapLegend } from '../components/MapSVG'
import { tripData } from '../data/tripData'

const meta = tripData.meta

/** Full-screen route map (screen === 'map'). */
export function MapOverlay() {
  const { goBack } = useStore()
  const { geo } = useMap()
  // Return to wherever the map was opened from, not blindly to Home.
  const close = goBack

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
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: '10px 10px 14px', background: c.paperMap, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
        <MapSVG geo={geo} fill />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1.5, background: c.ink, border: `1.5px solid ${c.ink}`, borderRadius: 8, overflow: 'hidden', flex: '0 0 auto' }}>
          {[
            { n: String(meta.nights), l: 'nights', accent: false },
            { n: String(meta.dayCount), l: 'days', accent: false },
            { n: meta.totalMiles, l: 'miles', accent: false },
            { n: String(meta.sigCount), l: 'key stops', accent: true },
          ].map((st, i) => (
            <div key={i} style={{ background: c.paper, padding: '10px 4px', textAlign: 'center' }}>
              <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 19, color: st.accent ? c.rust : c.ink }}>{st.n}</div>
              <div style={{ fontFamily: font.mono, fontSize: 7.5, letterSpacing: '.08em', color: c.inkFainter, textTransform: 'uppercase' }}>{st.l}</div>
            </div>
          ))}
        </div>
      </div>
      <MapLegend style={{ flex: '0 0 auto', gap: '9px 16px', padding: '11px 16px' }} />
    </div>
  )
}
