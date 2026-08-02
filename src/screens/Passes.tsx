import { c } from '../theme'
import { Kicker, ScreenTitle, Lede } from '../components/ui'
import { PassRows } from '../components/PassRows'

export function Passes() {
  return (
    <div style={{ animation: 'waw-fade .35s ease both', padding: '18px 16px 28px' }}>
      <Kicker color={c.teal}>The stuff cars miss</Kicker>
      <ScreenTitle>Passes &amp; Roads</ScreenTitle>
      <Lede>The mountain roads are half the point — often the better half. Eighteen of them, north to south.</Lede>
      <div style={{ marginTop: 14 }}>
        <PassRows />
      </div>
    </div>
  )
}
