import type { ReactNode } from 'react'
import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { Kicker, ScreenTitle, Lede } from '../components/ui'

const meta = tripData.meta

function Chip({ label, ink, bg }: { label: string; ink: string; bg: string }) {
  return (
    <span style={{ fontFamily: font.mono, fontSize: 7.5, fontWeight: 700, letterSpacing: '.05em', textTransform: 'uppercase', color: ink, background: bg, border: `1px solid ${ink}`, borderRadius: 3, padding: '2px 6px' }}>
      {label}
    </span>
  )
}

function GuideRow({ title, children, chips }: { title: string; children: ReactNode; chips?: ReactNode }) {
  return (
    <div style={{ borderTop: `1px solid ${c.lineSoft}`, padding: '12px 0' }}>
      <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 15, textTransform: 'uppercase', color: c.ink }}>{title}</div>
      <div style={{ fontFamily: font.serif, fontSize: 13, color: c.inkBody, lineHeight: 1.5, marginTop: 3 }}>{children}</div>
      {chips && <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 9 }}>{chips}</div>}
    </div>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.14em', color: c.rust, textTransform: 'uppercase', margin: '20px 0 2px' }}>
      {children}
    </div>
  )
}

function ResetPanel() {
  const { clearPosts, clearUpdates, clearNotes, clearMarksSig, clearGallery, resetEverything } = useStore()
  const smallBtn: React.CSSProperties = {
    border: `1.5px solid ${c.ink}`,
    borderRadius: 8,
    background: c.paper,
    color: c.ink,
    padding: '10px 8px',
    fontFamily: font.display,
    fontWeight: 600,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '.04em',
    cursor: 'pointer',
  }
  return (
    <div className="waw-noprint" style={{ marginTop: 24, border: `1.5px solid ${c.rust}`, borderRadius: 10, background: '#f7ece0', overflow: 'hidden' }}>
      <div style={{ background: c.rust, color: '#f6ecd6', padding: '8px 13px', fontFamily: font.mono, fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase' }}>Reset &amp; clear</div>
      <div style={{ padding: '12px 13px 14px' }}>
        <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 12, color: c.inkMuted, lineHeight: 1.5, marginBottom: 11 }}>
          Removes what you’ve added from the shared trip — for everyone. Grab a <strong>Backup</strong> from the Journal first if you want a copy.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <button onClick={clearPosts} style={smallBtn}>Clear postbox</button>
          <button onClick={clearUpdates} style={smallBtn}>Clear pings</button>
          <button onClick={clearNotes} style={smallBtn}>Clear journal</button>
          <button onClick={clearMarksSig} style={smallBtn}>Clear marks</button>
          <button onClick={clearGallery} style={{ ...smallBtn, gridColumn: '1 / -1' }}>Clear gallery (all photos)</button>
        </div>
        <button onClick={resetEverything} style={{ width: '100%', marginTop: 8, border: `1.5px solid ${c.rust}`, borderRadius: 8, background: c.rust, color: '#f6ecd6', padding: 12, fontFamily: font.display, fontWeight: 700, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '.05em', cursor: 'pointer' }}>
          Reset everything
        </button>
      </div>
    </div>
  )
}

