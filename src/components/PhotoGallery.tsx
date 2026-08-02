import { useEffect, useRef, useState } from 'react'
import { c, font } from '../theme'
import { isLocalPhoto, localId, localObjectURL } from '../lib/photoQueue'
import { photoList } from '../lib/photos'
import { PhotoView } from './PhotoView'

export interface GalleryPhoto {
  url: string
  alt: string
  when: string
}

/** Resolve a public URL or a `local:<id>` queued-photo token to a src. */
function usePhotoSrc(url: string): { src: string | null; pending: boolean } {
  const pending = isLocalPhoto(url)
  const [src, setSrc] = useState<string | null>(pending ? null : url)
  useEffect(() => {
    let alive = true
    if (isLocalPhoto(url)) {
      setSrc(null)
      localObjectURL(localId(url)).then((u) => alive && setSrc(u))
    } else {
      setSrc(url)
    }
    return () => {
      alive = false
    }
  }, [url])
  return { src, pending }
}

function Tile({ photo, onOpen }: { photo: GalleryPhoto; onOpen: () => void }) {
  const { src, pending } = usePhotoSrc(photo.url)
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`${photo.alt} — tap to enlarge`}
      style={{ position: 'relative', display: 'block', width: '100%', aspectRatio: '1 / 1', padding: 0, borderRadius: 7, overflow: 'hidden', border: `1.5px solid ${c.ink}`, background: c.paperMuted, cursor: 'zoom-in' }}
    >
      {src ? (
        <img src={src} alt={photo.alt} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      ) : (
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.mono, fontSize: 7, letterSpacing: '.08em', color: c.inkFainter, textTransform: 'uppercase', textAlign: 'center', padding: 6 }}>
          {pending ? 'Uploading soon' : '—'}
        </span>
      )}
      {pending && src && (
        <span style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7, borderRadius: '50%', background: c.amber, border: '1.5px solid #f6ecd6' }} />
      )}
    </button>
  )
}

function Lightbox({ photos, index, onClose, onNav }: { photos: GalleryPhoto[]; index: number; onClose: () => void; onNav: (d: number) => void }) {
  // The list can shrink WHILE the lightbox is open (the other phone deletes a
  // post; realtime pull lands) — clamp, and bail out if nothing is left.
  const photo = photos.length ? photos[Math.max(0, Math.min(index, photos.length - 1))] : undefined
  const { src } = usePhotoSrc(photo ? photo.url : '')

  useEffect(() => {
    if (!photo) onClose()
  }, [photo, onClose])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onNav(-1)
      else if (e.key === 'ArrowRight') onNav(1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onNav])

  const touch = useRef<{ x: number; y: number } | null>(null)
  const swiped = useRef(false)

  if (!photo) return null

  return (
    <div
      onClick={() => {
        if (swiped.current) {
          swiped.current = false
          return
        }
        onClose()
      }}
      onTouchStart={(e) => {
        const t = e.touches[0]
        touch.current = { x: t.clientX, y: t.clientY }
        swiped.current = false
      }}
      onTouchEnd={(e) => {
        const s = touch.current
        touch.current = null
        if (!s) return
        const t = e.changedTouches[0]
        const dx = t.clientX - s.x
        const dy = t.clientY - s.y
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
          swiped.current = true
          onNav(dx < 0 ? 1 : -1)
        }
      }}
      className="waw-noprint"
      role="dialog"
      aria-modal="true"
      aria-label={photo.alt}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(12,10,7,.94)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, animation: 'waw-fade .2s ease both', touchAction: 'pan-y' }}
    >
      {src && <img src={src} alt={photo.alt} style={{ maxWidth: '100%', maxHeight: '78%', borderRadius: 6, objectFit: 'contain' }} />}
      <div style={{ marginTop: 12, textAlign: 'center', color: '#f0e6cf' }}>
        <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 14, textTransform: 'uppercase', letterSpacing: '.02em' }}>{photo.alt}</div>
        <div style={{ fontFamily: font.mono, fontSize: 8.5, letterSpacing: '.1em', color: '#c9b98f', marginTop: 3 }}>{photo.when ? `${photo.when} · ` : ''}{index + 1} / {photos.length}</div>
      </div>
      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => { e.stopPropagation(); onNav(-1) }}
            style={{ position: 'absolute', left: 6, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'rgba(38,32,26,.7)', color: '#f6ecd6', fontFamily: font.display, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => { e.stopPropagation(); onNav(1) }}
            style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', width: 40, height: 40, borderRadius: '50%', background: 'rgba(38,32,26,.7)', color: '#f6ecd6', fontFamily: font.display, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            ›
          </button>
        </>
      )}
    </div>
  )
}

/** A grid of photo tiles with a shared navigable lightbox. */
function TileGrid({ photos, cols }: { photos: GalleryPhoto[]; cols: number }) {
  const [open, setOpen] = useState<number | null>(null)
  if (!photos.length) return null

  const nav = (d: number) =>
    setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length))

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 7 }}>
        {photos.map((p, i) => (
          <Tile key={i} photo={p} onOpen={() => setOpen(i)} />
        ))}
      </div>
      {open !== null && <Lightbox photos={photos} index={open} onClose={() => setOpen(null)} onNav={nav} />}
    </>
  )
}

/** A responsive 3-column grid of every trip photo (the Journal gallery). */
export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  return <TileGrid photos={photos} cols={3} />
}

/** Render a row's `photo` field (one or many): a single photo shows full-width
 *  as before; several show as a 2-column grid, each opening a lightbox. */
export function Photos({ photo, alt, when = '', maxHeight }: { photo?: string; alt: string; when?: string; maxHeight?: number }) {
  const list = photoList(photo)
  if (!list.length) return null
  if (list.length === 1) return <PhotoView url={list[0]} alt={alt} maxHeight={maxHeight} />
  const photos: GalleryPhoto[] = list.map((url, i) => ({ url, alt: `${alt} (${i + 1} of ${list.length})`, when }))
  return (
    <div style={{ marginTop: 8 }}>
      <TileGrid photos={photos} cols={2} />
    </div>
  )
}
