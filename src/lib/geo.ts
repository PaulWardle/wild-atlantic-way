/* Map projection + derived geometry for the accurate Ireland SVG.
 *
 * The coastline is real geographic data (src/data/irelandCoast.ts). The WAW route
 * TRACES the actual coastline arc from Malin Head down the whole Atlantic/SW coast
 * to Kinsale (so it hugs every peninsula, like the official map); the lead-in is
 * the short north-coast arc from Larne to Malin. The green "completed" line follows
 * that same coast arc up to the live position. To keep the small phone map legible
 * we drop only the two big east-coast cities the trip never visits.
 */

import type { Trip } from '../types'
import { irelandCoast } from '../data/irelandCoast'
import { journey } from '../data/journey'
import { nearestJourneyIndex } from './geocode'

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

// ---- coastline ring helpers (ring is [lat, lon][]) ----
const ring = irelandCoast
const RN = ring.length

function nearestRingIndex(lat: number, lon: number): number {
  const cos = Math.cos((lat * Math.PI) / 180)
  let best = 0, bd = Infinity
  for (let i = 0; i < RN; i++) {
    const dlat = ring[i][0] - lat
    const dlon = (ring[i][1] - lon) * cos
    const d = dlat * dlat + dlon * dlon
    if (d < bd) { bd = d; best = i }
  }
  return best
}
function arcIndices(i: number, j: number, forward: boolean): number[] {
  const out: number[] = []
  let k = i
  for (let guard = 0; guard <= RN; guard++) {
    out.push(k)
    if (k === j) break
    k = forward ? (k + 1) % RN : (k - 1 + RN) % RN
  }
  return out
}
function avgLon(idx: number[]): number {
  return idx.reduce((s, i) => s + ring[i][1], 0) / idx.length
}
function planarLen(idx: number[]): number {
  let s = 0
  for (let k = 1; k < idx.length; k++) {
    const a = ring[idx[k - 1]], b = ring[idx[k]]
    s += Math.hypot(b[0] - a[0], (b[1] - a[1]) * ecos)
  }
  return s
}
/** The arc between two ring points that runs along the western (Atlantic) coast. */
function westArc(i: number, j: number): number[] {
  const fwd = arcIndices(i, j, true)
  const bwd = arcIndices(i, j, false)
  return avgLon(fwd) <= avgLon(bwd) ? fwd : bwd
}
/** The shorter of the two arcs between two ring points. */
function shortArc(i: number, j: number): number[] {
  const fwd = arcIndices(i, j, true)
  const bwd = arcIndices(i, j, false)
  return planarLen(fwd) <= planarLen(bwd) ? fwd : bwd
}
function nearestInList(list: [number, number][], lat: number, lon: number): number {
  const cos = Math.cos((lat * Math.PI) / 180)
  let best = 0, bd = Infinity
  for (let i = 0; i < list.length; i++) {
    const dlat = list[i][0] - lat, dlon = (list[i][1] - lon) * cos
    const d = dlat * dlat + dlon * dlon
    if (d < bd) { bd = d; best = i }
  }
  return best
}
// Only the two big east-coast cities the trip never visits are dropped.
const DROP_CITIES = new Set(['Belfast', 'Dublin'])

/** Exact current position (from GPS, or the nearest journey stop's coords). */
export interface CurrentPos {
  lat: number
  lon: number
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

/** Compute all map geometry, given the exact current position (or null = not live). */
export function computeMapGeometry(trip: Trip, current: CurrentPos | null): MapGeometry {
  const G = trip.geo
  const R = trip.route
  // The official line starts at the Muff village marker (km 0) — anchoring the
  // rust arc (and the green progress line) at Malin drew the start ~100 km in
  // and made day-1 progress from Muff invisible.
  const MUFF = { lat: 55.0673, lon: -7.2691 }
  const fi = G.ferryIn
  const hf = G.homeFerry
  const liveActive = !!current
  const curIdx = current ? nearestJourneyIndex(current.lat, current.lon) : -1
  const curPhaseWaw = current ? journey[curIdx].phase === 'waw' : false

  // Route arcs along the real coast.
  const idxMuff = nearestRingIndex(MUFF.lat, MUFF.lon)
  const idxKinsale = nearestRingIndex(R[9].lat, R[9].lon)
  const idxLarne = nearestRingIndex(fi.lat, fi.lon)
  const wawCoords = westArc(idxMuff, idxKinsale).map((i) => ring[i]) as [number, number][]
  const leadCoords = shortArc(idxLarne, idxMuff).map((i) => ring[i]) as [number, number][]

  // Green "done" — the coast arc from Muff up to the point nearest the live position.
  let eDone = ''
  if (current && curPhaseWaw) {
    const k = nearestInList(wawCoords, current.lat, current.lon)
    eDone = splinePath(toXY(wawCoords.slice(0, k + 1)), false)
  }

  // Dots + labels: real coords sit on the accurate coast. "Done" = passed.
  const eMk = (p: { t: string; lat: number; lon: number; side: string; finish?: boolean }, r: number) => {
    const x = +EPX(p.lat, p.lon).toFixed(1)
    const y = +EPY(p.lat, p.lon).toFixed(1)
    const sd = eSide[p.side] || eSide.left
    const done = !!(current && nearestJourneyIndex(p.lat, p.lon) <= curIdx)
    return { x, y, r: p.finish ? 5.5 : r, t: (p.t || '').toUpperCase(), lx: +(x + sd.dx).toFixed(1), ly: +(y + sd.dy).toFixed(1), anchor: sd.a, done }
  }
  const landmarksRaw = (G.landmarks || []).map((p) => eMk(p, 3.4))
  const citiesRaw = (G.cities || []).filter((p) => !DROP_CITIES.has(p.t)).map((p) => eMk(p, 3))
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
    eIreland: splinePath(toXY(ring), true),
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
    eLiveX: current ? +EPX(current.lat, current.lon).toFixed(1) : 0,
    eLiveY: current ? +EPY(current.lat, current.lon).toFixed(1) : 0,
  }
}
