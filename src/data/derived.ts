/* Derived-once data from the static trip content. */
import { tripData } from './tripData'
import { buildTrackStops } from '../lib/geo'

/** North→south ordered, de-duped named points a "we are here" ping indexes into. */
export const trackStops = buildTrackStops(tripData)
