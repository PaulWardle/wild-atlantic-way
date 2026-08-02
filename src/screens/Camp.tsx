import { c, font } from '../theme'
import { tripData } from '../data/tripData'
import { Kicker, ScreenTitle } from '../components/ui'

/* Every night is booked and confirmed — the cards say exactly that and nothing
 * else: name, location, CONFIRMED. tripData.campsites is the single source of
 * truth for status; if a status ever regresses from 'booked' the card goes
 * amber again on its own. */

export function Camp() {
  const T = tripData
  const confirmed = T.campsites.filter((x) => x.bookingStatus === 'booked').length
  const pending = T.campsites.length - confirmed
  return (
    <div style={{ animation: 'waw-fade .35s ease both', padding: '18px 16px 28px' }}>
      <Kicker color={c.green}>Zero wild camping — every night pre-booked</Kicker>
      <ScreenTitle style={{ margin: '3px 0 6px' }}>Campsites</ScreenTitle>
      <div style={{ margin: '2px 0 8px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 15, color: c.green }}>
          Camping — {confirmed} of {T.campsites.length} confirmed
        </span>
        {pending > 0 && (
          <span style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.06em', color: c.amberGold, background: c.amberPanel, border: `1px solid ${c.amber}`, borderRadius: 3, padding: '1.5px 7px', textTransform: 'uppercase' }}>
            {pending} pending
          </span>
        )}
      </div>
      <div style={{ fontFamily: font.serif, fontSize: 13, color: '#5a5140', lineHeight: 1.55 }}>{T.campNotes.intro}</div>

      <div style={{ marginTop: 16 }}>
        {T.campsites.map((camp, i) => {
          const booked = camp.bookingStatus === 'booked'
          const tint = booked ? c.green : c.amber
          const panel = booked ? c.greenPanel : c.amberPanel
          return (
            <div key={i} style={{ border: `1.5px solid ${tint}`, borderRadius: 9, background: panel, marginBottom: 9, overflow: 'hidden', display: 'flex' }}>
              <div style={{ flex: '0 0 58px', background: tint, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 3px' }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={panel} strokeWidth={1.7} strokeLinejoin="round">
                  <path d="M12 4 L21 20 H3 Z" />
                  <path d="M12 4 V20" />
                </svg>
                <div style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, color: panel, marginTop: 5, textAlign: 'center', lineHeight: 1.2 }}>{camp.night}</div>
              </div>
              <div style={{ flex: 1, minWidth: 0, padding: '12px 13px' }}>
                <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 15, textTransform: 'uppercase', color: c.ink, lineHeight: 1.12 }}>{camp.primary}</div>
                <div style={{ fontFamily: font.serif, fontSize: 12.5, color: c.inkMuted, marginTop: 3 }}>{camp.base}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
