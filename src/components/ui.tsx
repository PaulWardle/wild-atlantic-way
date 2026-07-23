import type { CSSProperties, ReactNode } from 'react'
import { c, font } from '../theme'
import type { TagChip } from '../lib/tags'

/** Small mono kicker label above a screen title. */
export function Kicker({ children, color = c.rust, style }: { children: ReactNode; color?: string; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: font.mono,
        fontSize: 9,
        letterSpacing: '.16em',
        color,
        textTransform: 'uppercase',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** Big Oswald screen title. */
export function ScreenTitle({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: font.display,
        fontWeight: 700,
        fontSize: 27,
        textTransform: 'uppercase',
        color: c.ink,
        lineHeight: 1.02,
        margin: '3px 0 3px',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** Italic Spectral lede paragraph. */
export function Lede({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: font.serif,
        fontStyle: 'italic',
        fontSize: 13,
        color: c.inkMuted,
        lineHeight: 1.5,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/** The ordered tag-chip row for a stop. */
export function TagChips({ tags, size = 8 }: { tags: TagChip[]; size?: number }) {
  if (!tags.length) return null
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, margin: '6px 0 0' }}>
      {tags.map((t, i) => (
        <span
          key={i}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontFamily: font.mono,
            fontSize: size,
            fontWeight: 700,
            letterSpacing: '.08em',
            textTransform: 'uppercase',
            color: t.ink,
            border: `1px solid ${t.bd}`,
            borderRadius: 3,
            padding: '2px 5px',
            background: t.bg,
          }}
        >
          {t.label}
        </span>
      ))}
    </div>
  )
}

/** A square tick box (checked = filled + white check). */
export function Check({
  ticked,
  bg,
  bd,
  size = 21,
  radius = 5,
}: {
  ticked: boolean
  bg: string
  bd: string
  size?: number
  radius?: number
}) {
  return (
    <div
      style={{
        flex: `0 0 ${size}px`,
        height: size,
        borderRadius: radius,
        border: `1.5px solid ${bd}`,
        background: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {ticked && (
        <span
          style={{
            color: '#eef0e0',
            fontFamily: font.display,
            fontWeight: 700,
            fontSize: Math.round(size * 0.62),
            lineHeight: 1,
          }}
        >
          ✓
        </span>
      )}
    </div>
  )
}

export interface DropdownOption {
  label: string
  pick: () => void
}

/**
 * A custom tap-to-open dropdown (deliberately not a native <select>, which
 * rendered blank on iOS). Opens downward with a scrollable option list.
 */
export function Dropdown({
  label,
  open,
  onToggle,
  options,
  overlay = false,
  onClose,
}: {
  label: string
  open: boolean
  onToggle: () => void
  options: DropdownOption[]
  /** Render a full-screen click-catcher + absolutely-positioned menu (postbox reason). */
  overlay?: boolean
  onClose?: () => void
}) {
  const menu = (
    <div
      style={
        overlay
          ? {
              position: 'absolute',
              left: 0,
              right: 0,
              top: 'calc(100% + 4px)',
              zIndex: 50,
              border: `1.5px solid ${c.ink}`,
              borderRadius: 8,
              background: c.inputBg,
              overflow: 'hidden',
              boxShadow: '0 12px 30px rgba(20,16,10,.28)',
            }
          : {
              marginTop: 6,
              maxHeight: 200,
              overflowY: 'auto',
              border: `1.5px solid ${c.ink}`,
              borderRadius: 8,
              background: c.inputBg,
            }
      }
    >
      {options.map((o, i) => (
        <button
          key={i}
          onClick={o.pick}
          style={{
            display: 'block',
            width: '100%',
            textAlign: 'left',
            padding: overlay ? '10px 12px' : '9px 12px',
            borderBottom: `1px solid ${c.lineFaint}`,
            fontFamily: font.display,
            fontWeight: 500,
            fontSize: overlay ? 13 : 12.5,
            textTransform: 'uppercase',
            color: c.ink,
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  )

  return (
    <div style={overlay ? { position: 'relative' } : undefined}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          border: `1.5px solid ${c.ink}`,
          borderRadius: 7,
          background: c.inputBg,
          padding: '10px 12px',
          fontFamily: font.display,
          fontWeight: 600,
          fontSize: 13,
          textTransform: 'uppercase',
          color: c.ink,
        }}
      >
        <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}
        </span>
        <span style={{ flex: '0 0 auto', fontSize: 11, color: c.inkFainter, lineHeight: 1 }}>▾</span>
      </button>
      {open && overlay && onClose && (
        <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
      )}
      {open && menu}
    </div>
  )
}

/** A generic card shell: ink-bordered cream panel. */
export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        border: `1.5px solid ${c.ink}`,
        borderRadius: 9,
        background: c.paper,
        ...style,
      }}
    >
      {children}
    </div>
  )
}
