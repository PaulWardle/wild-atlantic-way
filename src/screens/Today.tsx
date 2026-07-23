import { c, font, phaseInfo } from '../theme'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { buildTags } from '../lib/tags'
import { countdownParts } from '../lib/countdown'
import { TagChips } from '../components/ui'

const meta = tripData.meta

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
    departMs = new Date(meta.depart).getTime()
  } catch {
    departMs = 0
  }
  const offDays = Math.floor((nowTs - departMs) / 86400000)
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
          Malin Head
          <br />
          to Kinsale
        </div>
        <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 14, color: c.inkMuted }}>The Wild Atlantic Way, ridden.</div>
        <div style={{ display: 'flex', gap: 7, marginTop: 26 }}>
          {[
            { n: '10', l: 'Days', accent: false },
            { n: String(meta.sigCount), l: 'Signature', accent: true },
            { n: '1.7k', l: 'Miles', accent: false },
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
  const summaryStops = (tdy.stops || [])
    .map((st, si) => ({ st, mk: marks['d' + todayIdx + 's' + si] || null }))
    .filter((x) => x.mk !== 'cut')
    .map((x) => {
      const tl = buildTags(x.st)
      return { n: x.st.n, tagList: tl, hasTags: tl.length > 0, kept: x.mk === 'keep', dot: x.mk === 'keep' ? c.green : '#c9ba94', op: x.st.skip ? 0.7 : 1 }
    })
  const highlights = (tdy.stops || [])
    .filter((st, si) => (st.tags || []).indexOf('s') >= 0 && marks['d' + todayIdx + 's' + si] !== 'cut')
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

      <div style={{ padding: '16px 16px 4px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 8.5, letterSpacing: '.16em', color: c.inkFaintest, textTransform: 'uppercase', marginBottom: 10 }}>Today at a glance</div>
        {highlights.length > 0 && (
          <div style={{ border: `1.5px solid ${c.rust}`, background: '#f7ecd6', borderRadius: 8, padding: '9px 12px', marginBottom: 13 }}>
            <div style={{ fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.1em', color: c.rust, textTransform: 'uppercase', marginBottom: 3 }}>★ Don’t miss</div>
            <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 14.5, textTransform: 'uppercase', color: c.ink, lineHeight: 1.3, letterSpacing: '.01em' }}>{highlights.join('  ·  ')}</div>
          </div>
        )}
        {summaryStops.map((ss, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 9, padding: '5px 0', opacity: ss.op }}>
            <div style={{ flex: '0 0 auto', width: 8, height: 8, borderRadius: '50%', background: ss.dot, marginTop: 6 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 14.5, color: c.ink, lineHeight: 1.15, letterSpacing: '.01em' }}>{ss.n}</div>
              {ss.hasTags && <TagChips tags={ss.tagList} size={7.5} />}
            </div>
            {ss.kept && <span style={{ flex: '0 0 auto', fontFamily: font.display, fontWeight: 700, fontSize: 13, color: c.green, marginTop: 2 }}>✓</span>}
          </div>
        ))}
      </div>

      {night && (
        <div style={{ margin: '10px 16px 0', border: `1.5px solid ${c.green}`, borderRadius: 9, background: c.greenPanel, overflow: 'hidden' }}>
          <div style={{ background: c.green, color: c.greenPanel, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 7 }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={c.greenPanel} strokeWidth={1.8} strokeLinejoin="round">
              <path d="M12 4 L21 20 H3 Z" />
              <path d="M12 4 V20" />
            </svg>
            <span style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' }}>Tonight — {night.area}</span>
          </div>
          <div style={{ padding: '11px 13px' }}>
            <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 16, textTransform: 'uppercase', color: c.ink, letterSpacing: '.01em', lineHeight: 1.1 }}>{night.primary}</div>
            <div style={{ fontFamily: font.serif, fontSize: 13, color: '#5a5140', lineHeight: 1.5, marginTop: 6 }}>{night.note}</div>
          </div>
        </div>
      )}

      <div style={{ padding: '16px 16px 26px' }}>
        <button onClick={() => nav({ screen: 'day', day: todayIdx })} style={{ width: '100%', border: `1.5px solid ${c.ink}`, borderRadius: 8, background: c.ink, color: c.paper, padding: 12, textAlign: 'center', fontFamily: font.display, fontWeight: 600, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.05em' }}>
          Open the full day →
        </button>
      </div>
    </div>
  )
}
