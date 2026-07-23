/* Map projection + derived geometry for the accurate Ireland SVG.
 *
 * The coastline is real geographic data (src/data/irelandCoast.ts). The WAW route
 * is drawn as one clean line through the ordered trip stops (src/data/journey.ts)
 * — smooth, not tracing every coastal inlet — and the green "completed" portion
 * follows that same line up to the live position. To keep the small phone map
 * legible we label only the iconic WAW headlands, not inland/east-coast cities.
 */

import type { Trip } from '../types'
import { irelandCoast } from '../data/irelandCoast'
import { journey, type JourneyStop } from '../data/journey'

// Expanded projection bounds (wide sea margins for labels).
const EB = { lonMin: -12.8, lonMax: -4.2, latMin: 51.0, latMax: 55.6, scale: 80, pad: 16 }
const ecos = Math.cos((((EB.latMin + EB.latMax) / 2) * Math.PI) / 180)
const ekx = EB.scale * ecos
const eky = EB.scale
const epad = EB.pad

const EPX = (_lat: number, lon: number) => epad + (lon - EB.lonMin) * ekx
const EPY = (lat: number, _lon: number) => epad + (EB.latMax - lat) * eky

export const eMapW = +(epad * 2 + (EB.lonMax - EB.lonMin) * ekx).toFixed(1)
export const eMapH = +(epad * 2 + (EB.latMax - EB.latMin) * eky).toFixed(1)

interface XY {
  x: number
  y: number
}
const toXY = (coords: [number, number][]): XY[] =>
  coords.map(([lat, lon]) => ({ x: EPX(lat, lon), y: EPY(lat, lon) }))

/** Catmull-Rom spline → cubic béziers; passes through every point, reads naturally. */
function splinePath(pts: XY[], closed: boolean): string {
  const n = pts.length
  const f = (v: number) => v.toFixed(1)
  if (n < 3) return pts.map((p, i) => (i ? 'L' : 'M') + f(p.x) + ' ' + f(p.y)).join(' ') + (closed ? ' Z' : '')
  const get = (i: number): XY => (closed ? pts[((i % n) + n) % n] : pts[Math.max(0, Math.min(n - 1, i))])
  let d = 'M' + f(pts[0].x) + ' ' + f(pts[0].y)
  const end = closed ? n : n - 1
  for (let i = 0; i < end; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2)
    const c1x = p1.x + (p2.x - p0.x) / 6, c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6, c2y = p2.y - (p3.y - p1.y) / 6
    d += ' C' + f(c1x) + ' ' + f(c1y) + ' ' + f(c2x) + ' ' + f(c2y) + ' ' + f(p2.x) + ' ' + f(p2.y)
  }
  if (closed) d += ' Z'
  return d
}

function nearestJourneyIndex(lat: number, lon: number): number {
  const cos = Math.cos((lat * Math.PI) / 180)
  let best = 0, bd = Infinity
  for (let i = 0; i < journey.length; i++) {
    const dlat = journey[i].lat - lat, dlon = (journey[i].lon - lon) * cos
    const d = dlat * dlat + dlon * dlon
    if (d < bd) { bd = d; best = i }
  }
  return best
}

// Only the two big east-coast cities the trip never visits are dropped; every
// WAW stop (incl. the inland ones) keeps its label.
const DROP_CITIES = new Set(['Belfast', 'Dublin'])

export type TrackStop = JourneyStop

/** The current stop from the latest ping's journey index (clamped). */
export function currentStop(si: number | undefined): { stop: JourneyStop; index: number } | null {
  if (si == null) return null
  const index = Math.max(0, Math.min(journey.length - 1, si | 0))
  return { stop: journey[index], index }
}

export interface MapDot {
  x: number
  y: number
  r: number
  fill: string
}
export interface MapLabel {
  x: number
  y: number
  a: 'start' | 'middle' | 'end'
  t: string
  f: string
  w: string
}
export interface MapGeometry {
  eMapW: number
  eMapH: number
  eIreland: string
  eLead: string
  eOff: string
  eDone: string
  eFerryIn: string
  eHome: string
  eLandmarks: MapDot[]
  eCities: MapDot[]
  eLabels: MapLabel[]
  eWawX: number
  eWawTheY: number
  eWawWayY: number
  eInX: number
  eInY: number
  eHomeX: number
  eHomeY: number
  eEdgeX: number
  eFerryInLabelY: number
  eFerryHomeLabelY: number
  eLiveActive: boolean
  eLiveX: number
  eLiveY: number
}

const eSide: Record<string, { a: 'start' | 'middle' | 'end'; dx: number; dy: number }> = {
  left: { a: 'end', dx: -7, dy: 3 },
  right: { a: 'start', dx: 7, dy: 3 },
  top: { a: 'middle', dx: 0, dy: -9 },
  bottom: { a: 'middle', dx: 0, dy: 14 },
  br: { a: 'start', dx: 7, dy: 12 },
  tr: { a: 'start', dx: 7, dy: -5 },
}

