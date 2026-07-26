import { useEffect, useState } from 'react'
import { useStore } from '../store/StoreProvider'
import { tripData } from '../data/tripData'
import { fetchForecast, type Forecast } from '../lib/weather'

export interface WeatherSpot {
  place: string
  lat: number
  lon: number
  forecast: Forecast | null
}

export interface WeatherState {
  today: WeatherSpot | null
  tomorrow: WeatherSpot | null
  loading: boolean
  /** true once a fetch has been attempted (so we can distinguish "no data yet"). */
  tried: boolean
}

/** Which trip day we're on: 0 before/at departure, clamped to the last day. */
function currentDayIndex(): number {
  const route = tripData.route
  try {
    const depart = new Date(tripData.meta.depart + 'T00:00:00').getTime()
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    const idx = Math.floor((today - depart) / 86400000)
    return Math.max(0, Math.min(route.length - 1, idx))
  } catch {
    return 0
  }
}

/** Today's forecast at wherever the brothers are (live GPS, else the day's
 * itinerary area) + tomorrow's forecast at the next planned area. */
export function useWeather(): WeatherState {
  const { store } = useStore()
  const route = tripData.route
  const u = (store.updates || [])[0]

  const dayIdx = currentDayIndex()
  const todayRoute = route[dayIdx] || route[0]
  const tomorrowRoute = route[Math.min(route.length - 1, dayIdx + 1)] || todayRoute

  // Today: the live ping if it carries coords, otherwise the itinerary area.
  const liveHere = u && u.lat != null && u.lon != null
  const todayLat = liveHere ? (u.lat as number) : todayRoute.lat
  const todayLon = liveHere ? (u.lon as number) : todayRoute.lon
  const todayPlace = liveHere ? u.place || todayRoute.area : todayRoute.area

  const tomorrowLat = tomorrowRoute.lat
  const tomorrowLon = tomorrowRoute.lon
  const tomorrowPlace = tomorrowRoute.area

  const [state, setState] = useState<WeatherState>({ today: null, tomorrow: null, loading: true, tried: false })

  // Key the effect on the rounded coordinates so it only refetches on a real move.
  const key = `${todayLat.toFixed(2)},${todayLon.toFixed(2)}|${tomorrowLat.toFixed(2)},${tomorrowLon.toFixed(2)}`

  useEffect(() => {
    let alive = true
    setState((s) => ({ ...s, loading: true }))

    const load = () => {
      Promise.all([fetchForecast(todayLat, todayLon), fetchForecast(tomorrowLat, tomorrowLon)]).then(
        ([t, tm]) => {
          if (!alive) return
          setState({
            today: { place: todayPlace, lat: todayLat, lon: todayLon, forecast: t },
            tomorrow: { place: tomorrowPlace, lat: tomorrowLat, lon: tomorrowLon, forecast: tm },
            loading: false,
            tried: true,
          })
        },
      )
    }
    load()

    // Refresh when connectivity returns.
    const onOnline = () => load()
    window.addEventListener('online', onOnline)
    return () => {
      alive = false
      window.removeEventListener('online', onOnline)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  return state
}
