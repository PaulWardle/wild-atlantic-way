/* Weather — a "proper" two-day forecast built from Open-Meteo (free, no key).
 *
 * We fetch the current conditions + a 2-day daily forecast for a given point.
 * The caller decides the points: TODAY at wherever the brothers actually are
 * (their live GPS ping, or the itinerary's area for the current day) and
 * TOMORROW at the next day's planned area from the itinerary.
 *
 * Results are cached in localStorage per rounded lat/lon so the last-known
 * forecast still shows with no signal (Open-Meteo is network-only through the
 * service worker) — flagged `stale` when it's older than the fresh window.
 */

export interface DayForecast {
  date: string // ISO yyyy-mm-dd (Europe/Dublin)
  code: number // WMO weather code
  tMax: number
  tMin: number
  precip: number // max precipitation probability, %
  wind: number // max wind, mph
  /** Max gust, mph — what actually shoves a bike around. Absent on stale pre-update caches. */
  gust?: number
  /** Dominant wind direction, degrees the wind blows FROM. */
  windDir?: number
}

export interface CurrentForecast {
  temp: number
  code: number
  wind: number
  isDay: boolean
  gust?: number
  windDir?: number
}

export interface Forecast {
  current: CurrentForecast
  days: DayForecast[] // [today, tomorrow]
  fetchedAt: number
  stale: boolean
}

const FRESH_MS = 30 * 60 * 1000 // 30 min
const CACHE_PREFIX = 'waw:wx:'

function keyFor(lat: number, lon: number): string {
  // ~0.1° buckets (~11 km) — plenty for a regional forecast, and keeps the
  // cache from exploding as the live position drifts.
  return CACHE_PREFIX + lat.toFixed(1) + ',' + lon.toFixed(1)
}

function readCache(key: string): Forecast | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    return JSON.parse(raw) as Forecast
  } catch {
    return null
  }
}

function writeCache(key: string, f: Forecast) {
  try {
    localStorage.setItem(key, JSON.stringify(f))
  } catch {
    /* quota — not fatal */
  }
}

/** Fetch (or serve cached) a current + 2-day forecast for a point. */
export async function fetchForecast(lat: number, lon: number): Promise<Forecast | null> {
  const key = keyFor(lat, lon)
  const cached = readCache(key)
  if (cached && Date.now() - cached.fetchedAt < FRESH_MS) {
    return { ...cached, stale: false }
  }

  const url =
    'https://api.open-meteo.com/v1/forecast' +
    `?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}` +
    '&current=temperature_2m,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m,is_day' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant' +
    '&timezone=Europe%2FDublin&forecast_days=2&temperature_unit=celsius&wind_speed_unit=mph'

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(String(res.status))
    const j = await res.json()
    const d = j.daily || {}
    const c = j.current || {}
    const days: DayForecast[] = (d.time || []).map((date: string, i: number) => ({
      date,
      code: d.weather_code?.[i] ?? 0,
      tMax: Math.round(d.temperature_2m_max?.[i] ?? 0),
      tMin: Math.round(d.temperature_2m_min?.[i] ?? 0),
      precip: Math.round(d.precipitation_probability_max?.[i] ?? 0),
      wind: Math.round(d.wind_speed_10m_max?.[i] ?? 0),
      gust: d.wind_gusts_10m_max?.[i] != null ? Math.round(d.wind_gusts_10m_max[i]) : undefined,
      windDir: d.wind_direction_10m_dominant?.[i] != null ? Math.round(d.wind_direction_10m_dominant[i]) : undefined,
    }))
    const forecast: Forecast = {
      current: {
        temp: Math.round(c.temperature_2m ?? days[0]?.tMax ?? 0),
        code: c.weather_code ?? days[0]?.code ?? 0,
        wind: Math.round(c.wind_speed_10m ?? 0),
        isDay: (c.is_day ?? 1) === 1,
        gust: c.wind_gusts_10m != null ? Math.round(c.wind_gusts_10m) : undefined,
        windDir: c.wind_direction_10m != null ? Math.round(c.wind_direction_10m) : undefined,
      },
      days,
      fetchedAt: Date.now(),
      stale: false,
    }
    writeCache(key, forecast)
    return forecast
  } catch {
    // Offline / API down — fall back to the last cached forecast, flagged stale.
    if (cached) return { ...cached, stale: true }
    return null
  }
}

/** Compass point for a degrees-from-north direction. */
export function compass(deg: number): string {
  return ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(deg / 45) % 8]
}

/** Wind vs the day's direction of travel. `windFrom` is where the wind blows
 * FROM; `heading` is the way the bikes point. A crosswind is the one that
 * shoves you across the lane — worse on a bike than the same speed on the nose. */
export function windVsRide(windFrom: number, heading: number): 'headwind' | 'tailwind' | 'crosswind' {
  const rel = Math.abs((((windFrom - heading) % 360) + 540) % 360 - 180) // 0 = on the nose, 180 = behind
  if (rel <= 50) return 'headwind'
  if (rel >= 130) return 'tailwind'
  return 'crosswind'
}

/** WMO weather code → a short label + one of our icon keys. */
export type WxIcon = 'sun' | 'partly' | 'cloud' | 'fog' | 'drizzle' | 'rain' | 'showers' | 'snow' | 'thunder'

export function wxInfo(code: number): { label: string; icon: WxIcon } {
  if (code === 0) return { label: 'Clear', icon: 'sun' }
  if (code === 1) return { label: 'Mainly clear', icon: 'sun' }
  if (code === 2) return { label: 'Partly cloudy', icon: 'partly' }
  if (code === 3) return { label: 'Overcast', icon: 'cloud' }
  if (code === 45 || code === 48) return { label: 'Fog', icon: 'fog' }
  if (code >= 51 && code <= 57) return { label: 'Drizzle', icon: 'drizzle' }
  if (code >= 61 && code <= 65) return { label: 'Rain', icon: 'rain' }
  if (code === 66 || code === 67) return { label: 'Freezing rain', icon: 'rain' }
  if (code >= 71 && code <= 77) return { label: 'Snow', icon: 'snow' }
  if (code >= 80 && code <= 82) return { label: 'Showers', icon: 'showers' }
  if (code === 85 || code === 86) return { label: 'Snow showers', icon: 'snow' }
  if (code >= 95) return { label: 'Thunderstorms', icon: 'thunder' }
  return { label: 'Cloudy', icon: 'cloud' }
}
