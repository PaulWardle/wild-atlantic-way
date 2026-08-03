import { useEffect, useState } from 'react'
import { useStore } from '../store/StoreProvider'
import type { ConnDiag } from '../store/StoreProvider'
import { c, font } from '../theme'

const hhmm = (ts: number) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

function Row({ ok, label, extra }: { ok: boolean; label: string; extra?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 3 }}>
      <span
        style={{
          fontFamily: font.display,
          fontWeight: 700,
          fontSize: 11,
          lineHeight: 1,
          color: ok ? c.green : c.rust,
        }}
      >
        {ok ? '✓' : '✗'}
      </span>
      <span
        style={{
          fontFamily: font.mono,
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '.1em',
          textTransform: 'uppercase',
          color: c.ink,
        }}
      >
        {label}
      </span>
      {extra && (
        <span style={{ fontFamily: font.mono, fontSize: 9, color: c.inkFaint }}>{extra}</span>
      )}
    </div>
  )
}

/**
 * One-tap sync + connection fault-finder. Lives inside the offline banner and
 * the Guide's offline row: forces a fresh sync, then reports which link is
 * broken — phone internet, trip server, or just the live channel — in plain
 * words, instead of leaving a vague "can't reach the server" to argue with.
 */
export function ConnCheck() {
  const { serverOk, lastSyncAt, syncNow, diagnose } = useStore()
  const [busy, setBusy] = useState(false)
  const [diag, setDiag] = useState<ConnDiag | null>(null)

  // Results describe a moment; once the server state flips they're stale.
  useEffect(() => setDiag(null), [serverOk])

  const run = async () => {
    if (busy) return
    setBusy(true)
    setDiag(null)
    try {
      await syncNow()
      setDiag(await diagnose())
    } finally {
      // Whatever the network does, the button must come back.
      setBusy(false)
    }
  }

  const verdict = !diag
    ? null
    : diag.server
      ? diag.live
        ? 'All good — this phone is reaching the trip server and live updates are flowing.'
        : 'The trip server is answering — live updates are rejoining, so the other phone’s changes can take up to a minute to appear.'
      : !diag.internet
        ? 'This phone has no internet right now — it’s not the app and not the server. Everything you post is saved on the phone and sends itself the moment signal returns.'
        : 'Your internet works but the trip server isn’t answering. Anything you post is queued safely; the app retries every minute on its own.'

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={run}
          disabled={busy}
          style={{
            fontFamily: font.mono,
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            color: busy ? c.inkFaint : c.ink,
            border: `1.5px solid ${busy ? c.inkFainter : c.ink}`,
            borderRadius: 7,
            background: c.paper,
            padding: '7px 12px',
          }}
        >
          {busy ? 'Checking…' : 'Sync now'}
        </button>
        {!diag && lastSyncAt != null && (
          <span style={{ fontFamily: font.mono, fontSize: 9, color: c.inkFaint }}>
            Last synced {hhmm(lastSyncAt)}
          </span>
        )}
      </div>
      {diag && (
        <div style={{ marginTop: 7 }}>
          <Row ok={diag.internet} label="Phone internet" />
          <Row ok={diag.server} label="Trip server" extra={diag.serverErr ?? undefined} />
          <Row ok={diag.live} label="Live updates" />
          <div style={{ fontFamily: font.mono, fontSize: 9, color: c.inkFaint, marginTop: 5 }}>
            Last synced {diag.lastSyncAt ? hhmm(diag.lastSyncAt) : 'not yet'}
            {diag.queued > 0 ? ` · ${diag.queued} queued to send` : ''}
          </div>
          <div style={{ fontFamily: font.serif, fontSize: 12, color: '#5a4f3b', lineHeight: 1.45, marginTop: 5 }}>
            {verdict}
          </div>
        </div>
      )}
    </div>
  )
}
