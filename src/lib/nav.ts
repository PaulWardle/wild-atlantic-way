/* Take the plan to Google Maps.
 *
 * Two ways out of the app and onto the handlebars:
 *
 *  1. Per-day "ride legs" — Google Maps directions deep-links. Origin is where
 *     you wake up, destination is tonight's campsite, and up to 8 waypoints
 *     sampled from the OFFICIAL line pin Google's routing to the Wild Atlantic
 *     Way instead of its inland shortcuts. Long days split into two legs so
 *     the waypoints stay dense enough to hug the coast.
 *
 *  2. KML files — the exact official line (plus stops and campsites) for
 *     import into Google My Maps (mymaps.google.com → Create → Import), which
 *     then shows as an overlay layer inside the Google Maps app.
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

/** Clean-spine points inside a chainage window (inclusive-ish). */
function windowPoints(fromKm: number, toKm: number): SpinePoint[] {
  return cleanSpine.filter((p) => p[2] >= fromKm - 1 && p[2] <= toKm + 1)
}

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

/** Nearest journey label to a point — names the split anchors of long days. */
function nearestLabel(lat: number, lon: number): string {
  let best = ''
  let bd = Infinity
  for (const j of journey) {
    const d = hav(lat, lon, j.lat, j.lon)
    if (d < bd) {
      bd = d
      best = j.label
    }
  }
  return bd <= 35 ? best.replace(/ \(.*\)$/, '') : 'the coast'
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

/** No origin on purpose: Google Maps then starts every leg from the phone's
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

/** Up to `n` waypoints spread evenly along a window. */
function sampleWaypoints(fromKm: number, toKm: number, n: number): Wp[] {
  const out: Wp[] = []
  const seen = new Set<string>()
  for (let k = 0; k <= n; k++) {
    // k=0 pins the leg's start too — with no explicit origin, this is what
    // pulls Google onto the line from wherever you're standing.
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

export interface NavLeg {
  label: string
  sub: string
  url: string
}

export type StopMarks = Record<string, 'keep' | 'maybe' | 'cut'>

const kmToMi = (km: number) => Math.round(km * 0.6214)

/** The day's ride as Google Maps direction links. Every leg starts from the
 * phone's current location (no fixed origin). Optional extras marked Keep are
 * routed in as waypoints at the right point of the day — remark and re-tap and
 * the link is rebuilt; Maybe/Cut extras stay off the route. */
export function dayLegs(di: number, marks?: StopMarks): NavLeg[] {
  const dy = T.days[di]
  if (!dy?.wawKm) return []
  const legs: NavLeg[] = []
  const [a, b] = dy.wawKm
  const camp = campCoord(di)
  const startPt = pointAtKm(a)
  const endPt = pointAtKm(b)

  // Kept extras, pinned by where their detour leaves the line.
  const kept: Array<Wp & { name: string }> = []
  dy.stops.forEach((st, si) => {
    if (st.kind !== 'extra' || st.lat == null || st.lon == null) return
    if (marks?.['d' + di + 's' + si] !== 'keep') return
    kept.push({ km: chainKm(st.lat, st.lon), lat: st.lat, lon: st.lon, name: st.n })
  })

  const ride = (label: string, from: number, to: number, dest: [number, number]) => {
    const ex = kept.filter((e) => e.km >= from - 3 && e.km <= to + 3)
    // Waypoint budget is 9 per link: kept extras always ride, the
    // official-line samples fill every remaining slot.
    const wps: Wp[] = [...sampleWaypoints(from, to, Math.max(4, 9 - ex.length) - 1), ...ex]
    legs.push({
      label,
      sub: `${kmToMi(to - from)} mi of official line${ex.length ? ' · via ' + ex.map((e) => e.name).join(' + ') : ''}`,
      url: gmapsUrl(dest, wps),
    })
  }

  // Day 1 opens with the ferry transfer down to the Muff start marker.
  if (di === 0 && dy.transferMi) {
    legs.push({
      label: 'Transfer · Larne → Muff',
      sub: `~${dy.transferMi} mi to the km-0 marker`,
      url: gmapsUrl([startPt[0], startPt[1]], []),
    })
  }

  // The final day ends at the Kinsale terminus, then transfers to the ferry camp.
  const isTransferCamp = di > 0 && !!dy.transferMi
  const dest: [number, number] = !isTransferCamp && camp ? camp : [endPt[0], endPt[1]]

  // Split the day into legs of ~100 km so the 9-pin-per-link cap stays dense
  // (~7–11 km between pins) — too tight for Google to shortcut off the Way.
  // Every day gets at least two (a morning and an afternoon).
  const nLegs = Math.max(2, Math.ceil((b - a) / 100))
  for (let i = 0; i < nLegs; i++) {
    const from = a + ((b - a) * i) / nLegs
    const to = a + ((b - a) * (i + 1)) / nLegs
    const last = i === nLegs - 1
    const legEnd = pointAtKm(to)
    const legDest: [number, number] = last ? dest : [legEnd[0], legEnd[1]]
    const endName = last ? (!isTransferCamp && camp ? 'camp' : 'Kinsale — the finish') : nearestLabel(legEnd[0], legEnd[1])
    ride(`Leg ${i + 1} of ${nLegs} · to ${endName}`, from, to, legDest)
  }

  // Final-day transfer off the Way to the ferry-night camp.
  if (isTransferCamp && camp) {
    legs.push({
      label: `Transfer · Kinsale → ${T.campsites[di].primary}`,
      sub: `~${dy.transferMi} mi to the ferry night`,
      url: gmapsUrl(camp, []),
    })
  }

  return legs
}

// ---- KML export (Google My Maps import) ----

const xmlEsc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function kmlDoc(name: string, body: string): string {
  return (
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<kml xmlns="http://www.opengis.net/kml/2.2"><Document>' +
    `<name>${xmlEsc(name)}</name>` +
    '<Style id="way"><LineStyle><color>ff2a41a8</color><width>4</width></LineStyle></Style>' +
    body +
    '</Document></kml>'
  )
}

function lineString(name: string, pts: SpinePoint[]): string {
  const coords = pts.map((p) => `${p[1]},${p[0]},0`).join(' ')
  return `<Placemark><name>${xmlEsc(name)}</name><styleUrl>#way</styleUrl><LineString><tessellate>1</tessellate><coordinates>${coords}</coordinates></LineString></Placemark>`
}

const placemark = (name: string, lat: number, lon: number) =>
  `<Placemark><name>${xmlEsc(name)}</name><Point><coordinates>${lon},${lat},0</coordinates></Point></Placemark>`

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

/** One day's official line + its stops and campsite, as a KML document. */
export function dayKml(di: number, marks?: StopMarks): string | null {
  const dy = T.days[di]
  const w = dy?.wawKm
  if (!w) return null
  const [a, b] = w
  let body = lineString(`Day ${dy.n} official line`, windowPoints(a, b))
  journey.forEach((j) => {
    if (j.phase !== 'waw') return
    const km = chainKm(j.lat, j.lon)
    if (km >= a - 3 && km <= b + 3) body += placemark(j.label, j.lat, j.lon)
  })
  dy.stops.forEach((st, si) => {
    if (st.kind !== 'extra' || st.lat == null || st.lon == null) return
    if (marks?.['d' + di + 's' + si] !== 'keep') return
    body += placemark(`★ KEPT — ${st.n}`, st.lat, st.lon)
  })
  const camp = campCoord(di)
  if (camp) body += placemark(`CAMP — ${T.campsites[di].primary}`, camp[0], camp[1])
  return kmlDoc(`WAW Day ${dy.n} — ${dy.title}`, body)
}

/** The whole official line, every named stop, every campsite. */
export function tripKml(): string {
  let body = lineString('Wild Atlantic Way — official line (Muff → Kinsale)', cleanSpine)
  journey.forEach((j) => {
    body += placemark(j.label, j.lat, j.lon)
  })
  T.campsites.forEach((cs) => {
    if (cs.lat != null && cs.lon != null) body += placemark(`CAMP ${cs.night} — ${cs.primary}`, cs.lat, cs.lon)
  })
  return kmlDoc('Wild Atlantic Way 2026 — full route', body)
}

/** Hand a KML doc to the phone as a downloadable file. */
export function downloadKml(filename: string, kml: string) {
  const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' })
  const url = URL.createObjectURL(blob)
  const el = document.createElement('a')
  el.href = url
  el.download = filename
  document.body.appendChild(el)
  el.click()
  el.remove()
  setTimeout(() => URL.revokeObjectURL(url), 30000)
}
