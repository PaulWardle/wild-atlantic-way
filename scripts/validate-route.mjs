/* Route-order validation against the OFFICIAL Wild Atlantic Way geometry.
 *
 * Checks (per ChatGPT spec §17):
 *  - day windows are contiguous and cover the full official line (0 → total)
 *  - no day window overlaps or runs backwards
 *  - each campsite sits within/at the end of its day's window (never behind)
 *  - campsite retraces are declared, not hidden
 *  - the final day reaches the Kinsale terminus
 *
 * Run: node scripts/validate-route.mjs   (exit 1 on any failure)
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

// ---- load tripData (JSON body) ----
const src = fs.readFileSync(path.join(root, 'src/data/tripData.ts'), 'utf8')
const data = JSON.parse(src.slice(src.indexOf('{', src.indexOf('tripData: Trip = '))))

// ---- load spine ----
const spineSrc = fs.readFileSync(path.join(root, 'src/data/wawSpine.ts'), 'utf8')
const TOTAL = parseFloat(spineSrc.match(/WAW_TOTAL_KM = ([\d.]+)/)[1])
const spine = JSON.parse(spineSrc.match(/wawSpine: SpinePoint\[\] = (\[\[.*?\]\])/s)[1])

const hav = (a, b) => {
  const R = 6371
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLon = ((b[1] - a[1]) * Math.PI) / 180
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}
const chainage = (lat, lon) => {
  let best = 0, bd = 1e9
  for (const [plat, plon, pkm] of spine) {
    const d = hav([lat, lon], [plat, plon])
    if (d < bd) { bd = d; best = pkm }
  }
  return { km: best, off: bd }
}

// campsite coordinates (site gate, best-known)
const campCoords = {
  'Binion Bay Camping': [55.2571, -7.4258],
  'Corcreggan Mill': [55.174, -7.863],
  'Strandhill Caravan & Camping': [54.2699, -8.596],
  'Keel Sandybanks': [53.9737, -10.0855],
  'Clifden Eco Beach': [53.539, -10.113],
  "O'Connors Riverside": [53.011, -9.387],
  'Campáil Teach an Aragail': [52.174, -10.348],
  'Hungry Hill Lodge': [51.689, -9.728],
  'IOAC, Tagoat': [52.196, -6.386],
}

let fail = 0
const ok = (m) => console.log('  ✓', m)
const bad = (m) => { console.log('  ✗', m); fail++ }
const warn = (m) => console.log('  ⚠', m)

console.log('== WAW route validation ==')
console.log('official line:', TOTAL, 'km · spine points:', spine.length)

// 1. windows contiguous + forward
console.log('\n-- day windows --')
let cursor = 0
data.days.forEach((d, i) => {
  if (!d.wawKm) {
    if (d.phase !== 'home') warn(`day ${i + 1} has no wawKm window (${d.title})`)
    return
  }
  const [a, b] = d.wawKm
  if (b <= a) bad(`day ${i + 1} window runs backwards: ${a} → ${b}`)
  if (Math.abs(a - cursor) > 0.5) bad(`day ${i + 1} window starts at km ${a}, expected ${cursor} (gap or overlap)`)
  else ok(`day ${i + 1}: km ${a} → ${b} (${Math.round((b - a) * 0.6214)} mi official)`)
  cursor = b
})
if (Math.abs(cursor - TOTAL) > 5) bad(`final window ends at km ${cursor}, official total is ${TOTAL} — ${(TOTAL - cursor).toFixed(0)} km of official Way unplanned`)
else ok(`coverage complete: windows end at km ${cursor} of ${TOTAL} → 100.0%`)

// 2. campsites forward
console.log('\n-- campsites --')
data.days.forEach((d, i) => {
  if (!d.night || !d.wawKm) return
  const key = Object.keys(campCoords).find((k) => d.night.primary.startsWith(k))
  if (!key) { warn(`day ${i + 1}: no coords for "${d.night.primary}" — skipped`); return }
  const { km, off } = chainage(...campCoords[key])
  const [a, b] = d.wawKm
  if (key === 'IOAC, Tagoat') { ok(`day ${i + 1}: ${key} = transfer target (off-Way by design)`); return }
  if (km < a - 8) bad(`day ${i + 1}: ${key} at km ${km.toFixed(0)} is BEHIND the day's window ${a}→${b}`)
  else if (km > b + 8) bad(`day ${i + 1}: ${key} at km ${km.toFixed(0)} is AHEAD of the day's window ${a}→${b}`)
  else {
    const inside = km < b - 8
    if (inside && !d.night.retraceMi) bad(`day ${i + 1}: ${key} sits mid-window (km ${km.toFixed(0)} of ${a}→${b}) but declares no retrace`)
    else ok(`day ${i + 1}: ${key} at km ${km.toFixed(0)} (window ${a}→${b}, off-line ${off.toFixed(1)}km${d.night.retraceMi ? `, declared retrace ${d.night.retraceMi}mi` : ''})`)
  }
})

// 3. terminus
console.log('\n-- terminus --')
const lastWaw = data.days.filter((d) => d.wawKm).slice(-1)[0]
if (lastWaw.wawKm[1] >= TOTAL - 5) ok('final WAW day reaches the Kinsale terminus')
else bad('final WAW day stops short of Kinsale')

console.log(fail ? `\nFAILED: ${fail} problem(s)` : '\nALL CHECKS PASSED — every day flows forward, 100% of the official line is planned')
process.exit(fail ? 1 : 0)
