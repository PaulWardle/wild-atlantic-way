/* Relative + absolute time formatting, ported from the original. */

/** "just now" / "5m ago" / "3h ago" / "2d ago" / "on 14 Aug". */
export function relTime(ts: number | undefined, now: number = Date.now()): string {
  if (!ts) return ''
  const d = now - ts
  const m = Math.floor(d / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return m + 'm ago'
  const h = Math.floor(m / 60)
  if (h < 24) return h + 'h ago'
  const dy = Math.floor(h / 24)
  if (dy < 7) return dy + 'd ago'
  try {
    return 'on ' + new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  } catch {
    return dy + 'd ago'
  }
}

/** "Thu, 14 Aug". */
export function fmtDate(ms: number): string {
  try {
    return new Date(ms).toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    })
  } catch {
    return ''
  }
}

/** "14:30". */
export function fmtTime(ms: number): string {
  try {
    return new Date(ms).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

export const pad2 = (n: number): string => (n < 10 ? '0' : '') + n

/** Local day key "YYYY-M-D" (used to group journal events by calendar day). */
export function dayKey(ms: number): string {
  const d = new Date(ms)
  return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate()
}
