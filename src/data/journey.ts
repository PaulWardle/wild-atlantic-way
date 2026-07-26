/* The journey as an ordered sequence of stops, in the order the brothers actually
 * ride them (Larne ferry → up to Malin → down the whole Atlantic coast → Kinsale).
 *
 * This single ordered list drives:
 *  - the "we are here" dropdown (so it reads in trip order, not alphabetically/by latitude)
 *  - the live pin position (Update.si indexes into this list)
 *  - the green "completed so far" progress along the route
 *
 * `phase: 'lead'` = the pre-WAW lead-in (Isle-of-Man ferry landing across the border);
 * `phase: 'waw'`  = the official Wild Atlantic Way from Malin Head onwards.
 */
export interface JourneyStop {
  label: string
  lat: number
  lon: number
  phase: 'lead' | 'waw'
}

export const journey: JourneyStop[] = [
  { label: 'Larne (ferry in)', lat: 54.85, lon: -5.81, phase: 'lead' },
  { label: 'Antrim Coast', lat: 55.2, lon: -6.1, phase: 'lead' },
  { label: 'Torr Head', lat: 55.2, lon: -6.06, phase: 'lead' },
  { label: 'Muff', lat: 55.07, lon: -7.27, phase: 'waw' },
  { label: 'Culdaff', lat: 55.29, lon: -7.16, phase: 'waw' },
  { label: 'Malin Head', lat: 55.38, lon: -7.37, phase: 'waw' },
  { label: 'Fanad Head', lat: 55.28, lon: -7.64, phase: 'waw' },
  { label: 'Dunfanaghy', lat: 55.18, lon: -7.98, phase: 'waw' },
  { label: 'Bloody Foreland', lat: 55.14, lon: -8.29, phase: 'waw' },
  { label: 'Ardara', lat: 54.77, lon: -8.41, phase: 'waw' },
  { label: 'Slieve League', lat: 54.63, lon: -8.66, phase: 'waw' },
  { label: 'Killybegs', lat: 54.63, lon: -8.45, phase: 'waw' },
  { label: 'Mullaghmore', lat: 54.47, lon: -8.45, phase: 'waw' },
  { label: 'Strandhill / Sligo', lat: 54.27, lon: -8.62, phase: 'waw' },
  { label: 'Ballina', lat: 54.12, lon: -9.16, phase: 'waw' },
  { label: 'Downpatrick Head', lat: 54.3, lon: -9.35, phase: 'waw' },
  { label: 'Belmullet / Erris', lat: 54.22, lon: -10.0, phase: 'waw' },
  { label: 'Keem Bay (Achill)', lat: 53.97, lon: -10.2, phase: 'waw' },
  { label: 'Westport', lat: 53.8, lon: -9.52, phase: 'waw' },
  { label: 'Killary Harbour', lat: 53.63, lon: -9.88, phase: 'waw' },
  { label: 'Clifden', lat: 53.49, lon: -10.02, phase: 'waw' },
  { label: 'Roundstone', lat: 53.38, lon: -9.92, phase: 'waw' },
  { label: 'Galway', lat: 53.27, lon: -9.05, phase: 'waw' },
  { label: 'Doolin', lat: 53.01, lon: -9.38, phase: 'waw' },
  { label: 'Cliffs of Moher', lat: 52.94, lon: -9.44, phase: 'waw' },
  { label: 'Loop Head', lat: 52.56, lon: -9.93, phase: 'waw' },
  { label: 'Dingle', lat: 52.14, lon: -10.27, phase: 'waw' },
  { label: 'Slea Head', lat: 52.1, lon: -10.45, phase: 'waw' },
  { label: 'Valentia (Bray Head)', lat: 51.88, lon: -10.34, phase: 'waw' },
  { label: 'Caherdaniel', lat: 51.77, lon: -10.1, phase: 'waw' },
  { label: 'Kenmare', lat: 51.88, lon: -9.58, phase: 'waw' },
  { label: 'Dursey Sound', lat: 51.61, lon: -10.14, phase: 'waw' },
  { label: 'Castletownbere', lat: 51.65, lon: -9.91, phase: 'waw' },
  { label: 'Healy Pass (Beara)', lat: 51.73, lon: -9.8, phase: 'waw' },
  { label: 'Bantry', lat: 51.68, lon: -9.45, phase: 'waw' },
  { label: 'Mizen Head', lat: 51.45, lon: -9.8, phase: 'waw' },
  { label: 'Clonakilty', lat: 51.62, lon: -8.87, phase: 'waw' },
  { label: 'Old Head of Kinsale', lat: 51.6, lon: -8.53, phase: 'waw' },
  { label: 'Kinsale — the finish', lat: 51.71, lon: -8.52, phase: 'waw' },
]

/** Signature-15 ids keyed by the journey label they correspond to (for the
 * "you're here ↔ bag this Signature spot" cross-link). */
export const journeyToSig: Record<string, string> = {
  'Malin Head': 's1',
  'Fanad Head': 's2',
  'Slieve League': 's3',
  'Mullaghmore': 's4',
  'Downpatrick Head': 's5',
  'Keem Bay (Achill)': 's6',
  'Killary Harbour': 's7',
  'Clifden': 's8',
  'Cliffs of Moher': 's9',
  'Loop Head': 's10',
  'Slea Head': 's11',
  'Valentia (Bray Head)': 's12',
  'Dursey Sound': 's13',
  'Mizen Head': 's14',
  'Old Head of Kinsale': 's15',
}
