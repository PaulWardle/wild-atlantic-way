import { c, font, phaseInfo } from '../theme'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { isMarkable } from '../lib/tags'
import { countdownParts } from '../lib/countdown'
import { NavPanel } from '../components/NavPanel'

const meta = tripData.meta

/** One node of the Today timeline: a dot (or camp tent) + title, with the
 * connecting line. A "maybe" is highlighted amber; skipped logistics are dimmed. */
function TimelineRow({
  dot,
  title,
  sub,
  tent = false,
  maybe = false,
  dim = false,
  hollow = false,
  last = false,
}: {
  dot: string
  title: string
  sub?: string
  tent?: boolean
  maybe?: boolean
  dim?: boolean
  hollow?: boolean
  last?: boolean
}) {
  return (
    <div style={{ display: 'flex', gap: 11 }}>
      <div style={{ flex: '0 0 18px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {tent ? (
          <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={dot} strokeWidth={1.9} strokeLinejoin="round" style={{ marginTop: 2 }}>
            <path d="M12 4 L21 20 H3 Z" />
            <path d="M12 4 V20" />
          </svg>
        ) : (
          <span style={{ width: 11, height: 11, borderRadius: '50%', background: hollow ? 'transparent' : dot, border: `2px solid ${dot}`, marginTop: 3, flex: '0 0 auto' }} />
        )}
        {!last && <div style={{ flex: 1, width: 1.5, background: c.lineSoft, marginTop: 3, minHeight: 12 }} />}
      </div>
      <div style={{ flex: 1, minWidth: 0, paddingBottom: last ? 2 : 14 }}>
        {sub && <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.12em', color: c.inkFaintest, textTransform: 'uppercase', marginBottom: 2 }}>{sub}</div>}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: font.display, fontWeight: 600, fontSize: 15, color: maybe ? c.amber : dim ? c.inkFainter : c.ink, textTransform: 'uppercase', letterSpacing: '.01em', lineHeight: 1.15 }}>
            {title}
          </span>
          {maybe && (
            <span style={{ fontFamily: font.mono, fontSize: 7.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: c.amberGold, border: `1px solid ${c.amber}`, background: c.amberPanel, borderRadius: 3, padding: '1px 5px' }}>
              maybe
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function CdCell({ n, label }: { n: string | number; label: string }) {
  return (
    <div style={{ border: `1.5px solid ${c.ink}`, background: c.paper, borderRadius: 9, padding: '12px 5px', minWidth: 58 }}>
      <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 30, color: c.rust, lineHeight: 0.9 }}>{n}</div>
      <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.12em', color: c.inkFainter, textTransform: 'uppercase', marginTop: 6 }}>{label}</div>
    </div>
  )
}

export function Today() {
  const { nowTs, isBrother, store, nav } = useStore()
  const marks = store.marks || {}
  const T = tripData

  let departMs = 0
  try {
    departMs = new Date(meta.depart + 'T00:00:00').getTime()
  } catch {
    departMs = 0
  }
  const d0 = new Date(nowTs)
  const todayMs = new Date(d0.getFullYear(), d0.getMonth(), d0.getDate()).getTime()
  const offDays = Math.floor((todayMs - departMs) / 86400000)
  let todayIdx: number
  let state: 'pre' | 'live' | 'post'
  if (offDays < 0) {
    todayIdx = 0
    state = 'pre'
  } else if (offDays >= T.days.length) {
    todayIdx = T.days.length - 1
    state = 'post'
  } else {
    todayIdx = offDays
    state = 'live'
  }

  if (state === 'pre') {
    const cd = countdownParts(meta.depart, nowTs)
    return (
      <div style={{ height: '100%', minHeight: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px 26px', animation: 'waw-fade .4s ease both' }}>
        <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: '.24em', color: c.rust, textTransform: 'uppercase' }}>Countdown to</div>
        <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 33, letterSpacing: '.008em', textTransform: 'uppercase', color: c.ink, lineHeight: 0.94, margin: '11px 0 5px' }}>
          Wild
          <br />
          Atlantic Way
        </div>
        <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 14, color: c.inkMuted, marginBottom: 28 }}>Douglas → Larne · 10 Aug 2026</div>
        <div style={{ display: 'flex', gap: 7 }}>
          <CdCell n={cd.days} label="Days" />
          <CdCell n={cd.hrs} label="Hrs" />
          <CdCell n={cd.mins} label="Min" />
          <CdCell n={cd.secs} label="Sec" />
        </div>
        <div style={{ fontFamily: font.serif, fontSize: 13, color: c.inkFainter, marginTop: 28, lineHeight: 1.55, maxWidth: 268 }}>
          {isBrother ? 'The day-by-day plan opens here once the trip begins.' : 'The day-by-day plan opens here once the brothers set off.'}
        </div>
      </div>
    )
  }

  if (state === 'post') {
    return (
      <div style={{ height: '100%', minHeight: 520, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '44px 26px', animation: 'waw-fade .4s ease both' }}>
        <div style={{ width: 66, height: 66, borderRadius: '50%', background: c.rust, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 22 }}>
          <svg width={34} height={34} viewBox="0 0 24 24" fill="none" stroke="#f6ecd6" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 13 l4 4 L19 6" />
          </svg>
        </div>
        <div style={{ fontFamily: font.mono, fontSize: 10, letterSpacing: '.24em', color: c.rust, textTransform: 'uppercase' }}>The ride is done</div>
        <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 31, textTransform: 'uppercase', color: c.ink, lineHeight: 0.96, margin: '9px 0 5px' }}>
          Muff
          <br />
          to Kinsale
        </div>
        <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 14, color: c.inkMuted }}>The Wild Atlantic Way, ridden.</div>
        <div style={{ display: 'flex', gap: 7, marginTop: 26 }}>
          {[
            { n: '10', l: 'Days', accent: false },
            { n: String(meta.sigCount), l: 'Signature', accent: true },
            { n: meta.totalMiles, l: 'Miles', accent: false },
          ].map((st, i) => (
            <div key={i} style={{ border: `1.5px solid ${c.ink}`, background: c.paper, borderRadius: 9, padding: '11px 13px' }}>
              <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 24, color: st.accent ? c.rust : c.ink, lineHeight: 0.9 }}>{st.n}</div>
              <div style={{ fontFamily: font.mono, fontSize: 8, letterSpacing: '.1em', color: c.inkFainter, textTransform: 'uppercase', marginTop: 5 }}>{st.l}</div>
            </div>
          ))}
        </div>
        <button onClick={() => nav({ screen: 'map' })} style={{ marginTop: 26, border: `1.5px solid ${c.ink}`, borderRadius: 8, background: c.ink, color: c.paper, padding: '11px 20px', textAlign: 'center', fontFamily: font.display, fontWeight: 600, fontSize: 12.5, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          See the map →
        </button>
        <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 13, color: c.inkFainter, marginTop: 22 }}>Bald(ing) Brothers · August 2026</div>
      </div>
    )
  }

  // live
  const tdy = T.days[todayIdx] || T.days[0]
  const tPi = phaseInfo(tdy.phase)
  // The day's plan as a timeline: every stop the brothers haven't cut, in order.
  // Cut stops drop out entirely; a "maybe" is highlighted; keeps/undecided are plain.
  const timelineStops = (tdy.stops || [])
    // Marks only apply to optional extras — locked official stops ignore them
    // (and stale position-keyed marks from older itineraries stay inert).
    .map((st, si) => ({ st, mk: isMarkable(tdy, st) ? marks['d' + todayIdx + 's' + si] || null : null }))
    .filter((x) => x.mk !== 'cut')
    .map((x) => ({ n: x.st.n, maybe: x.mk === 'maybe', skip: !!x.st.skip }))
  const highlights = (tdy.stops || [])
    .filter((st, si) => (st.tags || []).indexOf('s') >= 0 && !(isMarkable(tdy, st) && marks['d' + todayIdx + 's' + si] === 'cut'))
    .map((st) => st.n)
  const night = tdy.night
  const hasCall = !!tdy.warnBanner && isBrother

  return (
    <div style={{ animation: 'waw-fade .4s ease both' }}>
      <div style={{ background: c.ink, color: c.paper, padding: '16px 18px 15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.18em', color: c.gold, textTransform: 'uppercase' }}>Today · Day {tdy.n}</div>
          <div style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.14em', color: c.gold }}>{tdy.dow} · {tdy.date}</div>
        </div>
        <div style={{ display: 'inline-flex', fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: tPi.color, border: `1px solid ${tPi.color}`, borderRadius: 3, padding: '1px 6px', marginTop: 10 }}>
          {tPi.label}
        </div>
        <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 24, textTransform: 'uppercase', lineHeight: 1.04, margin: '7px 0 2px' }}>{tdy.title}</div>
        <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 14, color: '#c9bfa6' }}>{tdy.tagline}</div>
        <div style={{ display: 'inline-block', marginTop: 10, fontFamily: font.mono, fontSize: 10, letterSpacing: '.04em', color: c.paper, border: '1.5px solid #7a6d54', borderRadius: 20, padding: '3px 10px' }}>{tdy.miles}</div>
      </div>

      {hasCall && (
        <div style={{ margin: '14px 16px 0', border: `1.5px solid ${c.rust}`, background: c.amberPanelDeep, borderRadius: 8, padding: '11px 13px' }}>
          <div style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.12em', color: c.rust, textTransform: 'uppercase', marginBottom: 4 }}>⚠ The call to make</div>
          <div style={{ fontFamily: font.serif, fontSize: 13.5, color: c.inkBody2, lineHeight: 1.5 }}>{tdy.warnBanner}</div>
        </div>
      )}

      {/* On the road, this is the whole point of the screen: one tap → Google Maps. */}
      {isBrother && <NavPanel key={todayIdx} di={todayIdx} marks={marks} pad={16} />}

      <div style={{ padding: '16px 16px 4px' }}>
        {highlights.length > 0 && (
          <div style={{ border: `1.5px solid ${c.rust}`, background: '#f7ecd6', borderRadius: 8, padding: '9px 12px', marginBottom: 14 }}>
            <div style={{ fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.1em', color: c.rust, textTransform: 'uppercase', marginBottom: 3 }}>★ Don’t miss</div>
            <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 14.5, textTransform: 'uppercase', color: c.ink, lineHeight: 1.3, letterSpacing: '.01em' }}>{highlights.join('  ·  ')}</div>
          </div>
        )}
        <div style={{ fontFamily: font.mono, fontSize: 8.5, letterSpacing: '.16em', color: c.inkFaintest, textTransform: 'uppercase', marginBottom: 12 }}>The day, in order</div>

        <TimelineRow dot={c.rust} title="Set off" sub={`Day ${tdy.n} · ${tdy.dow}`} />
        {timelineStops.map((s, i) => (
          <TimelineRow
            key={i}
            dot={s.maybe ? c.amber : c.ink}
            hollow={!s.maybe && s.skip}
            title={s.n}
            maybe={s.maybe}
            dim={s.skip && !s.maybe}
          />
        ))}
        {night && <TimelineRow dot={c.green} tent title={night.primary} sub={`Tonight — ${night.area}`} last />}
      </div>

      <div style={{ padding: '18px 16px 26px' }}>
        <button onClick={() => nav({ screen: 'day', day: todayIdx })} style={{ width: '100%', border: `1.5px solid ${c.ink}`, borderRadius: 8, background: c.ink, color: c.paper, padding: 12, textAlign: 'center', fontFamily: font.display, fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Open the full day →
        </button>
      </div>
    </div>
  )
}
