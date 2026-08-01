import { c, font, phaseInfo } from '../theme'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { buildTags, isMarkable } from '../lib/tags'
import { stripPrice } from '../lib/camps'
import { summarizeDay, fmtH } from '../lib/daymath'
import { dayLegs, dayKml, tripKml, downloadKml } from '../lib/nav'
import { TagChips } from '../components/ui'
import type { Stop } from '../types'

/** Google Maps hand-off: ride legs pinned to the official line + KML for My Maps. */
function NavPanel({ di }: { di: number }) {
  const legs = dayLegs(di)
  if (!legs.length) return null
  const dy = tripData.days[di]
  return (
    <div style={{ margin: '14px 18px 0', border: `1.5px solid ${c.ink}`, borderRadius: 9, overflow: 'hidden' }}>
      <div style={{ background: c.teal, color: c.cream, padding: '6px 12px', fontFamily: font.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' }}>
        Navigate · Google Maps
      </div>
      <div style={{ background: c.paper, padding: '9px 11px 11px' }}>
        {legs.map((leg, i) => (
          <a
            key={i}
            href={leg.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: 10, border: `1.5px solid ${c.teal}`, borderRadius: 7, background: c.tealPanel, padding: '9px 12px', marginBottom: 6, textDecoration: 'none' }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 13, textTransform: 'uppercase', color: c.teal, letterSpacing: '.02em', lineHeight: 1.15 }}>{leg.label}</div>
              <div style={{ fontFamily: font.mono, fontSize: 8.5, color: c.inkFaint, marginTop: 2 }}>{leg.sub}</div>
            </div>
            <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 16, color: c.teal }}>›</span>
          </a>
        ))}
        <div style={{ display: 'flex', gap: 6, marginTop: 2 }}>
          <button
            onClick={() => {
              const k = dayKml(di)
              if (k) downloadKml(`waw-day-${dy.n}.kml`, k)
            }}
            style={{ flex: 1, border: `1.5px solid ${c.ink}`, borderRadius: 7, background: c.paper, padding: '7px 6px', fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: c.ink }}
          >
            Day {dy.n} line (KML)
          </button>
          <button
            onClick={() => downloadKml('wild-atlantic-way-full.kml', tripKml())}
            style={{ flex: 1, border: `1.5px solid ${c.ink}`, borderRadius: 7, background: c.paper, padding: '7px 6px', fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: c.ink }}
          >
            Full route (KML)
          </button>
        </div>
        <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 11.5, color: c.inkFainter, lineHeight: 1.45, marginTop: 8 }}>
          Legs open in Google Maps with the official line pinned as waypoints. KML files import into Google My Maps (Create map → Import) and show as a layer in the Maps app — the exact line, every stop, every camp.
        </div>
      </div>
    </div>
  )
}

/** Route-item badge: locked official road / on-route stop / optional extra / transfer. */
function KindBadge({ st }: { st: Stop }) {
  const k = st.kind
  if (!k) return null
  const spec =
    k === 'waw'
      ? { t: '🔒 OFFICIAL WAW', ink: c.paper, bg: c.ink, bd: c.ink }
      : k === 'onroute'
        ? { t: '📍 ON ROUTE', ink: c.green, bg: c.greenPanel, bd: c.green }
        : k === 'extra'
          ? { t: '🏍 OPTIONAL', ink: c.amber, bg: c.amberPanel, bd: c.amber }
          : { t: 'TRANSFER', ink: c.inkFainter, bg: c.paperMuted, bd: c.inkFainter }
  return (
    <span style={{ fontFamily: font.mono, fontSize: 7.5, fontWeight: 700, letterSpacing: '.07em', textTransform: 'uppercase', color: spec.ink, background: spec.bg, border: `1px solid ${spec.bd}`, borderRadius: 3, padding: '1px 6px', whiteSpace: 'nowrap' }}>
      {spec.t}
    </span>
  )
}

/** True road impact line for an optional extra — provenance-honest. */
function ImpactLine({ st }: { st: Stop }) {
  if (st.kind !== 'extra') return null
  if (!st.impactSrc) {
    return <div style={{ fontFamily: font.mono, fontSize: 9, color: c.inkFainter, marginTop: 4 }}>Road impact not yet calculated</div>
  }
  return (
    <div style={{ fontFamily: font.mono, fontSize: 9, color: c.amberGold, marginTop: 4, lineHeight: 1.5 }}>
      +{st.impactMi} mi est · +{st.impactMin} min riding{st.stopMin ? ` · ~${st.stopMin} min stop` : ''}
      {st.exit && <span style={{ color: c.inkFaintest }}> · off the line at {st.exit}</span>}
    </div>
  )
}

