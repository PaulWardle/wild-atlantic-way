import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { RealtimeChannel, SupabaseClient } from '@supabase/supabase-js'
import { getSupabase } from '../lib/supabase'
import { markKey } from '../lib/tags'
import { tripData } from '../data/tripData'
import { journey, journeyToSig } from '../data/journey'
import { attachPhotos, uploadBlob, photoList, photoField } from '../lib/photos'
import { isLocalPhoto, localId, loadPhoto, removePhoto, clearAllPending } from '../lib/photoQueue'
import { nearestJourneyIndex, reverseGeocode, isInIreland } from '../lib/geocode'
import type {
  Note,
  OutboxOp,
  Post,
  Role,
  Store,
  TableName,
  Update,
} from '../types'

export type Screen =
  | 'home'
  | 'days'
  | 'day'
  | 'signature'
  | 'passes'
  | 'sights'
  | 'camp'
  | 'kit'
  | 'attractions'
  | 'map'
  | 'today'
  | 'postbox'
  | 'journal'
  | 'info'

const LS_KEY = 'waw2026:v1'
const isOffline = () => typeof navigator !== 'undefined' && navigator.onLine === false

/** A GPS position resolved to a friendly place name, awaiting the user's
 *  confirmation before it's posted. `inIreland` is false when the fix is off
 *  the route entirely (so the map can avoid plotting it misleadingly). */
export interface CurrentPlace {
  lat: number
  lon: number
  place: string
  si: number
  inIreland: boolean
}

/** An in-theme prompt linking a Signature bag with a "we are here" post. */
export interface LinkPrompt {
  kind: 'offerPost' | 'offerBag'
  name: string
  journeyIndex?: number
  sigId?: string
}

// journey index for each signature id (reverse of journeyToSig)
const sigToJourneyIndex: Record<string, number> = {}
Object.keys(journeyToSig).forEach((label) => {
  const idx = journey.findIndex((j) => j.label === label)
  if (idx >= 0) sigToJourneyIndex[journeyToSig[label]] = idx
})

/** Legacy positional mark keys (d{di}s{si}) → stable slug ids. Positions are
 * correct at migration time; after this, itinerary edits can't re-aim marks. */
const LEGACY_MARK = /^d(\d+)s(\d+)$/
function migrateMarkKey(k: string): string {
  const m = LEGACY_MARK.exec(k)
  if (!m) return k
  return tripData.days[+m[1]]?.stops[+m[2]]?.sid ?? k
}
function migrateMarks(marks: Record<string, 'keep' | 'maybe' | 'cut'>): Record<string, 'keep' | 'maybe' | 'cut'> {
  const out: Record<string, 'keep' | 'maybe' | 'cut'> = {}
  Object.keys(marks).forEach((k) => {
    out[migrateMarkKey(k)] = marks[k]
  })
  return out
}

function emptyStore(role: Role = null): Store {
  return {
    role,
    posts: [],
    updates: [],
    notes: [],
    marks: {},
    sig: {},
    pack: {},
    book: {},
    kit: {},
    dec: {},
    ferry: null,
    outbox: [],
    customTags: [],
  }
}

/** Normalise a (possibly partial / legacy) persisted blob into a full Store. */
function normalize(raw: unknown): Store {
  const s = (raw && typeof raw === 'object' ? raw : {}) as Partial<Store>
  return {
    role: s.role ?? null,
    posts: s.posts ?? [],
    updates: s.updates ?? [],
    notes: s.notes ?? [],
    marks: migrateMarks(s.marks ?? {}),
    sig: s.sig ?? {},
    pack: s.pack ?? {},
    book: s.book ?? {},
    kit: s.kit ?? {},
    dec: s.dec ?? {},
    ferry: s.ferry ?? null,
    outbox: s.outbox ?? [],
    customTags: s.customTags ?? [],
  }
}

function loadStore(): Store {
  let store: Store
  try {
    store = normalize(JSON.parse(localStorage.getItem(LS_KEY) || '{}'))
  } catch {
    store = emptyStore()
  }
  // Deep-link: #at=<si>&t=<ts>&n=<note> seeds the latest location ping.
  const hv = parseHash()
  if (hv) {
    // Merge (dedupe by ts) — replacing wiped the cached ping history offline.
    if (!store.updates.some((u) => u.ts === hv.ts)) store.updates = [hv, ...store.updates]
    try {
      history.replaceState(null, '', location.pathname + location.search)
    } catch {
      /* noop */
    }
  }
  return store
}

