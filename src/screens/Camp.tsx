import { c, font } from '../theme'
import { tripData } from '../data/tripData'
import { stripPrice } from '../lib/camps'
import { Kicker, ScreenTitle } from '../components/ui'

export function Camp() {
  const T = tripData
  return (
    <div style={{ animation: 'waw-fade .35s ease both', padding: '18px 16px 28px' }}>
      <Kicker color={c.green}>Zero wild camping — every night pre-booked</Kicker>
      <ScreenTitle style={{ margin: '3px 0 6px' }}>Campsites</ScreenTitle>
      <div style={{ fontFamily: font.serif, fontSize: 13, color: '#5a5140', lineHeight: 1.55 }}>{T.campNotes.intro}</div>

      <div style={{ marginTop: 16 }}>
        {T.campsites.map((camp, i) => (
          <div key={i} style={{ border: `1.5px solid ${c.ink}`, borderRadius: 9, background: c.paper, marginBottom: 9, overflow: 'hidden', display: 'flex' }}>
            <div style={{ flex: '0 0 58px', background: c.greenPanel, borderRight: `1.5px solid ${c.green}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 3px' }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={c.green} strokeWidth={1.7} strokeLinejoin="round">
                <path d="M12 4 L21 20 H3 Z" />
                <path d="M12 4 V20" />
              </svg>
              <div style={{ fontFamily: font.mono, fontSize: 9, color: c.green, marginTop: 5, textAlign: 'center', lineHeight: 1.2 }}>{camp.night}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0, padding: '10px 12px' }}>
              <div style={{ fontFamily: font.mono, fontSize: 8.5, letterSpacing: '.1em', color: c.inkFainter, textTransform: 'uppercase' }}>{camp.base}</div>
              <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 14.5, textTransform: 'uppercase', color: c.ink, lineHeight: 1.12, marginTop: 2 }}>{camp.primary}</div>
              {stripPrice(camp.primaryNote) && <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 12, color: c.inkMuted, marginTop: 4, lineHeight: 1.4 }}>{stripPrice(camp.primaryNote)}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
