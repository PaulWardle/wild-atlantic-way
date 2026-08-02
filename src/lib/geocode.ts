import { journey } from '../data/journey'

/** Rough "is this on the island of Ireland" box — used to spot a live position
 *  that's off the route / not in Ireland so the map doesn't plot it misleadingly. */
export function isInIreland(lat: number, lon: number): boolean {
  return lat >= 51.2 && lat <= 55.6 && lon >= -11.0 && lon <= -5.2
}

/** Nearest journey stop index to a lat/lon (longitude compressed by cos(lat)). */
export function nearestJourneyIndex(lat: number, lon: number): number {
  const cos = Math.cos((lat * Math.PI) / 180)
  let best = 0
  let bd = Infinity
  for (let i = 0; i < journey.length; i++) {
    const dlat = journey[i].lat - lat
    const dlon = (journey[i].lon - lon) * cos
    const d = dlat * dlat + dlon * dlon
    if (d < bd) {
      bd = d
      best = i
    }
  }
  return best
}

/**
 * Reverse-geocode a GPS position to a friendly place name (town/locality), so the
 * app shows "Sneem" rather than raw coordinates. Uses BigDataCloud's free,
 * key-less client endpoint; falls back to null (caller then uses the nearest
 * journey stop name). Trims to locality + county where available.
 */
export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat.toFixed(3)}&longitude=${lon.toFixed(3)}&localityLanguage=en`
    const r = await fetch(url)
    if (!r.ok) return null
    const j = (await r.json()) as {
      locality?: string
      city?: string
      principalSubdivision?: string
      countryName?: string
    }
    const town = j.locality || j.city || ''
    const county = j.principalSubdivision || ''
    if (town && county && town !== county) return `${town}, ${county.replace(/^County\s+/i, '')}`
    return town || county || j.countryName || null
  } catch {
    return null
  }
}
