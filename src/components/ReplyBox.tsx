import { useState, type ReactNode } from 'react'
import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'
import { PhotoInput } from './PhotoInput'

/**
 * Brother-only reply composer for a postbox message: pick who's answering
 * (Paul / CJ), write the comment, optionally attach photos. Collapsed to a
 * small "Reply" link until tapped. The reply rides the posts pipeline, so it
 * queues offline and syncs like everything else.
 */
export function ReplyBox({ parentTs }: { parentTs: number }) {
  const { isBrother, submitReply } = useStore()
  const [open, setOpen] = useState(false)
  const [by, setBy] = useState<'Paul' | 'CJ'>('Paul')
  const [msg, setMsg] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)

  if (!isBrother) return null

  const send = async () => {
    if (busy || !msg.trim()) return
    setBusy(true)
    const ok = await submitReply(parentTs, by, msg, files)
    setBusy(false)
    if (ok) {
      setMsg('')
      setFiles([])
      setOpen(false)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="waw-noprint"
        style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.06em', color: c.teal, textDecoration: 'underline', padding: '8px 6px 4px 0', marginTop: 2 }}
      >
        ↩ Reply
      </button>
    )
  }

  const chip = (who: 'Paul' | 'CJ') => (
    <button
      onClick={() => setBy(who)}
      aria-pressed={by === who}
      style={{
        fontFamily: font.display,
        fontWeight: 600,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '.04em',
        border: `1.5px solid ${c.ink}`,
        borderRadius: 6,
        padding: '5px 12px',
        background: by === who ? c.ink : 'transparent',
        color: by === who ? c.paper : c.ink,
      }}
    >
      {who}
    </button>
  )

  return (
    <div className="waw-noprint" style={{ marginTop: 8, border: `1.5px dashed ${c.line}`, borderRadius: 8, padding: '9px 10px', background: c.paperMuted }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.12em', color: c.inkFaint, textTransform: 'uppercase' }}>Reply as</span>
        {chip('Paul')}
        {chip('CJ')}
      </div>
      <textarea
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        rows={2}
        maxLength={500}
        placeholder="Write back…"
        aria-label="Reply message"
        style={{ width: '100%', marginTop: 8, border: `1.5px solid ${c.ink}`, borderRadius: 7, background: c.inputBg, padding: '8px 10px', fontFamily: font.serif, fontSize: 13, color: c.inkSoft, resize: 'none', lineHeight: 1.5 }}
      />
      <div style={{ marginTop: 7 }}>
        <PhotoInput files={files} onAdd={(fs) => setFiles((cur) => [...cur, ...fs].slice(0, 4))} onRemove={(i) => setFiles((cur) => cur.filter((_, x) => x !== i))} disabled={busy} />
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button
          onClick={() => { setOpen(false); setMsg(''); setFiles([]) }}
          style={{ border: `1.5px solid ${c.ink}`, borderRadius: 6, background: 'transparent', color: c.ink, padding: '6px 14px', fontFamily: font.display, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em' }}
        >
          Cancel
        </button>
        <button
          onClick={send}
          disabled={busy || !msg.trim()}
          style={{ border: `1.5px solid ${c.ink}`, borderRadius: 6, background: msg.trim() ? c.ink : c.inkFainter, color: c.paper, padding: '6px 16px', fontFamily: font.display, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.04em' }}
        >
          {busy ? 'Sending…' : 'Send reply'}
        </button>
      </div>
    </div>
  )
}

/** One nested reply row: author, time, text, optional photos. */
export function ReplyRows({
  replies,
  photos,
  fmt,
}: {
  replies: { by: string; msg: string; ts: number; photo?: string }[] | undefined
  /** Render photos for a reply (screens pass their own Photos component through). */
  photos?: (photo: string | undefined, alt: string) => ReactNode
  /** Timestamp formatter (relTime on cards, clock time in the journal). */
  fmt: (ts: number) => string
}) {
  if (!replies || replies.length === 0) return null
  return (
    <div style={{ marginTop: 7, borderLeft: `2px solid ${c.lineSoft}`, paddingLeft: 9, display: 'flex', flexDirection: 'column', gap: 7 }}>
      {replies.map((r, i) => (
        <div key={i}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: font.display, fontWeight: 600, fontSize: 11.5, textTransform: 'uppercase', letterSpacing: '.03em', color: c.rust }}>↩ {r.by}</span>
            <span style={{ fontFamily: font.mono, fontSize: 8, color: c.inkFaintest }}>{fmt(r.ts)}</span>
          </div>
          <div style={{ fontFamily: font.serif, fontSize: 13, color: c.inkBody2, lineHeight: 1.45, marginTop: 1 }}>{r.msg}</div>
          {photos?.(r.photo, `Reply from ${r.by}`)}
        </div>
      ))}
    </div>
  )
}
