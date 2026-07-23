import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { Kicker, ScreenTitle, Lede } from '../components/ui'
import { SigRows } from '../components/SigRows'

export function Signature() {
  const { isBrother, store } = useStore()
  const sig = store.sig || {}
  const done = tripData.signature.filter((x) => !!sig[x.id]).length
  const total = tripData.signature.length

  return (
    <div style={{ animation: 'waw-fade .35s ease both', padding: '18px 16px 28px' }}>
      <Kicker>The official headliners</Kicker>
      <ScreenTitle>Signature 15</ScreenTitle>
      {isBrother ? (
        <Lede>
          The Wild Atlantic Way has ~180 Discovery Points; these 15 are the headline set. The full plan hits all of them — tick each one off as each is reached.
        </Lede>
      ) : (
        <Lede style={{ marginBottom: 14 }}>
          The Wild Atlantic Way has ~180 Discovery Points; these 15 are the headline set — the icons of the whole route.
        </Lede>
      )}

      {isBrother && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '14px 0 16px', border: `1.5px solid ${c.ink}`, borderRadius: 8, background: c.paper, padding: '10px 13px' }}>
          <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 26, color: c.rust, lineHeight: 1 }}>{done}</div>
          <div style={{ fontFamily: font.mono, fontSize: 10, color: c.inkFaint }}>of {total} bagged</div>
        </div>
      )}

      <SigRows interactive={isBrother} />
    </div>
  )
}