function SumCell({ label, value, strong, wide }: { label: string; value: string; strong?: boolean; wide?: boolean }) {
  return (
    <div style={{ background: c.paper, padding: '7px 4px', textAlign: 'center', gridColumn: wide ? 'span 2' : undefined }}>
      <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: strong ? 16 : 13.5, color: strong ? c.rust : c.ink, lineHeight: 1 }}>{value}</div>
      <div style={{ fontFamily: font.mono, fontSize: 7, letterSpacing: '.06em', color: c.inkFainter, textTransform: 'uppercase', marginTop: 3 }}>{label}</div>
    </div>
  )
}

function MarkButton({ label, color, bg, fg, onClick }: { label: string; color: string; bg: string; fg: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1.5px solid ${color}`,
        borderRadius: 6,
        padding: '5px 12px',
        fontFamily: font.display,
        fontWeight: 600,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '.04em',
        background: bg,
        color: fg,
      }}
    >
      {label}
    </button>
  )
}

export function DayDetail() {
  const { day, isBrother, store, setStopMark, setDay } = useStore()
  const marks = store.marks || {}
  const T = tripData
  const di = day
  const dy = T.days[di] || T.days[0]
  const sum = summarizeDay(dy, di, marks)
  const pi = phaseInfo(dy.phase)
  const night = dy.night
  const hasPrev = di > 0
  const hasNext = di < T.days.length - 1

  return (
    <div style={{ animation: 'waw-fade .35s ease both' }}>
      <div style={{ background: c.paperMuted, borderBottom: `1.5px solid ${c.ink}`, padding: '16px 18px 15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.14em', color: c.inkFaint, textTransform: 'uppercase' }}>
            {dy.dow} · {dy.date}
          </div>
          <div style={{ fontFamily: font.mono, fontSize: 9, letterSpacing: '.14em', color: c.rust }}>DAY {dy.n} / {T.meta.dayCount}</div>
        </div>
        <div style={{ display: 'inline-flex', fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: pi.color, border: `1px solid ${pi.color}`, borderRadius: 3, padding: '1px 6px', marginTop: 9 }}>
          {pi.label}
        </div>
        <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 25, textTransform: 'uppercase', color: c.ink, lineHeight: 1.02, margin: '6px 0 2px' }}>{dy.title}</div>
        <div style={{ fontFamily: font.serif, fontStyle: 'italic', fontSize: 14, color: c.inkMuted }}>{dy.tagline}</div>
        <div style={{ display: 'inline-block', marginTop: 9, fontFamily: font.mono, fontSize: 10, letterSpacing: '.04em', color: c.ink, border: `1.5px solid ${c.ink}`, borderRadius: 20, padding: '3px 10px', background: c.paper }}>{dy.miles}</div>
      </div>

      {dy.wawStart && (
        <div style={{ margin: '14px 18px 0', border: `1.5px solid ${c.rust}`, background: c.rust, color: '#f6ecd6', borderRadius: 8, padding: '10px 13px', display: 'flex', alignItems: 'center', gap: 9 }}>
          <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 18 }}>★</span>
          <div style={{ fontFamily: font.serif, fontSize: 13.5, lineHeight: 1.45 }}>
            The official Wild Atlantic Way begins here at Malin Head. Everything before was the warm-up.
          </div>
        </div>
      )}

      {dy.warnBanner && isBrother && (
        <div style={{ margin: '14px 18px 0', border: `1.5px solid ${c.rust}`, background: c.amberPanelDeep, borderRadius: 8, padding: '11px 13px' }}>
          <div style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.12em', color: c.rust, textTransform: 'uppercase', marginBottom: 4 }}>⚠ The call to make</div>
          <div style={{ fontFamily: font.serif, fontSize: 13.5, color: c.inkBody2, lineHeight: 1.5 }}>{dy.warnBanner}</div>
        </div>
      )}

      {/* Live day maths — official locked, extras recalc as you Keep/Maybe/Cut */}
      {sum.hasWaw && (
        <div style={{ margin: '14px 18px 0', border: `1.5px solid ${c.ink}`, borderRadius: 9, overflow: 'hidden' }}>
          <div style={{ background: c.ink, color: c.paper, padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: font.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' }}>Day maths · 100% WAW mode</span>
            <span style={{ fontFamily: font.mono, fontSize: 8.5, letterSpacing: '.06em', color: c.gold }}>WAW after today: {sum.wawPctAfter}%</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1.5, background: c.lineSoft }}>
            <SumCell label="Official 🔒" value={`${sum.wawMi} mi`} />
            <SumCell label="Transfer" value={`${sum.transferMi} mi`} />
            <SumCell label="Kept extras" value={`+${sum.keptMi} mi`} />
            <SumCell label="Maybe extras" value={`+${sum.maybeMi} mi`} />
            <SumCell label="Camp +/−" value={`${sum.campDevMi} mi`} />
            <SumCell label="Planned" value={`${Math.round(sum.plannedMi)} mi`} strong />
            <SumCell label="Max w/ maybes" value={`${Math.round(sum.maxMi)} mi`} />
            <SumCell label="Est. day" value={fmtH(sum.dayMin)} strong />
          </div>
          <div style={{ background: c.paperMuted, borderTop: `1px solid ${c.lineSoft}`, padding: '5px 12px', fontFamily: font.mono, fontSize: 8.5, color: c.inkFaint, letterSpacing: '.04em' }}>
            riding {fmtH(sum.rideMin)} · stops {fmtH(sum.stopMin)} · with maybes {fmtH(sum.maxDayMin)}
          </div>
        </div>
      )}

      {isBrother && <NavPanel di={di} />}

      <div style={{ padding: '18px 18px 4px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 8.5, letterSpacing: '.16em', color: c.inkFaintest, textTransform: 'uppercase', marginBottom: 12 }}>
          {isBrother ? 'The route · keep, maybe or cut each stop' : 'The route · every stop, in order'}
        </div>
        {(dy.stops || []).map((st, si) => {
          const key = 'd' + di + 's' + si
          // 100% WAW mode: only optional extras can carry a mark. Locked
          // official stops IGNORE marks entirely — this also makes stale
          // position-keyed marks from older itinerary versions inert.
          const mk = isMarkable(dy, st) ? marks[key] || null : null
          // Guests never see an extra the brothers have cut.
          if (!isBrother && mk === 'cut') return null
          const dot = mk === 'keep' ? c.green : mk === 'maybe' ? c.amber : mk === 'cut' ? c.rust : c.paperDeep
          const canMark = isMarkable(dy, st) && isBrother
          const isCut = mk === 'cut'
          return (
            <div key={si} style={{ display: 'flex', gap: 0, opacity: isCut ? 0.55 : 1 }}>
              <div style={{ flex: '0 0 26px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 13, height: 13, borderRadius: '50%', border: `2px solid ${mk ? dot : c.ink}`, background: dot, marginTop: 4, flex: '0 0 auto' }} />
                <div style={{ flex: 1, width: 2, background: '#c9ba94', margin: '2px 0' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0, padding: '0 0 18px 8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: font.display, fontWeight: 600, fontSize: 16, color: c.ink, lineHeight: 1.12, letterSpacing: '.01em', textDecoration: isCut ? 'line-through' : 'none' }}>
                    {st.n}
                  </span>
                  <KindBadge st={st} />
                </div>
                <TagChips tags={buildTags(st)} />
                <ImpactLine st={st} />
                <div style={{ fontFamily: font.serif, fontSize: 14, color: c.inkBody, lineHeight: 1.5, marginTop: 5 }}>{st.d}</div>
                {st.warn && isBrother && (
                  <div style={{ marginTop: 7, borderLeft: `3px solid ${c.rust}`, background: '#f5e7d8', padding: '6px 10px', borderRadius: '0 6px 6px 0' }}>
                    <span style={{ fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.1em', color: c.rust, textTransform: 'uppercase' }}>⚠ Heads up</span>
                    <div style={{ fontFamily: font.serif, fontSize: 13, color: c.inkBody2, lineHeight: 1.45, marginTop: 1 }}>{st.warn}</div>
                  </div>
                )}
                {canMark && (
                  <div style={{ display: 'flex', gap: 5, marginTop: 9 }}>
                    <MarkButton label="Keep" color={c.green} bg={mk === 'keep' ? c.green : c.greenPanel} fg={mk === 'keep' ? c.paper : c.green} onClick={() => setStopMark(di, si, 'keep')} />
                    <MarkButton label="Maybe" color={c.amber} bg={mk === 'maybe' ? c.amber : c.amberPanel} fg={mk === 'maybe' ? c.ink : c.amber} onClick={() => setStopMark(di, si, 'maybe')} />
                    <MarkButton label="Cut" color={c.rust} bg={mk === 'cut' ? c.rust : c.amberPanelDeep} fg={mk === 'cut' ? c.paper : c.rust} onClick={() => setStopMark(di, si, 'cut')} />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {night && (() => {
        // Colour is the booking status: green = booked, amber = unconfirmed.
        const unconfirmed = T.campsites[di] && T.campsites[di].bookingStatus !== 'booked'
        const nTint = unconfirmed ? c.amber : c.green
        const nPanel = unconfirmed ? c.amberPanel : c.greenPanel
        return (
        <div style={{ margin: '4px 18px 0' }}>
          <div style={{ display: 'flex', gap: 0 }}>
            <div style={{ flex: '0 0 26px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 14, height: 14, background: nTint, transform: 'rotate(45deg)', marginTop: 2, flex: '0 0 auto' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0, paddingLeft: 8 }}>
              <div style={{ border: `1.5px solid ${nTint}`, borderRadius: 9, background: nPanel, overflow: 'hidden' }}>
                <div style={{ background: nTint, color: nPanel, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={nPanel} strokeWidth={1.8} strokeLinejoin="round">
                    <path d="M12 4 L21 20 H3 Z" />
                    <path d="M12 4 V20" />
                  </svg>
                  <span style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' }}>Tonight — {night.area}</span>
                </div>
                <div style={{ padding: '11px 13px' }}>
                  <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 16, textTransform: 'uppercase', color: c.ink, letterSpacing: '.01em', lineHeight: 1.1 }}>{night.primary}</div>
                  {/* colour is the status: amber note only while unconfirmed (from tripData.campsites) */}
                  {isBrother && T.campsites[di] && T.campsites[di].bookingStatus !== 'booked' && (
                    <div style={{ fontFamily: font.mono, fontSize: 8.5, color: c.amber, marginTop: 4, letterSpacing: '.04em' }}>
                      {T.campsites[di].bookingNote || 'not yet confirmed'}
                    </div>
                  )}
                  {night.sellout && isBrother && (
                    <div style={{ display: 'inline-block', marginTop: 5, fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: c.rust, border: `1px solid ${c.rust}`, borderRadius: 3, padding: '1px 5px' }}>
                      Book this week — sells out
                    </div>
                  )}
                  {stripPrice(night.note) && <div style={{ fontFamily: font.serif, fontSize: 13, color: '#5a5140', lineHeight: 1.5, marginTop: 6 }}>{stripPrice(night.note)}</div>}
                  {(night.deviationMi != null || night.retraceMi != null) && (
                    <div style={{ fontFamily: font.mono, fontSize: 9, color: c.inkFaint, marginTop: 7, borderTop: '1px dashed #b9c0a0', paddingTop: 6, lineHeight: 1.6 }}>
                      WAW deviation +{night.deviationMi ?? 0} mi
                      {night.retraceMi ? (
                        <> · repeated road next morning ~{night.retraceMi} mi{night.retraceWhy ? <span style={{ color: c.inkFaintest }}> — {night.retraceWhy}</span> : null}</>
                      ) : (
                        <> · ✓ forward progression, no retrace</>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )})()}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, padding: '20px 18px 30px' }}>
        {hasPrev && (
          <button onClick={() => setDay(Math.max(0, di - 1))} style={{ border: `1.5px solid ${c.ink}`, borderRadius: 7, background: c.paper, padding: '9px 15px', fontFamily: font.display, fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.04em', color: c.ink }}>
            ‹ Prev day
          </button>
        )}
        <div style={{ flex: 1 }} />
        {hasNext && (
          <button onClick={() => setDay(Math.min(T.days.length - 1, di + 1))} style={{ border: `1.5px solid ${c.ink}`, borderRadius: 7, background: c.ink, padding: '9px 15px', fontFamily: font.display, fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '.04em', color: c.paper }}>
            Next day ›
          </button>
        )}
      </div>
    </div>
  )
}
