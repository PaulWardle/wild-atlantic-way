import { useState } from 'react'
import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { isMarkable, jTagOptions, markKey } from '../lib/tags'
import { buildEvents, buildFeed, buildGallery, buildGroups } from '../lib/journal'
import { Cross, Kicker, ScreenTitle, Lede, Dropdown } from '../components/ui'
import { PhotoInput } from '../components/PhotoInput'
import { ReplyBox, ReplyRows } from '../components/ReplyBox'
import { fmtTime } from '../lib/time'
import { PhotoGallery, Photos } from '../components/PhotoGallery'

const meta = tripData.meta

export function Journal() {
  const s = useStore()
  const {
    isBrother,
    store,
    savePDF,
    downloadBackup,
    jNote,
    setJNote,
    jAuthor,
    selectAuthor,
    jTag,
    jTagOther,
    setJTagOther,
    selectJTag,
    customTags,
    addCustomTag,
    jDay,
    selectJDay,
    jTime,
    setJTime,
    addNote,
    jEditTs,
    jEditText,
    setJEditText,
    saveEditNote,
    cancelEditNote,
    startEditNote,
    removeNote,
    removePost,
    removeLocation,
    openDD,
    toggleDD,
  } = s

  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const doAddNote = async () => {
    if (busy) return
    setBusy(true)
    try {
      await addNote(files)
      setFiles([])
    } finally {
      setBusy(false)
    }
  }

  const events = buildEvents(store, tripData)
  const feed = buildFeed(events)
  const latest = feed[0]
  const groups = buildGroups(events, tripData)
  const gallery = buildGallery(events)
  const [showGallery, setShowGallery] = useState(false)

  // marks summary
  const marks = store.marks || {}
  let keep = 0
  let maybe = 0
  let cut = 0
  tripData.days.forEach((dd, di) =>
    (dd.stops || []).forEach((st, si) => {
      if (!isMarkable(dd, st)) return
      const mk = marks[markKey(di, si)]
      if (mk === 'keep') keep++
      else if (mk === 'maybe') maybe++
      else if (mk === 'cut') cut++
    }),
  )
  const hasMarks = keep + maybe + cut > 0 && isBrother

  let jDepartMs = 0
  try {
    jDepartMs = new Date(meta.depart + 'T00:00:00').getTime()
  } catch {
    jDepartMs = 0
  }
  const jDayOptions = [{ label: 'Today', val: 'today' as number | string }].concat(
    tripData.days.map((d, i) => ({ label: 'Day ' + d.n + ' · ' + d.dow + ' ' + d.date, val: jDepartMs + i * 86400000 })),
  )
  const jDayLabel = jDay === 'today' ? 'Today' : (jDayOptions.find((x) => x.val === jDay) || { label: 'Today' }).label
  // Built-in tags + the brothers' own custom tags, with "Other" kept last.
  const tagOpts = [...jTagOptions.filter((t) => t !== 'Other'), ...customTags, 'Other']

  const authTab = (label: string, active: boolean, onClick: () => void) => (
    <button onClick={onClick} aria-pressed={active} style={{ flex: 1, borderRadius: 6, padding: '8px 4px', textAlign: 'center', fontFamily: font.display, fontWeight: 600, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '.03em', background: active ? c.ink : 'transparent', color: active ? c.paper : c.inkMuted }}>
      {label}
    </button>
  )

  return (
    <div style={{ animation: 'waw-fade .35s ease both', padding: '18px 16px 28px' }}>
      <div className="waw-noprint">
        <Kicker>The record · kept forever</Kicker>
        <ScreenTitle>Journal</ScreenTitle>
        <Lede>Every ping, decision, message and note — stitched into a day-by-day record to look back on.</Lede>
      </div>

      {/* Print-only cover */}
      <div className="waw-printonly" style={{ textAlign: 'center', padding: '2px 0 12px', marginBottom: 10, borderBottom: `2px solid ${c.ink}` }}>
        <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: c.rust }}>{meta.kicker}</div>
        <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 34, textTransform: 'uppercase', color: c.ink, lineHeight: 1, margin: '6px 0 5px' }}>{meta.title}</div>
        <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 15, color: c.inkMuted }}>{meta.route} · {meta.dates}</div>
      </div>

      {isBrother && (
        <>
          <div className="waw-noprint" style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <button onClick={savePDF} style={{ flex: 1, border: `1.5px solid ${c.ink}`, borderRadius: 8, background: c.ink, color: c.paper, padding: 11, textAlign: 'center', fontFamily: font.display, fontWeight: 700, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '.05em' }}>
              Save Trip Book (PDF)
            </button>
            <button onClick={downloadBackup} style={{ flex: '0 0 auto', border: `1.5px solid ${c.ink}`, borderRadius: 8, background: c.paper, color: c.ink, padding: '11px 14px', textAlign: 'center', fontFamily: font.display, fontWeight: 700, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '.05em' }}>
              Backup
            </button>
          </div>
          <div className="waw-noprint" style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 11.5, color: c.inkFainter, lineHeight: 1.45, marginTop: 7 }}>
            Saves the whole record as a PDF to keep forever — best saved while online — the photos need a connection. Best done at journey’s end.
          </div>
        </>
      )}

      {latest && (
        <div className="waw-noprint" style={{ marginTop: 18 }}>
          <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.14em', color: c.inkFaintest, textTransform: 'uppercase', marginBottom: 8 }}>Latest</div>
          <div style={{ border: `1.5px solid ${c.ink}`, borderRadius: 10, background: c.paper, padding: '14px 15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
              <span style={{ fontFamily: font.mono, fontSize: 7.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: latest.tagInk, background: latest.tagBg, border: `1px solid ${latest.tagInk}`, borderRadius: 3, padding: '1px 6px' }}>{latest.tag}</span>
              <span style={{ fontFamily: font.mono, fontSize: 8.5, color: c.inkFaintest, whiteSpace: 'nowrap' }}>{latest.when}</span>
            </div>
            {latest.hasTitle && <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 16, textTransform: 'uppercase', color: c.ink, lineHeight: 1.15, letterSpacing: '.01em' }}>{latest.title}</div>}
            {latest.hasAuthor && <div style={{ fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: c.inkMuted, marginTop: 3 }}>{latest.author}</div>}
            {latest.hasBody && <div style={{ fontFamily: font.serif, fontSize: 13.5, color: c.inkBody2, lineHeight: 1.5, marginTop: 6 }}>{latest.body}</div>}
            <Photos photo={latest.photo} alt={latest.title ? `Photo — ${latest.title}` : 'Trip photo'} maxHeight={220} />
          </div>
        </div>
      )}

      {gallery.length > 0 && (
        <div className="waw-noprint" style={{ marginTop: 18 }}>
          <button
            onClick={() => setShowGallery((v) => !v)}
            aria-expanded={showGallery}
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, border: `1.5px solid ${c.ink}`, borderRadius: 9, background: c.paperMuted, padding: '10px 13px' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke={c.ink} strokeWidth={1.8} strokeLinejoin="round" aria-hidden="true">
                <rect x={3} y={3} width={7.5} height={7.5} rx={1.2} />
                <rect x={13.5} y={3} width={7.5} height={7.5} rx={1.2} />
                <rect x={3} y={13.5} width={7.5} height={7.5} rx={1.2} />
                <rect x={13.5} y={13.5} width={7.5} height={7.5} rx={1.2} />
              </svg>
              <span style={{ fontFamily: font.display, fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.03em', color: c.ink }}>
                Gallery
              </span>
              <span style={{ fontFamily: font.mono, fontSize: 9, color: c.inkFainter }}>{gallery.length} photo{gallery.length === 1 ? '' : 's'}</span>
            </span>
            <span style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.06em', color: c.rust, textTransform: 'uppercase' }}>{showGallery ? 'Hide' : 'View grid'}</span>
          </button>
          {showGallery && (
            <div style={{ marginTop: 10 }}>
              <PhotoGallery photos={gallery} />
            </div>
          )}
        </div>
      )}

      {isBrother && (
        <div className="waw-noprint" style={{ marginTop: 16, border: `1.5px solid ${c.ink}`, borderRadius: 10, background: c.paper, padding: '13px 14px' }}>
          <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.14em', color: c.inkFaintest, textTransform: 'uppercase', marginBottom: 6 }}>Who’s writing</div>
          <div style={{ display: 'flex', gap: 4, border: `1.5px solid ${c.ink}`, borderRadius: 8, padding: 3, background: c.paperMuted, marginBottom: 12 }}>
            {authTab('Paul', (jAuthor || 'Paul') === 'Paul', () => selectAuthor('Paul'))}
            {authTab('CJ', jAuthor === 'CJ', () => selectAuthor('CJ'))}
          </div>
          <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.14em', color: c.inkFaintest, textTransform: 'uppercase', marginBottom: 6 }}>Add a note</div>
          <textarea
            value={jNote}
            onChange={(e) => setJNote(e.target.value)}
            rows={2}
            placeholder="What happened…"
            aria-label="Journal note"
            maxLength={2000}
            style={{ width: '100%', border: `1.5px solid ${c.ink}`, borderRadius: 7, background: c.inputBg, padding: '10px 12px', fontFamily: font.serif, fontSize: 13.5, color: c.inkSoft, resize: 'none', lineHeight: 1.5 }}
          />
          <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.14em', color: c.inkFaintest, textTransform: 'uppercase', margin: '11px 0 6px' }}>Tag</div>
          <Dropdown label={jTag || 'Update'} open={openDD === 'jtag'} onToggle={() => toggleDD('jtag')} options={tagOpts.map((t) => ({ label: t, pick: () => selectJTag(t) }))} />
          {(jTag || 'Update') === 'Other' && (
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <input
                value={jTagOther}
                onChange={(e) => setJTagOther(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && jTagOther.trim()) addCustomTag(jTagOther) }}
                placeholder="Name your tag"
                aria-label="Custom tag name"
                maxLength={40}
                style={{ flex: 1, minWidth: 0, border: `1.5px solid ${c.ink}`, borderRadius: 7, background: c.inputBg, padding: '9px 11px', fontFamily: font.display, fontWeight: 600, fontSize: 13, textTransform: 'uppercase', color: c.ink }}
              />
              <button
                onClick={() => jTagOther.trim() && addCustomTag(jTagOther)}
                aria-label="Add this tag to the list"
                title="Add to tag list"
                style={{ flex: '0 0 auto', border: `1.5px solid ${c.ink}`, borderRadius: 7, background: c.ink, color: c.paper, padding: '0 15px', fontFamily: font.display, fontWeight: 700, fontSize: 18, lineHeight: 1 }}
              >
                +
              </button>
            </div>
          )}
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.14em', color: c.inkFaintest, textTransform: 'uppercase', margin: '11px 0 6px' }}>File under</div>
              <Dropdown label={jDayLabel} open={openDD === 'jday'} onToggle={() => toggleDD('jday')} options={jDayOptions.map((o) => ({ label: o.label, pick: () => selectJDay(o.val) }))} />
            </div>
            <div style={{ flex: '0 0 118px', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.14em', color: c.inkFaintest, textTransform: 'uppercase', margin: '11px 0 6px' }}>At time</div>
              {/* appearance:none — iOS gives time inputs a stubborn intrinsic
                  width that ignores the column and paints past the screen edge.
                  The flex stretch matters too: with the chrome stripped, an
                  EMPTY time input has no inner content and collapses shorter
                  than the dropdown beside it until a value fills it. */}
              <input
                type="time"
                value={jTime}
                onChange={(e) => setJTime(e.target.value)}
                aria-label="Time for this entry"
                style={{ flex: 1, width: '100%', minWidth: 0, maxWidth: '100%', boxSizing: 'border-box', WebkitAppearance: 'none', appearance: 'none', border: `1.5px solid ${c.ink}`, borderRadius: 7, background: c.inputBg, padding: '0 9px', fontFamily: font.mono, fontSize: 13, color: c.ink }}
              />
            </div>
          </div>
          <PhotoInput
            files={files}
            onAdd={(fs) => setFiles((prev) => [...prev, ...fs])}
            onRemove={(i) => setFiles((prev) => prev.filter((_, j) => j !== i))}
            disabled={busy}
          />
          <button onClick={doAddNote} disabled={busy} style={{ width: '100%', marginTop: 10, border: `1.5px solid ${c.ink}`, borderRadius: 8, background: busy ? c.inkFainter : c.ink, color: c.paper, padding: 11, textAlign: 'center', fontFamily: font.display, fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.06em' }}>
            {busy ? 'Saving…' : '+ Add to journal'}
          </button>
        </div>
      )}

      {hasMarks && (
        <div style={{ marginTop: 14, border: `1.5px solid ${c.ink}`, borderRadius: 9, background: c.paperMuted, padding: '10px 13px' }}>
          <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.14em', color: c.ink, textTransform: 'uppercase', marginBottom: 8 }}>Stops decided so far</div>
          <div style={{ display: 'flex', gap: 7 }}>
            {[
              { n: keep, l: 'keep', color: c.green, bg: c.greenPanel },
              { n: maybe, l: 'maybe', color: c.amberGold, bg: c.amberPanel },
              { n: cut, l: 'cut', color: c.rust, bg: c.amberPanelDeep },
            ].map((t, i) => (
              <div key={i} style={{ flex: 1, border: `1.5px solid ${t.color}`, borderRadius: 7, padding: '7px 4px', textAlign: 'center', background: t.bg }}>
                <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 18, color: t.color, lineHeight: 1 }}>{t.n}</div>
                <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.08em', color: t.color, textTransform: 'uppercase', marginTop: 2 }}>{t.l}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {groups.length > 0 ? (
        groups.map((g) => (
          <div key={g.key} style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, borderBottom: `1.5px solid ${c.ink}`, paddingBottom: 5, marginBottom: 11 }}>
              {g.hasDay && <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 17, textTransform: 'uppercase', color: c.rust }}>{g.dayLabel}</span>}
              <span style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: '.06em', color: c.inkMuted, textTransform: 'uppercase' }}>{g.dateLabel}</span>
            </div>
            {g.entries.map((e, ei) => {
              const editing = e.isNote && jEditTs === e.noteTs
              return (
                <div key={ei} style={{ display: 'flex', gap: 9, padding: '0 0 13px' }}>
                  <div style={{ flex: '0 0 40px', fontFamily: font.mono, fontSize: 9, color: c.inkFaintest, textAlign: 'right', paddingTop: 1, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>{e.time}</div>
                  <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: e.tagInk, marginTop: 2, flex: '0 0 auto' }} />
                    <div style={{ flex: 1, width: 1.5, background: c.lineSoft, marginTop: 2 }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, paddingBottom: 2 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
                        <span style={{ fontFamily: font.mono, fontSize: 7.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: e.tagInk, background: e.tagBg, border: `1px solid ${e.tagInk}`, borderRadius: 3, padding: '1px 5px', whiteSpace: 'nowrap' }}>{e.tag}</span>
                        {e.hasAuthor && <span style={{ fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: c.inkMuted, whiteSpace: 'nowrap' }}>{e.author}</span>}
                      </div>
                      {isBrother && e.kind !== 'bag' && (
                        <div className="waw-noprint" style={{ display: 'flex', alignItems: 'center', gap: 10, flex: '0 0 auto' }}>
                          {e.isNote && (
                            <button onClick={() => startEditNote(e.noteTs as number, e.text)} aria-label="Edit" style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.04em', color: c.teal, textDecoration: 'underline', padding: '10px 8px', margin: '-10px -4px' }}>Edit</button>
                          )}
                          <button
                            onClick={() =>
                              e.isNote
                                ? removeNote(e.noteTs as number)
                                : e.kind === 'post'
                                  ? removePost(e.ts)
                                  : removeLocation(e.ts)
                            }
                            aria-label="Remove"
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '10px 10px', margin: '-10px -6px' }}
                          >
                            <Cross size={11} stroke={c.rust} strokeWidth={3.2} />
                          </button>
                        </div>
                      )}
                    </div>
                    {editing ? (
                      <>
                        <textarea
                          value={jEditText}
                          onChange={(ev) => setJEditText(ev.target.value)}
                          rows={2}
                          style={{ width: '100%', marginTop: 6, border: `1.5px solid ${c.ink}`, borderRadius: 7, background: c.inputBg, padding: '8px 10px', fontFamily: font.serif, fontSize: 13, color: c.inkSoft, resize: 'none', lineHeight: 1.5 }}
                        />
                        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                          <button onClick={cancelEditNote} style={{ border: `1.5px solid ${c.ink}`, borderRadius: 6, background: 'transparent', color: c.ink, padding: '6px 14px', fontFamily: font.display, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em' }}>Cancel</button>
                          <button onClick={saveEditNote} style={{ border: `1.5px solid ${c.ink}`, borderRadius: 6, background: c.ink, color: c.paper, padding: '6px 14px', fontFamily: font.display, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em' }}>Save</button>
                        </div>
                      </>
                    ) : (
                      <>
                        {e.hasTitle && <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 14.5, textTransform: 'uppercase', color: c.ink, lineHeight: 1.15, letterSpacing: '.01em', marginTop: 5 }}>{e.title}</div>}
                        {e.hasBody && <div style={{ fontFamily: font.serif, fontSize: 13, color: c.inkBody2, lineHeight: 1.5, marginTop: 3 }}>{e.body}</div>}
                        <Photos photo={e.photo} alt={e.title ? `Photo — ${e.title}` : 'Trip photo'} maxHeight={220} />
                        <ReplyRows replies={e.replies} fmt={fmtTime} photos={(photo, alt) => <Photos photo={photo} alt={alt} maxHeight={160} />} />
                        {e.kind === 'post' && <ReplyBox parentTs={e.ts} />}
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))
      ) : (
        <div style={{ marginTop: 16, border: `1.5px dashed ${c.line}`, borderRadius: 10, padding: '22px 18px', textAlign: 'center' }}>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 13.5, color: c.inkFainter, lineHeight: 1.55 }}>
            Nothing logged yet. It fills up as you post locations, mark stops, bag Signature spots and add notes — a full record to look back on.
          </div>
        </div>
      )}
    </div>
  )
}
