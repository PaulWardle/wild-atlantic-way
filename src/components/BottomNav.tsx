import type { ReactNode } from 'react'
import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'

const ACTIVE = c.rust
const IDLE = '#635944'

function Tab({
  label,
  ink,
  active,
  onClick,
  children,
}: {
  label: string
  ink: string
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      aria-label={label}
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        padding: '5px 2px',
        color: ink,
      }}
    >
      {children}
      <span style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.1em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </button>
  )
}

/** Bottom nav. Journal shows for all roles; Postbox is added for guests. */
export function BottomNav() {
  const s = useStore()
  const { screen, isGuest, nav } = s

  const homeInk = screen === 'home' ? ACTIVE : IDLE
  const daysInk =
    screen === 'days' || screen === 'day' || screen === 'signature' || screen === 'passes' || screen === 'attractions' || screen === 'sights'
      ? ACTIVE
      : IDLE
  const todayInk = screen === 'today' ? ACTIVE : IDLE
  const journalInk = screen === 'journal' ? ACTIVE : IDLE
  const postboxInk = screen === 'postbox' ? ACTIVE : IDLE
  const infoInk = screen === 'info' ? ACTIVE : IDLE

  return (
    <nav
      aria-label="Primary"
      className="waw-noprint"
      style={{
        flex: '0 0 auto',
        position: 'relative',
        zIndex: 20,
        background: '#ded0ab',
        borderTop: `1.5px solid ${c.ink}`,
        display: 'flex',
        padding: '6px 2px calc(8px + env(safe-area-inset-bottom))',
      }}
    >
      <Tab label="Home" ink={homeInk} active={homeInk === ACTIVE} onClick={() => nav({ screen: 'home' })}>
        <svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden="true" focusable="false">
          <circle cx={12} cy={12} r={9} />
          <path d="M12 5 L14.4 12 L12 19 L9.6 12 Z" fill="currentColor" stroke="none" />
        </svg>
      </Tab>
      <Tab label="Days" ink={daysInk} active={daysInk === ACTIVE} onClick={() => nav({ screen: 'days' })}>
        <svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden="true" focusable="false">
          <rect x={4} y={5} width={16} height={15} rx={1.5} />
          <line x1={4} y1={9.5} x2={20} y2={9.5} />
          <line x1={8} y1={3} x2={8} y2={6.5} />
          <line x1={16} y1={3} x2={16} y2={6.5} />
        </svg>
      </Tab>
      <Tab label="Today" ink={todayInk} active={todayInk === ACTIVE} onClick={() => nav({ screen: 'today' })}>
        <svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
          <circle cx={12} cy={12} r={9} />
          <path d="M12 7.5 V12 L15.5 14" />
        </svg>
      </Tab>
      <Tab label="Journal" ink={journalInk} active={journalInk === ACTIVE} onClick={() => nav({ screen: 'journal' })}>
        <svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round" strokeLinecap="round" aria-hidden="true" focusable="false">
          <path d="M6 3 h10 a1 1 0 0 1 1 1 v16 a1 1 0 0 1 -1 1 H6 a2 2 0 0 1 -2 -2 V5 a2 2 0 0 1 2 -2 Z" />
          <line x1={8.5} y1={8} x2={14} y2={8} />
          <line x1={8.5} y1={12} x2={14} y2={12} />
          <line x1={8.5} y1={16} x2={12} y2={16} />
        </svg>
      </Tab>
      {isGuest && (
        <Tab label="Postbox" ink={postboxInk} active={postboxInk === ACTIVE} onClick={() => nav({ screen: 'postbox' })}>
          <svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinejoin="round" aria-hidden="true" focusable="false">
            <rect x={3} y={5} width={18} height={14} rx={2} />
            <path d="M3 7 L12 13 L21 7" />
          </svg>
        </Tab>
      )}
      <Tab label="Info" ink={infoInk} active={infoInk === ACTIVE} onClick={() => nav({ screen: 'info' })}>
        <svg width={19} height={19} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} aria-hidden="true" focusable="false">
          <circle cx={12} cy={12} r={9} />
          <line x1={12} y1={11} x2={12} y2={16.5} strokeLinecap="round" />
          <circle cx={12} cy={7.8} r={1} fill="currentColor" stroke="none" />
        </svg>
      </Tab>
    </nav>
  )
}
