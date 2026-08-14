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
const rawSpine = JSON.parse(spineSrc.match(/wawSpine: SpinePoint\[\] = (\[\[.*?\]\])/s)[1])

const hav = (a, b) => {
  const R = 6371
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLon = ((b[1] - a[1]) * Math.PI) / 180
  const s = Math.sin(dLat / 2) ** 2 + Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

// Same artifact filter as the app's `cleanedSpine` (wawSpine.ts): drop a point
// only when it sits implausibly far from BOTH raw neighbours for its chainage
// gap. Validating against the raw spine would let a mis-stitched point mask a
// genuinely off-line stop (or vice versa).
const spine = rawSpine.filter((p, i) => {
  const far = (a, b) => hav(a, b) > Math.abs(b[2] - a[2]) + 4
  const prev = rawSpine[i - 1]
  const next = rawSpine[i + 1]
  if (prev && next) return !(far(prev, p) && far(p, next))
  return prev ? !far(prev, p) : !far(p, next)
})
const chainage = (lat, lon) => {
  let best = 0, bd = 1e9
  for (const [plat, plon, pkm] of spine) {
    const d = hav([lat, lon], [plat, plon])
    if (d < bd) { bd = d; best = pkm }
  }
  return { km: best, off: bd }
}

// Nearest point of ONE DAY'S stretch of line. Near towns two branches of the
// route can pass close together (e.g. Clifden), so the globally nearest spine
// point may belong to another day — the camp gate must measure against the
// day's own window.
const chainageWithin = (lat, lon, a, b) => {
  let best = a, bd = 1e9
  for (const [plat, plon, pkm] of spine) {
    if (pkm < a - 8 || pkm > b + 8) continue
    const d = hav([lat, lon], [plat, plon])
    if (d < bd) { bd = d; best = pkm }
  }
  return { km: best, off: bd }
}

// Campsite coordinates live in tripData.campsites (lat/lon) — one source of
// truth shared with the in-app Google Maps navigation.

let fail = 0
const ok = (m) => console.log('  ✓', m)
const bad = (m) => { console.log('  ✗', m); fail++ }
const warn = (m) => console.log('  ⚠', m)

console.log('== WAW route validation ==')
console.log('official line:', TOTAL, 'km · spine points:', spine.length)

// 0. spine continuity — the gate that would have caught the 2026-08 corruption.
// A road can NEVER be shorter than the crow-flies line, so for every
// consecutive pair the crow distance must not exceed the chainage gap, within
// small slack (+4 km for short sampling gaps; ×1.15+2 for long ones, since
// official-km anchoring can mildly compress the ladder). Displaced blocks and
// open-water seams run far beyond this and fail loudly.
console.log('\n-- spine continuity --')
{
  let seams = 0
  for (let i = 1; i < spine.length; i++) {
    const gap = spine[i][2] - spine[i - 1][2]
    const crow = hav([spine[i - 1][0], spine[i - 1][1]], [spine[i][0], spine[i][1]])
    if (gap <= 0) { bad(`spine chainage not increasing at km ${spine[i - 1][2]}`); seams++ }
    else if (gap <= 6 ? crow > gap + 4 : crow > gap * 1.15 + 2) { bad(`impossible seam km ${spine[i - 1][2]}→${spine[i][2]}: ${crow.toFixed(1)}km crow over ${gap.toFixed(1)}km of road`); seams++ }
  }
  if (!seams) ok(`all ${spine.length - 1} consecutive pairs physically plausible (road can never be shorter than crow)`)
}

// 0b. stop ordering — every located stop must sit on its day's stretch and the
// stops must map to non-decreasing chainage in itinerary order (small backward
// tolerance for out-and-back spur pairs).
console.log('\n-- stop ordering --')
{
  let stopFails = 0
  data.days.forEach((d, i) => {
    if (!d.wawKm) return
    const [a, b] = d.wawKm
    let prevKm = a - 8
    ;(d.stops || []).forEach((s) => {
      if (s.lat == null || s.lon == null || s.kind === 'extra') return
      const { km, off } = chainageWithin(s.lat, s.lon, a, b)
      if (off > 10) { bad(`day ${i + 1} stop "${s.n}" is ${off.toFixed(0)}km off the day's stretch`); stopFails++ }
      else if (km < prevKm - 8) { bad(`day ${i + 1} stop "${s.n}" at km ${km.toFixed(0)} is BEHIND the previous stop (km ${prevKm.toFixed(0)}) — route order broken`); stopFails++ }
      prevKm = Math.max(prevKm, km)
    })
  })
  if (!stopFails) ok('every located stop sits on its day’s stretch, in riding order')
}

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
  const cs = data.campsites[i]
  if (!cs || cs.lat == null || cs.lon == null) { bad(`day ${i + 1}: campsite "${d.night.primary}" has no lat/lon in tripData.campsites`); return }
  const key = cs.primary
  const [a, b] = d.wawKm
  if (key.startsWith('IOAC')) { ok(`day ${i + 1}: ${key} = transfer target (off-Way by design)`); return }
  const { km, off } = chainageWithin(cs.lat, cs.lon, a, b)
  if (off > 10) bad(`day ${i + 1}: ${key} is ${off.toFixed(0)}km off the day's stretch of line (${a}→${b}) — wrong day or wrong coords`)
  else if (km < a - 8) bad(`day ${i + 1}: ${key} at km ${km.toFixed(0)} is BEHIND the day's window ${a}→${b}`)
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

// 4. the Signature 15 must advertise the day they're ACTUALLY ridden. Moving
// the Friday camp to Spiddal shifted a day boundary and left Derrigimlagh
// telling the riders "Saturday" when it had become Friday — a checklist that
// lies about when you bag a point is worse than no checklist.
console.log('\n-- signature 15 day labels --')
const departMs = new Date(data.meta.depart + 'T00:00:00').getTime()
const dayLabel = (n) => {
  const dt = new Date(departMs + (n - 1) * 86400000)
  return dt.toDateString().slice(0, 3) + ' ' + dt.getDate()
}
let sigBad = 0
for (const sg of data.signature) {
  let di = -1
  data.days.forEach((dy, i) => (dy.stops || []).forEach((st) => { if (st.sid === sg.stop) di = i }))
  if (di < 0) { bad(`${sg.name}: stop "${sg.stop}" is not on any day`); sigBad++; continue }
  const wantDay = String(di + 1).padStart(2, '0')
  const wantDate = dayLabel(di + 1)
  if (sg.day !== wantDay || sg.date !== wantDate) {
    bad(`${sg.name}: says day ${sg.day} ${sg.date}, ridden day ${wantDay} ${wantDate}`)
    sigBad++
  }
}
if (!sigBad) ok(`all ${data.signature.length} signature points labelled with the day they're ridden`)

// 5. the mileage on each day card is what the riders plan their day around,
// so it must track the official window it's derived from. Moving a day
// boundary once left Saturday advertising Clifden-era miles.
console.log('\n-- day mileage vs official window --')
let milesBad = 0
for (const [x, dy] of data.days.entries()) {
  if (!dy.wawKm || !dy.miles) continue
  const nums = String(dy.miles).match(/\d+/g)
  if (!nums) continue
  // "~150mi (~75 transfer)": the transfer leg is off-Way, so take it back off
  const declared = +nums[0] - (/transfer/i.test(dy.miles) && nums[1] ? +nums[1] : 0)
  const official = Math.round((dy.wawKm[1] - dy.wawKm[0]) * 0.621371)
  const drift = Math.abs(declared - official) / official
  if (drift > 0.12) {
    bad(`day ${x + 1}: card says ${declared} official mi, window is ${official} mi (${Math.round(drift * 100)}% out)`)
    milesBad++
  }
}
if (!milesBad) ok('every day card’s mileage matches its official window')

console.log(fail ? `\nFAILED: ${fail} problem(s)` : '\nALL CHECKS PASSED — every day flows forward, 100% of the official line is planned')
process.exit(fail ? 1 : 0)
