/* Shared tag / reason vocabulary — the visual language for every stop, postbox
 * message and journal entry. Ported from the original renderVals(). */

import type { Stop } from '../types'

export interface TagChip {
  label: string
  ink: string
  bg: string
  bd: string
}

interface TagDef {
  label: string
  ink: string
  bg: string
  glyph: string
}

const tagReg: Record<string, TagDef> = {
  finish: { label: 'Finish line', ink: '#f6ecd6', bg: '#26201a', glyph: '⚑ ' },
  s: { label: 'Signature', ink: '#a8412a', bg: '#f7ecd6', glyph: '★ ' },
  b: { label: 'Biker road', ink: '#305a68', bg: '#e6ecec', glyph: '» ' },
  w: { label: 'WAW point', ink: '#3f7a5c', bg: '#e6f0ea', glyph: '' },
  view: { label: 'Viewpoint', ink: '#9a7b1e', bg: '#f4edd8', glyph: '' },
  beach: { label: 'Beach', ink: '#2f6d88', bg: '#e3eef2', glyph: '' },
  nature: { label: 'Nature', ink: '#55643a', bg: '#eef0e0', glyph: '' },
  history: { label: 'History', ink: '#5a6472', bg: '#e8ebef', glyph: '' },
  attraction: { label: 'Attraction', ink: '#7a4a6a', bg: '#efe4ec', glyph: '' },
  pub: { label: 'Pub', ink: '#9a5b1e', bg: '#f3e8d6', glyph: '' },
  cafe: { label: 'Café', ink: '#7a5230', bg: '#efe6d6', glyph: '' },
  food: { label: 'Food', ink: '#7a5230', bg: '#efe6d6', glyph: '' },
  town: { label: 'Town', ink: '#6b5f49', bg: '#e8dcbf', glyph: '' },
  logistics: { label: 'Logistics', ink: '#8a7c5f', bg: '#ece3cf', glyph: '' },
}

const tagOrder = [
  'finish', 's', 'b', 'w', 'view', 'beach', 'nature', 'history',
  'attraction', 'pub', 'cafe', 'food', 'town', 'logistics',
]

/** Build the ordered chip list for a stop, in the canonical tag order. */
export function buildTags(st: Stop): TagChip[] {
  const codes = (st.tags || []).slice()
  if (st.finish && codes.indexOf('finish') < 0) codes.unshift('finish')
  return tagOrder
    .filter((code) => codes.indexOf(code) >= 0)
    .map((code) => {
      const r = tagReg[code]
      return { label: r.glyph + r.label, ink: r.ink, bg: r.bg, bd: r.ink }
    })
}

/** A stop can be kept/maybe/cut only if it isn't a skip/finish stop on a non-home day. */
/** 100% WAW mode marking policy (riders' rule):
 *  LOCKED — official road segments ('waw'), Signature Points (tag 's'),
 *  transfers, skip/finish rows. Everything else is reviewable Keep/Maybe/Cut:
 *  cutting an on-route stop never removes its road (that's the Way) — it just
 *  means ride past without stopping. */
export function isMarkable(day: { phase: string }, st: Stop): boolean {
  if (st.skip || st.finish || day.phase === 'home') return false
  if (st.kind === 'waw' || st.kind === 'transfer') return false
  if ((st.tags || []).indexOf('s') >= 0) return false
  return true
}

export interface ReasonMeta {
  verb: string
  ink: string
  bg: string
}

/** Postbox reasons → verb + colours. */
export const reasonMeta: Record<string, ReasonMeta> = {
  Recommendation: { verb: 'recommends', ink: '#a8412a', bg: '#f4e4d9' },
  Comment: { verb: 'says', ink: '#55643a', bg: '#eef0e0' },
  Question: { verb: 'asks', ink: '#305a68', bg: '#e6ecec' },
  Feedback: { verb: 'reckons', ink: '#9a7b1e', bg: '#f4edd8' },
  Hello: { verb: 'says hi', ink: '#7a5230', bg: '#efe6d6' },
}

export const reasonList = ['Recommendation', 'Comment', 'Question', 'Feedback', 'Hello']

/** Journal event kinds → label + colours. */
export const jKindMeta: Record<string, { label: string; ink: string; bg: string }> = {
  loc: { label: 'Here', ink: '#a8412a', bg: '#f4e4d9' },
  post: { label: 'Postbox', ink: '#55643a', bg: '#eef0e0' },
  bag: { label: 'Signature', ink: '#9a7b1e', bg: '#f4edd8' },
  note: { label: 'Our note', ink: '#305a68', bg: '#e6ecec' },
}

/** Journal note tag options (composer dropdown). */
export const jTagOptions = [
  'Road', 'Attractions', 'Update', 'Thought', 'Feeling', 'Action',
  'Key Event', 'Milestone', 'Oh Fuck! Moment', 'Other',
]
