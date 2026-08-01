/* Tidy a hand-typed kit item: trim, collapse spaces, fix common gear typos,
 * apply proper casings (iPad, USB, CO₂…), and sentence-case the first word.
 * The phone keyboard's own autocorrect (enabled on the input) catches general
 * spelling; this map covers the kit-specific words it tends to miss. */

const FIX: Record<string, string> = {
  // typos → correct
  waterproff: 'waterproof',
  waterprof: 'waterproof',
  batterys: 'batteries',
  battries: 'batteries',
  punture: 'puncture',
  puntcure: 'puncture',
  chian: 'chain',
  lub: 'lube',
  gass: 'gas',
  sleaping: 'sleeping',
  sleepin: 'sleeping',
  matress: 'mattress',
  mattres: 'mattress',
  pilow: 'pillow',
  towl: 'towel',
  sandles: 'sandals',
  glvoes: 'gloves',
  golves: 'gloves',
  cannister: 'canister',
  ibruprofen: 'ibuprofen',
  ibprofen: 'ibuprofen',
  sunscream: 'suncream',
  reppelent: 'repellent',
  repellant: 'repellent',
  midgee: 'midge',
  gaffa: 'gaffer',
  cabel: 'cable',
  bunjee: 'bungee',
  bungie: 'bungee',
  zippties: 'zip ties',
  powerbank: 'power bank',
  waterbottle: 'water bottle',
  hiviz: 'hi-vis',
  'hi-viz': 'hi-vis',
  torh: 'torch',
  tourch: 'torch',
  charing: 'charging',
  // proper casings
  ipad: 'iPad',
  iphone: 'iPhone',
  airpods: 'AirPods',
  usb: 'USB',
  gps: 'GPS',
  gopro: 'GoPro',
  co2: 'CO₂',
  sim: 'SIM',
  uk: 'UK',
  eu: 'EU',
  ghic: 'GHIC',
  suzuki: 'Suzuki',
  honda: 'Honda',
  yamaha: 'Yamaha',
  kawasaki: 'Kawasaki',
  bmw: 'BMW',
  ktm: 'KTM',
  triumph: 'Triumph',
  allen: 'Allen',
}

/** Words whose casing is dictated by the FIX table (don't sentence-case over them). */
const CASED = new Set(Object.values(FIX).filter((v) => /[A-Z]/.test(v)))

export function normalizeItem(raw: string): string {
  const words = raw.replace(/\s+/g, ' ').trim().split(' ')
  if (!words[0]) return ''
  const fixed = words.map((w) => {
    const bare = w.toLowerCase()
    return FIX[bare] ?? w
  })
  // Sentence-case the first word unless its casing is meaningful (iPad, USB…).
  if (!CASED.has(fixed[0])) {
    fixed[0] = fixed[0].charAt(0).toUpperCase() + fixed[0].slice(1)
  }
  return fixed.join(' ')
}
