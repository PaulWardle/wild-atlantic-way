import { useEffect } from 'react'
import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'

/**
 * In-theme prompt that keeps the app feeling joined-up: bagging a Signature spot
 * offers to post "we are here", and posting a location at a Signature spot offers
 * to bag it. Brother-only (guests do neither).
 */
export function LinkPromptModal() {
  const { linkPrompt, confirmLink, dismissLink } = useStore()
  // Escape dismisses, like every other overlay in the app.
  useEffect(() => {
    if (!linkPrompt) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismissLink()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [linkPrompt, dismissLink])
  if (!linkPrompt) return null
  const offerPost = linkPrompt.kind === 'offerPost'

  return (
    <div
      className="waw-noprint"
      onClick={dismissLink}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 90,
        background: 'rgba(20,16,10,.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 26,
        animation: 'waw-fade .2s ease both',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 320,
          border: `1.5px solid ${c.ink}`,
          borderRadius: 14,
          background: c.paperDeep,
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,.4)',
        }}
      >
        <div style={{ background: c.rust, color: '#f6ecd6', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 20, lineHeight: 1 }}>{offerPost ? '★' : '⚑'}</span>
          <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 17, textTransform: 'uppercase', letterSpacing: '.01em', lineHeight: 1.05 }}>
            {offerPost ? `${linkPrompt.name} bagged!` : `You’re at ${linkPrompt.name}`}
          </div>
        </div>
        <div style={{ padding: '15px 16px 16px' }}>
          <div style={{ fontFamily: font.serif, fontSize: 14, color: c.inkBody2, lineHeight: 1.55 }}>
            {offerPost
              ? 'Nice one. Post that you’re here too, so everyone following along sees it flash on the map and land in the journal?'
              : 'That’s one of the Signature 15 — want to tick it off as bagged while you’re here?'}
          </div>
          <div style={{ display: 'flex', gap: 9, marginTop: 16 }}>
            <button
              onClick={dismissLink}
              style={{
                flex: '0 0 auto',
                border: `1.5px solid ${c.ink}`,
                borderRadius: 8,
                background: 'transparent',
                color: c.ink,
                padding: '11px 16px',
                fontFamily: font.display,
                fontWeight: 600,
                fontSize: 13,
                textTransform: 'uppercase',
                letterSpacing: '.04em',
              }}
            >
              Not now
            </button>
            <button
              onClick={confirmLink}
              style={{
                flex: 1,
                border: `1.5px solid ${c.ink}`,
                borderRadius: 8,
                background: c.ink,
                color: c.paper,
                padding: 11,
                textAlign: 'center',
                fontFamily: font.display,
                fontWeight: 700,
                fontSize: 13.5,
                textTransform: 'uppercase',
                letterSpacing: '.05em',
              }}
            >
              {offerPost ? '⚑ We are here' : '★ Bag it'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
