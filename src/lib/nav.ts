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
import { cleanedSpine, type SpinePoint } from '../data/wawSpine'
import { tripData } from '../data/tripData'

const T = tripData

function hav(aLat: number, aLon: number, bLat: number, bLon: number): number {
  const R = 6371
  const rad = Math.PI / 180
  const dLat = (bLat - aLat) * rad
  const dLon = (bLon - aLon) * rad
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(aLat * rad) * Math.cos(bLat * rad) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

// One shared artifact-filtered spine (see wawSpine.ts) — the app and the
// completion stat must never disagree about chainage.
const cleanSpine: SpinePoint[] = cleanedSpine

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

/** Nearest clean-spine point within one day's stretch of line. Near towns two
 * branches of the route pass close together (e.g. Clifden), so a global
 * nearest-point search can hop to another day's road — always scope to the
 * window being ridden. */
function nearestOnStretch(lat: number, lon: number, a: number, b: number): SpinePoint {
  let best: SpinePoint | null = null
  let bd = Infinity
  for (const p of cleanSpine) {
    if (p[2] < a - 8 || p[2] > b + 8) continue
    const d = hav(lat, lon, p[0], p[1])
    if (d < bd) {
      bd = d
      best = p
    }
  }
  return best ?? cleanSpine[0]
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
 * CURRENT LOCATION — which is where you are when you actually tap it.
 * Pins arrive pre-filtered and in ride order; this only builds the URL. */
function gmapsUrl(d: [number, number], wps: Wp[]): string {
  const wp = wps
    .slice(0, 9)
    .map((p) => ll(p.lat, p.lon))
    .join('|')
  return (
    'https://www.google.com/maps/dir/?api=1&travelmode=driving' +
    `&destination=${ll(d[0], d[1])}` +
    (wp ? `&waypoints=${encodeURIComponent(wp)}` : '')
  )
}

/** Ride-order pin hygiene: sort by chainage, then drop any pin whose crow
 * distance from the previous accepted position exceeds what its chainage gap
 * allows (a genuine road pin can never be farther by crow than by road, so
 * this only removes pins sitting on locally-inverted spine blocks — the ones
 * that would make Google zigzag). Anchored at the leg's start. */
function orderPins(start: { lat: number; lon: number; km: number }, wps: Wp[]): Wp[] {
  const out: Wp[] = []
  let anchor = start
  for (const p of wps.slice().sort((a, b) => a.km - b.km)) {
    if (hav(anchor.lat, anchor.lon, p.lat, p.lon) <= 1.2 * Math.max(0, p.km - anchor.km) + 4) {
      out.push(p)
      anchor = p
    }
  }
  return out
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

/** The day's checkpoints, in itinerary order: morning start, every rideable
 * stop on the day card, tonight's camp. Destinations keep their REAL
 * coordinates (Google snaps to the road itself — spine-snapping goes wrong
 * where the route runs both sides of a bay). Chainage is only used for pin
 * sampling and is clamped monotonic, so out-and-back spurs and across-water
 * mismatches can't drag pins backwards. Extras marked Cut drop out. */
export function dayCheckpoints(di: number, marks?: StopMarks): Checkpoint[] {
  const dy = T.days[di]
  const w = dy?.wawKm
  if (!w) return []
  const [a, b] = w
  const cps: Checkpoint[] = []

  if (di === 0) {
    cps.push({ name: 'Larne — off the ferry', lat: 54.85, lon: -5.81, km: a - 1 })
  } else if (campCoord(di - 1)) {
    const p = campCoord(di - 1) as [number, number]
    cps.push({ name: `Morning — ${T.campsites[di - 1].primary}`, lat: p[0], lon: p[1], km: a })
  } else {
    const s = pointAtKm(a)
    cps.push({ name: 'Day start', lat: s[0], lon: s[1], km: a })
  }

  const camp = campCoord(di)
  dy.stops.forEach((st, si) => {
    if (st.kind === 'transfer' || !st.kind || st.lat == null || st.lon == null) return
    if (st.kind === 'extra' && marks?.['d' + di + 's' + si] === 'cut') return
    // Skip a stop that sits on top of the previous checkpoint or the camp —
    // the neighbour covers it. (0.9 km: Farren's Bar and Malin Head are
    // 1.1 km apart and both belong in the list.)
    if (cps.length && hav(cps[cps.length - 1].lat, cps[cps.length - 1].lon, st.lat, st.lon) < 0.9) return
    if (camp && hav(camp[0], camp[1], st.lat, st.lon) < 0.9) return
    cps.push({ name: st.n, lat: st.lat, lon: st.lon, km: nearestOnStretch(st.lat, st.lon, a, b)[2] })
  })

  const isTransferCamp = di > 0 && !!dy.transferMi
  if (isTransferCamp && camp) {
    cps.push({ name: `Camp — ${T.campsites[di].primary}`, lat: camp[0], lon: camp[1], km: b + 1 })
  } else if (camp) {
    cps.push({ name: `Camp — ${T.campsites[di].primary}`, lat: camp[0], lon: camp[1], km: b })
  } else {
    const e = pointAtKm(b)
    cps.push({ name: 'End of day', lat: e[0], lon: e[1], km: b })
  }

  // Itinerary order is the truth — chainage must not run backwards along it.
  for (let i = 1; i < cps.length; i++) cps[i].km = Math.max(cps[i].km, cps[i - 1].km)
  return cps
}

/** Where the rider actually is along the day's route, from a GPS fix.
 * Being AT a checkpoint (nearest one within 1.2 km) beats chainage — two
 * stops can share a chainage (Farren's Bar and Malin Head both sit at km
 * ~104) and only the index says which one you're at. Otherwise projects onto
 * the day's stretch of line. Null when nowhere near the day (home, ferry,
 * mid-detour to an off-line extra — the panel falls back to taps there). */
export function dayPosition(
  di: number,
  lat: number,
  lon: number,
  cps: Checkpoint[],
): { at?: number; km?: number } | null {
  const w = T.days[di]?.wawKm
  if (!w) return null
  let atIdx = -1
  let atD = 1.2
  cps.forEach((cp, i) => {
    const d = hav(lat, lon, cp.lat, cp.lon)
    if (d < atD) {
      atD = d
      atIdx = i
    }
  })
  if (atIdx >= 0) return { at: atIdx }
  const p = nearestOnStretch(lat, lon, w[0], w[1])
  if (hav(lat, lon, p[0], p[1]) <= 8) return { km: p[2] }
  return null
}

/** One Google Maps link for the chosen stretch: current location → `to`,
 * official line pinned in between, kept extras as priority pins. When the
 * rider's live chainage is known, pins start from THERE, not from the
 * previous checkpoint. */
export function navStretch(
  di: number,
  from: Checkpoint,
  to: Checkpoint,
  marks?: StopMarks,
  riderKm?: number | null,
): { url: string; mi: number; via: string[] } {
  const dy = T.days[di]
  const dest: [number, number] = [to.lat, to.lon]
  const startKm = riderKm != null ? riderKm : from.km
  // Never show "~0 mi" for a real leg: the crow-flies floor applies even with
  // a live fix (off-line extras have clamped chainage that can zero the diff).
  const line = Math.max(0, to.km - startKm)
  const mi = Math.round(Math.max(line, hav(from.lat, from.lon, to.lat, to.lon)) * 0.6214) || 1
  const w = dy?.wawKm
  if (!w) return { url: gmapsUrl(dest, []), mi, via: [] }

  // Clamp the pinned stretch to the official window — transfer hops (Larne →
  // Muff, Kinsale → Rosslare camp) fall outside it and go pin-free…
  const lo = Math.min(Math.max(w[0], startKm), w[1])
  const hi = Math.min(Math.max(w[0], to.km), w[1])
  const isTransferDest = to.km > w[1]
  if (hi - lo < 2 && !isTransferDest) return { url: gmapsUrl(dest, []), mi, via: [] }

  const kept: Wp[] = []
  const via: string[] = []
  dy.stops.forEach((st, si) => {
    if (st.kind !== 'extra' || st.lat == null || st.lon == null) return
    if (marks?.['d' + di + 's' + si] !== 'keep') return
    const km = nearestOnStretch(st.lat, st.lon, w[0], w[1])[2]
    if (km < lo - 3 || km > hi + 3) return
    kept.push({ km, lat: st.lat, lon: st.lon })
    via.push(st.n)
  })

  let wps = [...sampleWaypoints(lo, hi, Math.max(4, 9 - kept.length) - 1), ...kept]
  if (isTransferDest) {
    // …but the last official miles before a transfer (the KINSALE FINISH on
    // day 9) must be pinned, or Google shortcuts the end of the Way on its
    // route to the far-off camp.
    const end = pointAtKm(w[1])
    wps.push({ km: w[1], lat: end[0], lon: end[1] })
  } else {
    // A pin within a couple of km of the destination BY CHAINAGE is noise;
    // judged by chainage, not crow distance — the route may pass close to the
    // destination with real miles still to ride (the Strandhill loop).
    wps = wps.filter((p) => p.km <= hi - 2.5)
  }
  // Anchor the anti-zigzag at the LINE's start of this stretch, not at the
  // from-checkpoint — a far-off transfer origin (Larne) must not disqualify
  // every on-line pin.
  const loPt = pointAtKm(lo)
  return { url: gmapsUrl(dest, orderPins({ lat: loPt[0], lon: loPt[1], km: lo }, wps)), mi, via }
}
