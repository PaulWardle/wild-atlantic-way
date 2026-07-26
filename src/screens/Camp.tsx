import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { stripPrice } from '../lib/camps'
import { Kicker, ScreenTitle } from '../components/ui'
import type { Campsite } from '../types'

/** Brother-only verification row: what's actually confirmed vs needs a phone call. */
function VerifyRow({ camp }: { camp: Campsite }) {
  const chip = (t: string, ok: boolean) => (
    <span style={{ fontFamily: font.mono, fontSize: 7.5, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: ok ? c.green : c.inkFainter, background: ok ? c.greenPanel : c.paperMuted, border: `1px solid ${ok ? c.green : c.inkFainter}`, borderRadius: 3, padding: '1px 5px' }}>
      {t}
    </span>
  )
  return (
    <div style={{ marginTop: 7, borderTop: '1px dashed #c9ba94', paddingTop: 6 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
        {camp.bookingStatus === 'booked' && chip('tents ✓', true)}
        {camp.bookingStatus === 'booked' && chip('bikes ✓', true)}
        {camp.price && chip(camp.price, false)}
      </div>
      {(camp.deviationMi != null || camp.retraceMi != null) && (
        <div style={{ fontFamily: font.mono, fontSize: 8.5, color: c.inkFaint, marginTop: 5, lineHeight: 1.5 }}>
          WAW deviation +{camp.deviationMi ?? 0} mi
          {camp.retraceMi ? ` · repeated road ~${camp.retraceMi} mi next morning` : ' · ✓ forward'}
        </div>
      )}
      {camp.source && <div style={{ fontFamily: font.mono, fontSize: 8, color: c.inkFaintest, marginTop: 3, lineHeight: 1.5 }}>{camp.source}</div>}
      {camp.backup && <div style={{ fontFamily: font.mono, fontSize: 8, color: c.inkFaint, marginTop: 3, lineHeight: 1.5 }}>ALT · {camp.backup}</div>}
    </div>
  )
}

export function Camp() {
  const { isBrother } = useStore()
  const T = tripData
  const booked = T.campsites.filter((x) => x.bookingStatus === 'booked').length
  const pending = T.campsites.filter((x) => x.bookingStatus === 'pending').length
  return (
    <div style={{ animation: 'waw-fade .35s ease both', padding: '18px 16px 28px' }}>
      <Kicker color={c.green}>Zero wild camping — every night pre-booked</Kicker>
      <ScreenTitle style={{ margin: '3px 0 6px' }}>Campsites</ScreenTitle>
      <div style={{ margin: '2px 0 8px', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 15, color: c.ink }}>
          Camping: {booked} / {T.campsites.length} booked
        </span>
        {pending > 0 && (
          <span style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.06em', color: c.amber, background: c.amberPanel, border: `1px solid ${c.amber}`, borderRadius: 3, padding: '1.5px 7px', textTransform: 'uppercase' }}>
            {pending} pending
          </span>
        )}
      </div>
      <div style={{ fontFamily: font.serif, fontSize: 13, color: '#5a5140', lineHeight: 1.55 }}>{T.campNotes.intro}</div>

      <div style={{ marginTop: 16 }}>
        {/* Booked nights are green; unconfirmed are amber — the colour IS the status. */}
        {T.campsites.map((camp, i) => {
          const pending = camp.bookingStatus !== 'booked'
          const tint = pending ? c.amber : c.green
          const panel = pending ? c.amberPanel : c.greenPanel
          return (
          <div key={i} style={{ border: `1.5px solid ${c.ink}`, borderRadius: 9, background: c.paper, marginBottom: 9, overflow: 'hidden', display: 'flex' }}>
            <div style={{ flex: '0 0 58px', background: panel, borderRight: `1.5px solid ${tint}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 3px' }}>
              <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={tint} strokeWidth={1.7} strokeLinejoin="round">
                <path d="M12 4 L21 20 H3 Z" />
                <path d="M12 4 V20" />
              </svg>
              <div style={{ fontFamily: font.mono, fontSize: 9, color: tint, marginTop: 5, textAlign: 'center', lineHeight: 1.2 }}>{camp.night}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0, padding: '10px 12px' }}>
              <div style={{ fontFamily: font.mono, fontSize: 8.5, letterSpacing: '.1em', color: c.inkFainter, textTransform: 'uppercase' }}>{camp.base}</div>
              <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 14.5, textTransform: 'uppercase', color: c.ink, lineHeight: 1.12, marginTop: 2 }}>{camp.primary}</div>
              {pending && camp.bookingNote && (
                <div style={{ fontFamily: font.mono, fontSize: 8.5, color: c.amber, marginTop: 3, letterSpacing: '.04em' }}>{camp.bookingNote}</div>
              )}
              {stripPrice(camp.primaryNote) && <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 12, color: c.inkMuted, marginTop: 4, lineHeight: 1.4 }}>{stripPrice(camp.primaryNote)}</div>}
              {isBrother && pending && <VerifyRow camp={camp} />}
            </div>
          </div>
        )})}
      </div>
    </div>
  )
}
