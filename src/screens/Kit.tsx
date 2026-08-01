import { useState, type ReactNode } from 'react'
import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { normalizeItem } from '../lib/itemText'

const T = tripData

/* Packing is per-brother: Paul and CJ each tick their own copy of the personal
 * list, and the shared kit (tent, tools, cooking) is allocated to ONE of them
 * so only one bike carries it. All of it lives in the synced `kit` table —
 * tick, allocate, add or remove on either phone and the other sees it live.
 *
 * Keys: pk:P:{gi}_{ii} / pk:C:{gi}_{ii} = personal ticks · pk:S:{gi}_{ii} =
 * shared-item packed · al:{id} = allocation ('P' | 'C') · add:{sec}:{id} =
 * custom item label · rm:{sec}:{gi}_{ii} = a stock item taken off the list. */

type Who = 'P' | 'C'
type Sec = Who | 'S'
const WHO_NAME: Record<Who, string> = { P: 'Paul', C: 'CJ' }

/** Custom items added to one section, oldest first. */
function addedItems(kit: Record<string, string>, sec: Sec): Array<{ id: string; label: string }> {
  const pre = `add:${sec}:`
  return Object.entries(kit)
    .filter(([k]) => k.startsWith(pre))
    .map(([k, label]) => ({ id: k.slice(pre.length), label }))
    .sort((a, b) => (a.id < b.id ? -1 : 1))
}

/** New-item input: phone autocorrect on, then our kit-word tidy on commit. */
function AddRow({ placeholder, onAdd }: { placeholder: string; onAdd: (label: string) => void }) {
  const [txt, setTxt] = useState('')
  const commit = () => {
    const v = normalizeItem(txt)
    if (v) onAdd(v)
    setTxt('')
  }
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '6px 2px' }}>
      <div style={{ flex: '0 0 19px', height: 19, borderRadius: 4, border: `1.5px dashed ${c.inkFainter}` }} />
      <input
        value={txt}
        onChange={(e) => setTxt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
        }}
        placeholder={placeholder}
        autoCapitalize="sentences"
        autoCorrect="on"
        spellCheck
        style={{ flex: 1, border: 'none', borderBottom: `1px dashed ${c.lineSoft}`, background: 'transparent', fontFamily: font.serif, fontSize: 13.5, color: c.inkSoft, padding: '3px 2px', outline: 'none' }}
      />
      {txt.trim() !== '' && (
        <button onClick={commit} style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: c.paper, background: c.green, border: `1.5px solid ${c.green}`, borderRadius: 4, padding: '3px 9px' }}>
          Add
        </button>
      )}
    </div>
  )
}

