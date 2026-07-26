import { useEffect, useState } from 'react'
import { c } from '../theme'

/** An inline trip photo. Tap (or Enter/Space) to open a full-screen lightbox;
 *  Escape or a tap anywhere closes it. `alt` describes the photo for screen
 *  readers — pass the place/caption when there is one. */
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

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`${alt} — tap to enlarge`}
        style={{ display: 'block', width: '100%', padding: 0, cursor: 'zoom-in' }}
      >
        <img
          src={url}
          alt={alt}
          loading="lazy"
          style={{ width: '100%', borderRadius: rounded, border: `1.5px solid ${c.ink}`, display: 'block', marginTop: 8, maxHeight, objectFit: 'cover' }}
        />
      </button>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="waw-noprint"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(12,10,7,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, animation: 'waw-fade .2s ease both' }}
        >
          <img src={url} alt={alt} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 6, objectFit: 'contain' }} />
        </div>
      )}
    </>
  )
}
