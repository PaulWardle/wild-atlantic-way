import { Component, type ReactNode } from 'react'
import { c, font } from '../theme'

/* Crash safety net. Without this, one unexpected render error white-screens
 * the whole app — unacceptable for something relied on in a field in Donegal.
 * Local data (localStorage + the outbox) survives a reload untouched, so the
 * honest fix for the rider is always: reload. */

interface State {
  err: Error | null
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { err: null }

  static getDerivedStateFromError(err: Error): State {
    return { err }
  }

  render() {
    if (!this.state.err) return this.props.children
    return (
      <div style={{ minHeight: '100dvh', background: c.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 340, width: '100%', border: `1.5px solid ${c.ink}`, borderRadius: 10, background: c.paperMuted, padding: '22px 20px', textAlign: 'center' }}>
          <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 22, textTransform: 'uppercase', color: c.ink, lineHeight: 1.1 }}>
            Bit of a pothole
          </div>
          <div style={{ fontFamily: font.serif, fontSize: 13.5, color: c.inkMuted, lineHeight: 1.55, marginTop: 10 }}>
            Something in the app broke unexpectedly. Nothing is lost — everything saved on this phone (posts, photos, ticks) survives a reload.
          </div>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: 16, width: '100%', border: `1.5px solid ${c.rust}`, borderRadius: 8, background: c.rust, color: c.cream, padding: '12px 10px', fontFamily: font.display, fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.05em' }}
          >
            Reload the app
          </button>
          <div style={{ fontFamily: font.mono, fontSize: 8, color: c.inkFainter, marginTop: 12, wordBreak: 'break-word' }}>
            {String(this.state.err?.message || this.state.err)}
          </div>
          <div style={{ fontFamily: font.mono, fontSize: 8, color: c.inkFainter, marginTop: 4 }}>build {__BUILD__}</div>
        </div>
      </div>
    )
  }
}
