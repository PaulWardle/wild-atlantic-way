import { useState } from 'react'
import { c } from '../theme'

/** An inline trip photo. Tap to open a full-screen lightbox. */
export function PhotoView({ url, maxHeight = 280, rounded = 8 }: { url: string; maxHeight?: number; rounded?: number }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <img
        src={url}
        alt="Trip photo"
        loading="lazy"
        onClick={() => setOpen(true)}
        style={{ width: '100%', borderRadius: rounded, border: `1.5px solid ${c.ink}`, display: 'block', marginTop: 8, maxHeight, objectFit: 'cover', cursor: 'zoom-in' }}
      />
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="waw-noprint"
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(12,10,7,.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, animation: 'waw-fade .2s ease both' }}
        >
          <img src={url} alt="Trip photo" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 6, objectFit: 'contain' }} />
        </div>
      )}
    </>
  )
}
