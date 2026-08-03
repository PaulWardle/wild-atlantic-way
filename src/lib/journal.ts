/* Builds the day-by-day journal record by stitching together every trip event:
 * location pings, keep/cut decisions (via the marks summary, shown separately),
 * Signature bags, postbox messages and the brothers' own notes. */

import type { Store, Trip } from '../types'
import { trackStops } from '../data/derived'
import { jKindMeta, reasonMeta } from './tags'
import { photoList } from './photos'
import { dayKey, fmtDate, fmtTime } from './time'

export interface JReply {
  by: string
  msg: string
  ts: number
  photo?: string
}

export interface JEvent {
  kind: 'loc' | 'post' | 'bag' | 'note'
  ts: number
  gms: number
  label?: string
  note?: string
  name?: string
  verb?: string
  msg?: string
  reason?: string
  text?: string
  author?: string
  tag?: string
  noteTs?: number
  photo?: string
  replies?: JReply[]
}

export interface FeedItem {
  tag: string
  tagInk: string
  tagBg: string
  when: string
  title: string
  body: string
  hasTitle: boolean
  hasBody: boolean
  author: string
  hasAuthor: boolean
  photo?: string
  replies?: JReply[]
}

export interface GroupEntry {
  kind: JEvent['kind']
  ts: number
  tag: string
  tagInk: string
  tagBg: string
  time: string
  title: string
  body: string
  hasTitle: boolean
  hasBody: boolean
  isNote: boolean
  author: string
  hasAuthor: boolean
  noteTs?: number
  text: string
  photo?: string
  replies?: JReply[]
}

export interface JGroup {
  key: string
  gms: number
  dayLabel: string
  hasDay: boolean
  dateLabel: string
  entries: GroupEntry[]
}

/** Flatten the store into raw journal events. */
export function buildEvents(store: Store, trip: Trip): JEvent[] {
  const events: JEvent[] = []
  const sig = store.sig || {}
  ;(store.updates || []).forEach((u) => {
    const st = trackStops[u.si] || { label: '' }
    events.push({ kind: 'loc', ts: u.ts || 0, gms: u.ts || 0, label: u.place || st.label || '', note: u.note || '', photo: u.photo })
  })
  // Brother replies (parentTs set) nest under the message they answer instead
  // of standing alone; a reply whose parent is gone stays hidden entirely.
  const replyByParent: Record<number, JReply[]> = {}
  ;(store.posts || []).forEach((p) => {
    if (p.parentTs == null) return
    ;(replyByParent[p.parentTs] = replyByParent[p.parentTs] || []).push({ by: p.name, msg: p.msg, ts: p.ts || 0, photo: p.photo })
  })
  Object.values(replyByParent).forEach((arr) => arr.sort((a, b) => a.ts - b.ts))
  ;(store.posts || []).forEach((p) => {
    if (p.parentTs != null) return
    const m = reasonMeta[p.reason] || reasonMeta.Comment
    events.push({ kind: 'post', ts: p.ts || 0, gms: p.ts || 0, name: p.name, verb: m.verb, msg: p.msg, reason: p.reason, photo: p.photo, replies: replyByParent[p.ts || 0] })
  })
  Object.keys(sig).forEach((id) => {
    const t = sig[id]
    if (typeof t === 'number') {
      const spot = (trip.signature || []).find((x) => x.id === id)
      events.push({ kind: 'bag', ts: t, gms: t, label: spot?.name || '' })
    }
  })
  ;(store.notes || []).forEach((n) => {
    events.push({
      kind: 'note',
      ts: n.ts || 0,
      gms: (typeof n.date === 'number' ? n.date : 0) || n.ts || 0,
      text: n.text || '',
      author: n.author || '',
      tag: n.tag || 'Note',
      noteTs: n.ts,
      photo: n.photo,
    })
  })
  return events
}

function titleBody(e: JEvent): { title: string; body: string } {
  if (e.kind === 'loc') return { title: e.label || '', body: e.note || '' }
  if (e.kind === 'post') return { title: ((e.name || '') + ' ' + (e.verb || '')).trim(), body: e.msg || '' }
  if (e.kind === 'bag') return { title: e.label || '', body: '' }
  return { title: '', body: e.text || '' }
}

