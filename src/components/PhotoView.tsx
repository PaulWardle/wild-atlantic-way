import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { c, font } from '../theme'
import { isLocalPhoto, localId, localObjectURL } from '../lib/photoQueue'

/** An inline trip photo. Tap (or Enter/Space) to open a full-screen lightbox;
 *  Escape or a tap anywhere closes it. `alt` describes the photo for screen
 *  readers — pass the place/caption when there is one.
 *
 *  `url` may be a public URL or a `local:<id>` token for a photo that's still
 *  queued for upload (offline) — the token is resolved to an in-memory object
 *  URL so the picture shows immediately, with a subtle "waiting to upload" mark. */
export function PhotoView({
  url,
  alt = 'Trip photo',
  maxHeight = 280,
  rounded = 8,
}: {
  url: string
  alt?: string
  maxHeight?: number
  rounded?: number
}) {
  const [open, setOpen] = useState(false)
  const pending = isLocalPhoto(url)
  const [resolved, setResolved] = useState<string | null>(pending ? null : url)

  useEffect(() => {
    let alive = true
    if (isLocalPhoto(url)) {
      setResolved(null)
      localObjectURL(localId(url)).then((u) => {
        if (alive) setResolved(u)
      })
    } else {
      setResolved(url)
    }
    return () => {
      alive = false
    }
  }, [url])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Nothing to show yet (local blob still loading, or already gone).
  if (!resolved) {
    if (!pending) return null
    return (
      <div style={{ marginTop: 8, borderRadius: rounded, border: `1.5px dashed ${c.inkFainter}`, background: c.paperMuted, padding: '14px 12px', textAlign: 'center', fontFamily: font.mono, fontSize: 8.5, letterSpacing: '.1em', color: c.inkOnMuted, textTransform: 'uppercase' }}>
        Photo waiting to upload
      </div>
    )
  }

  return (
    <>
      <div style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={`${alt} — tap to enlarge`}
          style={{ display: 'block', width: '100%', padding: 0, cursor: 'zoom-in' }}
        >
          <img
            src={resolved}
            alt={alt}
            loading="lazy"
            // Full-width cover keeps every card edge-to-edge and uniform; the
            // whole uncropped photo is one tap away in the lightbox.
            style={{ width: '100%', borderRadius: rounded, border: `1.5px solid ${c.ink}`, display: 'block', marginTop: 8, maxHeight, objectFit: 'cover' }}
          />
        </button>
        {pending && (
          <span style={{ position: 'absolute', top: 14, right: 8, fontFamily: font.mono, fontSize: 7.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#f6ecd6', background: 'rgba(38,32,26,.82)', borderRadius: 4, padding: '2px 6px' }}>
            Uploading soon
          </span>
        )}
      </div>
      {/* Portal to <body>: screen wrappers animate transform (waw-fade), which
          hijacks position:fixed — un-portaled, the lightbox pins to the scroll
          content instead of the viewport and the X drifts off-screen. */}
      {open && createPortal(
        <div
          onClick={() => setOpen(false)}
          className="waw-noprint"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          ref={(el) => el?.focus()}
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === 'Escape') setOpen(false)
          }}
          // Bottom padding keeps a tall portrait clear of the Back pill.
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(12,10,7,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px 16px calc(env(safe-area-inset-bottom, 0px) + 76px)', animation: 'waw-fade .2s ease both' }}
        >
          <img src={resolved} alt={alt} style={{ maxWidth: '100%', maxHeight: '82%', borderRadius: 6, objectFit: 'contain' }} />
          <button
            onClick={() => setOpen(false)}
            aria-label="Close photo"
            style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 12px)', right: 14, width: 40, height: 40, borderRadius: '50%', border: '1.5px solid rgba(246,236,214,.7)', background: 'rgba(12,10,7,.55)', color: '#f6ecd6', fontFamily: font.display, fontSize: 19, lineHeight: 1 }}
          >
            ×
          </button>
          <button
            onClick={() => setOpen(false)}
            style={{ position: 'absolute', bottom: 'calc(env(safe-area-inset-bottom, 0px) + 18px)', left: '50%', transform: 'translateX(-50%)', border: '1.5px solid rgba(246,236,214,.7)', borderRadius: 999, background: 'rgba(12,10,7,.55)', color: '#f6ecd6', fontFamily: font.mono, fontSize: 11, fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', padding: '11px 26px' }}
          >
            ‹ Back
          </button>
        </div>,
        document.body,
      )}
    </>
  )
}
