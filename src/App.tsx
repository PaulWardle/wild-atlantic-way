import type { CSSProperties } from 'react'
import { useStore, type Screen } from './store/StoreProvider'
import { tripData } from './data/tripData'
import { AppBar } from './components/AppBar'
import { BottomNav } from './components/BottomNav'
import { Gate } from './screens/Gate'
import { MapOverlay } from './screens/MapOverlay'
import { Home } from './screens/Home'
import { Days } from './screens/Days'
import { DayDetail } from './screens/DayDetail'
import { Today } from './screens/Today'
import { Camp } from './screens/Camp'
import { Signature } from './screens/Signature'
import { Sights } from './screens/Sights'
import { Passes } from './screens/Passes'
import { Kit } from './screens/Kit'
import { Postbox } from './screens/Postbox'
import { Journal } from './screens/Journal'
import { Info } from './screens/Info'
import { Attractions } from './screens/Attractions'
import { Decide } from './screens/Decide'

interface AppBarSpec {
  kicker: string
  title: string
  roundel: string
}

function appBarSpec(screen: Screen, day: number, postCount: number): AppBarSpec | null {
  const T = tripData
  const dy = T.days[day] || T.days[0]
  switch (screen) {
    case 'home':
    case 'today':
    case 'map':
      return null
    case 'days':
      return { kicker: 'The plan', title: 'The Ride', roundel: String(T.days.length) }
    case 'day':
      return { kicker: 'Day', title: dy.title, roundel: dy.n }
    case 'decide':
      return { kicker: 'Still deciding', title: 'The Ferries', roundel: '?' }
    case 'signature':
      return { kicker: 'Checklist', title: 'Signature 15', roundel: String(T.signature.length) }
    case 'passes':
      return { kicker: 'Biker roads', title: 'Passes & Roads', roundel: String(T.passes.length) }
    case 'camp':
      return { kicker: 'Every night booked', title: 'Campsites', roundel: String(T.campsites.length) }
    case 'attractions':
      return { kicker: 'Every sight', title: 'Attractions', roundel: 'A' }
    case 'kit':
      return { kicker: 'Get ready', title: 'Kit & Admin', roundel: 'K' }
    case 'postbox':
      return { kicker: 'Say hello', title: 'The Postbox', roundel: String(postCount) }
    case 'sights':
      return { kicker: 'Sights & roads', title: 'Sights & Roads', roundel: '★' }
    case 'journal':
      return { kicker: 'The record', title: 'Journal', roundel: '✎' }
    case 'info':
      return { kicker: 'How it works', title: 'The Guide', roundel: 'i' }
    default:
      return null
  }
}

function ScreenBody({ screen }: { screen: Screen }) {
  switch (screen) {
    case 'home':
      return <Home />
    case 'days':
      return <Days />
    case 'day':
      return <DayDetail />
    case 'today':
      return <Today />
    case 'camp':
      return <Camp />
    case 'signature':
      return <Signature />
    case 'sights':
      return <Sights />
    case 'passes':
      return <Passes />
    case 'kit':
      return <Kit />
    case 'postbox':
      return <Postbox />
    case 'journal':
      return <Journal />
    case 'info':
      return <Info />
    case 'attractions':
      return <Attractions />
    case 'decide':
      return <Decide />
    case 'map':
      return null // rendered as an overlay
    default:
      return <Home />
  }
}

export function App() {
  const s = useStore()
  const { screen, role, vw, scrollRef, day, store, goBack } = s

  const phoneMode = vw <= 640
  const deskStyle: CSSProperties = phoneMode
    ? { minHeight: '100dvh', background: '#e8dcbf', display: 'block', fontFamily: "'Spectral',Georgia,serif" }
    : {
        minHeight: '100vh',
        background: '#1c1813',
        backgroundImage: 'radial-gradient(120% 90% at 50% -10%, #2c2519 0%, #1c1813 60%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        fontFamily: "'Spectral',Georgia,serif",
      }
  const phoneStyle: CSSProperties = phoneMode
    ? {
        position: 'relative',
        width: '100%',
        height: '100dvh',
        background: '#e8dcbf',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }
    : {
        position: 'relative',
        width: '100%',
        maxWidth: 412,
        height: 'min(880px, calc(100vh - 40px))',
        background: '#e8dcbf',
        borderRadius: 30,
        boxShadow: '0 34px 80px rgba(0,0,0,.55), 0 0 0 10px #14110d, 0 0 0 12px #40372a',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }

  const ab = appBarSpec(screen, day, (store.posts || []).length)
  const showAppbar = ab !== null && screen !== 'home' && screen !== 'today' && screen !== 'map'

  return (
    <div className="waw-desk" style={deskStyle}>
      <div className="waw-phone" style={phoneStyle}>
        {/* paper-grain overlay */}
        <div
          className="waw-noprint"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 40,
            opacity: 0.045,
            backgroundImage:
              'repeating-linear-gradient(0deg,rgba(40,32,22,.4) 0,rgba(40,32,22,.4) 0.5px,transparent 0.5px,transparent 4px),repeating-linear-gradient(90deg,rgba(40,32,22,.4) 0,rgba(40,32,22,.4) 0.5px,transparent 0.5px,transparent 4px)',
          }}
        />

        {showAppbar && ab && <AppBar kicker={ab.kicker} title={ab.title} roundel={ab.roundel} onBack={goBack} />}

        <div
          ref={scrollRef}
          className="waw-scroll"
          style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', position: 'relative', zIndex: 1 }}
        >
          <ScreenBody screen={screen} />
        </div>

        <BottomNav />

        {screen === 'map' && <MapOverlay />}
        {!role && <Gate />}
      </div>
    </div>
  )
}