function RemoveBtn({ onRemove }: { onRemove: () => void }) {
  return (
    <button onClick={onRemove} style={{ flex: '0 0 auto', fontFamily: font.display, fontWeight: 700, fontSize: 13, color: c.rust, background: c.amberPanelDeep, border: `1.5px solid ${c.rust}`, borderRadius: 4, width: 24, height: 22, lineHeight: 1 }}>
      ×
    </button>
  )
}

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
  const [editing, setEditing] = useState(false)
  const kit = store.kit || {}
  const book = store.book || {}
  const tab = kitTab === 'todo' ? 'todo' : 'packing'
  const bookDone = T.bookings.filter((b) => !!book[b.id]).length

  const removed = (sec: Sec, gi: number, ii: number) => !!kit[`rm:${sec}:${gi}_${ii}`]

  /** Add a typed item to a section — skipped if it's already on that list. */
  const addItem = (sec: Sec, label: string) => {
    const have = new Set<string>()
    ;(sec === 'S' ? T.sharedKit : T.packing).forEach((g, gi) =>
      g.items.forEach((it, ii) => {
        if (!removed(sec, gi, ii)) have.add(it.toLowerCase())
      }),
    )
    addedItems(kit, sec).forEach((a) => have.add(a.label.toLowerCase()))
    if (have.has(label.toLowerCase())) return
    setKit(`add:${sec}:a${Date.now()}`, label)
  }

  /** Delete a custom item and everything hanging off it. */
  const removeAdded = (sec: Sec, id: string) => {
    setKit(`add:${sec}:${id}`, null)
    setKit(`pk:${sec}:${id}`, null)
    if (sec === 'S') setKit(`al:${id}`, null)
  }

  const sectionCount = (sec: Sec) => {
    let done = 0
    let total = 0
    ;(sec === 'S' ? T.sharedKit : T.packing).forEach((g, gi) =>
      g.items.forEach((_, ii) => {
        if (removed(sec, gi, ii)) return
        total++
        if (kit[`pk:${sec}:${gi}_${ii}`]) done++
      }),
    )
    addedItems(kit, sec).forEach((a) => {
      total++
      if (kit[`pk:${sec}:${a.id}`]) done++
    })
    return { done, total }
  }

  const personalSection = (who: Who) => {
    const n = sectionCount(who)
    const adds = addedItems(kit, who)
    return (
      <div key={who}>
        <SectionBar label={`${WHO_NAME[who]} packs`} right={`${n.done}/${n.total}`} />
        {T.packing.map((grp, gi) => {
          const rows = grp.items.map((label, ii) => ({ label, ii })).filter((r) => !removed(who, gi, r.ii))
          if (!rows.length) return null
          const done = rows.filter((r) => !!kit[`pk:${who}:${gi}_${r.ii}`]).length
          return (
            <div key={gi} style={{ marginBottom: 14 }}>
              <GroupHead label={grp.group} done={done} total={rows.length} />
              {rows.map((r) => {
                const k = `pk:${who}:${gi}_${r.ii}`
                return (
                  <ItemRow
                    key={k}
                    ticked={!!kit[k]}
                    label={r.label}
                    onToggle={() => setKit(k, kit[k] ? null : '1')}
                    extra={editing ? <RemoveBtn onRemove={() => setKit(`rm:${who}:${gi}_${r.ii}`, '1')} /> : undefined}
                  />
                )
              })}
            </div>
          )
        })}
        {adds.length > 0 && (
          <div style={{ marginBottom: 4 }}>
            <GroupHead label="Added" done={adds.filter((a) => !!kit[`pk:${who}:${a.id}`]).length} total={adds.length} />
            {adds.map((a) => {
              const k = `pk:${who}:${a.id}`
              return (
                <ItemRow
                  key={a.id}
                  ticked={!!kit[k]}
                  label={a.label}
                  onToggle={() => setKit(k, kit[k] ? null : '1')}
                  extra={editing ? <RemoveBtn onRemove={() => removeAdded(who, a.id)} /> : undefined}
                />
              )
            })}
          </div>
        )}
        <AddRow placeholder={`Add to ${WHO_NAME[who]}’s list…`} onAdd={(label) => addItem(who, label)} />
      </div>
    )
  }

  const sharedTotals = sectionCount('S')
  const sharedAdds = addedItems(kit, 'S')

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
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 3 }}>
            <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 24, textTransform: 'uppercase', color: c.ink }}>Packing</div>
            <button
              onClick={() => setEditing(!editing)}
              style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: editing ? c.paper : c.rust, background: editing ? c.rust : 'transparent', border: `1.5px solid ${c.rust}`, borderRadius: 5, padding: '3px 9px' }}
            >
              {editing ? 'Done' : 'Edit list'}
            </button>
          </div>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 12.5, color: c.inkMuted, marginBottom: 4 }}>
            {editing
              ? 'Tap × to take an item off a list. Type at the bottom of a section to add one — spelling and capitals get tidied automatically.'
              : 'Paul and CJ each tick their own list. Shared kit is carried once — tap PAUL or CJ to allocate it. Adds, removals and ticks sync live between both phones.'}
          </div>

          {personalSection('P')}
          {personalSection('C')}

          <SectionBar label="Shared — one of us brings it" right={`${sharedTotals.done}/${sharedTotals.total}`} />
          {T.sharedKit.map((grp, gi) => {
            const rows = grp.items.map((label, ii) => ({ label, ii })).filter((r) => !removed('S', gi, r.ii))
            if (!rows.length) return null
            const done = rows.filter((r) => !!kit[`pk:S:${gi}_${r.ii}`]).length
            return (
              <div key={gi} style={{ marginBottom: 14 }}>
                <GroupHead label={grp.group} done={done} total={rows.length} />
                {rows.map((r) => {
                  const tick = `pk:S:${gi}_${r.ii}`
                  const al = `al:${gi}_${r.ii}`
                  const who = kit[al] === 'P' || kit[al] === 'C' ? (kit[al] as Who) : null
                  return (
                    <ItemRow
                      key={tick}
                      ticked={!!kit[tick]}
                      label={r.label}
                      onToggle={() => setKit(tick, kit[tick] ? null : '1')}
                      extra={editing ? <RemoveBtn onRemove={() => setKit(`rm:S:${gi}_${r.ii}`, '1')} /> : <AllocChips who={who} onPick={(w) => setKit(al, who === w ? null : w)} />}
                    />
                  )
                })}
              </div>
            )
          })}
          {sharedAdds.length > 0 && (
            <div style={{ marginBottom: 4 }}>
              <GroupHead label="Added" done={sharedAdds.filter((a) => !!kit[`pk:S:${a.id}`]).length} total={sharedAdds.length} />
              {sharedAdds.map((a) => {
                const tick = `pk:S:${a.id}`
                const al = `al:${a.id}`
                const who = kit[al] === 'P' || kit[al] === 'C' ? (kit[al] as Who) : null
                return (
                  <ItemRow
                    key={a.id}
                    ticked={!!kit[tick]}
                    label={a.label}
                    onToggle={() => setKit(tick, kit[tick] ? null : '1')}
                    extra={editing ? <RemoveBtn onRemove={() => removeAdded('S', a.id)} /> : <AllocChips who={who} onPick={(w) => setKit(al, who === w ? null : w)} />}
                  />
                )
              })}
            </div>
          )}
          <AddRow placeholder="Add shared kit…" onAdd={(label) => addItem('S', label)} />
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 11.5, color: c.inkFainter, lineHeight: 1.5, marginTop: 8 }}>
            Unallocated shared items belong to nobody yet — divvy them up before the panniers close.
          </div>
        </>
      )}
    </div>
  )
}
