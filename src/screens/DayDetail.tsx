import { c, font, phaseInfo } from '../theme'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { buildTags, isMarkable } from '../lib/tags'
import { TagChips } from '../components/ui'

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

      <div style={{ padding: '18px 18px 4px' }}>
        <div style={{ fontFamily: font.mono, fontSize: 8.5, letterSpacing: '.16em', color: c.inkFaintest, textTransform: 'uppercase', marginBottom: 12 }}>
          {isBrother ? 'The route · keep, maybe or cut each stop' : 'The route · every stop, in order'}
        </div>
        {(dy.stops || []).map((st, si) => {
          const key = 'd' + di + 's' + si
          const mk = marks[key] || null
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
                <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 16, color: c.ink, lineHeight: 1.12, letterSpacing: '.01em', textDecoration: isCut ? 'line-through' : 'none' }}>
                  {st.n}
                </div>
                <TagChips tags={buildTags(st)} />
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

      {night && (
        <div style={{ margin: '4px 18px 0' }}>
          <div style={{ display: 'flex', gap: 0 }}>
            <div style={{ flex: '0 0 26px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 14, height: 14, background: c.green, transform: 'rotate(45deg)', marginTop: 2, flex: '0 0 auto' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0, paddingLeft: 8 }}>
              <div style={{ border: `1.5px solid ${c.green}`, borderRadius: 9, background: c.greenPanel, overflow: 'hidden' }}>
                <div style={{ background: c.green, color: c.greenPanel, padding: '6px 12px', display: 'flex', alignItems: 'center', gap: 7 }}>
                  <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={c.greenPanel} strokeWidth={1.8} strokeLinejoin="round">
                    <path d="M12 4 L21 20 H3 Z" />
                    <path d="M12 4 V20" />
                  </svg>
                  <span style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' }}>Tonight — {night.area}</span>
                </div>
                <div style={{ padding: '11px 13px' }}>
                  <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 16, textTransform: 'uppercase', color: c.ink, letterSpacing: '.01em', lineHeight: 1.1 }}>{night.primary}</div>
                  {night.sellout && isBrother && (
                    <div style={{ display: 'inline-block', marginTop: 5, fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: c.rust, border: `1px solid ${c.rust}`, borderRadius: 3, padding: '1px 5px' }}>
                      Book this week — sells out
                    </div>
                  )}
                  <div style={{ fontFamily: font.serif, fontSize: 13, color: '#5a5140', lineHeight: 1.5, marginTop: 6 }}>{night.note}</div>
                  <div style={{ fontFamily: font.mono, fontSize: 10, color: c.inkFaint, marginTop: 7, borderTop: '1px dashed #b9c0a0', paddingTop: 6 }}>BACKUP · {night.backup}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
