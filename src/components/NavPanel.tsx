import { useEffect, useMemo, useRef, useState } from 'react'
import { c, font } from '../theme'
import { dayCheckpoints, dayPosition, navStretch, type Checkpoint, type StopMarks } from '../lib/nav'

/* One big button: the NEXT stop — computed from where you ACTUALLY are.
 *
 * The panel takes a one-shot GPS fix when it opens (and again when you come
 * back from Google Maps), places you along the day's official line, and the
 * next stop is simply the first one still ahead of you. No background
 * tracking, no battery cost — a single position read per look.
 *
 * When GPS is denied, times out, or you're nowhere near the route (home, the
 * ferry), it falls back to tap-to-advance and says so. "skip" excludes a stop
 * you're not visiting; "change" jumps anywhere, and a live fix showing you've
 * passed that choice clears it again. */

export function NavPanel({ di, marks, pad = 18 }: { di: number; marks: StopMarks; pad?: number }) {
  const cps = useMemo(() => dayCheckpoints(di, marks), [di, marks])
  const cpsRef = useRef<Checkpoint[]>(cps)
  cpsRef.current = cps

  // ---- live position ----
  // pos: { at } = standing at a checkpoint (index); { km } = on the line
  // between stops. furthestRef never lets a GPS wobble (or an off-line spur
  // projection) drag "next" backwards during the day.
  const [pos, setPos] = useState<{ at?: number; km?: number } | null>(null)
  const [gps, setGps] = useState<'wait' | 'live' | 'off' | 'none'>('wait')
  const lastFixRef = useRef(0)
  const furthestRef = useRef<number>(-1)
  const locate = (fresh = false) => {
    if (!('geolocation' in navigator)) {
      setGps('none')
      return
    }
    navigator.geolocation.getCurrentPosition(
      (p) => {
        lastFixRef.current = Date.now()
        const got = dayPosition(di, p.coords.latitude, p.coords.longitude, cpsRef.current)
        if (got == null) {
          setGps('off')
          setPos(null)
        } else {
          setGps('live')
          setPos(got)
        }
      },
      () => setGps((g) => (g === 'live' ? 'live' : 'none')),
      // A manual re-locate must not serve a cached fix — that's the tap that
      // says "I've moved, look again".
      { timeout: 8000, maximumAge: fresh ? 0 : 30000 },
    )
  }
  useEffect(() => {
    locate()
    // Re-fix when the app comes back to the foreground (i.e. returning from
    // Google Maps at the last stop) — throttled so it stays a trickle.
    const onVis = () => {
      if (document.visibilityState === 'visible' && Date.now() - lastFixRef.current > 20000) locate()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [di])

  // ---- skips (persisted) + fallback tap progress + manual override ----
  const skipKey = 'waw:navskip:' + di
  const tapKey = 'waw:navnext:' + di
  const [skipped, setSkipped] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(skipKey) || '[]') as string[]
    } catch {
      return []
    }
  })
  const [tapName, setTapName] = useState<string | null>(() => {
    try {
      return localStorage.getItem(tapKey)
    } catch {
      return null
    }
  })
  const [over, setOver] = useState<string | null>(null)
  const [pick, setPick] = useState(false)
  if (cps.length < 2) return null

  const saveSkips = (s: string[]) => {
    setSkipped(s)
    try {
      localStorage.setItem(skipKey, JSON.stringify(s))
    } catch {
      /* noop */
    }
  }
  const saveTap = (v: string) => {
    setTapName(v)
    try {
      localStorage.setItem(tapKey, v)
    } catch {
      /* noop */
    }
  }

  // ---- which stop is next ----
  const live = gps === 'live' && pos != null
  // GPS-derived index of the next stop: standing AT checkpoint i → next is
  // i+1 (index-based, so equal-chainage neighbours like Farren's Bar / Malin
  // Head are never skipped); between stops → first checkpoint ahead of the
  // furthest chainage reached today.
  let gpsNext = -1
  if (live) {
    if (pos.at != null) {
      furthestRef.current = Math.max(furthestRef.current, cps[pos.at]?.km ?? -1)
      gpsNext = pos.at + 1
    } else {
      furthestRef.current = Math.max(furthestRef.current, pos.km as number)
      gpsNext = cps.findIndex((cp, i) => i >= 1 && cp.km > furthestRef.current + 0.3)
      if (gpsNext < 0) gpsNext = cps.length
    }
    while (gpsNext < cps.length && skipped.includes(cps[gpsNext].name)) gpsNext++
  }
  let ni: number
  const oi = over ? cps.findIndex((cp) => cp.name === over) : -1
  if (oi >= 1) {
    // A manual choice stands — even behind you (riding back for the photo is
    // legitimate) — until a live fix shows you AT it or past it.
    const reached = live && (pos!.at != null ? pos!.at >= oi : (pos!.km as number) >= cps[oi].km + 0.3)
    ni = reached ? -1 : oi
  } else {
    ni = -1
  }
  if (ni < 0) {
    if (live) {
      ni = gpsNext
    } else {
      const ti = tapName === 'DONE' ? cps.length : tapName ? cps.findIndex((cp) => cp.name === tapName) : -1
      ni = ti === cps.length ? cps.length : ti >= 1 ? ti : 1
      while (ni < cps.length && skipped.includes(cps[ni].name)) ni++
    }
  }
  const done = ni >= cps.length

  const advance = () => {
    setOver(null)
    const n = Math.min(ni + 1, cps.length)
    saveTap(n >= cps.length ? 'DONE' : cps[n].name)
  }
  const skipStop = () => {
    if (!done) saveSkips([...skipped, cps[ni].name])
    if (!live) advance()
  }
  const jumpTo = (i: number) => {
    setOver(cps[i].name)
    saveTap(cps[i].name)
    if (skipped.includes(cps[i].name)) saveSkips(skipped.filter((n) => n !== cps[i].name))
    setPick(false)
  }
  const restart = () => {
    setOver(null)
    saveSkips([])
    saveTap(cps[1].name)
  }

  const gpsLine =
    gps === 'live'
      ? '📍 live — next stop is what’s actually ahead of you'
      : gps === 'off'
        ? '📍 you’re not on the Way right now — advancing by taps'
        : gps === 'none'
          ? 'no GPS — advancing by taps'
          : '📍 locating…'

  const shell: React.CSSProperties = { margin: `14px ${pad}px 0`, border: `1.5px solid ${c.ink}`, borderRadius: 9, overflow: 'hidden' }
  const head: React.CSSProperties = { background: c.teal, color: c.cream, padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }
  const headL: React.CSSProperties = { fontFamily: font.mono, fontSize: 8.5, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' }
  const linkBtn: React.CSSProperties = { fontFamily: font.mono, fontSize: 9, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', background: 'none', border: 'none', textDecoration: 'underline' }

  if (done) {
    return (
      <div style={shell}>
        <div style={head}>
          <span style={headL}>Navigate · Google Maps</span>
        </div>
        <div style={{ background: c.greenPanel, padding: '14px 13px', textAlign: 'center' }}>
          <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 15, textTransform: 'uppercase', color: c.green }}>
            {live ? 'You’re past the last stop — day ridden ✓' : 'Day ridden — every stop ✓'}
          </div>
          <button onClick={restart} style={{ ...linkBtn, color: c.inkFaint, marginTop: 8 }}>
            restart the day
          </button>
        </div>
      </div>
    )
  }

  const to = cps[ni]
  const from = cps[ni - 1]
  const liveKm = live ? (pos!.at != null ? cps[pos!.at].km : (pos!.km as number)) : null
  const { url, mi, via } = navStretch(di, from, to, marks, liveKm)
  const after = ni + 1 < cps.length ? cps.slice(ni + 1).find((cp) => !skipped.includes(cp.name))?.name : null

  return (
    <div style={shell}>
      <div style={head}>
        <span style={headL}>Navigate · Google Maps</span>
        <span style={{ fontFamily: font.mono, fontSize: 8.5, letterSpacing: '.06em', color: '#bcd0d6' }}>stop {ni} of {cps.length - 1}</span>
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
        <div style={{ fontFamily: font.mono, fontSize: 8, color: gps === 'live' ? c.green : c.inkFainter, marginTop: 4, textAlign: 'center' }}>
          {gpsLine}
          {gps !== 'wait' && (
            <button onClick={() => locate(true)} style={{ ...linkBtn, fontSize: 8, color: c.inkFaint, marginLeft: 7 }}>
              re-locate
            </button>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 22, marginTop: 7 }}>
          <button onClick={skipStop} style={{ ...linkBtn, color: c.inkFaint }}>
            skip stop
          </button>
          <button onClick={() => setPick(!pick)} style={{ ...linkBtn, color: c.teal }}>
            {pick ? 'close' : 'change stop'}
          </button>
        </div>
        {pick && (
          <div style={{ marginTop: 9, border: `1.5px solid ${c.lineSoft}`, borderRadius: 8, overflow: 'hidden' }}>
            {cps.slice(1).map((cp, i) => {
              const idx = i + 1
              const ridden = idx < ni
              const current = idx === ni
              const skip = skipped.includes(cp.name)
              return (
                <button
                  key={idx}
                  onClick={() => jumpTo(idx)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, textAlign: 'left', padding: '8px 11px', background: current ? c.tealPanel : c.paper, borderTop: i ? `1px solid ${c.lineSoft}` : 'none' }}
                >
                  <span style={{ flex: '0 0 14px', fontFamily: font.mono, fontSize: 10, color: ridden ? c.green : c.inkFaintest }}>{ridden ? '✓' : current ? '▸' : ''}</span>
                  <span style={{ fontFamily: font.display, fontWeight: 600, fontSize: 12.5, textTransform: 'uppercase', color: skip ? c.inkFaintest : ridden ? c.inkFainter : current ? c.teal : c.ink, lineHeight: 1.2, textDecoration: skip ? 'line-through' : 'none' }}>
                    {cp.name}
                  </span>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
