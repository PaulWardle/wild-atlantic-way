import { useEffect, useMemo, useRef } from 'react'
import { c, font } from '../theme'

/** Attach-a-photo control: opens the OS picker (camera or library on mobile),
 * shows a preview with a remove button once chosen. */
export function PhotoInput({
  file,
  onPick,
  onClear,
  disabled,
}: {
  file: File | null
  onPick: (f: File) => void
  onClear: () => void
  disabled?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file])
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  if (file && preview) {
    return (
      <div style={{ position: 'relative', marginTop: 8 }}>
        <img src={preview} alt="Selected" style={{ width: '100%', borderRadius: 8, border: `1.5px solid ${c.ink}`, display: 'block', maxHeight: 240, objectFit: 'cover' }} />
        <button
          onClick={onClear}
          disabled={disabled}
          aria-label="Remove photo"
          style={{ position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: '50%', background: c.ink, color: c.paper, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: font.display, fontSize: 16, lineHeight: 1, border: `1.5px solid ${c.paper}` }}
        >
          ×
        </button>
      </div>
    )
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onPick(f)
          e.target.value = ''
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        style={{ width: '100%', marginTop: 8, border: `1.5px dashed ${c.ink}`, borderRadius: 8, background: c.inputBg, padding: '11px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: font.display, fontWeight: 600, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '.04em', color: c.ink }}
      >
        <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round" strokeLinecap="round">
          <path d="M3 8 a2 2 0 0 1 2-2 h2 l1.5-2 h5 L20 6 h1 a2 2 0 0 1 2 2 v9 a2 2 0 0 1-2 2 H4 a2 2 0 0 1-2-2 Z" />
          <circle cx="12.5" cy="12.5" r="3.5" />
        </svg>
        Add a photo
      </button>
    </>
  )
}
