import { c, font, phaseInfo } from '../theme'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { isMarkable } from '../lib/tags'

function Tally({ n, label, color, bg }: { n: number; label: string; color: string; bg: string }) {
  return (
    <div style={{ flex: 1, border: `1.5px solid ${color}`, borderRadius: 7, padding: '7px 4px', textAlign: 'center', background: bg }}>
      <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 18, color, lineHeight: 1 }}>{n}</div>
      <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.08em', color, textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
    </div>
  )
}

export function Days() {
  const { isBrother, store, nav } = useStore()
  const marks = store.marks || {}
  const T = tripData

  let keep = 0
  let maybe = 0
  let cut = 0
  T.days.forEach((dd, di) =>
    (dd.stops || []).forEach((st, si) => {
      if (!isMarkable(dd, st)) return
      const mk = marks['d' + di + 's' + si]
      if (mk === 'keep') keep++
      else if (mk === 'maybe') maybe++
      else if (mk === 'cut') cut++
    }),
  )

  const openDay = (i: number) => nav({ screen: 'day', day: i })

  return (
    <div style={{ animation: 'waw-fade .35s ease both', padding: '18px 16px 26px' }}>
      <div style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.18em', color: c.rust, textTransform: 'uppercase' }}>
        Malin Head to Kinsale · the official route
      </div>
      <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 30, textTransform: 'uppercase', color: c.ink, lineHeight: 1, margin: '3px 0 12px' }}>
        The Ride
      </div>

      {isBrother && (
        <>
          <div style={{ fontFamily: font.mono, fontSize: 8.5, letterSpacing: '.1em', color: c.inkFaintest, textTransform: 'uppercase', marginBottom: 6 }}>
            Your stop picks · decide per stop inside each day
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
            <Tally n={keep} label="keep" color={c.green} bg={c.greenPanel} />
            <Tally n={maybe} label="maybe" color={c.amber} bg={c.amberPanel} />
            <Tally n={cut} label="cut" color={c.rust} bg={c.amberPanelDeep} />
          </div>
        </>
      )}

      {T.days.map((day, i) => {
        const pi = phaseInfo(day.phase)
        return (
          <button
            key={i}
            onClick={() => openDay(i)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'stretch',
              gap: 0,
              border: `1.5px solid ${c.ink}`,
              borderRadius: 9,
              background: c.paper,
              marginBottom: 9,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <div style={{ flex: '0 0 62px', background: c.paperMuted, borderRight: `1.5px solid ${c.ink}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 4px' }}>
              <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 26, color: c.ink, lineHeight: 0.9 }}>{day.n}</div>
              <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.05em', color: c.inkFaint, marginTop: 3 }}>{day.dow}</div>
              <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.02em', color: c.rust }}>{day.date}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0, padding: '10px 12px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'inline-flex', alignSelf: 'flex-start', fontFamily: font.mono, fontSize: 7.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: pi.color, border: `1px solid ${pi.color}`, borderRadius: 3, padding: '1px 5px', marginBottom: 5 }}>
                {pi.label}
              </div>
              <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 15, textTransform: 'uppercase', color: c.ink, lineHeight: 1.08, letterSpacing: '.01em' }}>{day.title}</div>
              <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 12.5, color: c.inkFaint, marginTop: 2, lineHeight: 1.3 }}>{day.tagline}</div>
              <div style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.05em', color: c.inkFaintest, marginTop: 5 }}>{day.miles}</div>
            </div>
          </button>
        )
      })}

      <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
        <button onClick={() => nav({ screen: 'signature' })} style={{ flex: 1, border: `1.5px solid ${c.ink}`, borderRadius: 8, background: c.paperMuted, padding: 11, textAlign: 'center', fontFamily: font.display, fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.04em', color: c.ink }}>
          ★ Signature 15
        </button>
        <button onClick={() => nav({ screen: 'passes' })} style={{ flex: 1, border: `1.5px solid ${c.ink}`, borderRadius: 8, background: c.paperMuted, padding: 11, textAlign: 'center', fontFamily: font.display, fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.04em', color: c.ink }}>
          » Passes
        </button>
      </div>
    </div>
  )
}
