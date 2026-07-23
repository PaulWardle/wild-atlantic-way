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
          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
          <circle cx="12" cy="13" r="4" />
        </svg>
        Add a photo
      </button>
    </>
  )
}
