import type { ReactNode } from 'react'
import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'

const T = tripData

interface PackItem {
  key: string
  label: string
}
interface PackGroup {
  group: string
  items: PackItem[]
  done: number
  total: number
}

function usePackData() {
  const { store } = useStore()
  const pack = store.pack || {}
  const book = store.book || {}
  const groups: PackGroup[] = T.packing.map((g, gi) => {
    const items = g.items.map((it, ii) => ({ key: 'p' + gi + '_' + ii, label: it }))
    const done = items.filter((it) => !!pack[it.key]).length
    return { group: g.group, items, done, total: items.length }
  })
  let packDone = 0
  let packTotal = 0
  groups.forEach((g) => {
    packDone += g.done
    packTotal += g.total
  })
  const bookDone = T.bookings.filter((b) => !!book[b.id]).length
  return { pack, book, groups, packDone, packTotal, bookDone }
}

function ItemRow({ ticked, label, onToggle, box = 19 }: { ticked: boolean; label: string; onToggle: () => void; box?: number }) {
  return (
    <button onClick={onToggle} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '6px 2px', textAlign: 'left' }}>
      <div style={{ flex: `0 0 ${box}px`, height: box, borderRadius: 4, border: `1.5px solid ${ticked ? c.green : c.ink}`, background: ticked ? c.green : c.paper, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {ticked && <span style={{ color: '#eef0e0', fontFamily: font.display, fontWeight: 700, fontSize: 12, lineHeight: 1 }}>✓</span>}
      </div>
      <div style={{ flex: 1, fontFamily: font.serif, fontSize: 13.5, color: c.inkSoft, lineHeight: 1.35 }}>{label}</div>
    </button>
  )
}

function BookRow({ b, ticked, onToggle }: { b: (typeof T.bookings)[number]; ticked: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} style={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 11, border: `1.5px solid ${c.ink}`, borderRadius: 8, background: c.paper, padding: '11px 12px', marginBottom: 7, textAlign: 'left' }}>
      <div style={{ flex: '0 0 21px', height: 21, borderRadius: 5, border: `1.5px solid ${ticked ? c.green : c.ink}`, background: ticked ? c.green : c.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
        {ticked && <span style={{ color: '#eef0e0', fontFamily: font.display, fontWeight: 700, fontSize: 13, lineHeight: 1 }}>✓</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: font.display, fontWeight: 600, fontSize: 14.5, textTransform: 'uppercase', color: c.ink, lineHeight: 1.1 }}>{b.label}</span>
          {b.urgent && <span style={{ fontFamily: font.mono, fontSize: 7.5, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#f6ecd6', background: c.rust, borderRadius: 3, padding: '1px 5px' }}>Now</span>}
        </div>
        <div style={{ fontFamily: font.serif, fontSize: 12.5, color: c.inkMuted, lineHeight: 1.45, marginTop: 3 }}>{b.note}</div>
      </div>
    </button>
  )
}

function SectionHead({ children, tabRight }: { children: ReactNode; tabRight?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 3 }}>
      <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 24, textTransform: 'uppercase', color: c.ink }}>{children}</div>
      {tabRight}
    </div>
  )
}

function tabStyle(active: boolean): React.CSSProperties {
  return {
    flex: 1,
    borderRadius: 6,
    padding: '7px 3px',
    textAlign: 'center',
    fontFamily: font.display,
    fontWeight: 600,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '.03em',
    background: active ? c.ink : 'transparent',
    color: active ? c.paper : c.inkMuted,
  }
}

