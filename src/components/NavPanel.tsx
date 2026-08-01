import { useMemo, useState } from 'react'
import { c, font } from '../theme'
import { dayCheckpoints, navStretch, type StopMarks } from '../lib/nav'

/* On the road you want ONE tap: the app knows the day, knows what's been
 * ridden, so the panel leads with a single big button — the NEXT stop. Tap it,
 * Google Maps opens from wherever you're standing with the official line
 * pinned, and the panel lines up the stop after. "skip" passes a stop without
 * navigating; "change" opens one list for the exceptional jump-around. */

export function NavPanel({ di, marks, pad = 18 }: { di: number; marks: StopMarks; pad?: number }) {
  const cps = useMemo(() => dayCheckpoints(di, marks), [di, marks])
  const key = 'waw:navnext:' + di
  const [nextName, setNextName] = useState<string | null>(() => {
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  })
  const [pick, setPick] = useState(false)
  if (cps.length < 2) return null

  const found = nextName && nextName !== 'DONE' ? cps.findIndex((cp) => cp.name === nextName) : -1
  const ni = nextName === 'DONE' ? cps.length : found >= 1 ? found : 1
  const done = ni >= cps.length
  const save = (v: string) => {
    try {
      localStorage.setItem(key, v)
    } catch {
      /* private mode — progress just won't persist */
    }
  }
  const setNext = (i: number) => {
    setNextName(cps[i].name)
    save(cps[i].name)
    setPick(false)
  }
  const advance = () => {
    const n = ni + 1
    const v = n >= cps.length ? 'DONE' : cps[n].name
    setNextName(v)
    save(v)
  }

  const shell: React.CSSProperties = { margin: `14px ${pad}px 0`, border: `1.5px solid ${c.ink}`, borderRadius: 9, overflow: 'hidden' }
  const head: React.CSSProperties = { background: c.teal, color: c.cream, padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
  const headL: React.CSSProperties = { fontFamily: font.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' }

  if (done) {
    return (
      <div style={shell}>
        <div style={head}>
          <span style={headL}>Navigate · Google Maps</span>
        </div>
        <div style={{ background: c.greenPanel, padding: '14px 13px', textAlign: 'center' }}>
          <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 15, textTransform: 'uppercase', color: c.green }}>Day ridden — every stop ✓</div>
          <button onClick={() => setNext(1)} style={{ marginTop: 8, fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: c.inkFaint, background: 'none', border: 'none', textDecoration: 'underline' }}>
            restart the day
          </button>
        </div>
      </div>
    )
  }

  const from = cps[ni - 1]
  const to = cps[ni]
  const { url, mi, via } = navStretch(di, from, to, marks)
  const after = ni + 1 < cps.length ? cps[ni + 1].name : null

  return (
    <div style={shell}>
      <div style={head}>
        <span style={headL}>Navigate · Google Maps</span>
        <span style={{ fontFamily: font.mono, fontSize: 8.5, letterSpacing: '.06em', color: '#bcd0d6' }}>
          {ni - 1 > 0 ? `${ni - 1} ridden ✓ · ` : ''}stop {ni} of {cps.length - 1}
        </span>
      </div>
      <div style={{ background: c.paper, padding: '11px 12px 10px' }}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={advance}
          style={{ display: 'block', border: `1.5px solid ${c.teal}`, borderRadius: 8, background: c.teal, color: c.cream, padding: '13px 14px', textDecoration: 'none' }}
        >
          <div style={{ fontFamily: font.mono, fontSize: 8, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase', color: '#bcd0d6', marginBottom: 4 }}>Next stop</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
            <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 18, textTransform: 'uppercase', lineHeight: 1.08 }}>{to.name}</span>
            <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 22, flex: '0 0 auto' }}>›</span>
          </div>
        </a>
        <div style={{ fontFamily: font.mono, fontSize: 8.5, color: c.inkFaint, marginTop: 7, textAlign: 'center' }}>
          ~{mi} mi · official line pinned{via.length ? ` · via ${via.join(' + ')}` : ''}
          {after ? ` · then ${after}` : ' · last stop of the day'}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 22, marginTop: 7 }}>
          <button onClick={advance} style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: c.inkFaint, background: 'none', border: 'none', textDecoration: 'underline' }}>
            skip stop
          </button>
          <button onClick={() => setPick(!pick)} style={{ fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: c.teal, background: 'none', border: 'none', textDecoration: 'underline' }}>
            {pick ? 'close' : 'change stop'}
          </button>
        </div>
        {pick && (
          <div style={{ marginTop: 9, border: `1.5px solid ${c.lineSoft}`, borderRadius: 8, overflow: 'hidden' }}>
            {cps.slice(1).map((cp, i) => {
              const idx = i + 1
              const ridden = idx < ni
              const current = idx === ni
              return (
                <button
                  key={idx}
                  onClick={() => setNext(idx)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left', padding: '8px 11px', background: current ? c.tealPanel : c.paper, borderTop: i ? `1px solid ${c.lineSoft}` : 'none' }}
                >
                  <span style={{ flex: '0 0 14px', fontFamily: font.mono, fontSize: 10, color: ridden ? c.green : c.inkFaintest }}>{ridden ? '✓' : current ? '▸' : ''}</span>
                  <span style={{ fontFamily: font.display, fontWeight: 600, fontSize: 12.5, textTransform: 'uppercase', color: ridden ? c.inkFainter : current ? c.teal : c.ink, lineHeight: 1.2 }}>{cp.name}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
