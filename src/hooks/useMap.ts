import { useMemo } from 'react'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { computeMapGeometry, currentStop, type MapGeometry } from '../lib/geo'
import type { JourneyStop } from '../data/journey'

export interface MapState {
  geo: MapGeometry
  curStop: JourneyStop | null
  liveActive: boolean
}

/** Current map geometry derived from the latest location ping. */
export function useMap(): MapState {
  const { store } = useStore()
  const updates = store.updates || []
  const si = updates.length ? updates[0].si : null
  const geo = useMemo(() => computeMapGeometry(tripData, si), [si])
  const cur = currentStop(si ?? undefined)
  return { geo, curStop: cur ? cur.stop : null, liveActive: updates.length > 0 }
}
