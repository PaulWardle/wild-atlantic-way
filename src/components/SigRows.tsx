import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'

/** The Signature 15 list. Brothers get tappable rows (tick to bag); everyone else
 * gets read-only rows with a "Bagged" badge. Shared by the brother Signature
 * screen and the guest "Sights & Roads" combined screen. */
export function SigRows({ interactive }: { interactive: boolean }) {
  const { store, toggleSig } = useStore()
  const sig = store.sig || {}

  return (
    <>
      {tripData.signature.map((x) => {
        const ticked = !!sig[x.id]
        const dayRoundel = (
          <div style={{ flex: '0 0 auto', fontFamily: font.display, fontWeight: 700, fontSize: 12, color: c.paperDeep, background: c.ink, borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {x.day}
          </div>
        )
        const nameBlock = (
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 15, textTransform: 'uppercase', color: c.ink, lineHeight: 1.1, letterSpacing: '.01em' }}>★ {x.name}</div>
            <div style={{ fontFamily: font.mono, fontSize: 9, color: c.inkFainter, marginTop: 2 }}>{x.county} · {x.date}</div>
          </div>
        )

        if (interactive) {
          return (
            <button
              key={x.id}
              onClick={() => toggleSig(x.id)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, border: `1.5px solid ${c.ink}`, borderRadius: 8, background: c.paper, padding: '10px 12px', marginBottom: 7, textAlign: 'left' }}
            >
              <div style={{ flex: '0 0 22px', height: 22, borderRadius: 5, border: `1.5px solid ${ticked ? c.rust : c.ink}`, background: ticked ? c.rust : c.paper, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {ticked && <span style={{ color: '#f6ecd6', fontFamily: font.display, fontWeight: 700, fontSize: 14, lineHeight: 1 }}>✓</span>}
              </div>
              {nameBlock}
              {dayRoundel}
            </button>
          )
        }

        return (
          <div key={x.id} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, border: `1.5px solid ${c.ink}`, borderRadius: 8, background: c.paper, padding: '10px 12px', marginBottom: 7 }}>
            {nameBlock}
            {ticked && (
              <span style={{ flex: '0 0 auto', fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: c.greenPanel, background: c.green, border: `1px solid ${c.green}`, borderRadius: 4, padding: '2px 6px' }}>✓ Bagged</span>
            )}
            {dayRoundel}
          </div>
        )
      })}
    </>
  )
}
