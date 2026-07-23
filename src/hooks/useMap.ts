import { useMemo } from 'react'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { trackStops } from '../data/derived'
import { computeMapGeometry, currentStop, type MapGeometry, type TrackStop } from '../lib/geo'

export interface MapState {
  geo: MapGeometry
  curSt: TrackStop | null
  liveActive: boolean
}

/** Current map geometry derived from the latest location ping. */
export function useMap(): MapState {
  const { store } = useStore()
  const updates = store.updates || []
  const si = updates[0]?.si
  const curSt = currentStop(trackStops, si)
  const geo = useMemo(() => computeMapGeometry(tripData, curSt), [curSt])
  return { geo, curSt, liveActive: updates.length > 0 }
}
