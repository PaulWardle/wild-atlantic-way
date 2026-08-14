/* Types for the trip content (window.TRIP → tripData) and the local device store. */

export interface TripMeta {
  title: string
  kicker: string
  subtitle: string
  route: string
  dates: string
  depart: string // ISO date, e.g. "2026-08-10"
  countdownTo: string
  nights: number
  dayCount: number
  totalMiles: string
  sigCount: number
  intro: string
}

/** Route-item kind (100% WAW mode):
 *  'waw'      — official route road segment: locked, cannot be cut
 *  'onroute'  — stop directly on the official road: road locked, stopping optional
 *  'extra'    — requires leaving the official line: Keep/Maybe/Cut with road impact
 *  'transfer' — non-WAW travel (ferry legs, Larne→Muff, Kinsale→Rosslare) */
export type StopKind = 'waw' | 'onroute' | 'extra' | 'transfer'

export interface Stop {
  n: string
  /** Stable mark key (slug) — marks survive itinerary reorders. */
  sid?: string
  d: string
  skip?: boolean
  finish?: boolean
  warn?: string
  tags?: string[]
  kind?: StopKind
  /** True road detour impact vs staying on the line (exit→via→rejoin minus direct), miles. */
  impactMi?: number
  /** Extra riding minutes for that detour. */
  impactMin?: number
  /** Expected time spent at the stop, minutes. */
  stopMin?: number
  /** Detour provenance (extras only): where it leaves/rejoins the official line. */
  exit?: string
  rejoin?: string
  /** Official-line road miles exit→rejoin (baseline). */
  baseMi?: number
  /** Road miles exit→extra→rejoin. */
  viaMi?: number
  /** How the road impact was measured + when (e.g. "manual road estimate · verify in Google Maps · 2026-07-26"). Absent = not yet calculated. */
  impactSrc?: string
  /** Extras only: the detour target — routed into the day's Google Maps leg
   * as a waypoint while the extra is marked Keep. */
  lat?: number
  lon?: number
}

export interface Night {
  area: string
  primary: string
  note: string
  backup: string
  sellout: boolean
  /** Road miles off the official line to reach the site (evening). */
  deviationMi?: number
  /** Road miles ridden backwards next morning to rejoin forward progress. */
  retraceMi?: number
  /** Why a retrace is accepted (e.g. "sits inside the Slea Head loop"). */
  retraceWhy?: string
}

export interface Day {
  n: string
  dow: string
  date: string
  title: string
  tagline: string
  miles: string
  phase: 'lead' | 'waw' | 'home'
  wawStart?: boolean
  warnBanner?: string
  cuts?: string[]
  stops: Stop[]
  night: Night | null
  /** Official-route window ridden this day: [fromKm, toKm] along the KML line (Muff = 0). */
  wawKm?: [number, number]
  /** Non-WAW transfer miles this day (ferry approach, Kinsale→Rosslare, etc). */
  transferMi?: number
}

export interface FerryInbound {
  id: string
  route: string
  op: string
  price: string
  dur: string
  tag: string
  note: string
}

export interface FerryOption {
  id: string
  name: string
  tag: string
  routes: string[]
  hack: string
  transit: string
  ukLeg: string
  pros: string[]
  cons: string[]
}

export interface Ferries {
  inbound: FerryInbound[]
  home: {
    intro: string
    options: FerryOption[]
    checklist: string[]
  }
}

export interface SignatureSpot {
  id: string
  name: string
  county: string
  day: string
  date: string
  /** sid of the itinerary stop this point is bagged at. `day`/`date` are
   *  derived from it and gated by the route validator — moving a day boundary
   *  once left Derrigimlagh advertised as Saturday when it had become Friday. */
  stop: string
}

export interface Pass {
  name: string
  area: string
  d: string
  star?: boolean
}

export interface Campsite {
  night: string
  base: string
  primary: string
  primaryNote: string
  backup: string
  sellout: boolean
  /** Site coordinates — drive the route validator's forward-progress gate and
   * the Google Maps navigation legs. */
  lat?: number
  lon?: number
  /** Road miles off the official line to reach the site (evening). */
  deviationMi?: number
  /** Road miles ridden backwards next morning to rejoin forward progress. */
  retraceMi?: number
  /** Why a retrace is accepted (e.g. "sits inside the Slea Head loop"). */
  retraceWhy?: string
  // ---- booking status (single source of truth for every accommodation UI) ----
  bookingStatus?: 'booked' | 'pending' | 'unavailable' | 'not_contacted'
  /** Short human note for the status, e.g. "CJ calling" / "Awaiting campsite response". */
  bookingNote?: string
  // ---- verification (brother view only; never claim what isn't verified) ----
  tents?: 'confirmed' | 'unknown'
  bikes?: 'accepted' | 'unknown'
  open2026?: 'covers-august' | 'unknown'
  /** Price for 2 adults + 1 small tent, if known (e.g. "~€24 total / €12pp"). */
  price?: string
  checkIn?: string
  booking?: string
  availability?: 'booked' | 'available' | 'enquire' | 'full' | 'unknown'
  /** Where the info came from + when checked. */
  source?: string
}

