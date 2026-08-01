/* Take the ride to Google Maps, bit by bit.
 *
 * The day is a chain of checkpoints: where you wake up, the named stops along
 * the official line, and tonight's camp. The rider picks "I'm at" and "ride
 * to"; we hand Google ONE link — no fixed origin (so it starts from the
 * phone's current location), the chosen checkpoint as destination, and up to
 * 9 waypoints sampled from the OFFICIAL line in between, dense enough that
 * Google can't shortcut off the Way. Optional extras marked Keep are pinned
 * in as priority waypoints; Maybe/Cut stay off.
 *
 * The spine is the Fáilte Ireland KML downsampled to ~2 km; the stitch left a
 * few dozen isolated out-of-place points, so everything here reads from a
 * cleaned copy where a point is dropped if it sits much further from its
 * predecessor than the chainage gap allows.
 */
import { wawSpine, type SpinePoint } from '../data/wawSpine'
import { tripData } from '../data/tripData'
import { journey } from '../data/journey'

const T = tripData

function hav(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const R = 6371
  const rad = Math.PI / 180
  const dLat = (bLat - aLat) * rad
  const dLon = (bLon - aLon) * rad
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * rad) * Math.cos(bLat * rad) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

/** Spine with KML-stitch artifacts removed: keep a point only when its
 * crow-flies distance to the last kept point is plausible for the km gap. */
const cleanSpine: SpinePoint[] = (() => {
  const out: SpinePoint[] = [wawSpine[0]]
  for (let i = 1; i < wawSpine.length; i++) {
    const p = wawSpine[i]
    const q = out[out.length - 1]
    const gap = p[2] - q[2]
    if (hav(q[0], q[1], p[0], p[1]) <= gap + 8) out.push(p)
  }
  return out
})()

/** The clean point nearest a chainage mark. */
function pointAtKm(km: number): SpinePoint {
  let best = cleanSpine[0]
  let bd = Infinity
  for (const p of cleanSpine) {
    const d = Math.abs(p[2] - km)
    if (d < bd) {
      bd = d
      best = p
    }
  }
  return best
}

/** Chainage (km from Muff) of an arbitrary point, via the clean spine. */
function chainKm(lat: number, lon: number): number {
  let best = 0
  let bd = Infinity
  for (const p of cleanSpine) {
    const d = hav(lat, lon, p[0], p[1])
    if (d < bd) {
      bd = d
      best = p[2]
    }
  }
  return best
}

/** General direction of travel for a day (initial bearing, window start → end).
 * Degrees clockwise from north, or null when the day has no official window. */
export function dayHeading(di: number): number | null {
  const w = T.days[di]?.wawKm
  if (!w) return null
  const a = pointAtKm(w[0])
  const b = pointAtKm(w[1])
  const rad = Math.PI / 180
  const dLon = (b[1] - a[1]) * rad
  const la1 = a[0] * rad
  const la2 = b[0] * rad
  const y = Math.sin(dLon) * Math.cos(la2)
  const x = Math.cos(la1) * Math.sin(la2) - Math.sin(la1) * Math.cos(la2) * Math.cos(dLon)
  return (Math.atan2(y, x) / rad + 360) % 360
}

const ll = (lat: number, lon: number) => `${lat.toFixed(4)},${lon.toFixed(4)}`

/** A waypoint with its position along the line, so extras merge in ride order. */
interface Wp {
  km: number
  lat: number
  lon: number
}

/** No origin on purpose: Google Maps then starts the leg from the phone's
 * CURRENT LOCATION — which is where you are when you actually tap it. */
function gmapsUrl(d: [number, number], wps: Wp[]): string {
  // Ride order along the line; a waypoint on top of the destination is noise.
  const wp = wps
    .sort((a, b) => a.km - b.km)
    .filter((p) => hav(p.lat, p.lon, d[0], d[1]) > 2.5)
    .slice(0, 9)
    .map((p) => ll(p.lat, p.lon))
    .join('|')
  return (
    'https://www.google.com/maps/dir/?api=1&travelmode=driving' +
    `&destination=${ll(d[0], d[1])}` +
    (wp ? `&waypoints=${encodeURIComponent(wp)}` : '')
  )
}

/** Up to `n+1` waypoints spread evenly along a stretch (k=0 pins the start —
 * with no explicit origin, that's what pulls Google onto the line). */