/** The latest-first carousel/list feed (default up to 12 items). */
export function buildFeed(events: JEvent[], limit = 12): FeedItem[] {
  return events
    .slice()
    .sort((a, b) => b.gms - a.gms || b.ts - a.ts)
    .slice(0, limit)
    .map((e) => {
      const km = jKindMeta[e.kind]
      const isNote = e.kind === 'note'
      const { title, body } = titleBody(e)
      return {
        tag: isNote ? e.tag || 'Note' : e.kind === 'post' ? e.reason || km.label : km.label,
        tagInk: km.ink,
        tagBg: km.bg,
        when: fmtDate(e.gms),
        title,
        body,
        hasTitle: !!title,
        hasBody: !!body,
        author: isNote ? e.author || '' : '',
        hasAuthor: isNote && !!e.author,
        photo: e.photo,
        replies: e.replies,
      }
    })
}

/** Every photo across the trip (pings, posts, notes), newest first, with a
 *  caption + date — for the gallery grid. A single event may carry several
 *  photos (packed field), each becoming its own tile. */
export function buildGallery(events: JEvent[]): { url: string; alt: string; when: string }[] {
  return events
    .filter((e) => !!e.photo)
    .sort((a, b) => b.gms - a.gms || b.ts - a.ts)
    .flatMap((e) => {
      const { title } = titleBody(e)
      const when = fmtDate(e.gms)
      const own = photoList(e.photo).map((url) => ({ url, alt: title || 'Trip photo', when }))
      const fromReplies = (e.replies || []).flatMap((r) =>
        photoList(r.photo).map((url) => ({ url, alt: `Reply from ${r.by}`, when: fmtDate(r.ts) })),
      )
      return own.concat(fromReplies)
    })
}

/** dayKey → { n, dow } for each trip day (to label journal groups "Day 03"). */
export function tripDayByKey(trip: Trip): Record<string, { n: string; dow: string }> {
  let jDepartMs = 0
  try {
    jDepartMs = new Date(trip.meta.depart + 'T00:00:00').getTime()
  } catch {
    jDepartMs = 0
  }
  const out: Record<string, { n: string; dow: string }> = {}
  ;(trip.days || []).forEach((d, i) => {
    out[dayKey(jDepartMs + i * 86400000)] = { n: d.n, dow: d.dow }
  })
  return out
}

/** Group events by calendar day, newest day first, each day newest-first. */
export function buildGroups(events: JEvent[], trip: Trip): JGroup[] {
  const byKey: Record<string, JEvent[]> = {}
  events.forEach((e) => {
    const k = dayKey(e.gms)
    ;(byKey[k] = byKey[k] || []).push(e)
  })
  const dayMap = tripDayByKey(trip)
  return Object.keys(byKey)
    .map((k) => {
      const arr = byKey[k].slice().sort((a, b) => b.ts - a.ts)
      const gms = arr.reduce((mx, e) => Math.max(mx, e.gms), 0)
      const td = dayMap[k]
      const entries: GroupEntry[] = arr.map((e) => {
        const km = jKindMeta[e.kind]
        const isNote = e.kind === 'note'
        const { title, body } = titleBody(e)
        return {
          kind: e.kind,
          ts: e.ts,
          tag: isNote ? e.tag || 'Note' : e.kind === 'post' ? e.reason || km.label : km.label,
          tagInk: km.ink,
          tagBg: km.bg,
          time: fmtTime(e.ts),
          title,
          body,
          hasTitle: !!title,
          hasBody: !!body,
          isNote,
          author: isNote ? e.author || '' : '',
          hasAuthor: isNote && !!e.author,
          noteTs: e.noteTs,
          text: e.text || '',
          photo: e.photo,
          replies: e.replies,
        }
      })
      return { key: k, gms, dayLabel: td ? 'Day ' + td.n : '', hasDay: !!td, dateLabel: fmtDate(gms), entries }
    })
    .sort((a, b) => b.gms - a.gms)
}