export interface CampNotes {
  intro: string
  weather: string
  late: string
}

export interface PackGroup {
  group: string
  items: string[]
}

export interface CostRow {
  item: string
  est: string
}

export interface Costs {
  rows: CostRow[]
  total: string
  note?: string
}

export interface Booking {
  id: string
  label: string
  note: string
  urgent: boolean
}

export interface IntelCard {
  title: string
  body: string
}

export interface Resource {
  name: string
  note: string
}

export interface NegotiationRow {
  id: string
  decision: string
  options: string[]
  lean: string
}

export interface GeoPoint {
  t: string
  lat: number
  lon: number
  side: string
  finish?: boolean
}

export interface Geo {
  bounds: {
    lonMin: number
    lonMax: number
    latMin: number
    latMax: number
    scale: number
    pad: number
  }
  malin: { lat: number; lon: number }
  ferryIn: { lat: number; lon: number }
  homeFerry: { lat: number; lon: number }
  wawLabel: { lat: number; lon: number }
  landmarks: GeoPoint[]
  cities: GeoPoint[]
  ireland: [number, number][]
}

export interface RoutePoint {
  n: string
  lat: number
  lon: number
  area: string
  phase: string
  finish?: boolean
}

export interface Trip {
  meta: TripMeta
  days: Day[]
  ferries: Ferries
  signature: SignatureSpot[]
  passes: Pass[]
  campsites: Campsite[]
  campNotes: CampNotes
  /** Per-brother checklist — each of Paul and CJ ticks his own copy. */
  packing: PackGroup[]
  /** One-between-two kit (tent, tools, cooking) — allocated to a brother. */
  sharedKit: PackGroup[]
  costs: Costs
  bookings: Booking[]
  intel: IntelCard[]
  resources: Resource[]
  negotiation: NegotiationRow[]
  geo: Geo
  route: RoutePoint[]
}

// ---- Local device store (localStorage key `waw2026:v1`) ----

export type Role = 'brother' | 'guest' | null

/** Postbox message. `reason` ∈ Recommendation/Comment/Question/Feedback/Hello. */
export interface Post {
  name: string
  reason: string
  msg: string
  ts: number
  photo?: string // public URL of an attached photo
  pending?: boolean
  /** Set on brother replies: the ts of the postbox message being answered. */
  parentTs?: number
}

/** "We are here" location ping. `si` = nearest trip-order journey stop (for progress
 * + fallback label). When posted via GPS, `lat`/`lon` hold the exact position and
 * `place` the friendly reverse-geocoded name (e.g. "Sneem"). */
export interface Update {
  si: number
  note: string
  ts: number
  photo?: string
  lat?: number
  lon?: number
  place?: string
  pending?: boolean
}

/** Brother journal note. */
export interface Note {
  text: string
  author: string
  tag: string
  date: number | string // trip-day epoch ms, or 'today' resolved at write time
  ts: number
  photo?: string
  pending?: boolean
}

export type Marks = Record<string, 'keep' | 'maybe' | 'cut'>
export type Sig = Record<string, number>

/** A queued write that hasn't reached the cloud yet (offline outbox). */
export interface OutboxOp {
  _k: string
  op: 'insert' | 'upsert' | 'delete' | 'update'
  t: TableName
  row?: Record<string, unknown>
  col?: string
  val?: unknown
  /** Failed photo-upload cycles — after enough, the stuck photos are stripped
   * so the text still delivers instead of blocking the whole outbox. */
  tries?: number
}

export type TableName = 'posts' | 'locations' | 'notes' | 'marks' | 'sig' | 'kit'

export interface Store {
  role: Role
  posts: Post[]
  updates: Update[]
  notes: Note[]
  marks: Marks
  sig: Sig
  pack: Record<string, boolean>
  book: Record<string, boolean>
  /** Synced key→value kit state: per-brother packing ticks ("pk:P:0_3" = "1")
   * and shared-item allocations ("al:1_2" = "P" | "C"). Cloud table `kit`. */
  kit: Record<string, string>
  dec: Record<string, number>
  ferry: string | null
  outbox: OutboxOp[]
  /** Brother-authored custom journal tags (device-local), added via "Other → +". */
  customTags: string[]
}
