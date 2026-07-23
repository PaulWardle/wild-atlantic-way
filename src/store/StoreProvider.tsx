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
import { tripData } from '../data/tripData'
import { journey, journeyToSig } from '../data/journey'
import { uploadPhoto } from '../lib/photos'
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
  | 'decide'
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
    dec: {},
    ferry: null,
    outbox: [],
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
    marks: s.marks ?? {},
    sig: s.sig ?? {},
    pack: s.pack ?? {},
    book: s.book ?? {},
    dec: s.dec ?? {},
    ferry: s.ferry ?? null,
    outbox: s.outbox ?? [],
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
  if (hv) store.updates = [hv]
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
    return {
      si: Math.max(0, i),
      note: q.get('n') ? decodeURIComponent(q.get('n') as string) : '',
      ts: q.get('t') ? parseInt(q.get('t') as string, 10) : Date.now(),
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
  postHere: (file?: File | null) => Promise<void>

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
  submitPost: (file?: File | null) => Promise<void>
  removePost: (ts: number) => void
  clearPosts: () => void
  setPostIdx: (i: number) => void

  // journal composer / edit
  jFeedIdx: number
  setJFeedIdx: (i: number) => void
  jFeedSwipeStart: (e: React.TouchEvent | React.MouseEvent) => void
  jFeedSwipeEnd: (e: React.TouchEvent | React.MouseEvent) => void
  jNote: string
  jDay: number | string
  jAuthor: string
  jTag: string
  jTagOther: string
  jEditTs: number | null
  jEditText: string
  setJNote: (v: string) => void
  selectJDay: (v: number | string) => void
  selectAuthor: (a: string) => void
  selectJTag: (t: string) => void
  setJTagOther: (v: string) => void
  addNote: (file?: File | null) => Promise<void>
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
  toggleBook: (id: string) => void
  pickFerry: (v: string) => void
  pickDec: (id: string, idx: number) => void

  // clears / reset
  clearNotes: () => void
  clearMarksSig: () => void
  clearUpdates: () => void
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
  const [jNote, setJNoteState] = useState('')
  const [jDay, setJDay] = useState<number | string>('today')
  const [jAuthor, setJAuthor] = useState('Paul')
  const [jTag, setJTag] = useState('Update')
  const [jTagOther, setJTagOtherState] = useState('')
  const [jEditTs, setJEditTs] = useState<number | null>(null)
  const [jEditText, setJEditTextState] = useState('')
  const [pwOpen, setPwOpen] = useState(false)
  const [pwVal, setPwVal] = useState('')
  const [pwErr, setPwErr] = useState(false)
  const [copied, setCopied] = useState(false)
  const [linkPrompt, setLinkPrompt] = useState<LinkPrompt | null>(null)

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
    Promise.all([
      sb.from('posts').select('*'),
      sb.from('locations').select('*'),
      sb.from('notes').select('*'),
      sb.from('marks').select('*'),
      sb.from('sig').select('*'),
    ])
      .then((res) => {
        const [p, l, n, m, g] = res
        const next: Store = { ...storeRef.current }
        if (!p.error)
          next.posts = ((p.data || []) as Post[])
            .map((r) => ({ name: r.name, reason: r.reason, msg: r.msg, ts: r.ts, photo: r.photo }))
            .sort((a, b) => b.ts - a.ts)
        if (!l.error)
          next.updates = ((l.data || []) as Update[])
            .map((r) => ({ si: r.si, note: r.note, ts: r.ts, photo: r.photo }))
            .sort((a, b) => b.ts - a.ts)
        if (!n.error)
          next.notes = ((n.data || []) as Array<{ body: string; author: string; tag: string; day: number | string; ts: number; photo?: string }>)
            .map((r) => ({ text: r.body, author: r.author, tag: r.tag, date: r.day, ts: r.ts, photo: r.photo }))
            .sort((a, b) => b.ts - a.ts)
        if (!m.error) {
          const mm: Store['marks'] = {}
          ;((m.data || []) as Array<{ stop: string; mark: 'keep' | 'maybe' | 'cut' }>).forEach((r) => {
            mm[r.stop] = r.mark
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
        // Re-apply optimistic (unsent) inserts on top of the cloud pull.
        const ob = storeRef.current.outbox || []
        ob.forEach((x) => {
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
      .catch(() => {})
  }, [commit])

  const runOp = useCallback((o: OutboxOp) => {
    const sb = sbRef.current as SupabaseClient
    const q = sb.from(o.t)
    if (o.op === 'insert') return q.insert(o.row as Record<string, unknown>)
    if (o.op === 'upsert') return q.upsert(o.row as Record<string, unknown>)
    return q.delete().eq(o.col as string, o.val as string | number)
  }, [])

  const queueOp = useCallback((o: Omit<OutboxOp, '_k'>, flag: boolean) => {
    const cur: Store = { ...storeRef.current }
    const key =
      o.op + ':' + o.t + ':' + (o.row ? o.row.ts || o.row.stop || o.row.sid : o.col + '=' + o.val)
    const ob = (cur.outbox || []).filter((x) => x._k !== key)
    ob.push({ _k: String(key), ...o })
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

  const tryOp = useCallback(
    (o: Omit<OutboxOp, '_k'>, flag: boolean) => {
      if (sbRef.current && !isOffline()) {
        runOp({ _k: '', ...o }).then(
          (r) => {
            if (r && r.error) queueOp(o, flag)
          },
          () => queueOp(o, flag),
        )
      } else {
        queueOp(o, flag)
      }
    },
    [runOp, queueOp],
  )

  const insertRow = useCallback((t: TableName, row: Record<string, unknown>) => tryOp({ op: 'insert', t, row }, true), [tryOp])
  const upsertRow = useCallback((t: TableName, row: Record<string, unknown>) => tryOp({ op: 'upsert', t, row }, false), [tryOp])
  const deleteRow = useCallback((t: TableName, col: string, val: unknown) => tryOp({ op: 'delete', t, col, val }, false), [tryOp])
  const deleteAll = useCallback((t: TableName) => {
    const sb = sbRef.current
    if (sb) sb.from(t).delete().gt('ts', 0).then(() => {}, () => {})
  }, [])
  const wipe = useCallback((t: TableName, col: string) => {
    const sb = sbRef.current
    if (sb) sb.from(t).delete().not(col, 'is', null).then(() => {}, () => {})
  }, [])

  const flush = useCallback(() => {
    if (flushingRef.current || !sbRef.current || isOffline()) return
    const ob = (storeRef.current.outbox || []).slice()
    if (!ob.length) return
    flushingRef.current = true
    Promise.all(
      ob.map((o) => runOp(o).then((r) => (r && !r.error ? o._k : null), () => null)),
    ).then((res) => {
      flushingRef.current = false
      const doneKeys = res.filter(Boolean) as string[]
      if (doneKeys.length) {
        const cur: Store = { ...storeRef.current }
        cur.outbox = (cur.outbox || []).filter((x) => doneKeys.indexOf(x._k) < 0)
        commit(cur)
        pullAll()
      }
    })
  }, [runOp, commit, pullAll])

  // init supabase + realtime, intervals, listeners
  useEffect(() => {
    const sb = getSupabase()
    sbRef.current = sb
    pullAll()
    if (!subRef.current) {
      subRef.current = sb
        .channel('waw')
        .on('postgres_changes', { event: '*', schema: 'public' }, () => pullAll())
        .subscribe()
    }
    const onOnline = () => flush()
    window.addEventListener('online', onOnline)
    const flushInt = window.setInterval(() => flush(), 20000)
    const onResize = () => {
      const w = window.innerWidth
      setVw((prev) => (Math.abs(w - prev) > 2 ? w : prev))
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('resize', onResize)
      window.clearInterval(flushInt)
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
    const tick = window.setInterval(() => {
      if (screenRef.current === 'today' || !roleRef.current) setNowTs(Date.now())
    }, 1000)
    return () => window.clearInterval(tick)
  }, [])

  // auto-advancing carousels on Home
  useEffect(() => {
    const car = window.setInterval(() => {
      if (screenRef.current !== 'home') return
      const s = storeRef.current
      const posts = s.posts || []
      const n = Math.min(12, posts.length)
      if (n > 1) setPostIdxState((i) => (i + 1) % n)
      const jn = Math.min(
        12,
        (s.updates || []).length +
          (s.posts || []).length +
          (s.notes || []).length +
          Object.keys(s.sig || {}).filter((k) => typeof s.sig[k] === 'number').length,
      )
      if (jn > 1) setJFeedIdxState((i) => i + 1)
    }, 4500)
    return () => window.clearInterval(car)
  }, [])

  // ---- mutations ----
  // Post a location ping at a given journey index (used by the cross-link too).
  const postLocationAt = useCallback(
    (si: number, note: string, photo?: string) => {
      const row: Update = { si, note: (note || '').trim(), ts: Date.now(), ...(photo ? { photo } : {}) }
      const updates = [row, ...(storeRef.current.updates || [])].slice(0, 8)
      set({ updates })
      insertRow('locations', { si: row.si, note: row.note, ts: row.ts, ...(photo ? { photo } : {}) })
    },
    [set, insertRow],
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
    async (file?: File | null) => {
      const si = Math.max(0, typeof draftI === 'number' ? draftI : parseInt(String(draftI), 10) || 0)
      const photo = file ? (await uploadPhoto(file)) || undefined : undefined
      postLocationAt(si, draftNote, photo)
      setDraftNoteState('')
      // If this spot is one of the Signature 15 and not yet bagged, offer to bag it.
      const label = journey[si]?.label
      const sigId = label ? journeyToSig[label] : undefined
      if (sigId && !storeRef.current.sig[sigId]) setLinkPrompt({ kind: 'offerBag', name: label, sigId })
    },
    [draftI, draftNote, postLocationAt],
  )

  const setStopMark = useCallback(
    (di: number, si: number, val: 'keep' | 'maybe' | 'cut') => {
      const key = 'd' + di + 's' + si
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

  const toggleBook = useCallback(
    (id: string) => {
      const book = { ...storeRef.current.book }
      if (book[id]) delete book[id]
      else book[id] = true
      set({ book })
    },
    [set],
  )

  const pickFerry = useCallback(
    (v: string) => {
      const cur = storeRef.current.ferry
      const nv = cur === v ? null : v
      const dec = { ...storeRef.current.dec }
      if (nv == null) delete dec.d1
      else dec.d1 = ({ A: 0, B: 1 } as Record<string, number>)[nv]
      set({ ferry: nv, dec })
    },
    [set],
  )

  const pickDec = useCallback(
    (id: string, idx: number) => {
      const dec = { ...storeRef.current.dec }
      const nv = dec[id] === idx ? null : idx
      if (nv == null) delete dec[id]
      else dec[id] = nv
      const patch: Partial<Store> = { dec }
      if (id === 'd1') patch.ferry = nv == null ? null : ['A', 'B'][nv] || null
      set(patch)
    },
    [set],
  )

  const submitPost = useCallback(
    async (file?: File | null) => {
      const name = (postName || '').trim()
      const msg = (postMsg || '').trim()
      if (!name || !msg) {
        setPostErr(true)
        return
      }
      const reason = postReason || 'Recommendation'
      const photo = file ? (await uploadPhoto(file)) || undefined : undefined
      const row: Post = { name, reason, msg, ts: Date.now(), ...(photo ? { photo } : {}) }
      const posts = [row, ...(storeRef.current.posts || [])].slice(0, 40)
      set({ posts })
      insertRow('posts', { name: row.name, reason: row.reason, msg: row.msg, ts: row.ts, ...(photo ? { photo } : {}) })
      setPostMsgState('')
      setPostErr(false)
      setPostIdxState(0)
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

  const clearPosts = useCallback(() => {
    if (typeof window !== 'undefined' && !window.confirm('Clear the whole board? This can’t be undone.')) return
    set({ posts: [] })
    setPostIdxState(0)
    deleteAll('posts')
  }, [set, deleteAll])

  const addNote = useCallback(
    async (file?: File | null) => {
      const text = (jNote || '').trim()
      if (!text && !file) return
      const jd = jDay ?? 'today'
      const date = jd === 'today' ? Date.now() : (jd as number)
      let tag = jTag || 'Update'
      if (tag === 'Other') tag = (jTagOther || '').trim() || 'Other'
      const author = jAuthor || 'Paul'
      const ts = Date.now()
      const photo = file ? (await uploadPhoto(file)) || undefined : undefined
      const note: Note = { text, ts, date, author, tag, ...(photo ? { photo } : {}) }
      set({ notes: [note, ...(storeRef.current.notes || [])] })
      insertRow('notes', { body: text, author, tag, day: date, ts, ...(photo ? { photo } : {}) })
      setJNoteState('')
      setJTagOtherState('')
    },
    [jNote, jDay, jTag, jTagOther, jAuthor, set, insertRow],
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
    if (text && sbRef.current)
      sbRef.current.from('notes').update({ body: text }).eq('ts', ts).then(() => {}, () => {})
    setJEditTs(null)
    setJEditTextState('')
  }, [jEditTs, jEditText, set])

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

  const clearNotes = useCallback(() => {
    if (typeof window !== 'undefined' && !window.confirm('Delete ALL journal notes? This can’t be undone.')) return
    set({ notes: [] })
    deleteAll('notes')
  }, [set, deleteAll])

  const clearMarksSig = useCallback(() => {
    if (typeof window !== 'undefined' && !window.confirm('Clear all keep/maybe/cut marks and Signature picks?')) return
    set({ marks: {}, sig: {} })
    wipe('marks', 'stop')
    wipe('sig', 'sid')
  }, [set, wipe])

  const clearUpdates = useCallback(() => {
    if (typeof window !== 'undefined' && !window.confirm('Clear all posted locations?')) return
    set({ updates: [] })
    deleteAll('locations')
    if (typeof history !== 'undefined') {
      try {
        history.replaceState(null, '', location.pathname + location.search)
      } catch {
        /* noop */
      }
    }
  }, [set, deleteAll])

  const resetEverything = useCallback(() => {
    if (typeof window === 'undefined') return
    if (
      !window.confirm(
        'Reset EVERYTHING back to a clean slate?\n\nThis clears all postbox messages, location pings, journal notes, keep/cut marks, Signature picks, packing ticks and booking flags — for everyone. It cannot be undone.',
      )
    )
      return
    if (!window.confirm('Last chance — really wipe it all? Tap Cancel to grab a Backup first.')) return
    const keepRole = storeRef.current.role || null
    commit(emptyStore(keepRole))
    deleteAll('posts')
    deleteAll('locations')
    deleteAll('notes')
    wipe('marks', 'stop')
    wipe('sig', 'sid')
    setTimeout(() => {
      try {
        location.reload()
      } catch {
        /* noop */
      }
    }, 700)
  }, [commit, deleteAll, wipe])

  const savePDF = useCallback(() => {
    try {
      window.print()
    } catch {
      /* noop */
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
    setPostIdx: setPostIdxState,
    jFeedIdx,
    setJFeedIdx: setJFeedIdxState,
    jFeedSwipeStart,
    jFeedSwipeEnd,
    jNote,
    jDay,
    jAuthor,
    jTag,
    jTagOther,
    jEditTs,
    jEditText,
    setJNote: setJNoteState,
    selectJDay,
    selectAuthor,
    selectJTag,
    setJTagOther: setJTagOtherState,
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
    toggleBook,
    pickFerry,
    pickDec,
    clearNotes,
    clearMarksSig,
    clearUpdates,
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
