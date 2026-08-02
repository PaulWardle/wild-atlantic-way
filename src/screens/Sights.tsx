import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'
import { Kicker, ScreenTitle, Lede } from '../components/ui'
import { SigRows } from '../components/SigRows'
import { PassRows } from '../components/PassRows'

/** Guest "Sights & Roads" — Signature 15 + Passes behind a toggle (read-only). */
export function Sights() {
  const { sightsTab, setSightsTab } = useStore()
  const onSig = (sightsTab || 'sig') === 'sig'

  const tabStyle = (active: boolean): React.CSSProperties => ({
    flex: 1,
    borderRadius: 6,
    padding: '8px 4px',
    textAlign: 'center',
    fontFamily: font.display,
    fontWeight: 600,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '.03em',
    background: active ? c.ink : 'transparent',
    color: active ? c.paper : c.inkMuted,
  })

  return (
    <div style={{ animation: 'waw-fade .35s ease both', padding: '18px 16px 28px' }}>
      <Kicker>The headliners &amp; the roads</Kicker>
      <ScreenTitle style={{ margin: '3px 0 12px' }}>Sights &amp; Roads</ScreenTitle>

      <div style={{ display: 'flex', gap: 4, border: `1.5px solid ${c.ink}`, borderRadius: 9, padding: 3, background: c.paperMuted, marginBottom: 16 }}>
        <button onClick={() => setSightsTab('sig')} style={tabStyle(onSig)}>★ Signature 15</button>
        <button onClick={() => setSightsTab('passes')} style={tabStyle(!onSig)}>» Passes</button>
      </div>

      {onSig ? (
        <>
          <Lede style={{ marginBottom: 14 }}>
            The Wild Atlantic Way has ~180 Discovery Points; these 15 are the headline set — the icons of the whole route.
          </Lede>
          <SigRows interactive={false} />
        </>
      ) : (
        <>
          <Lede>The mountain roads are half the point — often the better half. Eighteen of them, north to south.</Lede>
          <div style={{ marginTop: 14 }}>
            <PassRows />
          </div>
        </>
      )}
    </div>
  )
}