function sampleWaypoints(fromKm: number, toKm: number, n: number): Wp[] {
  const out: Wp[] = []
  const seen = new Set<string>()
  for (let k = 0; k <= n; k++) {
    const km = fromKm + ((toKm - fromKm) * k) / (n + 1)
    const p = pointAtKm(km)
    const key = ll(p[0], p[1])
    if (!seen.has(key)) {
      seen.add(key)
      out.push({ km, lat: p[0], lon: p[1] })
    }
  }
  return out
}

function campCoord(di: number): [number, number] | null {
  const cs = T.campsites[di]
  return cs && cs.lat != null && cs.lon != null ? [cs.lat, cs.lon] : null
}

export type StopMarks = Record<string, 'keep' | 'maybe' | 'cut'>

/** A pickable point of the day: morning start, named stops, camp. */
export interface Checkpoint {
  name: string
  lat: number
  lon: number
  km: number
}

/** The day's checkpoints in ride order. */
export function dayCheckpoints(di: number): Checkpoint[] {
  const dy = T.days[di]
  const w = dy?.wawKm
  if (!w) return []
  const [a, b] = w
  const cps: Checkpoint[] = []

  if (di === 0) {
    cps.push({ name: 'Larne — off the ferry', lat: 54.85, lon: -5.81, km: a - 1 })
    const s = pointAtKm(a)
    cps.push({ name: 'Muff — the start marker', lat: s[0], lon: s[1], km: a })
  } else if (campCoord(di - 1)) {
    const p = campCoord(di - 1) as [number, number]
    cps.push({ name: `Morning — ${T.campsites[di - 1].primary}`, lat: p[0], lon: p[1], km: a })
  } else {
    const s = pointAtKm(a)
    cps.push({ name: 'Day start', lat: s[0], lon: s[1], km: a })
  }

  journey.forEach((j) => {
    if (j.phase !== 'waw') return
    const km = chainKm(j.lat, j.lon)
    if (km <= a + 2 || km >= b - 2) return
    if (cps.some((c) => Math.abs(c.km - km) < 3)) return
    cps.push({ name: j.label, lat: j.lat, lon: j.lon, km })
  })

  const camp = campCoord(di)
  const isTransferCamp = di > 0 && !!dy.transferMi
  if (isTransferCamp) {
    const e = pointAtKm(b)
    cps.push({ name: 'Kinsale — the finish', lat: e[0], lon: e[1], km: b })
    if (camp) cps.push({ name: `Camp — ${T.campsites[di].primary}`, lat: camp[0], lon: camp[1], km: b + 1 })
  } else if (camp) {
    cps.push({ name: `Camp — ${T.campsites[di].primary}`, lat: camp[0], lon: camp[1], km: b })
  } else {
    const e = pointAtKm(b)
    cps.push({ name: 'End of day', lat: e[0], lon: e[1], km: b })
  }

  return cps.sort((x, y) => x.km - y.km)
}

/** One Google Maps link for the chosen stretch: current location → `to`,
 * official line pinned in between, kept extras as priority pins. */
export function navStretch(
  di: number,
  from: Checkpoint,
  to: Checkpoint,
  marks?: StopMarks,
): { url: string; mi: number; via: string[] } {
  const dy = T.days[di]
  const dest: [number, number] = [to.lat, to.lon]
  const line = Math.max(0, to.km - from.km)
  const mi = Math.round(Math.max(line, hav(from.lat, from.lon, to.lat, to.lon) * 1.25) * 0.6214)
  const w = dy?.wawKm
  if (!w) return { url: gmapsUrl(dest, []), mi, via: [] }

  // Clamp the pinned stretch to the official window — transfer hops (Larne →
  // Muff, Kinsale → Rosslare camp) fall outside it and go pin-free.
  const lo = Math.min(Math.max(w[0], from.km), w[1])
  const hi = Math.min(Math.max(w[0], to.km), w[1])
  if (hi - lo < 2) return { url: gmapsUrl(dest, []), mi, via: [] }

  const kept: Wp[] = []
  const via: string[] = []
  dy.stops.forEach((st, si) => {
    if (st.kind !== 'extra' || st.lat == null || st.lon == null) return
    if (marks?.['d' + di + 's' + si] !== 'keep') return
    const km = chainKm(st.lat, st.lon)
    if (km < lo - 3 || km > hi + 3) return
    kept.push({ km, lat: st.lat, lon: st.lon })
    via.push(st.n)
  })

  const wps = [...sampleWaypoints(lo, hi, Math.max(4, 9 - kept.length) - 1), ...kept]
  return { url: gmapsUrl(dest, wps), mi, via }
}
