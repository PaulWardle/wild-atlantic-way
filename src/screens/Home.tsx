import type { ReactNode } from 'react'
import { c, font } from '../theme'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { trackStops } from '../data/derived'
import { daysToGo } from '../lib/countdown'
import { relTime } from '../lib/time'
import { reasonMeta } from '../lib/tags'
import { buildEvents, buildFeed } from '../lib/journal'
import { useMap } from '../hooks/useMap'
import { MapSVG, MapLegend } from '../components/MapSVG'
import { Slider } from '../components/Slider'
import { Dropdown } from '../components/ui'

const meta = tripData.meta

function CardHeader({ icon, title, right }: { icon: ReactNode; title: string; right?: ReactNode }) {
  return (
    <div
      style={{
        background: c.ink,
        color: c.paper,
        padding: '9px 13px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
      }}
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          fontFamily: font.mono,
          fontSize: 9.5,
          letterSpacing: '.16em',
          textTransform: 'uppercase',
        }}
      >
        {icon}
        {title}
      </span>
      {right}
    </div>
  )
}

function Tile({ icon, title, sub, onClick }: { icon: ReactNode; title: string; sub: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1.5px solid ${c.ink}`,
        background: c.paper,
        borderRadius: 8,
        padding: '13px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {icon}
      <div>
        <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 14, textTransform: 'uppercase', color: c.ink, letterSpacing: '.02em' }}>
          {title}
        </div>
        <div style={{ fontFamily: font.serif, fontSize: 11.5, color: c.inkFaint }}>{sub}</div>
      </div>
    </button>
  )
}

export function Home() {
  const s = useStore()
  const {
    store,
    isBrother,
    isGuest,
    signOut,
    nav,
    draftI,
    setDraftI,
    draftNote,
    setDraftNote,
    postHere,
    clearUpdates,
    openDD,
    toggleDD,
    postIdx,
    setPostIdx,
    jFeedIdx,
    jFeedSwipeStart,
    jFeedSwipeEnd,
  } = s
  const { geo, curStop, liveActive } = useMap()

  const updates = store.updates || []
  const posts = store.posts || []
  const outbox = store.outbox || []
  const hasUnsent = outbox.length > 0

  const whereHeading = isGuest ? 'Where they’ve been' : 'Where we are'
  const liveHereLabel = isGuest ? 'The brothers are here' : 'We’re here'
  const liveArea = curStop ? curStop.label : ''
  const liveWhen = liveActive ? relTime(updates[0].ts) : ''
  const liveNote = (updates[0] && updates[0].note) || ''
  const pingRow = (u: (typeof updates)[number]) => ({
    loc: (trackStops[u.si] || { label: '' }).label || '',
    when: relTime(u.ts),
    note: u.note || '',
  })
  const liveFeed = updates.slice(1).map(pingRow) // brother "earlier pings"
  const allPings = updates.map(pingRow) // guest "today the brothers have been"

  const postList = posts.slice(0, 12).map((p) => {
    const m = reasonMeta[p.reason] || reasonMeta.Comment
    return { name: p.name, verb: m.verb, reason: p.reason, msg: p.msg, when: relTime(p.ts), tagInk: m.ink, tagBg: m.bg }
  })
  const postCount = posts.length
  const postCountLabel = postCount + (postCount === 1 ? ' message' : ' messages')

  const events = buildEvents(store, tripData)
  const feed = buildFeed(events).slice(0, 5)
  const jFeedCountLabel = events.length + (events.length === 1 ? ' entry' : ' entries')

  const locOptions = trackStops.map((st, i) => ({ label: st.label, pick: () => setDraftI(i) }))
  const locLabel = (trackStops[draftI != null ? draftI : 0] || trackStops[0] || { label: 'Pick a spot' }).label || 'Pick a spot'

  const countdown = daysToGo(meta.depart)

  return (
    <div style={{ animation: 'waw-fade .4s ease both' }}>
      {hasUnsent && (
        <div style={{ margin: '12px 16px 0', border: `1.5px solid ${c.amber}`, background: c.amberPanel, borderRadius: 9, padding: '10px 13px' }}>
          <div style={{ fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.12em', color: c.amber, textTransform: 'uppercase', marginBottom: 3 }}>
            {outbox.length} waiting to send
          </div>
          <div style={{ fontFamily: font.serif, fontSize: 12.5, color: '#5a4f3b', lineHeight: 1.45 }}>
            Saved on this phone — they’ll send automatically the moment you’re back online. Nothing’s lost.
          </div>
        </div>
      )}

      {/* header */}
      <div style={{ padding: '26px 20px 6px' }}>
        <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 30, letterSpacing: '.01em', textTransform: 'uppercase', color: c.ink, lineHeight: 0.9, whiteSpace: 'nowrap' }}>
          Bald(ing) Brothers
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0 0' }}>
          <div style={{ fontFamily: font.display, fontWeight: 500, fontSize: 13.5, letterSpacing: '.26em', textTransform: 'uppercase', color: c.inkMuted, whiteSpace: 'nowrap' }}>
            August Adventures
          </div>
          <div style={{ height: 1.5, flex: 1, background: c.line }} />
          <button
            onClick={signOut}
            title="Switch role"
            style={{
              flex: '0 0 auto',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              border: `1.5px solid ${c.ink}`,
              borderRadius: 20,
              padding: '3px 9px 3px 8px',
              background: c.paperMuted,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: isBrother ? c.green : c.amber, display: 'inline-block' }} />
            <span style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.1em', textTransform: 'uppercase', color: c.ink }}>
              {isBrother ? 'Brother' : 'Guest'}
            </span>
          </button>
        </div>
        <div style={{ marginTop: 17, borderTop: `1.5px solid ${c.ink}`, paddingTop: 13 }}>
          <div style={{ fontFamily: font.mono, fontSize: 8.5, letterSpacing: '.18em', color: c.inkFainter, textTransform: 'uppercase', marginBottom: 6 }}>
            The route
          </div>
          <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 37, letterSpacing: '.005em', textTransform: 'uppercase', color: c.rust, lineHeight: 0.92 }}>
            Wild
            <br />
            Atlantic Way
          </div>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 14.5, color: '#5a4f3b', marginTop: 9 }}>{meta.route}</div>
          <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 14.5, color: '#5a4f3b', marginTop: 3 }}>{meta.dates}</div>
        </div>
      </div>

      {/* live "we're here" banner */}
      {liveActive && (
        <div
          style={{
            margin: '14px 16px 0',
            border: `1.5px solid ${c.ink}`,
            background: c.rust,
            color: '#f6ecd6',
            borderRadius: 9,
            padding: '10px 13px',
            display: 'flex',
            alignItems: 'center',
            gap: 11,
          }}
        >
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f6ecd6', display: 'inline-block', flex: '0 0 auto', animation: 'waw-blink 1.4s ease-in-out infinite' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: font.mono, fontSize: 8.5, letterSpacing: '.16em', textTransform: 'uppercase', opacity: 0.85 }}>
              {liveHereLabel} · updated {liveWhen}
            </div>
            <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 19, textTransform: 'uppercase', letterSpacing: '.01em', lineHeight: 1.05, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {liveArea}
            </div>
          </div>
          <span style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.08em', opacity: 0.8, whiteSpace: 'nowrap' }}>On the map ↓</span>
        </div>
      )}

      {/* countdown card */}
      <div style={{ margin: '16px 20px 0', border: `1.5px solid ${c.ink}`, background: c.paper, borderRadius: 9, display: 'flex', alignItems: 'stretch', overflow: 'hidden' }}>
        <div style={{ background: c.rust, color: '#f6ecd6', padding: '12px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 74 }}>
          <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 32, lineHeight: 0.9 }}>{countdown}</div>
        </div>
        <div style={{ padding: '11px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontFamily: font.mono, fontSize: 9.5, letterSpacing: '.18em', color: c.ink, textTransform: 'uppercase' }}>Days to go</div>
          <div style={{ fontFamily: font.serif, fontSize: 13, color: c.inkMuted, marginTop: 2 }}>until the Wild Atlantic Way</div>
        </div>
      </div>

      {/* journey map */}
      <div style={{ margin: '18px 16px 0', border: `1.5px solid ${c.ink}`, borderRadius: 10, background: c.paperMap, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderBottom: `1.5px solid ${c.ink}`, background: c.paperMuted }}>
          <span style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.16em', color: c.ink, textTransform: 'uppercase' }}>The shape of the journey</span>
          <button onClick={() => nav({ screen: 'map' })} style={{ fontFamily: font.mono, fontSize: 9, color: c.inkFainter, letterSpacing: '.06em' }}>
            Malin Head → Kinsale
          </button>
        </div>
        <div style={{ padding: '6px 6px 0' }} onClick={() => nav({ screen: 'map' })}>
          <MapSVG geo={geo} />
        </div>
        <MapLegend />
      </div>

      {/* live tracker */}
      <div style={{ margin: '10px 16px 0', border: `1.5px solid ${c.ink}`, borderRadius: 10, overflow: 'hidden', background: c.paper }}>
        <CardHeader
          icon={
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={c.paper} strokeWidth={1.9} strokeLinejoin="round">
              <path d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12Z" />
              <circle cx={12} cy={10} r={2.4} />
            </svg>
          }
          title={whereHeading}
          right={liveActive ? <span style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.08em', color: c.gold }}>updated {liveWhen}</span> : undefined}
        />

        {/* Brother: current spot + earlier pings (they post from here). */}
        {liveActive && isBrother && (
          <>
            <div style={{ padding: '13px 14px 4px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 9, height: 9, borderRadius: '50%', background: c.rust, display: 'inline-block', animation: 'waw-blink 1.4s ease-in-out infinite', flex: '0 0 auto' }} />
                <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 21, textTransform: 'uppercase', color: c.ink, lineHeight: 1.02, letterSpacing: '.01em' }}>{liveArea}</div>
              </div>
              {liveNote && <div style={{ marginTop: 8, fontFamily: font.serif, fontSize: 13.5, color: c.inkBody2, lineHeight: 1.5 }}>“{liveNote}”</div>}
            </div>
            {updates.length > 1 && (
              <div style={{ margin: '11px 14px 0', borderTop: `1px dashed ${c.line}`, paddingTop: 9 }}>
                <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.14em', color: c.inkFaintest, textTransform: 'uppercase', marginBottom: 6 }}>Earlier pings</div>
                {liveFeed.map((u, i) => (
                  <div key={i} style={{ display: 'flex', gap: 9, padding: '4px 0' }}>
                    <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 12, color: c.rust, flex: '0 0 auto', lineHeight: 1.3 }}>•</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 12.5, textTransform: 'uppercase', color: c.ink, lineHeight: 1.15 }}>{u.loc}</div>
                      <div style={{ fontFamily: font.mono, fontSize: 8, color: c.inkFaintest, marginTop: 1 }}>{u.when}</div>
                      {u.note && <div style={{ fontFamily: font.serif, fontSize: 12, color: c.inkMuted, lineHeight: 1.45, marginTop: 2 }}>{u.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Guest: a recap of the day's journey (current spot is already in the banner). */}
        {liveActive && isGuest && (
          <div style={{ padding: '13px 14px 13px' }}>
            <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.14em', color: c.inkFaintest, textTransform: 'uppercase', marginBottom: 8 }}>
              Today the brothers have been
            </div>
            {allPings.map((u, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '5px 0' }}>
                <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: i === 0 ? c.rust : '#c9ba94', marginTop: 3, flex: '0 0 auto' }} />
                  {i < allPings.length - 1 && <div style={{ flex: 1, width: 1.5, background: c.lineSoft, marginTop: 2 }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
                  <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 13.5, textTransform: 'uppercase', color: c.ink, lineHeight: 1.15, letterSpacing: '.01em' }}>{u.loc}</div>
                  <div style={{ fontFamily: font.mono, fontSize: 8, color: c.inkFaintest, marginTop: 1 }}>{u.when}</div>
                  {u.note && <div style={{ fontFamily: font.serif, fontSize: 12.5, color: c.inkMuted, lineHeight: 1.45, marginTop: 2 }}>“{u.note}”</div>}
                </div>
              </div>
            ))}
          </div>
        )}

        {!liveActive && isBrother && (
          <div style={{ padding: '12px 14px 2px', fontFamily: font.serif, fontSize: 13, color: '#5a5140', lineHeight: 1.55 }}>
            No location posted yet. Tap <b style={{ color: c.rust }}>We are here</b> so friends &amp; family can follow along.
          </div>
        )}
        {!liveActive && isGuest && (
          <div style={{ padding: '12px 14px 13px', fontFamily: font.serif, fontSize: 13, color: '#5a5140', lineHeight: 1.55 }}>
            No location posted yet — check back once the brothers are on the road and their spot will flash on the map.
          </div>
        )}

        {isBrother && (
          <div style={{ padding: '11px 14px 13px' }}>
            <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.14em', color: c.inkFaintest, textTransform: 'uppercase', marginBottom: 6 }}>Post an update</div>
            <Dropdown label={locLabel} open={openDD === 'loc'} onToggle={() => toggleDD('loc')} options={locOptions} />
            <input
              value={draftNote}
              onChange={(e) => setDraftNote(e.target.value)}
              placeholder="Add a comment (optional)"
              style={{
                width: '100%',
                marginTop: 8,
                border: `1.5px solid ${c.ink}`,
                borderRadius: 7,
                background: c.inputBg,
                padding: '9px 11px',
                fontFamily: font.serif,
                fontSize: 13,
                color: c.inkSoft,
                outline: 'none',
              }}
            />
            <button
              onClick={postHere}
              style={{
                width: '100%',
                marginTop: 9,
                border: `1.5px solid ${c.ink}`,
                borderRadius: 8,
                background: c.rust,
                color: '#f6ecd6',
                padding: 12,
                textAlign: 'center',
                fontFamily: font.display,
                fontWeight: 700,
                fontSize: 14,
                textTransform: 'uppercase',
                letterSpacing: '.06em',
              }}
            >
              ⚑ We are here
            </button>
            {liveActive && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                <button onClick={clearUpdates} style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.04em', color: c.inkFaintest }}>
                  Clear all
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* postbox carousel */}
      <div style={{ margin: '12px 16px 0', border: `1.5px solid ${c.ink}`, borderRadius: 10, overflow: 'hidden', background: c.paper }}>
        <CardHeader
          icon={
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={c.paper} strokeWidth={1.9} strokeLinejoin="round">
              <rect x={3} y={5} width={18} height={14} rx={2} />
              <path d="M3 7 L12 13 L21 7" />
            </svg>
          }
          title="The postbox"
          right={<span style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.06em', color: c.gold, whiteSpace: 'nowrap' }}>{postCountLabel}</span>}
        />
        {postCount > 0 ? (
          <Slider
            idx={postIdx}
            onDot={setPostIdx}
            slides={postList.map((p, i) => (
              <div key={i} style={{ padding: '12px 15px 13px', minHeight: 94 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontFamily: font.mono, fontSize: 7.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: p.tagInk, background: p.tagBg, border: `1px solid ${p.tagInk}`, borderRadius: 3, padding: '1px 6px' }}>
                    {p.reason}
                  </span>
                  <span style={{ fontFamily: font.mono, fontSize: 8.5, letterSpacing: '.04em', color: c.inkFaintest }}>{p.when}</span>
                </div>
                <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 17, textTransform: 'uppercase', letterSpacing: '.01em', color: c.ink, lineHeight: 1.05 }}>
                  {p.name} {p.verb}
                </div>
                <div style={{ fontFamily: font.serif, fontSize: 14, color: c.inkBody2, lineHeight: 1.5, marginTop: 5 }}>“{p.msg}”</div>
              </div>
            ))}
          />
        ) : (
          <div style={{ padding: '14px 15px 15px', fontFamily: font.serif, fontStyle: 'italic', fontSize: 13, color: c.inkMuted, lineHeight: 1.5 }}>
            No messages yet — guests can leave a hello, tip or question from the Postbox tab and they’ll slide through here.
          </div>
        )}
      </div>

      {/* journal carousel */}
      <div style={{ margin: '12px 16px 0', border: `1.5px solid ${c.ink}`, borderRadius: 10, overflow: 'hidden', background: c.paper }}>
        <CardHeader
          icon={
            <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke={c.paper} strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round">
              <path d="M6 3 h9 a1 1 0 0 1 1 1 v15 a1 1 0 0 1 -1 1 H6 a2 2 0 0 1 -2 -2 V5 a2 2 0 0 1 2 -2 Z" />
              <line x1={8} y1={8} x2={13} y2={8} />
              <line x1={8} y1={12} x2={13} y2={12} />
            </svg>
          }
          title="The journal"
          right={<span style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.06em', color: c.gold, whiteSpace: 'nowrap' }}>{jFeedCountLabel}</span>}
        />
        {feed.length > 0 ? (
          <Slider
            idx={jFeedIdx}
            onSwipeStart={jFeedSwipeStart}
            onSwipeEnd={jFeedSwipeEnd}
            slides={feed.map((e, i) => (
              <div key={i} style={{ padding: '12px 15px 13px', minHeight: 94 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontFamily: font.mono, fontSize: 7.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: e.tagInk, background: e.tagBg, border: `1px solid ${e.tagInk}`, borderRadius: 3, padding: '1px 6px' }}>
                    {e.tag}
                  </span>
                  {e.hasAuthor && <span style={{ fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: c.inkMuted }}>{e.author}</span>}
                  <span style={{ fontFamily: font.mono, fontSize: 8.5, letterSpacing: '.04em', color: c.inkFaintest, marginLeft: 'auto' }}>{e.when}</span>
                </div>
                {e.hasTitle && <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 17, textTransform: 'uppercase', letterSpacing: '.01em', color: c.ink, lineHeight: 1.05 }}>{e.title}</div>}
                {e.hasBody && <div style={{ fontFamily: font.serif, fontSize: 14, color: c.inkBody2, lineHeight: 1.5, marginTop: 5 }}>{e.body}</div>}
              </div>
            ))}
          />
        ) : (
          <div style={{ padding: '14px 15px 15px', fontFamily: font.serif, fontStyle: 'italic', fontSize: 13, color: c.inkMuted, lineHeight: 1.5 }}>
            The record starts here — locations, decisions, Signature spots and notes will slide through as the trip unfolds.
          </div>
        )}
      </div>

      {/* stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1.5, margin: '18px 16px 0', background: c.ink, border: `1.5px solid ${c.ink}`, borderRadius: 8, overflow: 'hidden' }}>
        {[
          { n: String(meta.nights), l: 'nights', accent: false },
          { n: String(meta.dayCount), l: 'days', accent: false },
          { n: '1.7k', l: 'miles', accent: false },
          { n: String(meta.sigCount), l: 'key stops', accent: true },
        ].map((st, i) => (
          <div key={i} style={{ background: c.paper, padding: '11px 4px', textAlign: 'center' }}>
            <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 20, color: st.accent ? c.rust : c.ink }}>{st.n}</div>
            <div style={{ fontFamily: font.mono, fontSize: 7.5, letterSpacing: '.08em', color: c.inkFainter, textTransform: 'uppercase' }}>{st.l}</div>
          </div>
        ))}
      </div>

      {/* tiles */}
      <div style={{ padding: '22px 16px 4px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.18em', color: c.rust, textTransform: 'uppercase', marginBottom: 10 }}>The pack — tap in</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
          <Tile
            title="The Ride"
            sub="10-day itinerary"
            onClick={() => nav({ screen: 'days' })}
            icon={
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c.ink} strokeWidth={1.6}>
                <rect x={4} y={5} width={16} height={15} rx={1.5} />
                <line x1={4} y1={9.5} x2={20} y2={9.5} />
                <line x1={8} y1={3} x2={8} y2={6.5} />
                <line x1={16} y1={3} x2={16} y2={6.5} />
              </svg>
            }
          />
          <Tile
            title="Attractions"
            sub="every sight, filtered"
            onClick={() => nav({ screen: 'attractions' })}
            icon={
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c.rust} strokeWidth={1.6} strokeLinejoin="round">
                <path d="M12 22s7-6.6 7-12a7 7 0 1 0-14 0c0 5.4 7 12 7 12Z" />
                <circle cx={12} cy={10} r={2.6} />
              </svg>
            }
          />
          {isBrother && (
            <Tile
              title="Signature 15"
              sub="the headliners"
              onClick={() => nav({ screen: 'signature' })}
              icon={
                <svg width={22} height={22} viewBox="0 0 24 24" fill={c.rust} stroke={c.rust} strokeWidth={1}>
                  <path d="M12 3 l2.6 5.9 6.4 .6 -4.9 4.2 1.5 6.3 -5.6 -3.4 -5.6 3.4 1.5 -6.3 -4.9 -4.2 6.4 -.6 Z" />
                </svg>
              }
            />
          )}
          {isBrother && (
            <Tile
              title="Passes"
              sub="19 biker roads"
              onClick={() => nav({ screen: 'passes' })}
              icon={
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c.teal} strokeWidth={1.7} strokeLinejoin="round" strokeLinecap="round">
                  <path d="M3 20 L8 8 L13 15 L17 5 L21 12" />
                </svg>
              }
            />
          )}
          {isGuest && (
            <Tile
              title="Sights & Roads"
              sub="spots & biker passes"
              onClick={() => nav({ screen: 'sights' })}
              icon={
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c.rust} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round">
                  <path d="M12 3.5 l2.3 5.2 5.7 .5 -4.3 3.7 1.3 5.6 -5 -3 -5 3 1.3 -5.6 -4.3 -3.7 5.7 -.5 Z" />
                </svg>
              }
            />
          )}
          <Tile
            title="Campsites"
            sub="every night booked"
            onClick={() => nav({ screen: 'camp' })}
            icon={
              <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="#55643a" strokeWidth={1.6} strokeLinejoin="round">
                <path d="M12 4 L21 20 H3 Z" />
                <path d="M12 4 V20" />
              </svg>
            }
          />
          {isBrother && (
            <Tile
              title="Kit & Admin"
              sub="packing, costs, intel"
              onClick={() => nav({ screen: 'kit', kitTab: 'todo' })}
              icon={
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c.ink} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round">
                  <rect x={4} y={4} width={16} height={16} rx={2} />
                  <path d="M8 12 l2.8 2.8 L16 9" />
                </svg>
              }
            />
          )}
          {isBrother && (
            <Tile
              title="Postbox"
              sub="messages from guests"
              onClick={() => nav({ screen: 'postbox' })}
              icon={
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c.rust} strokeWidth={1.6} strokeLinejoin="round">
                  <rect x={3} y={5} width={18} height={14} rx={2} />
                  <path d="M3 7 L12 13 L21 7" />
                </svg>
              }
            />
          )}
          {isBrother && (
            <Tile
              title="Journal"
              sub="the trip record"
              onClick={() => nav({ screen: 'journal' })}
              icon={
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={c.teal} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round">
                  <path d="M6 3 h10 a1 1 0 0 1 1 1 v16 a1 1 0 0 1 -1 1 H6 a2 2 0 0 1 -2 -2 V5 a2 2 0 0 1 2 -2 Z" />
                  <line x1={8.5} y1={8} x2={14} y2={8} />
                  <line x1={8.5} y1={12} x2={14} y2={12} />
                  <line x1={8.5} y1={16} x2={12} y2={16} />
                </svg>
              }
            />
          )}
        </div>
      </div>

      <div style={{ margin: '16px 16px 26px', borderTop: `1.5px dashed ${c.line}`, paddingTop: 14 }}>
        <div style={{ fontFamily: font.serif, fontSize: 13.5, fontStyle: 'italic', color: c.inkMuted, lineHeight: 1.55 }}>{meta.intro}</div>
      </div>
    </div>
  )
}
