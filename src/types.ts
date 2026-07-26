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

export interface Stop {
  n: string
  d: string
  skip?: boolean
  finish?: boolean
  warn?: string
  tags?: string[]
}

export interface Night {
  area: string
  primary: string
  note: string
  backup: string
  sellout: boolean
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
  packing: PackGroup[]
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
  op: 'insert' | 'upsert' | 'delete'
  t: TableName
  row?: Record<string, unknown>
  col?: string
  val?: unknown
}

export type TableName = 'posts' | 'locations' | 'notes' | 'marks' | 'sig'

export interface Store {
  role: Role
  posts: Post[]
  updates: Update[]
  notes: Note[]
  marks: Marks
  sig: Sig
  pack: Record<string, boolean>
  book: Record<string, boolean>
  dec: Record<string, number>
  ferry: string | null
  outbox: OutboxOp[]
}
