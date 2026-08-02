import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { isMarkable, markKey } from '../lib/tags'
import { Kicker, ScreenTitle, Lede } from '../components/ui'

export function Attractions() {
  const { attractFilter, setAttractFilter, store, nav, isBrother } = useStore()
  const marks = store.marks || {}
  const af = attractFilter || 'all'
  const T = tripData

  let allCount = 0
  let sigC = 0
  let bikeC = 0
  const attractDays: Array<{
    dn: string
    dow: string
    date: string
    title: string
    idx: number
    stops: Array<{ n: string; d: string; sig: boolean; biker: boolean; finish: boolean; cut: boolean; op: number; deco: string; dot: string }>
  }> = []

  T.days.forEach((d2, ai) => {
    if (d2.phase === 'home') return
    const bstops = (d2.stops || []).map((st, si) => ({ st, si })).filter((x) => !x.st.skip)
    bstops.forEach((x) => {
      allCount++
      const tg = x.st.tags || []
      if (tg.indexOf('s') >= 0) sigC++
      if (tg.indexOf('b') >= 0) bikeC++
    })
    const stops = bstops
      .filter((x) => {
        const tg = x.st.tags || []
        return af === 'all' ? true : af === 'sig' ? tg.indexOf('s') >= 0 : af === 'biker' ? tg.indexOf('b') >= 0 : true
      })
      .map((x) => {
        const st = x.st
        const tg = st.tags || []
        const sg = tg.indexOf('s') >= 0
        const bk = tg.indexOf('b') >= 0
        // Only optional extras can be cut — locked official stops ignore marks
        // (also inoculates against stale position-keyed marks from old versions).
        const cut = isMarkable(d2, st) && marks[markKey(ai, x.si)] === 'cut'
        // Guests never see a stop the brothers have cut — same rule as the
        // day cards (this screen used to leak them struck-through).
        if (!isBrother && cut) return null
        return { n: st.n, d: st.d, sig: sg, biker: bk, finish: !!st.finish, cut, op: cut ? 0.5 : 1, deco: cut ? 'line-through' : 'none', dot: cut ? '#c9ba94' : sg ? c.rust : bk ? c.teal : '#c9ba94' }
      }).filter((r): r is NonNullable<typeof r> => r !== null)
    if (stops.length) attractDays.push({ dn: d2.n, dow: d2.dow, date: d2.date, title: d2.title, idx: ai, stops })
  })

  const chip = (label: string, active: boolean, activeBg: string, activeFg: string, borderColor: string, onClick: () => void) => (
    <button onClick={onClick} aria-pressed={active} style={{ flex: 1, border: `1.5px solid ${borderColor}`, borderRadius: 7, padding: '8px 4px', textAlign: 'center', background: active ? activeBg : c.paper, color: active ? activeFg : c.ink, fontFamily: font.display, fontWeight: 600, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.03em' }}>
      {label}
    </button>
  )

  return (
    <div style={{ animation: 'waw-fade .35s ease both', padding: '18px 16px 28px' }}>
      <Kicker>Every sight worth the kickstand</Kicker>
      <ScreenTitle>Attractions</ScreenTitle>
      <Lede>Everything the route passes, day by day — castles, cliffs, beaches, pubs and the roads themselves. Filter to just the headliners or the biker roads.</Lede>

      <div style={{ display: 'flex', gap: 7, margin: '15px 0 6px' }}>
        {chip(`All ${allCount}`, af === 'all', c.ink, c.paper, c.ink, () => setAttractFilter('all'))}
        {chip(`★ ${sigC}`, af === 'sig', c.rust, '#f6ecd6', c.rust, () => setAttractFilter('sig'))}
        {chip(`» ${bikeC}`, af === 'biker', c.teal, c.tealPanel, c.teal, () => setAttractFilter('biker'))}
      </div>

      {attractDays.map((ad) => (
        <div key={ad.idx} style={{ marginTop: 16 }}>
          <button onClick={() => nav({ screen: 'day', day: ad.idx })} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 9, borderBottom: `1.5px solid ${c.ink}`, padding: '0 0 5px', marginBottom: 8 }}>
            <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 16, color: c.rust }}>{ad.dn}</span>
            <span style={{ flex: 1, fontFamily: font.display, fontWeight: 600, fontSize: 13.5, textTransform: 'uppercase', letterSpacing: '.02em', color: c.ink, lineHeight: 1.05 }}>{ad.title}</span>
            <span style={{ fontFamily: font.mono, fontSize: 9, color: c.inkFainter }}>{ad.date}</span>
          </button>
          {ad.stops.map((st, si) => (
            <div key={si} style={{ display: 'flex', gap: 9, padding: '6px 0', opacity: st.op }}>
              <div style={{ flex: '0 0 auto', width: 7, height: 7, borderRadius: '50%', background: st.dot, marginTop: 6 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 14.5, color: c.ink, lineHeight: 1.12, letterSpacing: '.01em', textDecoration: st.deco }}>{st.n}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, margin: '5px 0 0' }}>
                  {st.sig && <span style={{ fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: c.rust, border: `1px solid ${c.rust}`, borderRadius: 3, padding: '1px 5px', background: '#f7ecd6' }}>★ Signature</span>}
                  {st.biker && <span style={{ fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: c.teal, border: `1px solid ${c.teal}`, borderRadius: 3, padding: '1px 5px', background: c.tealPanel }}>» Biker road</span>}
                  {st.finish && <span style={{ fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#f6ecd6', border: `1px solid ${c.ink}`, borderRadius: 3, padding: '1px 5px', background: c.ink }}>⚑ Finish</span>}
                </div>
                <div style={{ fontFamily: font.serif, fontSize: 13, color: c.inkBody, lineHeight: 1.5, marginTop: 5 }}>{st.d}</div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