const leadStops = journey.filter((j) => j.phase === 'lead')
const wawStops = journey.filter((j) => j.phase === 'waw')
const wawCoords = wawStops.map((j) => [j.lat, j.lon]) as [number, number][]
// Lead-in ends where the WAW begins (Malin), so the two lines meet cleanly.
const leadCoords = leadStops.concat(wawStops[0]).map((j) => [j.lat, j.lon]) as [number, number][]

/** Compute all map geometry, given the current journey index (or null = not live). */
export function computeMapGeometry(trip: Trip, si: number | null): MapGeometry {
  const G = trip.geo
  const R = trip.route
  const fi = G.ferryIn
  const hf = G.homeFerry
  const cur = si == null ? null : currentStop(si)
  const liveActive = !!cur

  // Green "done" — the WAW line from Malin up to (and including) the current stop.
  let eDone = ''
  if (cur && cur.stop.phase === 'waw') {
    const wIdx = cur.index - leadStops.length
    if (wIdx >= 0) eDone = splinePath(toXY(wawCoords.slice(0, wIdx + 1)), false)
  }

  // Iconic headland dots + labels only (real coords → sit on the coast). "Done" = passed.
  const eMk = (p: { t: string; lat: number; lon: number; side: string; finish?: boolean }, r: number) => {
    const x = +EPX(p.lat, p.lon).toFixed(1)
    const y = +EPY(p.lat, p.lon).toFixed(1)
    const sd = eSide[p.side] || eSide.left
    const done = !!(cur && nearestJourneyIndex(p.lat, p.lon) <= cur.index)
    return { x, y, r: p.finish ? 5.5 : r, t: (p.t || '').toUpperCase(), lx: +(x + sd.dx).toFixed(1), ly: +(y + sd.dy).toFixed(1), anchor: sd.a, done }
  }
  const landmarksRaw = (G.landmarks || []).map((p) => eMk(p, 4))
  const citiesRaw = (G.cities || []).filter((p) => !DROP_CITIES.has(p.t)).map((p) => eMk(p, 3.6))
  const eLandmarks: MapDot[] = landmarksRaw.map((m) => ({ x: m.x, y: m.y, r: m.r, fill: m.done ? '#4a7a3a' : '#8f3341' }))
  const eCities: MapDot[] = citiesRaw.map((m) => ({ x: m.x, y: m.y, r: m.r, fill: m.done ? '#4a7a3a' : '#8a7c5f' }))
  const eLabels: MapLabel[] = landmarksRaw
    .map((m) => ({ x: m.lx, y: m.ly, a: m.anchor, t: m.t, f: '#26201a', w: '700' }))
    .concat(citiesRaw.map((m) => ({ x: m.lx, y: m.ly, a: m.anchor, t: m.t, f: '#6b5f49', w: '600' })))

  const eLarneY = EPY(fi.lat, fi.lon)
  const eRosX = EPX(hf.lat, hf.lon)
  const eRosY = EPY(hf.lat, hf.lon)
  const eKinX = EPX(R[9].lat, R[9].lon)
  const eKinY = EPY(R[9].lat, R[9].lon)
  const eWawYc = EPY(G.wawLabel.lat, G.wawLabel.lon)

  return {
    eMapW,
    eMapH,
    eIreland: splinePath(toXY(irelandCoast), true),
    eLead: splinePath(toXY(leadCoords), false),
    eOff: splinePath(toXY(wawCoords), false),
    eDone,
    eFerryIn:
      'M' + (eMapW - 5).toFixed(1) + ' ' + (eLarneY - 6).toFixed(1) +
      ' L' + EPX(fi.lat, fi.lon).toFixed(1) + ' ' + EPY(fi.lat, fi.lon).toFixed(1),
    eHome:
      'M' + eKinX.toFixed(1) + ' ' + eKinY.toFixed(1) +
      ' L' + eRosX.toFixed(1) + ' ' + eRosY.toFixed(1) +
      ' L' + (eMapW - 5).toFixed(1) + ' ' + (eRosY - 7).toFixed(1),
    eLandmarks,
    eCities,
    eLabels,
    eWawX: +EPX(G.wawLabel.lat, G.wawLabel.lon).toFixed(1),
    eWawTheY: +(eWawYc - 11).toFixed(1),
    eWawWayY: +(eWawYc + 7).toFixed(1),
    eInX: +EPX(fi.lat, fi.lon).toFixed(1),
    eInY: +eLarneY.toFixed(1),
    eHomeX: +eRosX.toFixed(1),
    eHomeY: +eRosY.toFixed(1),
    eEdgeX: +(eMapW - 6).toFixed(1),
    eFerryInLabelY: +(eLarneY - 9).toFixed(1),
    eFerryHomeLabelY: +(eRosY + 16).toFixed(1),
    eLiveActive: liveActive,
    eLiveX: cur ? +EPX(cur.stop.lat, cur.stop.lon).toFixed(1) : 0,
    eLiveY: cur ? +EPY(cur.stop.lat, cur.stop.lon).toFixed(1) : 0,
  }
}
