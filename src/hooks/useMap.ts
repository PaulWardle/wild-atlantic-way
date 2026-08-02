import { useMemo } from 'react'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { journey } from '../data/journey'
import { isInIreland } from '../lib/geocode'
import { chainageOf, WAW_TOTAL_KM } from '../data/wawSpine'
import { computeMapGeometry, type CurrentPos, type MapGeometry } from '../lib/geo'

export interface MapState {
  geo: MapGeometry
  curLabel: string
  liveActive: boolean
  /** Official-route completion (0..100, one decimal) at the latest live position — null pre-Way. */
  wawPct: number | null
}

/** Current map geometry derived from the latest location ping (exact GPS when
 * available, otherwise the nearest journey stop). */
export function useMap(): MapState {
  const { store } = useStore()
  const updates = store.updates || []
  const u = updates.length ? updates[0] : null

  const stop = u ? journey[Math.max(0, Math.min(journey.length - 1, u.si | 0))] : null
  // Latest ping with coordinates that are actually IN Ireland — the Aug 19
  // ferry-home ping (Irish Sea) must not blank a completed trip's map.
  const inIE = updates.find((x) => x.lat != null && x.lon != null && isInIreland(x.lat as number, x.lon as number))
  const exact = u && u.lat != null && u.lon != null ? { lat: u.lat, lon: u.lon } : null
  // A fix that's off the route / outside Ireland gets a label but no map dot —
  // plotting it on the Ireland map would be misleading.
  const current: CurrentPos | null = exact
    ? isInIreland(exact.lat, exact.lon)
      ? exact
      : inIE
        ? { lat: inIE.lat as number, lon: inIE.lon as number }
        : null
    : stop
      ? { lat: stop.lat, lon: stop.lon }
      : null
  const curLabel = u ? u.place || stop?.label || '' : ''

  const geo = useMemo(() => computeMapGeometry(tripData, current), [current?.lat, current?.lon])

  // Official completion — only meaningful once on the Way (post-Muff, in
  // Ireland) AND near the line: an overnight detour to Killarney would
  // otherwise print a confident % from whichever branch is crow-nearest.
  const onWay = current && u && journey[Math.max(0, Math.min(journey.length - 1, u.si | 0))]?.phase === 'waw'
  let wawPct: number | null = null
  if (onWay) {
    const { km, offKm } = chainageOf(current.lat, current.lon)
    if (offKm <= 8) wawPct = Math.round((km / WAW_TOTAL_KM) * 1000) / 10
  }

  return { geo, curLabel, liveActive: updates.length > 0, wawPct }
}