export function Kit() {
  const { kitTab, setKitTab, togglePack, toggleBook } = useStore()
  const { pack, book, groups, packDone, packTotal, bookDone } = usePackData()
  // Book + Intel tabs are gone — bookings live inside To do now.
  const tab = kitTab === 'todo' || kitTab === 'costs' ? kitTab : kitTab === 'packing' ? 'packing' : 'todo'

  const packGroupsBlock = (headerColor: string, headerWeight = false) =>
    groups.map((grp, gi) => (
      <div key={gi} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: headerWeight ? `1.5px solid ${c.ink}` : `1px solid ${c.lineSoft}`, paddingBottom: 4, marginBottom: 6 }}>
          <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: headerWeight ? 14 : 13, textTransform: 'uppercase', letterSpacing: '.05em', color: headerColor }}>{grp.group}</div>
          <div style={{ fontFamily: font.mono, fontSize: 9, color: c.inkFainter }}>{grp.done}/{grp.total}</div>
        </div>
        {grp.items.map((it) => (
          <ItemRow key={it.key} ticked={!!pack[it.key]} label={it.label} onToggle={() => togglePack(it.key)} />
        ))}
      </div>
    ))

  return (
    <div style={{ animation: 'waw-fade .35s ease both', padding: '16px 16px 28px' }}>
      <div style={{ display: 'flex', gap: 3, border: `1.5px solid ${c.ink}`, borderRadius: 9, padding: 3, background: c.paperMuted, marginBottom: 16 }}>
        <button onClick={() => setKitTab('todo')} style={tabStyle(tab === 'todo')}>To do</button>
        <button onClick={() => setKitTab('packing')} style={tabStyle(tab === 'packing')}>Packing</button>
        <button onClick={() => setKitTab('costs')} style={tabStyle(tab === 'costs')}>Costs</button>
      </div>

      {tab === 'todo' && (
        <>
          <SectionHead tabRight={<div style={{ fontFamily: font.mono, fontSize: 11, color: c.green }}>{packDone + bookDone}/{packTotal + T.bookings.length}</div>}>To do</SectionHead>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 12.5, color: c.inkMuted, marginBottom: 12 }}>
            Everything to sort before departure — bookings and the full packing list in one place. Ticks sync with the Packing tab.
          </div>
          <div style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.14em', color: c.rust, textTransform: 'uppercase', borderBottom: `1.5px solid ${c.ink}`, paddingBottom: 4, marginBottom: 8 }}>Book &amp; confirm</div>
          {T.bookings.map((b) => (
            <BookRow key={b.id} b={b} ticked={!!book[b.id]} onToggle={() => toggleBook(b.id)} />
          ))}
          <div style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.14em', color: c.rust, textTransform: 'uppercase', borderBottom: `1.5px solid ${c.ink}`, paddingBottom: 4, margin: '18px 0 8px' }}>Pack</div>
          {packGroupsBlock(c.green)}
        </>
      )}

      {tab === 'packing' && (
        <>
          <SectionHead tabRight={<div style={{ fontFamily: font.mono, fontSize: 11, color: c.green }}>{packDone}/{packTotal}</div>}>Packing list</SectionHead>
          <div style={{ height: 9 }} />
          {packGroupsBlock(c.rust, true)}
        </>
      )}

      {tab === 'costs' && (
        <>
          <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 24, textTransform: 'uppercase', color: c.ink, marginBottom: 3 }}>Cost estimate</div>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 12.5, color: c.inkMuted, marginBottom: 12 }}>Per person, ballpark. The craic is the swing factor.</div>
          <div style={{ border: `1.5px solid ${c.ink}`, borderRadius: 9, background: c.paper, padding: '4px 14px 10px' }}>
            {T.costs.rows.map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'baseline', padding: '10px 0', borderTop: '1px solid #d8c8a2' }}>
                <div style={{ fontFamily: font.serif, fontSize: 13, color: c.inkSoft, lineHeight: 1.4 }}>{row.item}</div>
                <div style={{ fontFamily: font.mono, fontSize: 11, color: c.rust, whiteSpace: 'nowrap' }}>{row.est}</div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 8, borderTop: `2px solid ${c.ink}`, paddingTop: 10 }}>
              <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 16, textTransform: 'uppercase', color: c.ink }}>Total / person</div>
              <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 18, color: c.rust }}>{T.costs.total}</div>
            </div>
          </div>
          {T.costs.note && <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 12, color: c.inkFainter, lineHeight: 1.5, marginTop: 9 }}>{T.costs.note}</div>}
        </>
      )}

    </div>
  )
}
