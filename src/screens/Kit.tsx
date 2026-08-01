import type { ReactNode } from 'react'
import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'

const T = tripData

/* Packing is per-brother: Paul and CJ each tick their own copy of the personal
 * list, and the shared kit (tent, tools, cooking) is allocated to ONE of them
 * so only one bike carries it. All of it lives in the synced `kit` table —
 * tick or allocate on either phone and the other sees it live.
 *
 * Keys: pk:P:{gi}_{ii} / pk:C:{gi}_{ii} = personal ticks · pk:S:{gi}_{ii} =
 * shared-item packed · al:{gi}_{ii} = allocation ('P' | 'C'). */

type Who = 'P' | 'C'
const WHO_NAME: Record<Who, string> = { P: 'Paul', C: 'CJ' }

function ItemRow({ ticked, label, onToggle, extra }: { ticked: boolean; label: string; onToggle: () => void; extra?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 2px' }}>
      <button onClick={onToggle} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', background: 'none', border: 'none', padding: 0 }}>
        <div style={{ flex: '0 0 19px', height: 19, borderRadius: 4, border: `1.5px solid ${ticked ? c.green : c.ink}`, background: ticked ? c.green : c.paper, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {ticked && <span style={{ color: '#eef0e0', fontFamily: font.display, fontWeight: 700, fontSize: 12, lineHeight: 1 }}>✓</span>}
        </div>
        <div style={{ flex: 1, fontFamily: font.serif, fontSize: 13.5, color: c.inkSoft, lineHeight: 1.35 }}>{label}</div>
      </button>
      {extra}
    </div>
  )
}

/** PAUL / CJ allocation toggle for one shared item. */
function AllocChips({ who, onPick }: { who: Who | null; onPick: (w: Who) => void }) {
  const chip = (w: Who) => {
    const on = who === w
    return (
      <button
        key={w}
        onClick={() => onPick(w)}
        style={{ fontFamily: font.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: on ? c.paper : c.inkFaint, background: on ? c.teal : c.paperMuted, border: `1.5px solid ${on ? c.teal : c.inkFainter}`, borderRadius: 4, padding: '3px 8px' }}
      >
        {WHO_NAME[w]}
      </button>
    )
  }
  return (
    <div style={{ display: 'flex', gap: 4, flex: '0 0 auto' }}>
      {chip('P')}
      {chip('C')}
    </div>
  )
}

function GroupHead({ label, done, total }: { label: string; done: number; total: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderBottom: `1px solid ${c.lineSoft}`, paddingBottom: 4, marginBottom: 6 }}>
      <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.05em', color: c.green }}>{label}</div>
      <div style={{ fontFamily: font.mono, fontSize: 9, color: done === total ? c.green : c.inkFainter }}>{done}/{total}</div>
    </div>
  )
}

function SectionBar({ label, right }: { label: string; right?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: c.ink, color: c.paper, borderRadius: 7, padding: '7px 12px', margin: '18px 0 10px' }}>
      <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '.04em' }}>{label}</span>
      {right && <span style={{ fontFamily: font.mono, fontSize: 10, color: c.gold }}>{right}</span>}
    </div>
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
  const { store, kitTab, setKitTab, setKit, toggleBook } = useStore()
  const kit = store.kit || {}
  const book = store.book || {}
  const tab = kitTab === 'todo' ? 'todo' : 'packing'
  const bookDone = T.bookings.filter((b) => !!book[b.id]).length

  const personalCount = (who: Who) => {
    let done = 0
    let total = 0
    T.packing.forEach((g, gi) =>
      g.items.forEach((_, ii) => {
        total++
        if (kit[`pk:${who}:${gi}_${ii}`]) done++
      }),
    )
    return { done, total }
  }

  const personalSection = (who: Who) => {
    const n = personalCount(who)
    return (
      <div key={who}>
        <SectionBar label={`${WHO_NAME[who]} packs`} right={`${n.done}/${n.total}`} />
        {T.packing.map((grp, gi) => {
          const done = grp.items.filter((_, ii) => !!kit[`pk:${who}:${gi}_${ii}`]).length
          return (
            <div key={gi} style={{ marginBottom: 14 }}>
              <GroupHead label={grp.group} done={done} total={grp.items.length} />
              {grp.items.map((label, ii) => {
                const k = `pk:${who}:${gi}_${ii}`
                return <ItemRow key={k} ticked={!!kit[k]} label={label} onToggle={() => setKit(k, kit[k] ? null : '1')} />
              })}
            </div>
          )
        })}
      </div>
    )
  }

  const sharedTotals = (() => {
    let done = 0
    let total = 0
    T.sharedKit.forEach((g, gi) =>
      g.items.forEach((_, ii) => {
        total++
        if (kit[`pk:S:${gi}_${ii}`]) done++
      }),
    )
    return { done, total }
  })()

  return (
    <div style={{ animation: 'waw-fade .35s ease both', padding: '16px 16px 28px' }}>
      <div style={{ display: 'flex', gap: 3, border: `1.5px solid ${c.ink}`, borderRadius: 9, padding: 3, background: c.paperMuted, marginBottom: 16 }}>
        <button onClick={() => setKitTab('todo')} style={tabStyle(tab === 'todo')}>To do</button>
        <button onClick={() => setKitTab('packing')} style={tabStyle(tab === 'packing')}>Packing</button>
      </div>

      {tab === 'todo' && (
        <>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 3 }}>
            <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 24, textTransform: 'uppercase', color: c.ink }}>To do</div>
            <div style={{ fontFamily: font.mono, fontSize: 11, color: c.green }}>{bookDone}/{T.bookings.length}</div>
          </div>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 12.5, color: c.inkMuted, marginBottom: 12 }}>
            The admin to have squared away before departure.
          </div>
          {T.bookings.map((b) => (
            <BookRow key={b.id} b={b} ticked={!!book[b.id]} onToggle={() => toggleBook(b.id)} />
          ))}
        </>
      )}

      {tab === 'packing' && (
        <>
          <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 24, textTransform: 'uppercase', color: c.ink, marginBottom: 3 }}>Packing</div>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 12.5, color: c.inkMuted, marginBottom: 4 }}>
            Paul and CJ each tick their own list. Shared kit is carried once — tap PAUL or CJ to allocate it, and the tick is theirs to make. Syncs live between both phones.
          </div>

          {personalSection('P')}
          {personalSection('C')}

          <SectionBar label="Shared — one of us brings it" right={`${sharedTotals.done}/${sharedTotals.total}`} />
          {T.sharedKit.map((grp, gi) => {
            const done = grp.items.filter((_, ii) => !!kit[`pk:S:${gi}_${ii}`]).length
            return (
              <div key={gi} style={{ marginBottom: 14 }}>
                <GroupHead label={grp.group} done={done} total={grp.items.length} />
                {grp.items.map((label, ii) => {
                  const tick = `pk:S:${gi}_${ii}`
                  const al = `al:${gi}_${ii}`
                  const who = kit[al] === 'P' || kit[al] === 'C' ? (kit[al] as Who) : null
                  return (
                    <ItemRow
                      key={tick}
                      ticked={!!kit[tick]}
                      label={label}
                      onToggle={() => setKit(tick, kit[tick] ? null : '1')}
                      extra={<AllocChips who={who} onPick={(w) => setKit(al, who === w ? null : w)} />}
                    />
                  )
                })}
              </div>
            )
          })}
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 11.5, color: c.inkFainter, lineHeight: 1.5, marginTop: 4 }}>
            Unallocated shared items belong to nobody yet — divvy them up before the panniers close.
          </div>
        </>
      )}
    </div>
  )
}
