/* Live day arithmetic for 100% WAW mode.
 *
 * Official window miles come from the day's [fromKm, toKm] on the official
 * line (wawSpine chainage) — locked, never reduced by any user choice.
 * Optional extras add their TRUE ROAD impact (exit→via→rejoin minus baseline)
 * according to their Keep / Maybe / Cut mark. Unmarked extras count as Maybe.
 * Estimated riding: coastal miles at 30 mph, transfer miles at 46 mph.
 */

import type { Day, Marks, Stop } from '../types'
import { WAW_TOTAL_KM } from '../data/wawSpine'
import { isMarkable } from './tags'

const KM_TO_MI = 0.621371

export interface DaySummary {
  wawMi: number
  transferMi: number
  keptMi: number
  maybeMi: number
  campDevMi: number
  plannedMi: number
  maxMi: number
  rideMin: number // planned riding minutes (without maybes)
  stopMin: number // planned stop minutes (without maybes)
  dayMin: number // planned door-to-door
  maxDayMin: number // with all maybes
  wawPctAfter: number // official completion after this day, 0..100
  hasWaw: boolean
}

export type ExtraMark = 'keep' | 'maybe' | 'cut'

/** The effective status of a markable stop. Defaults differ by cost:
 *  on-route stops (no road cost) default to KEEP — they're the plan;
 *  off-route extras (road cost) default to MAYBE — their miles are opted into. */
export function extraStatus(day: Day, di: number, si: number, st: Stop, marks: Marks): ExtraMark | null {
  if (!isMarkable(day, st)) return null
  const mk = marks['d' + di + 's' + si]
  if (mk === 'keep' || mk === 'maybe' || mk === 'cut') return mk
  return st.kind === 'extra' ? 'maybe' : 'keep'
}

export function summarizeDay(day: Day, di: number, marks: Marks): DaySummary {
  const wawMi = day.wawKm ? (day.wawKm[1] - day.wawKm[0]) * KM_TO_MI : 0
  const transferMi = day.transferMi || 0
  const campDevMi = (day.night?.deviationMi || 0) + (day.night?.retraceMi || 0)

  let keptMi = 0
  let maybeMi = 0
  let keptExtraMin = 0
  let maybeExtraMin = 0
  let stopMin = 0
  let maybeStopMin = 0

  day.stops.forEach((st, si) => {
    const status = extraStatus(day, di, si, st, marks)
    if (status === null) {
      // locked road / on-route stop / transfer: stop time always counts
      stopMin += st.stopMin || 0
      return
    }
    if (status === 'cut') return
    const mi = st.impactMi || 0
    const min = st.impactMin || 0
    if (status === 'keep') {
      keptMi += mi
      keptExtraMin += min
      stopMin += st.stopMin || 0
    } else {
      maybeMi += mi
      maybeExtraMin += min
      maybeStopMin += st.stopMin || 0
    }
  })

  const plannedMi = wawMi + transferMi + keptMi + campDevMi
  const maxMi = plannedMi + maybeMi
  // Riding time: official + camp deviation at 30 mph coastal, transfers at
  // 46 mph. Extras use their own impactMin (a Torr Head mile is not a 30 mph
  // mile), so their miles are deliberately NOT run through the blend.
  const rideMin = ((wawMi + campDevMi) / 30) * 60 + (transferMi / 46) * 60 + keptExtraMin
  const dayMin = rideMin + stopMin
  const maxDayMin = dayMin + maybeExtraMin + maybeStopMin

  return {
    wawMi: r1(wawMi),
    transferMi: r1(transferMi),
    keptMi: r1(keptMi),
    maybeMi: r1(maybeMi),
    campDevMi: r1(campDevMi),
    plannedMi: r1(plannedMi),
    maxMi: r1(maxMi),
    rideMin: Math.round(rideMin),
    stopMin: Math.round(stopMin),
    dayMin: Math.round(dayMin),
    maxDayMin: Math.round(maxDayMin),
    wawPctAfter: day.wawKm ? Math.round((day.wawKm[1] / WAW_TOTAL_KM) * 1000) / 10 : 0,
    hasWaw: !!day.wawKm,
  }
}

const r1 = (n: number) => Math.round(n * 10) / 10

export function fmtH(min: number): string {
  const h = Math.floor(min / 60)
  const m = Math.round(min % 60)
  return `${h}h ${String(m).padStart(2, '0')}m`
}
