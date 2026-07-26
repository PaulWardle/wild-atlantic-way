/* Builds the day-by-day journal record by stitching together every trip event:
 * location pings, keep/cut decisions (via the marks summary, shown separately),
 * Signature bags, postbox messages and the brothers' own notes. */

import type { Store, Trip } from '../types'
import { trackStops } from '../data/derived'
import { jKindMeta, reasonMeta } from './tags'
import { dayKey, fmtDate, fmtTime } from './time'

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
}

export interface GroupEntry {
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
  ;(store.posts || []).forEach((p) => {
    const m = reasonMeta[p.reason] || reasonMeta.Comment
    events.push({ kind: 'post', ts: p.ts || 0, gms: p.ts || 0, name: p.name, verb: m.verb, msg: p.msg, reason: p.reason, photo: p.photo })
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
      }
    })
}

/** Every photo across the trip (pings, posts, notes), newest first, with a
 *  caption + date — for the gallery grid. */
export function buildGallery(events: JEvent[]): { url: string; alt: string; when: string }[] {
  return events
    .filter((e) => !!e.photo)
    .sort((a, b) => b.gms - a.gms || b.ts - a.ts)
    .map((e) => {
      const { title } = titleBody(e)
      return { url: e.photo as string, alt: title || 'Trip photo', when: fmtDate(e.gms) }
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
        }
      })
      return { key: k, gms, dayLabel: td ? 'Day ' + td.n : '', hasDay: !!td, dateLabel: fmtDate(gms), entries }
    })
    .sort((a, b) => b.gms - a.gms)
}
