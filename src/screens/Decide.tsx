import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import type { FerryOption } from '../types'
import { Kicker, ScreenTitle } from '../components/ui'

const T = tripData

function FerryCard({ opt, picked, onPick }: { opt: FerryOption; picked: boolean; onPick: () => void }) {
  return (
    <div style={{ border: `1.5px solid ${c.ink}`, borderRadius: 9, overflow: 'hidden', marginBottom: 12, background: c.paper }}>
      <div style={{ background: picked ? c.rust : c.paperMuted, color: picked ? '#f6ecd6' : c.ink, padding: '10px 13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: '.1em' }}>OPT {opt.id}</span>
          <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 17, textTransform: 'uppercase' }}>{opt.name}</span>
        </div>
        <span style={{ fontFamily: font.mono, fontSize: 8.5, letterSpacing: '.08em', opacity: 0.85 }}>{opt.tag}</span>
      </div>
      <div style={{ padding: '12px 13px' }}>
        {opt.routes.map((r, i) => (
          <div key={i} style={{ fontFamily: font.mono, fontSize: 10.5, color: c.inkBody2, lineHeight: 1.6 }}>· {r}</div>
        ))}
        <div style={{ fontFamily: font.serif, fontSize: 13.5, color: c.inkBody2, lineHeight: 1.5, marginTop: 9 }}>{opt.hack}</div>
        <div style={{ fontFamily: font.serif, fontSize: 12.5, color: c.inkMuted, lineHeight: 1.5, marginTop: 8 }}>
          <b style={{ color: c.ink }}>Transit:</b> {opt.transit}
        </div>
        <div style={{ fontFamily: font.serif, fontSize: 12.5, color: c.inkMuted, lineHeight: 1.5, marginTop: 4 }}>
          <b style={{ color: c.ink }}>UK leg:</b> {opt.ukLeg}
        </div>
        <div style={{ marginTop: 10 }}>
          {opt.pros.map((p, i) => (
            <div key={`p${i}`} style={{ fontFamily: font.serif, fontSize: 12, color: '#4a5d33', lineHeight: 1.4, marginBottom: 3 }}>✓ {p}</div>
          ))}
          {opt.cons.map((cc, i) => (
            <div key={`c${i}`} style={{ fontFamily: font.serif, fontSize: 12, color: c.rust, lineHeight: 1.4, marginBottom: 3 }}>✗ {cc}</div>
          ))}
        </div>
        <button
          onClick={onPick}
          style={{ width: '100%', marginTop: 12, border: `1.5px solid ${c.ink}`, borderRadius: 7, padding: 10, textAlign: 'center', fontFamily: font.display, fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.06em', background: picked ? c.green : c.paper, color: picked ? c.greenPanel : c.ink }}
        >
          {picked ? '✓ Our choice' : 'Choose ' + opt.id}
        </button>
      </div>
    </div>
  )
}

export function Decide() {
  const { store, pickFerry, pickDec } = useStore()
  const ferry = store.ferry
  const dec = store.dec || {}
  const fer = T.ferries

  return (
    <div style={{ animation: 'waw-fade .35s ease both', padding: '18px 16px 28px' }}>
      <Kicker>Two ferries to lock in</Kicker>
      <ScreenTitle style={{ margin: '3px 0 4px' }}>The Ferries</ScreenTitle>
      <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 13.5, color: c.inkMuted, lineHeight: 1.5, marginBottom: 16 }}>
        The way in from the Isle of Man, and the way home from Kinsale. Both bike decks sell out for August — book them together.
      </div>

      <div style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.14em', color: c.ink, textTransform: 'uppercase', borderBottom: `1.5px solid ${c.ink}`, paddingBottom: 5, marginBottom: 10 }}>
        The way in · Isle of Man → Ireland
      </div>
      {fer.inbound.map((leg, i) => (
        <div key={i} style={{ border: `1.5px solid ${c.ink}`, borderRadius: 8, background: c.paper, padding: '11px 13px', marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'baseline' }}>
            <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 15, textTransform: 'uppercase', color: c.ink, lineHeight: 1.1 }}>{leg.route}</div>
            <div style={{ fontFamily: font.mono, fontSize: 11, color: c.rust, whiteSpace: 'nowrap' }}>{leg.price}</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4, alignItems: 'center' }}>
            <span style={{ fontFamily: font.mono, fontSize: 9.5, color: c.inkFaint }}>{leg.op} · {leg.dur}</span>
            <span style={{ fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: c.teal, border: `1px solid ${c.teal}`, borderRadius: 3, padding: '1px 6px' }}>{leg.tag}</span>
          </div>
          <div style={{ fontFamily: font.serif, fontSize: 12.5, color: '#5a5140', lineHeight: 1.5, marginTop: 6 }}>{leg.note}</div>
        </div>
      ))}

      <div style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.14em', color: c.ink, textTransform: 'uppercase', borderBottom: `1.5px solid ${c.ink}`, paddingBottom: 5, margin: '20px 0 10px' }}>
        The way home · from Kinsale
      </div>
      <div style={{ fontFamily: font.serif, fontSize: 13, color: c.inkMuted, lineHeight: 1.5, marginBottom: 12 }}>{fer.home.intro}</div>

      <FerryCard opt={fer.home.options[0]} picked={ferry === fer.home.options[0].id} onPick={() => pickFerry(fer.home.options[0].id)} />
      <div style={{ textAlign: 'center', fontFamily: font.display, fontWeight: 700, fontSize: 13, color: c.rust, letterSpacing: '.1em', margin: '2px 0 12px' }}>— OR —</div>
      <FerryCard opt={fer.home.options[1]} picked={ferry === fer.home.options[1].id} onPick={() => pickFerry(fer.home.options[1].id)} />

      <div style={{ border: `1.5px solid ${c.ink}`, borderRadius: 8, background: c.paperMuted, padding: '10px 13px', marginBottom: 22 }}>
        <div style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.12em', color: c.ink, textTransform: 'uppercase', marginBottom: 6 }}>Ferry booking checklist</div>
        {fer.home.checklist.map((cc, i) => (
          <div key={i} style={{ fontFamily: font.serif, fontSize: 12.5, color: c.inkBody2, lineHeight: 1.45, padding: '3px 0' }}>• {cc}</div>
        ))}
      </div>

      <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 22, textTransform: 'uppercase', color: c.ink, borderTop: `2px solid ${c.ink}`, paddingTop: 14 }}>The Negotiation Table</div>
      <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 13, color: c.inkMuted, margin: '2px 0 6px' }}>
        Every open decision in one place. Tap to bank your pick; the note is the data-based lean.
      </div>
      {T.negotiation.map((row) => (
        <div key={row.id} style={{ borderTop: '1px solid #d3c39c', padding: '12px 0' }}>
          <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 15, textTransform: 'uppercase', color: c.ink, letterSpacing: '.02em' }}>{row.decision}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '8px 0' }}>
            {row.options.map((o, idx) => {
              const picked = dec[row.id] === idx
              return (
                <button
                  key={idx}
                  onClick={() => pickDec(row.id, idx)}
                  style={{ border: `1.5px solid ${c.ink}`, borderRadius: 20, padding: '4px 11px', fontFamily: font.mono, fontSize: 10, letterSpacing: '.02em', background: picked ? c.ink : c.paper, color: picked ? c.paper : c.ink }}
                >
                  {o}
                </button>
              )
            })}
          </div>
          <div style={{ fontFamily: font.serif, fontSize: 12.5, color: c.inkMuted, lineHeight: 1.5 }}>
            <span style={{ fontFamily: font.mono, fontSize: 8.5, letterSpacing: '.1em', color: c.rust, textTransform: 'uppercase' }}>Lean · </span>
            {row.lean}
          </div>
        </div>
      ))}
    </div>
  )
}