export function Info() {
  const { isBrother, isGuest } = useStore()

  return (
    <div style={{ animation: 'waw-fade .35s ease both', padding: '18px 16px 30px' }}>
      <Kicker>How this app works</Kicker>
      <ScreenTitle>The Guide</ScreenTitle>
      {isGuest ? (
        <Lede>Everything you can see and do while you follow the lads around the Wild Atlantic Way.</Lede>
      ) : (
        <Lede>The full manual — every screen and tool, plus what friends &amp; family see on their version.</Lede>
      )}

      <div style={{ marginTop: 15, border: `1.5px solid ${c.ink}`, borderRadius: 10, background: c.paperMuted, padding: '12px 14px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.14em', color: c.ink, textTransform: 'uppercase', marginBottom: 7 }}>The trip</div>
        <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 19, textTransform: 'uppercase', color: c.rust, lineHeight: 1 }}>{meta.route}</div>
        <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 13, color: '#5a4f3b', marginTop: 3 }}>{meta.dates}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px 14px', marginTop: 9, fontFamily: font.mono, fontSize: 9.5, letterSpacing: '.04em', color: '#5a4f3b' }}>
          <span>{meta.dayCount} days</span>
          <span>{meta.nights} nights</span>
          <span>{meta.totalMiles} mi</span>
          <span>{meta.sigCount} signature stops</span>
        </div>
      </div>

      {isGuest && (
        <>
          <SectionLabel>What you can do</SectionLabel>
          <GuideRow title="The home screen">
            Your hub: the countdown to kick-off, where the lads are right now, the map, and the latest messages and journal entries sliding through.
          </GuideRow>
          <GuideRow title="Where they are">
            Shows up only once the brothers post their location — and it refreshes every time they check in somewhere new. A quiet map just means they haven’t updated yet, so keep an eye out.
            <div style={{ marginTop: 9, border: `1.5px solid ${c.ink}`, background: c.rust, color: '#f6ecd6', borderRadius: 8, padding: '8px 11px', display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#f6ecd6', display: 'inline-block', flex: '0 0 auto' }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: font.mono, fontSize: 7.5, letterSpacing: '.14em', textTransform: 'uppercase', opacity: 0.85 }}>The brothers are here · updated 2h ago</div>
                <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 15, textTransform: 'uppercase', lineHeight: 1.05 }}>Slea Head, Dingle</div>
              </div>
            </div>
          </GuideRow>
          <GuideRow title="The map">
            The shape of the whole journey — Muff at the top of Lough Foyle all the way down to Kinsale — with every headland and town, and the live pin marking where they are.
          </GuideRow>
          <GuideRow title="Weather">
            Right on the home screen: today’s forecast for where the lads are, and tomorrow’s for where they’re headed next — so you know if they’re getting a soaking.
          </GuideRow>
          <GuideRow title="The gallery">
            Every photo from the road, newest first — sliding through on the home screen and as a grid in the Journal. Tap one to open it big and swipe through the lot.
          </GuideRow>
          <GuideRow
            title="The postbox"
            chips={
              <>
                <Chip label="Recommendation" ink={c.rust} bg={c.amberPanelDeep} />
                <Chip label="Comment" ink={c.green} bg={c.greenPanel} />
                <Chip label="Question" ink={c.teal} bg={c.tealPanel} />
                <Chip label="Feedback" ink={c.amberGold} bg="#f4edd8" />
                <Chip label="Hello" ink="#7a5230" bg="#efe6d6" />
              </>
            }
          >
            Leave a hello, a tip, a recommendation or a question. Add your name, pick what it is, write your message — and add a photo or two if you like — and it lands on the home screen for the whole crew to see. This is your way to cheer them on.
          </GuideRow>
          <GuideRow
            title="The journal"
            chips={
              <>
                <Chip label="⚑ Milestone" ink={c.rust} bg={c.amberPanelDeep} />
                <Chip label="Road" ink={c.teal} bg={c.tealPanel} />
                <Chip label="Signature" ink={c.amberGold} bg="#f4edd8" />
                <Chip label="Here" ink={c.rust} bg={c.amberPanelDeep} />
              </>
            }
          >
            A running, day-by-day record of the trip — locations, messages, milestones and notes with timestamps — that builds as they go. Watch it fill up on the home screen.
          </GuideRow>
          <GuideRow title="Browse the route">
            Have a nose around: <b>Days</b> for the ride day by day, <b>Today</b> for what’s on now, and <b>Sights &amp; Roads</b> for the headline spots and biker passes. Campsites and the day plans are all there to explore.
          </GuideRow>
          <div style={{ marginTop: 14, fontFamily: font.serif, fontStyle: 'italic', fontSize: 12.5, color: c.inkFainter, lineHeight: 1.55 }}>
            Tip: add it to your home screen (Share → Add to Home Screen) to open it like an app — it even works offline. Your messages are saved on this device; keep the link handy to check back in.
          </div>
        </>
      )}

      {isBrother && (
        <>
          <SectionLabel>Every screen &amp; tool</SectionLabel>
          <GuideRow title="Home">Your dashboard: countdown, live location, the map, the postbox and journal feeds, and the pack of tools.</GuideRow>
          <GuideRow title="We are here">
            Post where you are so F&amp;F can follow. Tap <b>Use my location</b> for a live GPS fix — it names the spot (a town, not coordinates) and asks you to <b>confirm before it posts</b>, so a stray tap never sends. No signal or off the route? <b>Set it by hand</b> instead. Add a comment and photos first and they ride along. It flashes on the map and heads up the journal.
          </GuideRow>
          <GuideRow title="Weather">
            Today’s forecast for where you actually are — your live spot, or the day’s area before you’ve posted — and tomorrow’s for where you’re headed next. High/low, chance of rain and wind. It re-checks as you post locations, and the last reading stays put when you’ve no signal.
          </GuideRow>
          <GuideRow
            title="The ride (Days)"
            chips={
              <>
                <Chip label="Keep" ink={c.green} bg={c.greenPanel} />
                <Chip label="Maybe" ink={c.amber} bg={c.amberPanel} />
                <Chip label="Cut" ink={c.rust} bg={c.amberPanelDeep} />
              </>
            }
          >
            Every day’s stops with the detail. Mark each one <b>Keep</b>, <b>Maybe</b> or <b>Cut</b> as you settle the plan — the tallies roll up across the trip, feed <b>Today</b>, and drop into the <b>Journal</b>.
          </GuideRow>
          <GuideRow title="Today">
            The live day, set by the date — and it follows your <b>Keep / Maybe / Cut</b> calls: stops you’ve cut drop off the glance and kept ones get flagged as don’t-miss. Shows the call to make, tonight’s camp and a jump into the full day. Before the off it’s a live countdown.
          </GuideRow>
          <GuideRow title="Campsites">Every night’s confirmed pitch — one place per night, zero wild camping. On the home grid and inside each day.</GuideRow>
          <GuideRow
            title="Sights &amp; roads"
            chips={
              <>
                <Chip label="★ Signature" ink={c.rust} bg="#f7ecd6" />
                <Chip label="✓ Bagged" ink="#eef0e0" bg={c.green} />
              </>
            }
          >
            <b>Signature 15</b> — tick them off as you bag each one — and the 18 biker <b>Passes</b>, north to south. Bagged spots get a badge that shows on the guests’ version too.
          </GuideRow>
          <GuideRow title="Kit &amp; admin">The to-do list (add your own as things come up) and the per-brother packing lists with the shared-kit allocator.</GuideRow>
          <GuideRow title="The postbox">Everything F&amp;F have posted. Read them and remove any you don’t want to keep. You review here — guests are the ones who post.</GuideRow>
          <GuideRow
            title="The journal"
            chips={
              <>
                <Chip label="Milestone" ink={c.teal} bg={c.tealPanel} />
                <Chip label="Oh Fuck! Moment" ink={c.teal} bg={c.tealPanel} />
                <Chip label="Key Event" ink={c.teal} bg={c.tealPanel} />
                <Chip label="Paul" ink={c.inkMuted} bg={c.paperDeep} />
                <Chip label="CJ" ink={c.inkMuted} bg={c.paperDeep} />
              </>
            }
          >
            The full record. Add a note as <b>Paul</b> or <b>CJ</b> with a tag (or make your own with <b>+</b>), file it under any day <b>and time</b>, and attach photos — it auto-pulls in your locations, Signature bags and the postbox, grouped day by day with times. Edit or remove your notes any time. <b>Save Trip Book</b> exports the lot as a keepsake PDF.
          </GuideRow>
          <GuideRow title="The gallery">
            Every photo from the trip in one place — a carousel on Home and a grid in the Journal. Tap any shot to open it full-screen and <b>swipe</b> through them all. Post up to four photos on a location, note or message.
          </GuideRow>
          <GuideRow title="The map">The whole route with the live pin — from the home card or full-screen. A fix that’s off the route or outside Ireland still posts, it just won’t sit on the route line.</GuideRow>
          <GuideRow title="Install &amp; offline">
            Add it to your home screen (Share → <b>Add to Home Screen</b>) and it runs like a proper app. It works with <b>no signal</b> — the whole thing loads offline, and anything you post (words and photos) is saved on the phone and syncs the moment you’re back on. A banner tells you when the trip server can’t be reached.
          </GuideRow>

          <div style={{ marginTop: 18, border: `1.5px solid ${c.ink}`, borderRadius: 10, background: c.greenPanel, padding: '13px 14px' }}>
            <div style={{ fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.14em', color: c.green, textTransform: 'uppercase', marginBottom: 6 }}>What guests see</div>
            <div style={{ fontFamily: font.serif, fontSize: 13, color: c.inkSoft, lineHeight: 1.55 }}>
              Friends &amp; family get a lighter, view-only version. They follow along — the countdown, the map and your live location, the weather, the photo gallery, the postbox and the journal feed — and can leave you messages (with photos) in the postbox. They can’t post locations, mark stops Keep/Maybe/Cut, see Kit &amp; Admin or edit the record, and any stop you’ve <b>Cut</b> disappears from their day view. Signature 15 &amp; Passes show as a read-only “Sights &amp; Roads” list.
            </div>
          </div>
          <div style={{ marginTop: 12, border: `1.5px dashed ${c.rust}`, borderRadius: 9, background: '#f7ecdd', padding: '11px 13px' }}>
            <div style={{ fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.12em', color: c.rust, textTransform: 'uppercase', marginBottom: 4 }}>Brother access</div>
            <div style={{ fontFamily: font.serif, fontSize: 13, color: c.inkBody2, lineHeight: 1.5 }}>
              On the welcome screen, tap <b>I’m a brother</b> and enter the password <b style={{ fontFamily: font.display, letterSpacing: '.12em' }}>WAW</b> for the full planner. The <b>Brother</b> chip on the home header switches roles.
            </div>
          </div>

          <ResetPanel />
        </>
      )}
    </div>
  )
}
