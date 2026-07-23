/* Map projection + derived geometry for the hand-authored Ireland SVG.
 *
 * The app renders one map (home card, landing gate, full-screen) using the
 * "expanded" projection below — its own bounds with wide sea margins so the
 * coastal labels have room. Ported from the original renderVals().
 *
 * Green progress: the route from Malin Head (north) down to the latest posted
 * position renders green ("done"); the rest stays rust. Landmarks/cities north of
 * the current latitude also render green.
 */

import type { Trip } from '../types'

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

/**
 * Smooth an ordered point list into an SVG path using a Catmull-Rom spline
 * (converted to cubic béziers). The curve passes through every original point,
 * so the coastline keeps its real shape but reads naturally instead of angular.
 */
function splinePath(pts: XY[], closed: boolean): string {
  const n = pts.length
  const f = (v: number) => v.toFixed(1)
  if (n < 3) {
    return (
      pts.map((p, i) => (i ? 'L' : 'M') + f(p.x) + ' ' + f(p.y)).join(' ') + (closed ? ' Z' : '')
    )
  }
  const get = (i: number): XY =>
    closed ? pts[((i % n) + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]
  let d = 'M' + f(pts[0].x) + ' ' + f(pts[0].y)
  const end = closed ? n : n - 1
  for (let i = 0; i < end; i++) {
    const p0 = get(i - 1)
    const p1 = get(i)
    const p2 = get(i + 1)
    const p3 = get(i + 2)
    const c1x = p1.x + (p2.x - p0.x) / 6
    const c1y = p1.y + (p2.y - p0.y) / 6
    const c2x = p2.x - (p3.x - p1.x) / 6
    const c2y = p2.y - (p3.y - p1.y) / 6
    d += ' C' + f(c1x) + ' ' + f(c1y) + ' ' + f(c2x) + ' ' + f(c2y) + ' ' + f(p2.x) + ' ' + f(p2.y)
  }
  if (closed) d += ' Z'
  return d
}

const eSide: Record<string, { a: 'start' | 'middle' | 'end'; dx: number; dy: number }> = {
  left: { a: 'end', dx: -7, dy: 3 },
  right: { a: 'start', dx: 7, dy: 3 },
  top: { a: 'middle', dx: 0, dy: -9 },
  bottom: { a: 'middle', dx: 0, dy: 14 },
  br: { a: 'start', dx: 7, dy: 12 },
  tr: { a: 'start', dx: 7, dy: -5 },
}

export interface TrackStop {
  label: string
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

/**
 * Every named point on the route (landmarks + day areas + towns), de-duped by
 * first word and sorted north→south. This is the ordered list a "we are here"
 * ping indexes into (`Update.si`).
 */
export function buildTrackStops(trip: Trip): TrackStop[] {
  const seen: Record<string, 1> = {}
  const out: TrackStop[] = []
  const addStop = (label: string, lat: number, lon: number) => {
    const k = (label || '').toLowerCase().split(' ')[0]
    if (!k || seen[k]) return
    seen[k] = 1
    out.push({ label, lat, lon })
  }
  ;(trip.geo.landmarks || []).forEach((p) => addStop(p.t, p.lat, p.lon))
  ;(trip.route || []).forEach((r) => addStop(r.area.split(' —')[0], r.lat, r.lon))
  ;(trip.geo.cities || []).forEach((p) => addStop(p.t, p.lat, p.lon))
  out.sort((a, b) => b.lat - a.lat)
  return out
}

/** The current stop from the latest ping (clamped into the trackStops range). */
export function currentStop(trackStops: TrackStop[], si: number | undefined): TrackStop | null {
  if (si == null) return null
  const i = Math.max(0, Math.min(trackStops.length - 1, si | 0))
  return trackStops[i] || null
}

/** Compute all geometry for the map SVG, given the current position (or null). */
export function computeMapGeometry(trip: Trip, curSt: TrackStop | null): MapGeometry {
  const G = trip.geo
  const R = trip.route
  const M = G.malin
  const fi = G.ferryIn
  const hf = G.homeFerry
  const IR = G.ireland
  const liveActive = !!curSt

  const eMk = (p: { t: string; lat: number; lon: number; side: string; finish?: boolean }, r: number) => {
    const x = +EPX(p.lat, p.lon).toFixed(1)
    const y = +EPY(p.lat, p.lon).toFixed(1)
    const sd = eSide[p.side] || eSide.left
    const done = !!(curSt && p.lat >= curSt.lat)
    return {
      x,
      y,
      r: p.finish ? 5.5 : r,
      t: (p.t || '').toUpperCase(),
      lx: +(x + sd.dx).toFixed(1),
      ly: +(y + sd.dy).toFixed(1),
      anchor: sd.a,
      done,
    }
  }

  const eLarneY = EPY(fi.lat, fi.lon)
  const eRosX = EPX(hf.lat, hf.lon)
  const eRosY = EPY(hf.lat, hf.lon)
  const eKinX = EPX(R[9].lat, R[9].lon)
  const eKinY = EPY(R[9].lat, R[9].lon)
  const eWawYc = EPY(G.wawLabel.lat, G.wawLabel.lon)

  const landmarksRaw = (G.landmarks || []).map((p) => eMk(p, 4))
  const citiesRaw = (G.cities || []).map((p) => eMk(p, 3.6))

  const eLandmarks: MapDot[] = landmarksRaw.map((m) => ({
    x: m.x,
    y: m.y,
    r: m.r,
    fill: m.done ? '#4a7a3a' : '#8f3341',
  }))
  const eCities: MapDot[] = citiesRaw.map((m) => ({
    x: m.x,
    y: m.y,
    r: m.r,
    fill: m.done ? '#4a7a3a' : '#8a7c5f',
  }))
  const eLabels: MapLabel[] = landmarksRaw
    .map((m) => ({ x: m.lx, y: m.ly, a: m.anchor, t: m.t, f: '#26201a', w: '700' }))
    .concat(citiesRaw.map((m) => ({ x: m.lx, y: m.ly, a: m.anchor, t: m.t, f: '#6b5f49', w: '600' })))

  // The WAW route hugs the west coast: Malin Head → whole west + SW coast → Kinsale.
  const offRouteCoords: [number, number][] = [[M.lat, M.lon] as [number, number]]
    .concat(IR.slice(22).reverse())
    .concat([[R[9].lat, R[9].lon] as [number, number]])

  // Completed-route line: follow the route coastline from Malin down to the vertex
  // NEAREST the current position (by distance, longitude compressed by cos(lat)) —
  // no diagonal jump to off-route coords (a live position like inland Cork used to
  // throw a stray green line clear across the map).
  let eDone = ''
  if (liveActive && curSt) {
    const coslat = Math.cos((curSt.lat * Math.PI) / 180)
    let best = 0
    let bestD = Infinity
    for (let i = 0; i < offRouteCoords.length; i++) {
      const dlat = offRouteCoords[i][0] - curSt.lat
      const dlon = (offRouteCoords[i][1] - curSt.lon) * coslat
      const dd = dlat * dlat + dlon * dlon
      if (dd < bestD) {
        bestD = dd
        best = i
      }
    }
    eDone = splinePath(toXY(offRouteCoords.slice(0, best + 1)), false)
  }

  return {
    eMapW,
    eMapH,
    eIreland: splinePath(toXY(IR), true),
    eLead: splinePath(toXY(IR.slice(0, 6).reverse() as [number, number][]), false),
    eOff: splinePath(toXY(offRouteCoords), false),
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
    eLiveX: curSt ? +EPX(curSt.lat, curSt.lon).toFixed(1) : 0,
    eLiveY: curSt ? +EPY(curSt.lat, curSt.lon).toFixed(1) : 0,
  }
}
