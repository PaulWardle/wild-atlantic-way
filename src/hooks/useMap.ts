import { useMemo } from 'react'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { journey } from '../data/journey'
import { isInIreland } from '../lib/geocode'
import { completionAt } from '../data/wawSpine'
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
  const exact = u && u.lat != null && u.lon != null ? { lat: u.lat, lon: u.lon } : null
  // A fix that's off the route / outside Ireland gets a label but no map dot —
  // plotting it on the Ireland map would be misleading.
  const current: CurrentPos | null = exact
    ? isInIreland(exact.lat, exact.lon)
      ? exact
      : null
    : stop
      ? { lat: stop.lat, lon: stop.lon }
      : null
  const curLabel = u ? u.place || stop?.label || '' : ''

  const geo = useMemo(() => computeMapGeometry(tripData, current), [current?.lat, current?.lon])

  // Official completion — only meaningful once on the Way (post-Muff, in Ireland).
  const onWay = current && u && journey[Math.max(0, Math.min(journey.length - 1, u.si | 0))]?.phase === 'waw'
  const wawPct = onWay ? Math.round(completionAt(current.lat, current.lon) * 1000) / 10 : null

  return { geo, curLabel, liveActive: updates.length > 0, wawPct }
}
