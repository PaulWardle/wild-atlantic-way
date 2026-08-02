import { pad2 } from './time'

export interface CountdownParts {
  days: number
  hrs: string
  mins: string
  secs: string
}

/** Live D/H/M/S until departure (clamped at zero). */
export function countdownParts(departIso: string, nowTs: number): CountdownParts {
  let departMs = 0
  try {
    departMs = new Date(departIso + 'T00:00:00').getTime()
  } catch {
    departMs = 0
  }
  const diff = Math.max(0, departMs - nowTs)
  return {
    days: Math.floor(diff / 86400000),
    hrs: pad2(Math.floor((diff % 86400000) / 3600000)),
    mins: pad2(Math.floor((diff % 3600000) / 60000)),
    secs: pad2(Math.floor((diff % 60000) / 1000)),
  }
}

/** Whole days-to-go, rounded up (the Home countdown card). */
export function daysToGo(departIso: string, now: number = Date.now()): number {
  try {
    return Math.max(0, Math.ceil((new Date(departIso + 'T00:00:00').getTime() - now) / 86400000))
  } catch {
    return 0
  }
}