function parseHash(): Update | null {
  try {
    const h = (typeof location !== 'undefined' ? location.hash : '') || ''
    if (h.indexOf('at=') < 0) return null
    const q = new URLSearchParams(h.replace(/^#/, ''))
    if (!q.has('at')) return null
    const i = parseInt(q.get('at') || '', 10)
    if (isNaN(i)) return null
    // URLSearchParams already decoded once — a second decode corrupted notes
    // containing literal % signs. Clamp/cap everything: this is untrusted input.
    return {
      si: Math.max(0, Math.min(i, journey.length - 1)),
      note: (q.get('n') || '').slice(0, 200),
      // Untrusted input: NaN never dedupes (NaN !== NaN, so every open of a
      // bad link stacks another entry) and a far-future value pins itself as
      // the permanent "latest" ping.
      ts: (() => {
        const t = parseInt(q.get('t') || '', 10)
        return Number.isFinite(t) && t > 1577836800000 && t < Date.now() + 60000 ? t : Date.now()
      })(),
    }
  } catch {
    return null
  }
}

interface HistEntry {
  screen: Screen
  day: number
  kitTab: string
  sightsTab: string
  attractFilter: string
  scrollTop: number
}

export interface StoreContextValue {
  store: Store
  role: Role
  isBrother: boolean
  isGuest: boolean
  ready: boolean
  /** null = unknown yet, true = reached the backend, false = unreachable (paused/offline). */
  serverOk: boolean | null

  // navigation
  screen: Screen
  day: number
  kitTab: string
  sightsTab: string
  attractFilter: string
  scrollRef: React.RefObject<HTMLDivElement>
  nav: (patch: Partial<{ screen: Screen; day: number; kitTab: string }>) => void
  goBack: () => void
  setDay: (i: number) => void
  setKitTab: (t: string) => void
  setSightsTab: (t: string) => void
  setAttractFilter: (f: string) => void

  // clock / viewport
  nowTs: number
  vw: number

  // location ping composer
  draftI: number
  draftNote: string
  setDraftI: (i: number) => void
  setDraftNote: (v: string) => void
  postHere: (files?: File[] | null) => Promise<void>
  resolveCurrentPlace: () => Promise<CurrentPlace | 'denied' | 'unavailable' | 'nogeo'>
  postResolvedPlace: (pos: CurrentPlace, note: string, files?: File[] | null) => Promise<void>

  // custom dropdowns
  openDD: string | null
  toggleDD: (name: string) => void
  closeDD: () => void

  // postbox composer
  postName: string
  postReason: string
  postMsg: string
  postErr: boolean
  postIdx: number
  setPostName: (v: string) => void
  selectReason: (r: string) => void
  setPostMsg: (v: string) => void
  submitPost: (files?: File[] | null) => Promise<boolean>
  removePost: (ts: number) => void
  clearPosts: () => void
  setPostIdx: (i: number) => void

  // home gallery carousel (kept in sync with the postbox/journal carousels)
  galIdx: number
  setGalIdx: (i: number) => void

  // journal composer / edit
  jFeedIdx: number
  setJFeedIdx: (i: number) => void
  jFeedSwipeStart: (e: React.TouchEvent | React.MouseEvent) => void
  jFeedSwipeEnd: (e: React.TouchEvent | React.MouseEvent) => void
  jNote: string
  jDay: number | string
  jTime: string
  jAuthor: string
  jTag: string
  jTagOther: string
  customTags: string[]
  jEditTs: number | null
  jEditText: string
  setJNote: (v: string) => void
  selectJDay: (v: number | string) => void
  setJTime: (v: string) => void
  selectAuthor: (a: string) => void
  selectJTag: (t: string) => void
  setJTagOther: (v: string) => void
  addCustomTag: (tag: string) => void
  addNote: (files?: File[] | null) => Promise<void>
  startEditNote: (ts: number, text: string) => void
  setJEditText: (v: string) => void
  saveEditNote: () => void
  cancelEditNote: () => void
  removeNote: (ts: number) => void

  // stop marks / signature / packing / bookings / ferries / negotiation
  setStopMark: (di: number, si: number, val: 'keep' | 'maybe' | 'cut') => void
  toggleSig: (id: string) => void

  // signature ↔ location cross-link prompt
  linkPrompt: LinkPrompt | null
  confirmLink: () => void
  dismissLink: () => void
  togglePack: (k: string) => void
  setKit: (k: string, v: string | null) => void
  toggleBook: (id: string) => void

  // clears / reset
  clearNotes: () => void
  clearMarksSig: () => void
  clearUpdates: () => void
  clearGallery: () => void
  resetEverything: () => void

  // export / share
  savePDF: () => void
  downloadBackup: () => void
  copyLink: () => void
  copied: boolean

  // gate
  pwOpen: boolean
  pwVal: string
  pwErr: boolean
  chooseBrother: () => void
  cancelPw: () => void
  setPw: (v: string) => void
  submitPw: () => void
  chooseGuest: () => void
  signOut: () => void
}

const StoreContext = createContext<StoreContextValue | null>(null)

export function useStore(): StoreContextValue {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store>(loadStore)
  const storeRef = useRef(store)

  // persist + keep the ref in sync so async callbacks (flush/pull) read fresh state
  const commit = useCallback((next: Store) => {
    storeRef.current = next
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next))
    } catch {
      /* quota / private mode — device mirror is best-effort */
    }
    setStore(next)
  }, [])

  const set = useCallback(
    (patch: Partial<Store>) => commit({ ...storeRef.current, ...patch }),
    [commit],
  )

  // ---- navigation ----
  const [screen, setScreen] = useState<Screen>('home')
  const [day, setDayState] = useState(0)
  const [kitTab, setKitTabState] = useState('packing')
  const [sightsTab, setSightsTabState] = useState('sig')
  const [attractFilter, setAttractFilterState] = useState('all')
  const histRef = useRef<HistEntry[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)
  const scrollTarget = useRef(0)
  const [navTick, setNavTick] = useState(0)

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = scrollTarget.current
  }, [navTick])

  const toTop = useCallback(() => {
    scrollTarget.current = 0
    setNavTick((t) => t + 1)
  }, [])

  const nav = useCallback(
    (patch: Partial<{ screen: Screen; day: number; kitTab: string }>) => {
      const cur: HistEntry = {
        screen,
        day,
        kitTab,
        sightsTab,
        attractFilter,
        scrollTop: scrollRef.current ? scrollRef.current.scrollTop : 0,
      }
      histRef.current = histRef.current.concat([cur]).slice(-25)
      if (patch.screen !== undefined) setScreen(patch.screen)
      if (patch.day !== undefined) setDayState(patch.day)
      if (patch.kitTab !== undefined) setKitTabState(patch.kitTab)
      scrollTarget.current = 0
      setNavTick((t) => t + 1)
    },
    [screen, day, kitTab, sightsTab, attractFilter],
  )

  const goBack = useCallback(() => {
    const prev = histRef.current.pop()
    if (!prev) {
      setScreen('home')
      toTop()
      return
    }
    setScreen(prev.screen)
    setDayState(prev.day)
    setKitTabState(prev.kitTab)
    setSightsTabState(prev.sightsTab)
    setAttractFilterState(prev.attractFilter)
    scrollTarget.current = prev.scrollTop || 0
    setNavTick((t) => t + 1)
  }, [toTop])

  const setDay = useCallback(
    (i: number) => {
      setDayState(i)
      toTop()
    },
    [toTop],
  )
  const setKitTab = useCallback(
    (t: string) => {
      setKitTabState(t)
      toTop()
    },
    [toTop],
  )
  const setSightsTab = useCallback(
    (t: string) => {
      setSightsTabState(t)
      toTop()
    },
    [toTop],
  )
  const setAttractFilter = useCallback(
    (f: string) => {
      setAttractFilterState(f)
      toTop()
    },
    [toTop],
  )

  // ---- transient UI state ----
  const [nowTs, setNowTs] = useState(() => Date.now())
  const nowTsRef = useRef(nowTs)
  nowTsRef.current = nowTs
  const [vw, setVw] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 500))
  const [draftI, setDraftIState] = useState(0)
  const [draftNote, setDraftNoteState] = useState('')
  const [openDD, setOpenDD] = useState<string | null>(null)
  const [postName, setPostNameState] = useState('')
  const [postReason, setPostReason] = useState('Recommendation')
  const [postMsg, setPostMsgState] = useState('')
  const [postErr, setPostErr] = useState(false)
  const [postIdx, setPostIdxState] = useState(0)
  const [jFeedIdx, setJFeedIdxState] = useState(0)
  const [galIdx, setGalIdxState] = useState(0)
  const [jNote, setJNoteState] = useState('')
  const [jDay, setJDay] = useState<number | string>('today')
  const [jAuthor, setJAuthor] = useState('Paul')
  const [jTag, setJTag] = useState('Update')
  const [jTagOther, setJTagOtherState] = useState('')
  const [jTime, setJTimeState] = useState('')
  const [jEditTs, setJEditTs] = useState<number | null>(null)
  const [jEditText, setJEditTextState] = useState('')
  const [pwOpen, setPwOpen] = useState(false)
  const [pwVal, setPwVal] = useState('')
  const [pwErr, setPwErr] = useState(false)
  const [copied, setCopied] = useState(false)
  const [linkPrompt, setLinkPrompt] = useState<LinkPrompt | null>(null)
  const [serverOk, setServerOk] = useState<boolean | null>(null)
  const serverOkRef = useRef<boolean | null>(null)
  serverOkRef.current = serverOk
  const pullEpochRef = useRef(0)
  const lastPullRef = useRef(0)
  const migratedMarksRef = useRef<Set<string>>(new Set())
  const upsertRowRef = useRef<((t: TableName, row: Record<string, unknown>) => void) | null>(null)
  const deleteRowRef = useRef<((t: TableName, col: string, val: unknown) => void) | null>(null)
  /** Re-subscribes the realtime channel — set by the init effect, called when a
   *  pull succeeds after downtime (the old channel may be permanently dead). */
  const resubFnRef = useRef<(() => void) | null>(null)

  const role = store.role
  const isBrother = role === 'brother'
  const isGuest = role === 'guest'

  // ---- Supabase sync ----
  const sbRef = useRef<SupabaseClient | null>(null)
  const subRef = useRef<RealtimeChannel | null>(null)
  const flushingRef = useRef(false)

  const pullAll = useCallback(() => {
    const sb = sbRef.current
    if (!sb) return
    // Epoch guard: realtime fires a pull per event, so pulls overlap; a slow
    // STALE response must never commit over a newer one.
    const epoch = ++pullEpochRef.current
    lastPullRef.current = Date.now()
    Promise.all([
      sb.from('posts').select('*'),
      sb.from('locations').select('*'),
      sb.from('notes').select('*'),
      sb.from('marks').select('*'),
      sb.from('sig').select('*'),
      sb.from('kit').select('*'),
    ])
      .then((res) => {
        if (epoch !== pullEpochRef.current) return // superseded by a newer pull
        const [p, l, n, m, g, kt] = res
        // If every table errored (e.g. project paused / no connection), flag the
        // server as unreachable so the UI can say so.
        const okNow = !p.error || !l.error || !n.error || !m.error || !g.error || !kt.error
        // Recovered after downtime → the realtime channel may be dead; rejoin it.
        if (okNow && serverOkRef.current === false) resubFnRef.current?.()
        setServerOk(okNow)
        const next: Store = { ...storeRef.current }
        if (!p.error)
          next.posts = ((p.data || []) as Post[])
            .map((r) => ({ name: r.name, reason: r.reason, msg: r.msg, ts: r.ts, photo: r.photo }))
            .sort((a, b) => b.ts - a.ts)
        if (!l.error)
          next.updates = ((l.data || []) as Update[])
            .map((r) => ({ si: r.si, note: r.note, ts: r.ts, photo: r.photo, lat: r.lat, lon: r.lon, place: r.place }))
            .sort((a, b) => b.ts - a.ts)
        if (!n.error)
          next.notes = ((n.data || []) as Array<{ body: string; author: string; tag: string; day: number | string; ts: number; photo?: string }>)
            .map((r) => ({ text: r.body, author: r.author, tag: r.tag, date: r.day, ts: r.ts, photo: r.photo }))
            .sort((a, b) => b.ts - a.ts)
        if (!m.error) {
          const mm: Store['marks'] = {}
          ;((m.data || []) as Array<{ stop: string; mark: 'keep' | 'maybe' | 'cut' }>).forEach((r) => {
            const k = migrateMarkKey(r.stop)
            mm[k] = r.mark
            // Converge the server onto stable keys, once per legacy row.
            if (k !== r.stop && !migratedMarksRef.current.has(r.stop)) {
              migratedMarksRef.current.add(r.stop)
              upsertRowRef.current?.('marks', { stop: k, mark: r.mark })
              deleteRowRef.current?.('marks', 'stop', r.stop)
            }
          })
          next.marks = mm
        }
        if (!g.error) {
          const ss: Store['sig'] = {}
          ;((g.data || []) as Array<{ sid: string; ts: number }>).forEach((r) => {
            ss[r.sid] = r.ts
          })
          next.sig = ss
        }
        if (!kt.error) {
          const kk: Store['kit'] = {}
          ;((kt.data || []) as Array<{ k: string; v: string }>).forEach((r) => {
            kk[r.k] = r.v
          })
          next.kit = kk
        }
        // Re-apply EVERY optimistic (unsent) op on top of the cloud pull —
        // not just inserts. A queued mark/kit/sig upsert or delete that a pull
        // clobbered used to visibly revert the UI until the flush landed.
        const ob = storeRef.current.outbox || []
        ob.forEach((x) => {
          if (x.t === 'marks') {
            if (x.op === 'upsert' && x.row) next.marks = { ...next.marks, [String(x.row.stop)]: x.row.mark as never }
            if (x.op === 'delete') {
              next.marks = { ...next.marks }
              delete next.marks[String(x.val)]
            }
            return
          }
          if (x.t === 'kit') {
            if (x.op === 'upsert' && x.row) next.kit = { ...next.kit, [String(x.row.k)]: String(x.row.v) }
            if (x.op === 'delete') {
              next.kit = { ...next.kit }
              delete next.kit[String(x.val)]
            }
            return
          }
          if (x.t === 'sig') {
            if (x.op === 'insert' && x.row) next.sig = { ...next.sig, [String(x.row.sid)]: x.row.ts as number }
            if (x.op === 'delete') {
              next.sig = { ...next.sig }
              delete next.sig[String(x.val)]
            }
            return
          }
          if (x.op === 'update' && x.t === 'notes' && x.row) {
            next.notes = next.notes.map((n) =>
              n.ts === x.val ? { ...n, text: (x.row!.body as string) ?? n.text, tag: (x.row!.tag as string) ?? n.tag } : n,
            )
            return
          }
          if (x.op === 'delete') {
            if (x.t === 'posts') next.posts = next.posts.filter((r) => r.ts !== x.val)
            if (x.t === 'locations') next.updates = next.updates.filter((r) => r.ts !== x.val)
            if (x.t === 'notes') next.notes = next.notes.filter((r) => r.ts !== x.val)
            return
          }
          if (x.op && x.op !== 'insert') return
          const row = x.row || {}
          if (x.t === 'posts') {
            const p: Post = { ...(row as unknown as Post), pending: true }
            next.posts = [p, ...next.posts]
          } else if (x.t === 'locations') {
            const u: Update = { ...(row as unknown as Update), pending: true }
            next.updates = [u, ...next.updates]
          } else if (x.t === 'notes') {
            const n: Note = {
              text: (row.body as string) || '',
              author: (row.author as string) || '',
              tag: (row.tag as string) || '',
              date: (row.day as number | string) ?? (row.ts as number),
              ts: row.ts as number,
              photo: row.photo as string | undefined,
              pending: true,
            }
            next.notes = [n, ...next.notes]
          }
        })
        next.posts.sort((a, b) => b.ts - a.ts)
        next.updates.sort((a, b) => b.ts - a.ts)
        next.notes.sort((a, b) => b.ts - a.ts)
        commit(next)
      })
      .catch(() => setServerOk(false))
  }, [commit])

  const runOp = useCallback(async (o: OutboxOp): Promise<{ error: unknown } | { error: null }> => {
    const sb = sbRef.current as SupabaseClient
    let row = o.row as Record<string, unknown> | undefined
    // Queued offline photos (photo field holds one or more "local:<id>" tokens):
    // upload each stashed blob now and swap the tokens for public URLs before the
    // row reaches the table.
    const uploaded: string[] = []
    if (row && typeof row.photo === 'string' && row.photo.includes('local:')) {
      const tokens = photoList(row.photo as string)
      const resolved: string[] = []
      for (const tok of tokens) {
        if (!isLocalPhoto(tok)) {
          resolved.push(tok)
          continue
        }
        const id = localId(tok)
        const blob = await loadPhoto(id)
        if (!blob) continue // blob gone — drop just this photo, keep the rest
        const url = await uploadBlob(blob)
        // Upload still failing (offline / storage down): keep the whole op queued.
        if (!url) return { error: { message: 'photo upload pending' } }
        resolved.push(url)
        uploaded.push(id)
      }
      row = { ...row, photo: photoField(resolved) }
      if (row.photo === undefined) delete row.photo
      // Write resolved URLs back onto the queued op: if the table op below
      // fails, the retry reuses the uploaded copies instead of re-uploading
      // (which orphaned a new bucket file per 20s retry cycle).
      if (o.row) o.row.photo = row.photo as string | undefined
    }
    const q = sb.from(o.t)
    if (o.op === 'insert') {
      const res = await q.insert(row as Record<string, unknown>)
      // Blobs are deleted only AFTER the row lands — an upload followed by a
      // failed insert must keep the op (and its photos) replayable.
      if (!res.error) uploaded.forEach((id) => removePhoto(id))
      return res
    }
    if (o.op === 'upsert') return q.upsert(row as Record<string, unknown>)
    if (o.op === 'update') return q.update(row as Record<string, unknown>).eq(o.col as string, o.val as string | number)
    return q.delete().eq(o.col as string, o.val as string | number)
  }, [])

  /** One key per LOGICAL ROW (no op in it): a later op on the same row must
   * replace any queued one — an offline tick-then-untick must never leave an
   * upsert and a delete racing each other at flush time. The '#suffix' makes
   * each queued instance unique so flush removes exactly what it sent. */
  const opSeqRef = useRef(0)
  const queueOp = useCallback((o: Omit<OutboxOp, '_k'>, flag: boolean) => {
    const cur: Store = { ...storeRef.current }
    const logical = o.t + '|' + String(o.row ? o.row.ts ?? o.row.stop ?? o.row.sid ?? o.row.k ?? o.val : o.val)
    const ob = (cur.outbox || []).filter((x) => !(x._k === logical || x._k.startsWith(logical + '#')))
    ob.push({ _k: logical + '#' + ++opSeqRef.current, ...o })
    cur.outbox = ob
    // optimistic "pending" flag on the mirrored row
    if (flag && o.row) {
      const coll: 'posts' | 'updates' | 'notes' | null =
        o.t === 'posts' ? 'posts' : o.t === 'locations' ? 'updates' : o.t === 'notes' ? 'notes' : null
      if (coll) {
        cur[coll] = (cur[coll] as Array<{ ts: number }>).map((it) =>
          it.ts === o.row!.ts ? { ...it, pending: true } : it,
        ) as never
      }
    }
    commit(cur)
  }, [commit])

  /** Every write rides the outbox: queue FIRST (durable the instant it
   * exists), then flush immediately when online. The old direct-send path
   * bypassed the queue's replace-by-row ordering — a stale queued op could
   * flush over a newer landed write — and left an in-flight op durable
   * nowhere if iOS killed the app mid-hang on lie-fi. */
  const flushRef = useRef<() => void>(() => {})
  const flushAgainRef = useRef(false)
  const tryOp = useCallback(
    (o: Omit<OutboxOp, '_k'>, flag: boolean) => {
      queueOp(o, flag)
      if (sbRef.current && !isOffline()) flushRef.current()
    },
    [queueOp],
  )

  const insertRow = useCallback((t: TableName, row: Record<string, unknown>) => tryOp({ op: 'insert', t, row }, true), [tryOp])
  const upsertRow = useCallback((t: TableName, row: Record<string, unknown>) => tryOp({ op: 'upsert', t, row }, false), [tryOp])
  const deleteRow = useCallback((t: TableName, col: string, val: unknown) => tryOp({ op: 'delete', t, col, val }, false), [tryOp])
  upsertRowRef.current = upsertRow
  deleteRowRef.current = deleteRow
  /** Server-wide clears must not run blind: offline they'd wipe the phone,
   * leave the server intact, and the next pull would "resurrect" everything —
   * minus the user's unsent work. */
  const requireOnline = useCallback((): boolean => {
    if (!sbRef.current || isOffline() || serverOkRef.current === false) {
      try {
        window.alert('You’re offline (or the trip server is unreachable) — clearing needs a live connection. Nothing was changed.')
      } catch {
        /* noop */
      }
      return false
    }
    return true
  }, [])
  /** Server-side clears. Resolve to null on success and an error value on
   * failure — PostgREST failures arrive as RESOLVED {error} responses, so a
   * bare .catch reported success even when every delete failed. */
  const deleteAll = useCallback((t: TableName): Promise<unknown> => {
    const sb = sbRef.current
    if (!sb) return Promise.resolve({ message: 'no client' })
    return Promise.resolve(sb.from(t).delete().gt('ts', 0)).then(
      (r) => (r as { error?: unknown } | null)?.error ?? null,
      (e) => e ?? { message: 'network' },
    )
  }, [])
  const wipe = useCallback((t: TableName, col: string): Promise<unknown> => {
    const sb = sbRef.current
    if (!sb) return Promise.resolve({ message: 'no client' })
    return Promise.resolve(sb.from(t).delete().not(col, 'is', null)).then(
      (r) => (r as { error?: unknown } | null)?.error ?? null,
      (e) => e ?? { message: 'network' },
    )
  }, [])

  const flush = useCallback(async () => {
    if (flushingRef.current) {
      flushAgainRef.current = true // an op was queued mid-flush — run again after
      return
    }
    if (!sbRef.current || isOffline()) return
    const ob = (storeRef.current.outbox || []).slice()
    if (!ob.length) return
    flushingRef.current = true
    // SEQUENTIAL, in queue order: ops touching related rows must land in the
    // order the user made them — a parallel flush let a delete and an upsert
    // race and finish in either order.
    const doneKeys: string[] = []
    try {
      for (const o of ob) {
        let sent = false
        try {
          const r = await runOp(o)
          if (r && !r.error) sent = true
          else {
            // "Already exists" (unique violation) means an earlier send DID land
            // before the connection/server dropped — the row is on the server, so
            // the op is done. Without this, a half-sent op re-queues forever.
            const code = (r?.error as { code?: string } | null)?.code
            if (o.op === 'insert' && code === '23505') sent = true
          }
        } catch {
          /* network hiccup — handled below */
        }
        // STOP at the first failure. Continuing broke ordering between related
        // ops with different keys (a note's failed insert + its "successful"
        // zero-row edit permanently reverted the edit on the retry).
        if (!sent) break
        doneKeys.push(o._k)
      }
    } finally {
      flushingRef.current = false
    }
    if (doneKeys.length) {
      const cur: Store = { ...storeRef.current }
      // _k is unique per queued instance, so this removes exactly the ops that
      // were sent — an op REPLACED mid-flight keeps its new instance queued.
      cur.outbox = (cur.outbox || []).filter((x) => doneKeys.indexOf(x._k) < 0)
      commit(cur)
      pullAll()
    }
    if (flushAgainRef.current) {
      flushAgainRef.current = false
      window.setTimeout(() => flushRef.current(), 100)
    }
  }, [runOp, commit, pullAll])
  flushRef.current = flush

  // init supabase + realtime, intervals, listeners
  useEffect(() => {
    const sb = getSupabase()
    sbRef.current = sb
    pullAll()
    // Realtime events arrive in bursts (and echo our own writes) — a trailing
    // debounce turns "15 ticks" into one pull instead of fifteen.
    let pullTimer = 0
    const debouncedPull = () => {
      window.clearTimeout(pullTimer)
      pullTimer = window.setTimeout(() => pullAll(), 750)
    }
    // The channel dying silently was invisible: subscribe's status callback is
    // the only signal when a mid-session outage kills realtime.
    const onChannelStatus = (status: string) => {
      if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') setServerOk(false)
    }
    // The status callback must be channel-aware: after a resubscribe, the
    // REMOVED channel's async CLOSED ack would otherwise re-mark the server
    // down and put recovery into a permanent 20s teardown loop.
    const makeChannel = () => {
      const ch = sb.channel('waw').on('postgres_changes', { event: '*', schema: 'public' }, debouncedPull)
      ch.subscribe((status: string) => {
        if (subRef.current === ch) onChannelStatus(status)
      })
      return ch
    }
    if (!subRef.current) subRef.current = makeChannel()
    resubFnRef.current = () => {
      const old = subRef.current
      subRef.current = makeChannel() // reassign FIRST so old's CLOSED is ignored
      try {
        if (old) sb.removeChannel(old)
      } catch {
        /* noop */
      }
    }
    const onOnline = () => {
      flush()
      pullAll()
    }
    window.addEventListener('online', onOnline)
    // Every 20s: flush the outbox; re-pull while the server looks unreachable;
    // and — even when everything LOOKS fine — pull at least every 5 minutes,
    // because a dead channel plus a live network is otherwise silent staleness.
    const flushInt = window.setInterval(() => {
      if (document.visibilityState === 'hidden') return // asleep in a pocket
      flush()
      // Unreachable: retry the pull at 60s, not 20s — a day of no-signal riding
      // shouldn't spin the radio three times a minute. 5-min failsafe unchanged.
      const downRetry = serverOkRef.current === false && Date.now() - lastPullRef.current > 60000
      if (downRetry || Date.now() - lastPullRef.current > 300000) pullAll()
    }, 20000)
    const onResize = () => {
      const w = window.innerWidth
      setVw((prev) => (Math.abs(w - prev) > 2 ? w : prev))
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('resize', onResize)
      window.clearInterval(flushInt)
      window.clearTimeout(pullTimer)
      if (subRef.current) {
        try {
          sb.removeChannel(subRef.current)
        } catch {
          /* noop */
        }
        subRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 1s clock — only advances nowTs on the Today screen or the landing gate
  const screenRef = useRef(screen)
  screenRef.current = screen
  const roleRef = useRef(role)
  roleRef.current = role
  useEffect(() => {
    // Seconds only matter for the pre-trip countdown (gate / Today-before-
    // departure). During the live trip Today only needs the DAY, so a minute
    // tick saves a whole-tree re-render every second of an all-day screen.
    let departMs = Infinity
    try {
      departMs = new Date(tripData.meta.depart + 'T00:00:00').getTime()
    } catch {
      /* keep fast tick */
    }
    const tick = window.setInterval(() => {
      if (screenRef.current !== 'today' && roleRef.current) return
      const now = Date.now()
      if (now < departMs || now - nowTsRef.current >= 60000) setNowTs(now)
    }, 1000)
    return () => window.clearInterval(tick)
  }, [])

  // auto-advancing carousels on Home — one timer drives the postbox, journal
  // and gallery together so they all turn on the same beat (never drifting).
  // A manual dot-tap/swipe pauses the beat (mid-read content must not be
  // yanked away), and reduced-motion users get no auto-advance at all.
  const carouselTouchRef = useRef(0)
  useEffect(() => {
    const car = window.setInterval(() => {
      if (screenRef.current !== 'home') return
      try {
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
      } catch {
        /* noop */
      }
      if (Date.now() - carouselTouchRef.current < 15000) return
      const s = storeRef.current
      const n = Math.min(10, (s.posts || []).length)
      if (n > 1) setPostIdxState((i) => (i + 1) % n)
      const jn = Math.min(
        10,
        (s.updates || []).length +
          (s.posts || []).length +
          (s.notes || []).length +
          Object.keys(s.sig || {}).filter((k) => typeof s.sig[k] === 'number').length,
      )
      if (jn > 1) setJFeedIdxState((i) => i + 1)
      const photoCount =
        (s.updates || []).reduce((t, u) => t + photoList(u.photo).length, 0) +
        (s.notes || []).reduce((t, x) => t + photoList(x.photo).length, 0) +
        (s.posts || []).reduce((t, p) => t + photoList(p.photo).length, 0)
      if (photoCount > 1) setGalIdxState((i) => i + 1)
    }, 4500)
    return () => window.clearInterval(car)
  }, [])

  // ---- mutations ----
  // Post a location ping at a given journey index (used by the cross-link too).
  // `pos` carries an exact GPS position + friendly place name when available.
  const postLocationAt = useCallback(
    (si: number, note: string, photo?: string, pos?: { lat: number; lon: number; place: string }) => {
      const extra = {
        ...(photo ? { photo } : {}),
        ...(pos ? { lat: pos.lat, lon: pos.lon, place: pos.place } : {}),
      }
      const row: Update = { si, note: (note || '').trim(), ts: Date.now(), ...extra }
      const updates = [row, ...(storeRef.current.updates || [])].slice(0, 8)
      set({ updates })
      insertRow('locations', { si: row.si, note: row.note, ts: row.ts, ...extra })
    },
    [set, insertRow],
  )

  // Resolve the device's exact GPS position + friendly place name — WITHOUT
  // posting. The composer shows a confirmation, then calls postResolvedPlace.
  const resolveCurrentPlace = useCallback(
    (): Promise<CurrentPlace | 'denied' | 'unavailable' | 'nogeo'> => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) return Promise.resolve('nogeo')
      return new Promise((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (posn) => {
            const lat = posn.coords.latitude
            const lon = posn.coords.longitude
            const si = nearestJourneyIndex(lat, lon)
            const place = (await reverseGeocode(lat, lon)) || journey[si].label
            resolve({ lat, lon, place, si, inIreland: isInIreland(lat, lon) })
          },
          (err) => resolve(err.code === 1 ? 'denied' : 'unavailable'),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        )
      })
    },
    [],
  )

  // Post a position the composer already resolved + the user confirmed.
  const postResolvedPlace = useCallback(
    async (pos: CurrentPlace, note: string, files?: File[] | null) => {
      const photo = files && files.length ? await attachPhotos(files) : undefined
      postLocationAt(pos.si, note, photo, { lat: pos.lat, lon: pos.lon, place: pos.place })
      // If this is a Signature 15 spot and not yet bagged, offer to bag it.
      const sigId = journeyToSig[journey[pos.si].label]
      if (sigId && !storeRef.current.sig[sigId]) {
        setLinkPrompt({ kind: 'offerBag', name: journey[pos.si].label, sigId })
      }
    },
    [postLocationAt],
  )

  // Bag a Signature spot without triggering the cross-link prompt (used by the modal).
  const bagSigSilent = useCallback(
    (id: string) => {
      if (storeRef.current.sig[id]) return
      const sig = { ...storeRef.current.sig }
      const t = Date.now()
      sig[id] = t
      insertRow('sig', { sid: id, ts: t })
      set({ sig })
    },
    [set, insertRow],
  )

  const postHere = useCallback(
    async (files?: File[] | null) => {
      const si = Math.max(0, typeof draftI === 'number' ? draftI : parseInt(String(draftI), 10) || 0)
      const photo = files && files.length ? await attachPhotos(files) : undefined
      postLocationAt(si, draftNote, photo)
      setDraftNoteState('')
      // If this spot is one of the Signature 15 and not yet bagged, offer to bag it.
      const label = journey[si]?.label
      const sigId = label ? journeyToSig[label] : undefined
      if (sigId && !storeRef.current.sig[sigId]) setLinkPrompt({ kind: 'offerBag', name: tripData.signature.find((x) => x.id === sigId)?.name || label, sigId })
    },
    [draftI, draftNote, postLocationAt],
  )

  const setStopMark = useCallback(
    (di: number, si: number, val: 'keep' | 'maybe' | 'cut') => {
      const key = markKey(di, si)
      const marks = { ...storeRef.current.marks }
      if (marks[key] === val) {
        delete marks[key]
        deleteRow('marks', 'stop', key)
      } else {
        marks[key] = val
        upsertRow('marks', { stop: key, mark: val })
      }
      set({ marks })
    },
    [set, deleteRow, upsertRow],
  )

  const toggleSig = useCallback(
    (id: string) => {
      const sig = { ...storeRef.current.sig }
      if (sig[id]) {
        delete sig[id]
        deleteRow('sig', 'sid', id)
      } else {
        const t = Date.now()
        sig[id] = t
        insertRow('sig', { sid: id, ts: t })
        // Just bagged a spot with a known location — offer to post "we are here".
        const jIdx = sigToJourneyIndex[id]
        if (jIdx != null && storeRef.current.updates[0]?.si !== jIdx) {
          setLinkPrompt({ kind: 'offerPost', name: journey[jIdx].label, journeyIndex: jIdx })
        }
      }
      set({ sig })
    },
    [set, deleteRow, insertRow],
  )

  const confirmLink = useCallback(() => {
    const p = linkPrompt
    setLinkPrompt(null)
    if (!p) return
    if (p.kind === 'offerPost' && p.journeyIndex != null) {
      postLocationAt(p.journeyIndex, '')
      setDraftIState(p.journeyIndex)
    } else if (p.kind === 'offerBag' && p.sigId) {
      bagSigSilent(p.sigId)
    }
  }, [linkPrompt, postLocationAt, bagSigSilent])

  const dismissLink = useCallback(() => setLinkPrompt(null), [])

  const togglePack = useCallback(
    (k: string) => {
      const pack = { ...storeRef.current.pack }
      if (pack[k]) delete pack[k]
      else pack[k] = true
      set({ pack })
    },
    [set],
  )

  /** Synced kit state (per-brother packing ticks + shared-item allocations).
   * null clears the key. Optimistic locally; upsert/delete rides the outbox. */
  const setKit = useCallback(
    (k: string, v: string | null) => {
      const kit = { ...storeRef.current.kit }
      if (v == null) {
        delete kit[k]
        deleteRow('kit', 'k', k)
      } else {
        kit[k] = v
        upsertRow('kit', { k, v })
      }
      set({ kit })
    },
    [set, deleteRow, upsertRow],
  )

  const toggleBook = useCallback(
    (id: string) => {
      const book = { ...storeRef.current.book }
      if (book[id]) delete book[id]
      else book[id] = true
      set({ book })
    },
    [set],
  )


  const submitPost = useCallback(
    async (files?: File[] | null): Promise<boolean> => {
      const name = (postName || '').trim().slice(0, 60)
      const msg = (postMsg || '').trim().slice(0, 500)
      if (!name || !msg) {
        setPostErr(true)
        return false // caller keeps the attached photos — validation failed
      }
      const reason = postReason || 'Recommendation'
      const photo = files && files.length ? await attachPhotos(files) : undefined
      const row: Post = { name, reason, msg, ts: Date.now(), ...(photo ? { photo } : {}) }
      const posts = [row, ...(storeRef.current.posts || [])].slice(0, 40)
      set({ posts })
      insertRow('posts', { name: row.name, reason: row.reason, msg: row.msg, ts: row.ts, ...(photo ? { photo } : {}) })
      setPostMsgState('')
      setPostErr(false)
      setPostIdxState(0)
      return true
    },
    [postName, postMsg, postReason, set, insertRow],
  )

  const removePost = useCallback(
    (ts: number) => {
      if (typeof window !== 'undefined' && !window.confirm('Remove this message?')) return
      const posts = (storeRef.current.posts || []).filter((p) => p.ts !== ts)
      set({ posts })
      deleteRow('posts', 'ts', ts)
    },
    [set, deleteRow],
  )

  const clearPosts = useCallback(async () => {
    if (typeof window !== 'undefined' && !window.confirm('Clear the whole board? This can’t be undone.')) return
    if (!requireOnline()) return
    const err = await deleteAll('posts')
    if (err) {
      try { window.alert('The trip server couldn’t clear the board — nothing was changed.') } catch { /* noop */ }
      return
    }
    const cur: Store = { ...storeRef.current }
    cur.posts = []
    cur.outbox = (cur.outbox || []).filter((x) => x.t !== 'posts')
    commit(cur)
    setPostIdxState(0)
  }, [commit, deleteAll, requireOnline])

  const addNote = useCallback(
    async (files?: File[] | null) => {
      const text = (jNote || '').trim().slice(0, 2000)
      if (!text && !(files && files.length)) return
      const jd = jDay ?? 'today'
      // Day the entry belongs to (midnight), used for grouping.
      const now = new Date()
      const todayMid = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
      const dayMid = jd === 'today' ? todayMid : (jd as number)
      // Optional time-of-day → an exact timestamp so it lands in the right slot.
      const tm = /^(\d{1,2}):(\d{2})$/.exec(jTime || '')
      let ts: number
      if (tm) ts = dayMid + Number(tm[1]) * 3600000 + Number(tm[2]) * 60000 + Math.floor(Math.random() * 1000)
      else ts = jd === 'today' ? Date.now() : dayMid + 12 * 3600000 + Math.floor(Math.random() * 1000) // noon-ish if a past day has no time
      // ts is the row's identity (UNIQUE on the server). Two notes filed to the
      // same day+minute must never collide — the colliding insert would be
      // treated as already-delivered and the second note silently vanishes.
      while ((storeRef.current.notes || []).some((n) => n.ts === ts)) ts++
      const date = dayMid
      let tag = jTag || 'Update'
      if (tag === 'Other') tag = (jTagOther || '').trim() || 'Other'
      const author = jAuthor || 'Paul'
      const photo = files && files.length ? await attachPhotos(files) : undefined
      const note: Note = { text, ts, date, author, tag, ...(photo ? { photo } : {}) }
      set({ notes: [note, ...(storeRef.current.notes || [])] })
      insertRow('notes', { body: text, author, tag, day: date, ts, ...(photo ? { photo } : {}) })
      setJNoteState('')
      setJTagOtherState('')
      setJTimeState('')
    },
    [jNote, jDay, jTag, jTagOther, jTime, jAuthor, set, insertRow],
  )

  // Save a brother's own tag (from "Other → +") so it's reusable in the list.
  const addCustomTag = useCallback(
    (tag: string) => {
      const t = (tag || '').trim().slice(0, 40)
      if (!t) return
      const cur: Store = { ...storeRef.current }
      const existing = cur.customTags || []
      if (!existing.some((x) => x.toLowerCase() === t.toLowerCase())) {
        cur.customTags = [...existing, t]
        commit(cur)
      }
      setJTag(t)
      setJTagOtherState('')
    },
    [commit],
  )

  const startEditNote = useCallback((ts: number, text: string) => {
    setJEditTs(ts)
    setJEditTextState(text || '')
  }, [])

  const saveEditNote = useCallback(() => {
    const ts = jEditTs
    if (ts == null) return
    const text = (jEditText || '').trim()
    const notes = (storeRef.current.notes || []).map((n) =>
      n.ts === ts ? { ...n, text: text || n.text } : n,
    )
    set({ notes })
    // Through the outbox like every other write — a direct .update() silently
    // lost offline edits (never queued, then overwritten by the next pull).
    if (text) tryOp({ op: 'update', t: 'notes', row: { body: text }, col: 'ts', val: ts }, false)
    setJEditTs(null)
    setJEditTextState('')
  }, [jEditTs, jEditText, set, tryOp])

  const cancelEditNote = useCallback(() => {
    setJEditTs(null)
    setJEditTextState('')
  }, [])

  const removeNote = useCallback(
    (ts: number) => {
      if (typeof window !== 'undefined' && !window.confirm('Delete this note?')) return
      const notes = (storeRef.current.notes || []).filter((n) => n.ts !== ts)
      set({ notes })
      deleteRow('notes', 'ts', ts)
    },
    [set, deleteRow],
  )

  const clearNotes = useCallback(async () => {
    if (typeof window !== 'undefined' && !window.confirm('Delete ALL journal notes? This can’t be undone.')) return
    if (!requireOnline()) return
    const err = await deleteAll('notes')
    if (err) {
      try { window.alert('The trip server couldn’t clear the notes — nothing was changed.') } catch { /* noop */ }
      return
    }
    const cur: Store = { ...storeRef.current }
    cur.notes = []
    cur.outbox = (cur.outbox || []).filter((x) => x.t !== 'notes')
    commit(cur)
  }, [commit, deleteAll, requireOnline])

  const clearMarksSig = useCallback(async () => {
    if (typeof window !== 'undefined' && !window.confirm('Clear all keep/maybe/cut marks and Signature picks?')) return
    if (!requireOnline()) return
    const errs = await Promise.all([wipe('marks', 'stop'), wipe('sig', 'sid')])
    if (errs.some((e) => e != null)) {
      try { window.alert('The trip server couldn’t clear the marks — nothing was changed.') } catch { /* noop */ }
      return
    }
    const cur: Store = { ...storeRef.current }
    cur.marks = {}
    cur.sig = {}
    cur.outbox = (cur.outbox || []).filter((x) => x.t !== 'marks' && x.t !== 'sig')
    commit(cur)
  }, [commit, wipe, requireOnline])

  const clearUpdates = useCallback(async () => {
    if (typeof window !== 'undefined' && !window.confirm('Clear all posted locations?')) return
    if (!requireOnline()) return
    const err = await deleteAll('locations')
    if (err) {
      try { window.alert('The trip server couldn’t clear the locations — nothing was changed.') } catch { /* noop */ }
      return
    }
    const cur: Store = { ...storeRef.current }
    cur.updates = []
    cur.outbox = (cur.outbox || []).filter((x) => x.t !== 'locations')
    commit(cur)
    if (typeof history !== 'undefined') {
      try {
        history.replaceState(null, '', location.pathname + location.search)
      } catch {
        /* noop */
      }
    }
  }, [commit, deleteAll, requireOnline])

  const clearGallery = useCallback(async () => {
    if (typeof window !== 'undefined' && !window.confirm('Clear every photo from the trip? The notes and messages stay — only the pictures go. This can’t be undone.')) return
    if (!requireOnline()) return
    const sb = sbRef.current
    if (!sb) return
    // The confirm promises deletion, so DELIVER deletion: collect every stored
    // object path first, null the columns, then remove the objects themselves —
    // otherwise anyone holding a URL could fetch "cleared" photos forever.
    const paths: string[] = []
    const collect = (rows: Array<{ photo?: string }>) =>
      rows.forEach((r) =>
        photoList(r.photo).forEach((u) => {
          const m = /\/photos\/([^/?]+)(?:\?|$)/.exec(u)
          if (m) paths.push(m[1])
        }),
      )
    collect(storeRef.current.posts || [])
    collect(storeRef.current.notes || [])
    collect(storeRef.current.updates || [])
    sb.from('posts').update({ photo: null }).not('photo', 'is', null).then(() => {}, () => {})
    sb.from('notes').update({ photo: null }).not('photo', 'is', null).then(() => {}, () => {})
    sb.from('locations').update({ photo: null }).not('photo', 'is', null).then(() => {}, () => {})
    if (paths.length) sb.storage.from('photos').remove(paths).then(() => {}, () => {})
    const cur: Store = { ...storeRef.current }
    cur.posts = (cur.posts || []).map((p) => ({ ...p, photo: undefined }))
    cur.notes = (cur.notes || []).map((n) => ({ ...n, photo: undefined }))
    cur.updates = (cur.updates || []).map((u) => ({ ...u, photo: undefined }))
    commit(cur)
    clearAllPending()
  }, [commit, requireOnline])

  const resetEverything = useCallback(async () => {
    if (typeof window === 'undefined') return
    if (
      !window.confirm(
        'Reset EVERYTHING back to a clean slate?\n\nThis clears all postbox messages, location pings, journal notes, keep/cut marks, Signature picks, packing ticks and booking flags — for everyone. It cannot be undone.',
      )
    )
      return
    if (!window.confirm('Last chance — really wipe it all? Tap Cancel to grab a Backup first.')) return
    if (!requireOnline()) return
    // Server first, AWAITED and VERIFIED — a timeout or any failed delete
    // aborts the local wipe entirely. Proceeding blind produced the worst
    // outcome: a permanent partial wipe with zero signal to the user.
    const work = Promise.all([
      deleteAll('posts'),
      deleteAll('locations'),
      deleteAll('notes'),
      wipe('marks', 'stop'),
      wipe('sig', 'sid'),
      wipe('kit', 'k'),
    ])
    const results = await Promise.race([work, new Promise<null>((r) => setTimeout(() => r(null), 10000))])
    if (results == null || results.some((e) => e != null)) {
      try {
        window.alert('Couldn’t confirm the server wipe (weak signal or the server refused) — NOTHING was cleared, on the server or this phone. Try again with better signal.')
      } catch {
        /* noop */
      }
      return
    }
    const keepRole = storeRef.current.role || null
    commit(emptyStore(keepRole))
    clearAllPending()
    try {
      location.reload()
    } catch {
      /* noop */
    }
  }, [commit, deleteAll, wipe, requireOnline])

  const savePDF = useCallback(async () => {
    try {
      // Print engines don't reliably force lazy images below the fold — a Trip
      // Book with empty frames is a ruined keepsake. Eager-load and decode
      // everything first (bounded, so a dead image can't block the print).
      const imgs = Array.from(document.images)
      imgs.forEach((im) => {
        im.loading = 'eager'
      })
      await Promise.race([
        Promise.allSettled(imgs.map((im) => (im.decode ? im.decode().catch(() => {}) : Promise.resolve()))),
        new Promise((r) => setTimeout(r, 6000)),
      ])
      window.print()
    } catch {
      try {
        window.print()
      } catch {
        /* noop */
      }
    }
  }, [])

  const downloadBackup = useCallback(() => {
    try {
      const S = storeRef.current
      const data = {
        exportedAt: new Date().toISOString(),
        trip: tripData.meta,
        posts: S.posts || [],
        locations: S.updates || [],
        notes: S.notes || [],
        signature: S.sig || {},
        marks: S.marks || {},
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'wild-atlantic-way-backup.json'
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        try {
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        } catch {
          /* noop */
        }
      }, 200)
    } catch (e) {
      try {
        alert('Backup failed: ' + e)
      } catch {
        /* noop */
      }
    }
  }, [])

  const copyTimer = useRef<number | undefined>(undefined)
  const copyLink = useCallback(() => {
    const u = (storeRef.current.updates || [])[0]
    if (!u) return
    try {
      const base = location.href.split('#')[0]
      const url =
        base + '#at=' + u.si + '&t=' + (u.ts || Date.now()) + (u.note ? '&n=' + encodeURIComponent(u.note) : '')
      if (navigator.clipboard) navigator.clipboard.writeText(url)
      setCopied(true)
      window.clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* noop */
    }
  }, [])

  // ---- gate ----
  const chooseBrother = useCallback(() => {
    setPwOpen(true)
    setPwVal('')
    setPwErr(false)
  }, [])
  const cancelPw = useCallback(() => {
    setPwOpen(false)
    setPwVal('')
    setPwErr(false)
  }, [])
  const setPw = useCallback((v: string) => {
    setPwVal(v)
    setPwErr(false)
  }, [])
  const submitPw = useCallback(() => {
    const ok = (pwVal || '').trim().toUpperCase() === 'WAW'
    if (ok) {
      setPwOpen(false)
      setPwVal('')
      setPwErr(false)
      set({ role: 'brother' })
    } else {
      setPwErr(true)
    }
  }, [pwVal, set])
  const chooseGuest = useCallback(() => set({ role: 'guest' }), [set])
  const signOut = useCallback(() => {
    setScreen('home')
    // Wipe the nav history: the next person holding the phone (a guest after a
    // brother, say) must not be able to back-step into role-gated screens.
    histRef.current = []
    setPwOpen(false)
    setPwVal('')
    setPwErr(false)
    set({ role: null })
  }, [set])

  // ---- dropdowns / small setters ----
  const toggleDD = useCallback((name: string) => setOpenDD((cur) => (cur === name ? null : name)), [])
  const closeDD = useCallback(() => setOpenDD(null), [])
  const setDraftI = useCallback((i: number) => {
    setDraftIState(i)
    setOpenDD(null)
  }, [])
  const selectReason = useCallback((r: string) => {
    setPostReason(r)
    setOpenDD(null)
  }, [])
  const selectJDay = useCallback((v: number | string) => {
    setJDay(v)
    setOpenDD(null)
  }, [])
  const selectAuthor = useCallback((a: string) => setJAuthor(a), [])
  const selectJTag = useCallback((t: string) => {
    setJTag(t)
    setOpenDD(null)
  }, [])

  const jfX = useRef<number | null>(null)
  const jFeedSwipeStart = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    jfX.current =
      'touches' in e && e.touches[0] ? e.touches[0].clientX : (e as React.MouseEvent).clientX
  }, [])
  const jFeedSwipeEnd = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (jfX.current == null) return
    const x =
      'changedTouches' in e && e.changedTouches[0]
        ? e.changedTouches[0].clientX
        : (e as React.MouseEvent).clientX
    const d = x - jfX.current
    jfX.current = null
    if (Math.abs(d) < 30) return
    const dir = d < 0 ? 1 : -1
    setJFeedIdxState((i) => i + dir)
  }, [])

  const value: StoreContextValue = {
    store,
    role,
    isBrother,
    isGuest,
    ready: true,
    serverOk,
    screen,
    day,
    kitTab,
    sightsTab,
    attractFilter,
    scrollRef,
    nav,
    goBack,
    setDay,
    setKitTab,
    setSightsTab,
    setAttractFilter,
    nowTs,
    vw,
    draftI,
    draftNote,
    setDraftI,
    setDraftNote: setDraftNoteState,
    postHere,
    resolveCurrentPlace,
    postResolvedPlace,
    openDD,
    toggleDD,
    closeDD,
    postName,
    postReason,
    postMsg,
    postErr,
    postIdx,
    setPostName: (v) => {
      setPostNameState(v)
      setPostErr(false)
    },
    selectReason,
    setPostMsg: (v) => {
      setPostMsgState(v)
      setPostErr(false)
    },
    submitPost,
    removePost,
    clearPosts,
    setPostIdx: (i: number) => {
      carouselTouchRef.current = Date.now()
      setPostIdxState(i)
    },
    galIdx,
    setGalIdx: (i: number) => {
      carouselTouchRef.current = Date.now()
      setGalIdxState(i)
    },
    jFeedIdx,
    setJFeedIdx: (i: number) => {
      carouselTouchRef.current = Date.now()
      setJFeedIdxState(i)
    },
    jFeedSwipeStart,
    jFeedSwipeEnd,
    jNote,
    jDay,
    jTime,
    jAuthor,
    jTag,
    jTagOther,
    customTags: store.customTags || [],
    jEditTs,
    jEditText,
    setJNote: setJNoteState,
    selectJDay,
    setJTime: setJTimeState,
    selectAuthor,
    selectJTag,
    setJTagOther: setJTagOtherState,
    addCustomTag,
    addNote,
    startEditNote,
    setJEditText: setJEditTextState,
    saveEditNote,
    cancelEditNote,
    removeNote,
    setStopMark,
    toggleSig,
    linkPrompt,
    confirmLink,
    dismissLink,
    togglePack,
    setKit,
    toggleBook,
    clearNotes,
    clearMarksSig,
    clearUpdates,
    clearGallery,
    resetEverything,
    savePDF,
    downloadBackup,
    copyLink,
    copied,
    pwOpen,
    pwVal,
    pwErr,
    chooseBrother,
    cancelPw,
    setPw,
    submitPw,
    chooseGuest,
    signOut,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
