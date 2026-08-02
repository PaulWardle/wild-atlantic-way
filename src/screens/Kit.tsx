import { useEffect, useState, type ReactNode } from 'react'
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

/** Custom items added to one section ('P'/'C'/'S' packing, 'T' to-dos), oldest first. */
function addedItems(kit: Record<string, string>, sec: string): Array<{ id: string; label: string }> {
  const pre = `add:${sec}:`
  return Object.entries(kit)
    .filter(([k]) => k.startsWith(pre))
    .map(([k, label]) => ({ id: k.slice(pre.length), label }))
    .sort((a, b) => (a.id < b.id ? -1 : 1))
}

/** New-item input: phone autocorrect on, then our kit-word tidy on commit.
 * `boxed` renders it as a dashed card matching the To-do card style. */
function AddRow({ placeholder, onAdd, boxed = false }: { placeholder: string; onAdd: (label: string) => void; boxed?: boolean }) {
  const [txt, setTxt] = useState('')
  const commit = () => {
    const v = normalizeItem(txt)
    if (v) onAdd(v)
    setTxt('')
  }
  const outer: React.CSSProperties = boxed
    ? { display: 'flex', gap: 11, alignItems: 'center', border: `1.5px dashed ${c.inkFainter}`, borderRadius: 8, background: 'transparent', padding: '11px 12px', marginBottom: 7 }
    : { display: 'flex', gap: 10, alignItems: 'center', padding: '6px 2px' }
  return (
    <div style={outer}>
      <div style={{ flex: `0 0 ${boxed ? 21 : 19}px`, height: boxed ? 21 : 19, borderRadius: boxed ? 5 : 4, border: `1.5px dashed ${c.inkFainter}` }} />
      <input
        value={txt}
        onChange={(e) => setTxt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit()
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        autoCapitalize="sentences"
        autoCorrect="on"
        spellCheck
        style={{ flex: 1, border: 'none', borderBottom: boxed ? 'none' : `1px dashed ${c.lineSoft}`, background: 'transparent', fontFamily: font.serif, fontSize: 13.5, color: c.inkSoft, padding: '3px 2px' }}
      />
      {txt.trim() !== '' && (
        <button onClick={commit} style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: c.paper, background: c.green, border: `1.5px solid ${c.green}`, borderRadius: 4, padding: '3px 9px' }}>
          Add
        </button>
      )}
    </div>
  )
}

/** SVG cross — a text × sits on a font baseline and drifts off-centre. */
function RemoveBtn({ onRemove }: { onRemove: () => void }) {
  return (
    <button onClick={onRemove} aria-label="Remove item" style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, background: c.amberPanelDeep, border: `1.5px solid ${c.rust}`, borderRadius: 4, padding: 0 }}>
      <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke={c.rust} strokeWidth={3.4} strokeLinecap="round" aria-hidden="true">
        <path d="M5 5 L19 19 M19 5 L5 19" />
      </svg>
    </button>
  )
}

const SEC_SHORT: Record<Sec, string> = { P: 'P', C: 'CJ', S: 'SH' }

/** Edit-mode controls: shuffle an item to another list, or bin it. `dests`
 * narrows the move targets — personal STOCK items only offer →SH, because both
 * brothers share the same personal template so a P↔C "move" would just make
 * the item vanish from one list. */
