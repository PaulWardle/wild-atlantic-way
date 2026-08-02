import { useEffect, useMemo, useRef, useState } from 'react'
import { c, font } from '../theme'

/** Attach-photos control: opens the OS picker (camera or library on mobile),
 * shows a row of previews with per-photo remove buttons. Supports several
 * photos per post/note up to `max`. */
export function PhotoInput({
  files,
  onAdd,
  onRemove,
  disabled,
  max = 4,
}: {
  files: File[]
  onAdd: (fs: File[]) => void
  onRemove: (i: number) => void
  disabled?: boolean
  max?: number
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files])
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews])
  // Silently dropping the 5th+ picked photo read as a broken picker.
  const [overMsg, setOverMsg] = useState('')
  useEffect(() => {
    if (!overMsg) return
    const t = window.setTimeout(() => setOverMsg(''), 3000)
    return () => window.clearTimeout(t)
  }, [overMsg])

  const full = files.length >= max

  if (files.length > 0) {
    return (
      <div style={{ marginTop: 8 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {previews.map((url, i) => (
            <div key={i} style={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: 7, overflow: 'hidden', border: `1.5px solid ${c.ink}` }}>
              <img src={url} alt={`Selected ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <button
                onClick={() => onRemove(i)}
                disabled={disabled}
                aria-label={`Remove photo ${i + 1}`}
                style={{ position: 'absolute', top: 2, right: 2, width: 30, height: 30, borderRadius: '50%', background: c.ink, color: c.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.display, fontSize: 15, lineHeight: 1, border: `1.5px solid ${c.paper}` }}
              >
                ×
              </button>
            </div>
          ))}
          {!full && (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
              aria-label="Add another photo"
              style={{ aspectRatio: '1 / 1', border: `1.5px dashed ${c.ink}`, borderRadius: 7, background: c.inputBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.ink, fontFamily: font.display, fontSize: 26, lineHeight: 1 }}
            >
              +
            </button>
          )}
        </div>
        {overMsg && <div role="status" style={{ fontFamily: font.mono, fontSize: 9, color: c.rust, marginTop: 5 }}>{overMsg}</div>}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => {
            const picked = Array.from(e.target.files || [])
            const room = max - files.length
            if (picked.length > room) setOverMsg(`Max ${max} photos per post — kept the first ${room}.`)
            if (picked.length) onAdd(picked.slice(0, room))
            e.target.value = ''
          }}
        />
      </div>
    )
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        style={{ display: 'none' }}
        onChange={(e) => {
          const picked = Array.from(e.target.files || [])
          if (picked.length > max) setOverMsg(`Max ${max} photos per post — kept the first ${max}.`)
          if (picked.length) onAdd(picked.slice(0, max))
          e.target.value = ''
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        style={{ width: '100%', marginTop: 8, border: `1.5px dashed ${c.ink}`, borderRadius: 8, background: c.inputBg, padding: '11px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: font.display, fontWeight: 600, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '.04em', color: c.ink }}
      >
        <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round" strokeLinecap="round" aria-hidden="true">
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        Add photos
      </button>
      {overMsg && <div role="status" style={{ fontFamily: font.mono, fontSize: 9, color: c.rust, marginTop: 5 }}>{overMsg}</div>}
    </>
  )
}
