import { useState } from 'react'
import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'
import { reasonList, reasonMeta } from '../lib/tags'
import { relTime } from '../lib/time'
import { Kicker, ScreenTitle, Lede, Dropdown } from '../components/ui'
import { PhotoInput } from '../components/PhotoInput'
import { Photos } from '../components/PhotoGallery'

export function Postbox() {
  const s = useStore()
  const {
    isBrother,
    isGuest,
    store,
    postName,
    postReason,
    postMsg,
    postErr,
    setPostName,
    selectReason,
    setPostMsg,
    submitPost,
    clearPosts,
    removePost,
    openDD,
    toggleDD,
    closeDD,
  } = s

  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const doSubmit = async () => {
    if (busy) return
    setBusy(true)
    try {
      // Only a sent message clears the composer — a validation miss (no name)
      // must not throw away photos the guest already attached.
      if (await submitPost(files)) setFiles([])
    } finally {
      setBusy(false)
    }
  }

  const posts = store.posts || []
  const postList = posts.map((p) => {
    const m = reasonMeta[p.reason] || reasonMeta.Comment
    return { ...p, verb: m.verb, tagInk: m.ink, tagBg: m.bg, when: relTime(p.ts) }
  })

  return (
    <div style={{ animation: 'waw-fade .35s ease both', padding: '18px 16px 28px' }}>
      <Kicker>Recommendations · questions · hellos</Kicker>
      <ScreenTitle>The Postbox</ScreenTitle>
      {isGuest ? (
        <Lede>Leave the brothers a tip, a question or just a hello. It shows up on the home screen for everyone following along.</Lede>
      ) : (
        <Lede>Everything friends &amp; family have posted. Remove anything you don’t want to keep.</Lede>
      )}

      {isGuest && (
        <div style={{ marginTop: 16, border: `1.5px solid ${c.ink}`, borderRadius: 10, background: c.paper, padding: '13px 14px' }}>
          <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.14em', color: c.inkFaintest, textTransform: 'uppercase', marginBottom: 6 }}>Your name</div>
          <input
            value={postName}
            onChange={(e) => setPostName(e.target.value)}
            placeholder="Full Name"
            aria-label="Your name"
            maxLength={60}
            style={{ width: '100%', border: `1.5px solid ${c.ink}`, borderRadius: 7, background: c.inputBg, padding: '10px 12px', fontFamily: font.display, fontWeight: 600, fontSize: 14, color: c.ink }}
          />

          <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.14em', color: c.inkFaintest, textTransform: 'uppercase', margin: '12px 0 6px' }}>This is a…</div>
          <Dropdown
            label={postReason}
            open={openDD === 'reason'}
            onToggle={() => toggleDD('reason')}
            onClose={closeDD}
            overlay
            options={reasonList.map((r) => ({ label: r, pick: () => selectReason(r) }))}
          />

          <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.14em', color: c.inkFaintest, textTransform: 'uppercase', margin: '12px 0 6px' }}>Message</div>
          <textarea
            value={postMsg}
            onChange={(e) => setPostMsg(e.target.value)}
            rows={3}
            placeholder="Say your piece…"
            aria-label="Your message"
            maxLength={500}
            style={{ width: '100%', border: `1.5px solid ${c.ink}`, borderRadius: 7, background: c.inputBg, padding: '10px 12px', fontFamily: font.serif, fontSize: 13.5, color: c.inkSoft, resize: 'none', lineHeight: 1.5 }}
          />

          <PhotoInput
            files={files}
            onAdd={(fs) => setFiles((prev) => [...prev, ...fs])}
            onRemove={(i) => setFiles((prev) => prev.filter((_, j) => j !== i))}
            disabled={busy}
          />

          {postErr && <div style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.04em', color: c.rust, marginTop: 8 }}>Add your name and a message first.</div>}
          <button
            onClick={doSubmit}
            disabled={busy}
            style={{ width: '100%', marginTop: 10, border: `1.5px solid ${c.ink}`, borderRadius: 8, background: busy ? c.inkFainter : c.rust, color: '#f6ecd6', padding: 12, textAlign: 'center', fontFamily: font.display, fontWeight: 700, fontSize: 14, textTransform: 'uppercase', letterSpacing: '.06em' }}
          >
            {busy ? 'Sending…' : 'Pin it to the board'}
          </button>
        </div>
      )}

      {posts.length > 0 ? (
        <>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '22px 0 4px' }}>
            <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 18, textTransform: 'uppercase', color: c.ink }}>On the board</div>
            {isBrother && (
              <button onClick={clearPosts} style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.04em', color: c.inkFaintest }}>
                Clear all
              </button>
            )}
          </div>
          {postList.map((p) => (
            <div key={p.ts} style={{ border: `1.5px solid ${c.ink}`, borderRadius: 9, background: c.paper, padding: '11px 13px', marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontFamily: font.mono, fontSize: 7.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: p.tagInk, background: p.tagBg, border: `1px solid ${p.tagInk}`, borderRadius: 3, padding: '1px 5px' }}>{p.reason}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 0 auto' }}>
                  {p.pending && <span style={{ fontFamily: font.mono, fontSize: 7.5, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: c.amberGold, border: `1px solid ${c.amber}`, borderRadius: 3, padding: '1px 5px' }}>not sent</span>}
                  <span style={{ fontFamily: font.mono, fontSize: 8.5, color: c.inkFaintest }}>{p.when}</span>
                  {isBrother && (
                    <button onClick={() => removePost(p.ts)} aria-label="Remove" style={{ width: 30, height: 30, border: `1.5px solid ${c.rust}`, borderRadius: '50%', color: c.rust, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.display, fontSize: 13, lineHeight: 1, flex: '0 0 auto' }}>
                      ×
                    </button>
                  )}
                </div>
              </div>
              <div style={{ fontFamily: font.serif, fontSize: 14, color: c.inkSoft, lineHeight: 1.5, marginTop: 6 }}>
                <b style={{ fontFamily: font.display, fontWeight: 600, fontSize: 13, letterSpacing: '.02em', textTransform: 'uppercase', color: c.ink }}>
                  {p.name} {p.verb}
                </b>{' '}
                {p.msg}
              </div>
              <Photos photo={p.photo} alt={p.name ? `Photo from ${p.name}` : 'Trip photo'} maxHeight={240} />
            </div>
          ))}
        </>
      ) : (
        <div style={{ marginTop: 20, border: `1.5px dashed ${c.line}`, borderRadius: 10, padding: '22px 18px', textAlign: 'center' }}>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 13.5, color: c.inkFainter, lineHeight: 1.55 }}>
            {isGuest ? 'Nothing on the board yet. Be the first to leave the brothers a message.' : 'Nothing on the board yet. Messages from friends & family will land here.'}
          </div>
        </div>
      )}
    </div>
  )
}
