import { c, font } from '../theme'
import { tripData } from '../data/tripData'

/** The biker passes list (north→south). Shared by the Passes screen and the
 * guest "Sights & Roads" combined screen. */
export function PassRows() {
  return (
    <>
      {tripData.passes.map((pass, i) => (
        <div key={i} style={{ display: 'flex', gap: 11, borderTop: `1px solid ${c.lineSoft}`, padding: '11px 2px' }}>
          <div style={{ flex: '0 0 auto', width: 22, height: 22, borderRadius: '50%', border: `1.5px solid ${c.teal}`, color: c.teal, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.mono, fontSize: 11, marginTop: 1 }}>
            »
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: font.display, fontWeight: 600, fontSize: 15.5, textTransform: 'uppercase', color: c.ink, letterSpacing: '.01em' }}>{pass.name}</span>
              {pass.star && (
                <span style={{ fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: c.rust, border: `1px solid ${c.rust}`, borderRadius: 3, padding: '1px 5px', background: '#f7ecd6' }}>
                  ★ The pass
                </span>
              )}
            </div>
            <div style={{ fontFamily: font.mono, fontSize: 9, color: c.inkFainter, margin: '2px 0 3px' }}>{pass.area}</div>
            <div style={{ fontFamily: font.serif, fontSize: 13, color: c.inkBody, lineHeight: 1.5 }}>{pass.d}</div>
          </div>
        </div>
      ))}
    </>
  )
}
