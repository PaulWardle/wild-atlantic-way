import { useMemo } from 'react'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { journey } from '../data/journey'
import { computeMapGeometry, type CurrentPos, type MapGeometry } from '../lib/geo'

export interface MapState {
  geo: MapGeometry
  curLabel: string
  liveActive: boolean
}

/** Current map geometry derived from the latest location ping (exact GPS when
 * available, otherwise the nearest journey stop). */
export function useMap(): MapState {
  const { store } = useStore()
  const updates = store.updates || []
  const u = updates.length ? updates[0] : null

  const stop = u ? journey[Math.max(0, Math.min(journey.length - 1, u.si | 0))] : null
  const current: CurrentPos | null = u
    ? u.lat != null && u.lon != null
      ? { lat: u.lat, lon: u.lon }
      : stop
        ? { lat: stop.lat, lon: stop.lon }
        : null
    : null
  const curLabel = u ? u.place || stop?.label || '' : ''

  const geo = useMemo(() => computeMapGeometry(tripData, current), [current?.lat, current?.lon])

  return { geo, curLabel, liveActive: updates.length > 0 }
}