function EditControls({ current, onMove, onRemove, dests }: { current: Sec; onMove: (dest: Sec) => void; onRemove: () => void; dests?: Sec[] }) {
  return (
    <div style={{ display: 'flex', gap: 4, flex: '0 0 auto', alignItems: 'center' }}>
      {(dests ?? (['P', 'C', 'S'] as Sec[]).filter((s) => s !== current))
        .map((s) => (
          <button
            key={s}
            onClick={() => onMove(s)}
            style={{ fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.04em', color: c.teal, background: c.tealPanel, border: `1.5px solid ${c.teal}`, borderRadius: 4, padding: '3px 6px' }}
          >
            →{SEC_SHORT[s]}
          </button>
        ))}
      <RemoveBtn onRemove={onRemove} />
    </div>
  )
}

function ItemRow({ ticked, label, onToggle, extra }: { ticked: boolean; label: string; onToggle: () => void; extra?: ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 2px' }}>
      <button onClick={onToggle} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left', background: 'none', border: 'none', padding: 0 }}>
        <div style={{ flex: '0 0 19px', height: 19, borderRadius: 4, border: `1.5px solid ${ticked ? c.green : c.ink}`, background: ticked ? c.green : c.paper, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {ticked && (
            <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="#eef0e0" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12.5 L10 18.5 L20 6.5" />
            </svg>
          )}
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
        style={{ fontFamily: font.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: on ? c.paper : c.inkFaint, background: on ? c.teal : c.paperMuted, border: `1.5px solid ${on ? c.teal : c.inkFainter}`, borderRadius: 4, padding: '6px 10px' }}
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


/** One To-do card — label and tick, nothing else. Stock and custom items look
 * identical; in edit mode a centred × removes either. */
function TodoCard({ label, ticked, onToggle, onRemove }: { label: string; ticked: boolean; onToggle: () => void; onRemove?: () => void }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 11, border: `1.5px solid ${c.ink}`, borderRadius: 8, background: c.paper, padding: '11px 12px', marginBottom: 7 }}>
      <button onClick={onToggle} style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 11, textAlign: 'left', background: 'none', border: 'none', padding: 0 }}>
        <div style={{ flex: '0 0 21px', height: 21, borderRadius: 5, border: `1.5px solid ${ticked ? c.green : c.ink}`, background: ticked ? c.green : c.paper, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {ticked && (
            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="#eef0e0" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12.5 L10 18.5 L20 6.5" />
            </svg>
          )}
        </div>
        <span style={{ flex: 1, fontFamily: font.display, fontWeight: 600, fontSize: 14.5, textTransform: 'uppercase', color: c.ink, lineHeight: 1.2 }}>{label}</span>
      </button>
      {onRemove && <RemoveBtn onRemove={onRemove} />}
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
  const { store, kitTab, setKitTab, setKit, isBrother } = useStore()
  const [editing, setEditing] = useState(false)
  // Which packing list is on screen — remembered per phone.
  const [packView, setPackViewState] = useState<Sec>(() => {
    try {
      const v = localStorage.getItem('waw:packview')
      return v === 'C' || v === 'S' ? v : 'P'
    } catch {
      return 'P'
    }
  })
  const setPackView = (v: Sec) => {
    setPackViewState(v)
    try {
      localStorage.setItem('waw:packview', v)
    } catch {
      /* noop */
    }
  }
  const kit = store.kit || {}
  const book = store.book || {}
  const tab = kitTab === 'todo' ? 'todo' : 'packing'
  // Stock to-dos minus any removed; ticks live in the synced kit table with the
  // old device-local flags as a read-only fallback so nobody loses progress.
  const visibleBookings = T.bookings.filter((b) => !kit[`rm:B:${b.id}`])
  const bookTicked = (id: string) => (kit[`pk:B:${id}`] != null ? kit[`pk:B:${id}`] === '1' : !!book[id])

  const removed = (sec: Sec, gi: number, ii: number) => !!kit[`rm:${sec}:${gi}_${ii}`]

  // "Already on the list" flash for the add rows — a silent no-op reads as a
  // broken add button.
  const [dupMsg, setDupMsg] = useState('')
  useEffect(() => {
    if (!dupMsg) return
    const t = window.setTimeout(() => setDupMsg(''), 2500)
    return () => window.clearTimeout(t)
  }, [dupMsg])

  // Brothers only — the tiles that lead here are already gated, but the nav
  // history isn't a security boundary and setKit writes to the shared table.
  // (After every hook, so a mid-session role switch can't corrupt hook order.)
  if (!isBrother) return null

  /** Add a typed item to a section. Re-typing a removed stock item restores it
   * (clears the rm: tombstone) instead of minting an add: duplicate; a true
   * duplicate flashes a note. `quiet` = internal move, no flash. */
  const addItem = (sec: Sec, label: string, quiet = false) => {
    const lower = label.toLowerCase()
    const stock = sec === 'S' ? T.sharedKit : T.packing
    for (let gi = 0; gi < stock.length; gi++) {
      for (let ii = 0; ii < stock[gi].items.length; ii++) {
        if (stock[gi].items[ii].toLowerCase() === lower && removed(sec, gi, ii)) {
          setKit(`rm:${sec}:${gi}_${ii}`, null)
          return
        }
      }
    }
    const have = new Set<string>()
    stock.forEach((g, gi) =>
      g.items.forEach((it, ii) => {
        if (!removed(sec, gi, ii)) have.add(it.toLowerCase())
      }),
    )
    addedItems(kit, sec).forEach((a) => have.add(a.label.toLowerCase()))
    if (have.has(lower)) {
      if (!quiet) setDupMsg(`“${label}” is already on the list`)
      return
    }
    setKit(`add:${sec}:a${Date.now()}`, label)
  }

  /** Delete a custom item and everything hanging off it. */
  const removeAdded = (sec: Sec, id: string) => {
    setKit(`add:${sec}:${id}`, null)
    setKit(`pk:${sec}:${id}`, null)
    if (sec === 'S') setKit(`al:${id}`, null)
  }

  /** Reset the list on screen: untick everything and restore removed stock
   * items. Added items and shared allocations are kept — they're decisions,
   * not progress. */
  const resetView = () => {
    const name = packView === 'S' ? 'the SHARED list' : `${WHO_NAME[packView as Who]}’s list`
    if (!window.confirm(`Reset ${name}?\n\nUnticks everything and restores any removed items. Your added items (and who-carries-what) are kept.`)) return
    Object.keys(kit).forEach((k) => {
      if (k.startsWith(`pk:${packView}:`) || k.startsWith(`rm:${packView}:`)) setKit(k, null)
    })
  }

  /** Shuffle a stock item to another list: off here, added there (deduped). */
  const moveStock = (sec: Sec, gi: number, ii: number, label: string, dest: Sec) => {
    addItem(dest, label, true)
    setKit(`rm:${sec}:${gi}_${ii}`, '1')
  }
  const moveAdded = (sec: Sec, id: string, label: string, dest: Sec) => {
    addItem(dest, label, true)
    removeAdded(sec, id)
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
    const adds = addedItems(kit, who)
    return (
      <div key={who}>
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
                    extra={editing ? <EditControls current={who} dests={['S']} onMove={(d) => moveStock(who, gi, r.ii, r.label, d)} onRemove={() => setKit(`rm:${who}:${gi}_${r.ii}`, '1')} /> : undefined}
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
                  extra={editing ? <EditControls current={who} onMove={(d) => moveAdded(who, a.id, a.label, d)} onRemove={() => removeAdded(who, a.id)} /> : undefined}
                />
              )
            })}
          </div>
        )}
        <AddRow placeholder={`Add to ${WHO_NAME[who]}’s list…`} onAdd={(label) => addItem(who, label)} />
        {dupMsg && <div role="status" style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.04em', color: c.rust, padding: '4px 2px 0' }}>{dupMsg}</div>}
      </div>
    )
  }

  const sharedAdds = addedItems(kit, 'S')
  const todoAdds = addedItems(kit, 'T')

  return (
    <div style={{ animation: 'waw-fade .35s ease both', padding: '16px 16px 28px' }}>
      <div style={{ display: 'flex', gap: 3, border: `1.5px solid ${c.ink}`, borderRadius: 9, padding: 3, background: c.paperMuted, marginBottom: 16 }}>
        <button onClick={() => setKitTab('todo')} style={tabStyle(tab === 'todo')}>To do</button>
        <button onClick={() => setKitTab('packing')} style={tabStyle(tab === 'packing')}>Packing</button>
      </div>

      {tab === 'todo' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
            <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 24, textTransform: 'uppercase', color: c.ink }}>To do</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontFamily: font.mono, fontSize: 11, color: c.green }}>
                {visibleBookings.filter((b) => bookTicked(b.id)).length + todoAdds.filter((a) => !!kit[`pk:T:${a.id}`]).length}/{visibleBookings.length + todoAdds.length}
              </span>
              <button
                onClick={() => setEditing(!editing)}
                style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: editing ? c.paper : c.rust, background: editing ? c.rust : 'transparent', border: `1.5px solid ${c.rust}`, borderRadius: 5, padding: '3px 9px' }}
              >
                {editing ? 'Done' : 'Edit'}
              </button>
            </div>
          </div>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 12.5, color: c.inkMuted, marginBottom: 12 }}>
            {editing
              ? 'Tap × to remove any item — reword one by removing it and adding your own version.'
              : 'The admin to square away — add anything that comes up on the road; it syncs to both phones.'}
          </div>
          {visibleBookings.map((b) => (
            <TodoCard
              key={b.id}
              label={b.label}
              ticked={bookTicked(b.id)}
              onToggle={() => setKit(`pk:B:${b.id}`, bookTicked(b.id) ? '0' : '1')}
              onRemove={editing ? () => { if (window.confirm(`Remove \u201c${b.label}\u201d from the list on both phones?`)) setKit(`rm:B:${b.id}`, '1') } : undefined}
            />
          ))}
          {todoAdds.map((a) => {
            const k = `pk:T:${a.id}`
            return (
              <TodoCard
                key={a.id}
                label={a.label}
                ticked={!!kit[k]}
                onToggle={() => setKit(k, kit[k] ? null : '1')}
                onRemove={editing ? () => {
                  setKit(`add:T:${a.id}`, null)
                  setKit(k, null)
                } : undefined}
              />
            )
          })}
          <AddRow boxed placeholder="Add a to-do…" onAdd={(label) => {
            const have = new Set([...todoAdds.map((a) => a.label.toLowerCase()), ...visibleBookings.map((b) => b.label.toLowerCase())])
            if (!have.has(label.toLowerCase())) setKit(`add:T:a${Date.now()}`, label)
          }} />
          {editing && T.bookings.some((b) => kit[`rm:B:${b.id}`]) && (
            <button
              onClick={() => T.bookings.forEach((b) => { if (kit[`rm:B:${b.id}`]) setKit(`rm:B:${b.id}`, null) })}
              style={{ display: 'block', margin: '10px auto 0', fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: c.teal, background: 'none', border: 'none', textDecoration: 'underline' }}
            >
              restore removed items
            </button>
          )}
        </>
      )}

      {tab === 'packing' && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 24, textTransform: 'uppercase', color: c.ink }}>Packing</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={resetView}
                style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: c.inkFaint, background: 'transparent', border: `1.5px solid ${c.inkFainter}`, borderRadius: 5, padding: '3px 9px' }}
              >
                Reset
              </button>
              <button
                onClick={() => setEditing(!editing)}
                style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: editing ? c.paper : c.rust, background: editing ? c.rust : 'transparent', border: `1.5px solid ${c.rust}`, borderRadius: 5, padding: '3px 9px' }}
              >
                {editing ? 'Done' : 'Edit list'}
              </button>
            </div>
          </div>

          {/* One list at a time: whose kit are we looking at? */}
          <div style={{ display: 'flex', gap: 3, border: `1.5px solid ${c.ink}`, borderRadius: 9, padding: 3, background: c.paperMuted, marginBottom: 10 }}>
            {(['P', 'C', 'S'] as Sec[]).map((v) => {
              const n = sectionCount(v)
              const on = packView === v
              return (
                <button key={v} onClick={() => setPackView(v)} style={{ ...tabStyle(on), display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <span>{v === 'S' ? 'Shared' : WHO_NAME[v]}</span>
                  <span style={{ fontFamily: font.mono, fontSize: 8, fontWeight: 400, color: on ? (n.done === n.total ? '#b5d0a0' : c.gold) : c.inkFainter }}>
                    {n.done}/{n.total}
                  </span>
                </button>
              )
            })}
          </div>

          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 12.5, color: c.inkMuted, marginBottom: 10 }}>
            {editing
              ? 'Tap × to remove an item, or the arrow chips to move it to another list. Type at the bottom to add — spelling and capitals get tidied.'
              : packView === 'S'
                ? 'Carried once between the pair — tap PAUL or CJ on an item to allocate who brings it.'
                : `${WHO_NAME[packView as Who]}’s own list — ticks sync live to the other phone.`}
          </div>

          {packView !== 'S' && personalSection(packView as Who)}

          {packView === 'S' && (
            <>
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
                      extra={editing ? <EditControls current="S" onMove={(d) => moveStock('S', gi, r.ii, r.label, d)} onRemove={() => setKit(`rm:S:${gi}_${r.ii}`, '1')} /> : <AllocChips who={who} onPick={(w) => setKit(al, who === w ? null : w)} />}
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
                    extra={editing ? <EditControls current="S" onMove={(d) => moveAdded('S', a.id, a.label, d)} onRemove={() => removeAdded('S', a.id)} /> : <AllocChips who={who} onPick={(w) => setKit(al, who === w ? null : w)} />}
                  />
                )
              })}
            </div>
          )}
              <AddRow placeholder="Add shared kit…" onAdd={(label) => addItem('S', label)} />
              {dupMsg && <div role="status" style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.04em', color: c.rust, padding: '4px 2px 0' }}>{dupMsg}</div>}
              <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 11.5, color: c.inkFainter, lineHeight: 1.5, marginTop: 8 }}>
                Unallocated shared items belong to nobody yet — divvy them up before the panniers close.
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
