# WILD ATLANTIC WAY 2026 — FULL EXPORT FOR CROSS-REFERENCE
Generated 26 Jul 2026 directly from the app's live data (single source of truth) + the official Fáilte Ireland KML.

**Trip:** Mon 10 – Wed 19 Aug 2026 · 2 riders · Larne in (Steam Packet, lands 14:15 Mon) · Rosslare→Fishguard out (Stena 08:15 Wed, port 07:15) · both crossings BOOKED · night 1 BOOKED (Binion Bay, Clonmany).
**Mode:** 100% WAW — the official line (2506.8 km Muff→Kinsale) is locked; a build-time validator proves the nine day-windows are contiguous, cover 100.0%, and every campsite sits forward.

---

## PART 1 — METHOD (how to audit this)
1. The official route geometry comes from Fáilte Ireland's own KML (job ref FI-144804-WAW-0523, June 2023): 407 route segments (2,510 km total), 187 Discovery Points + 15 Signature Discovery Points + start/end markers.
2. The segments were stitched into one south-bound line using the KML's own Discovery-Point document order as the ordering discipline → a 2,506.8 km spine, with every point snapped to a distance-along-route ("km mark", Muff = km 0).
3. Every itinerary day is a window [fromKm → toKm] on that line. Windows are contiguous (each starts where the last ended) and total 0 → 2,506.8 = 100.0%.
4. Campsites/waypoints were snapped to the line to verify forward order. Anything that repeats road is DECLARED (see Gallarus).
5. Optional-extra road impacts are manual road estimates (exit → via → rejoin minus the official baseline), flagged "est" — to be re-verified in Google Maps pre-trip. None are crow-flies. None are invented; anything unmeasured would read "not yet calculated".

## PART 2 — THE DECISION LOG (what was decided, why, and what was rejected)

**D1. Ride south, Muff → Kinsale**
The official start/end markers are at Muff and Kinsale. Southbound puts the fixed Larne landing at the correct end and finishes 130mi from the booked boat. No alternative considered viable.

**D2. Day 1 LOCKED: Larne → Muff → Stroove/the Warren → Farren's → Malin Head → Binion**
Riders' explicit instruction + Binion is the one booked night. Malin Head in the EVENING (~19:30) means Farren's Bar is open — the rejected alternative (Malin as a Day-2 dawn spur, proposed by one planning pass) was refuted in verification: the pub is shut at 09:30 AND it hides ~24mi of re-ridden road. Antrim Coast and Torr Head REMOVED from the app entirely (riders' call, 26 Jul): the trip starts at Muff; Larne→Muff is a plain 75mi transfer.

**D3. Night 2 — Corcreggan Mill, Dunfanaghy (km 279)**
Exactly at the end of the Fanad/Rosguill window, on the forward line; Horn Head (km 312) opens the next morning IN the direction of travel. The old plan's sin — visiting Bloody Foreland (km 346) then sleeping back at Dunfanaghy — is structurally impossible now.

**D4. Night 3 — Strandhill (km 660)**
The old plan's worst flaw: it rode to Downpatrick Head (km 741) then BACK east to sleep at Strandhill (km 660), then re-rode the same coast next day — ~100 wasted miles across two days. Fix: Day 3 ENDS at Strandhill; all of north Mayo (Downpatrick, Céide, Erris) belongs to Day 4. Site kept — it was the day boundary that was wrong, not the campsite.

**D5. Night 4 — Keel Sandybanks, Achill (km 1046)**
End of the Mayo window. Keem Bay (km 1053) is deliberately NOT visited the same evening: it opens Day 5 as a dawn spur in golden light, in the direction of travel.

**D6. Night 5 — Clifden Eco Beach, Claddaghduff (km 1196)**
The tent is ON the official line, one km BEFORE Sky Road/Derrigimlagh which open Day 6 — the old plan visited them first and slept backwards. Also the designated recovery night (Day 5 is the short day by design — see Decision 12).

**D7. Night 6 — Nagle's, Doolin (km 1486)**
Cliffs of Moher sit effectively adjacent on the line (the two are ~1.5km apart in chainage) — sleeping at Doolin buys the Cliffs at 08:00 before the coaches, zero dead leg, plus the trad session. Most contested booking of the trip (peak Saturday). UPDATE 26 Jul: Nagle's is FULL — the stored alternative O'Connors Riverside, Doolin (same forward position) is now the selected site, PENDING email response.

**D8. Night 7 — Campáil Teach an Aragail, Gallarus (km 1867) — ZERO retrace (corrected 26 Jul)**
Chainage proof: the official line runs Dingle (1810) → Slea Head → Blasket (1856) → Gallarus (1867) → BACK through Dingle (1890) → Inch — the loop's return leg is forward official line. So the Slea Head Drive is ridden on DAY 7 EVENING (golden hour, buses gone) ending at the tent, and Day 8 exits forward Gallarus → Dingle → Inch with no repeated road at all. The earlier declared 5mi retrace was an artefact of describing a dawn loop the windows never required.

**D9. Night 8 — Hungry Hill Lodge, Adrigole (km 2197) — THE ONE CAMPSITE CHANGE (was Kenmare)**
Proven necessity: from Kenmare (km 2131), the final day = 373km of remaining official line PLUS the 210km transfer — impossible. Sleeping at Adrigole banks the whole of north Beara + Dursey Sound + McCarthy's Bar on Monday evening and puts the tent at the foot of the Healy Pass (optional sunrise spur, +9mi). Fallbacks if unbookable: Berehaven (Castletownbere), Dowling's (Glengarriff), Eagle Point (Ballylickey). STATUS UPDATE 26 Jul: BOOKED & CONFIRMED — the endgame is secured.

**D10. Night 9 — IOAC, Tagoat (BOOKED; replaces St Margaret's Beach)**
Transfer target, minutes from Rosslare Harbour for the 08:15 boat — booked & confirmed 26 Jul. Not a WAW decision; no route impact.

**D11. 100% restoration — Sheep's Head, Lough Hyne–Baltimore–Toe Head–Galley Head, full Mullet loop ALL IN**
Earlier drafts cut ~76mi of official line to protect the final day. Riders' priority order (100% completion > daily workload) reverses that: all restored and locked. Consequence accepted with eyes open: Day 9 = ~320mi planned (~130 of it main-road transfer), 06:00 start, ~12h door-to-door by the app's own arithmetic before any Maybes.

**D12. Day 5 stays short (94 official mi) ON PURPOSE**
It is the mid-trip recovery that makes the finale survivable, plus Westport lunch and the Omey tide window. Rebalancing it "to even things out" was modelled and rejected: boundary shifts at Clifden, Lahinch, Dingle and Glengarriff were each tested against the chainage — none reduces the finale without deleting official miles or set-pieces; the southern anchors (Doolin/Gallarus/Adrigole/Rosslare) are forced.

**D13. Skellig Michael landing & Dursey cable-car crossing EXCLUDED; viewpoints retained**
Physics, not preference: landings sell out months ahead and eat ~5h; the cable-car round trip eats ~2h. Kerry Cliffs + Bray Head (both ON the official line) cover the Skelligs; Dursey Sound station is on-line. Both crossings remain listed as extras with honest time costs if the day somehow allows.

**D14. Caha Pass N71 tunnels NOT ridden**
They are not official WAW line (checked against the KML — the Way crosses Beara around the coast, which is now ridden in full). Riding the tunnels too = riding Beara twice. The Healy Pass sunrise spur is the Beara mountain-road experience instead.

**D15. Buncrana–Rathmullan ferry NOT recommended**
It would skip ~25mi of official line around Lough Swilly (there is no bridge; Letterkenny loop is the Way). Flagged in-app as ⚠ breaks 100% completion. The Killimer–Tarbert Shannon ferry, by contrast, IS the official crossing and is retained (hourly, on the half-hour, no booking possible).

**D16. Route corrections adopted 26 Jul (cross-check round 2)**
Four fixes from external review, each verified against the chainage before adoption: (1) Day 1 — Warren Point (Greencastle) gets its own waypoint in true road order (Moville → Greencastle/Warren → Stroove), and Farren's Bar precedes Malin Head (it sits on the approach road); (2) Glenveagh/Errigal moved to Day 3 as an OUT-AND-BACK from Gweedore (+20mi/+50min est) — the previous Dunfanaghy→Gweedore through-routing both overshot the Day-2 campsite AND would have bypassed official line; (3) the Day 6/7 boundary moved to km 1483 so Day 6 no longer claims the Cliffs (1485) while sleeping at Doolin — Day 7 now opens with them; (4) the Gallarus/Slea fix above.

**D17. Marking policy (riders' rule, 26 Jul)**
LOCKED and non-reviewable: official road, Signature Points, transfers. EVERYTHING else — every on-route stop and off-route extra — carries Keep/Maybe/Cut for review. Cutting an on-route stop never removes its road (that is the Way); it means ride past without stopping. Defaults: on-route stops = Keep (they are the plan), off-route extras = Maybe (their road cost is opted into).

**D18. Only EXTRAS are cuttable**
The app enforces it: official road cannot be Cut or Maybe'd; on-route stops can be ridden past but their road stays; the release-valve concept now applies to stop DURATIONS and optional extras only. The build fails if a data edit ever breaks window contiguity or campsite forwardness.

---

## PART 3 — THE NINE DAYS, IN FULL
All numbers generated from the live app data. "Official" mileage is the locked line window; extras are unmarked (= Maybe) unless stated; times assume 30mph coastal / 46mph transfer + listed stop times.

### DAY 01 · MON 10 AUG — Ferry → Larne → Muff → Inishowen
*Off the boat, straight to the start line at Muff*

**Official window:** km 0 → 120 (74.6 mi locked) · **Transfer:** 75 mi · **Camp ±:** 0.5 mi
**Planned:** 150 mi (max with all extras 150) · **Est:** riding 4h 08m + stops 1h 10m = 5h 18m (max 5h 18m) · **WAW after today: 4.8%**

> ⚠ Locked day: Larne → Derry → Muff, then the official line up Lough Foyle — Greencastle/Warren Point, Stroove — round to Culdaff, past Farren's to Malin Head, and the tent at Binion. Late boat? Muff → R238 direct to camp, Malin as a 25-mile dawn spur.

| # | Stop | Type | Time/impact |
|---|---|---|---|
| 1 | **Douglas → Larne** | ⛴ TRANSFER (non-WAW) | — |
| 2 | **Muff — the Way begins** | 🔒 OFFICIAL WAW (locked road) | ~10min stop |
| 3 | **Moville → Greencastle & Warren Point** | 🔒 OFFICIAL WAW (locked road) | ~5min stop |
| 4 | **Stroove & Inishowen Head** | 📍 ON ROUTE (road locked, stop optional) | ~5min stop |
| 5 | **Kinnagoe Bay** | 📍 ON ROUTE (road locked, stop optional) | ~10min stop |
| 6 | **Culdaff** | 📍 ON ROUTE (road locked, stop optional) | — |
| 7 | **Farren's Bar** | 📍 ON ROUTE (road locked, stop optional) | ~15min stop |
| 8 | **MALIN HEAD** | 📍 ON ROUTE (road locked, stop optional) | ~25min stop |
| 9 | **Doagh → Pollan Bay → camp** | 🔒 OFFICIAL WAW (locked road) | — |

Stop detail:
- **Douglas → Larne**: Steam Packet 09:30, into Larne 14:15 (~4h45). Then the transfer: Larne → Derry → Muff, ~75mi of main road, ~1h45 — no sightseeing, the trip starts at the Muff marker. ⚠ Vehicle check-in closes 45 min before — be at Douglas for 08:45.
- **Muff — the Way begins**: Skirt Derry and cross into Donegal at Muff on Lough Foyle — the official start/end point of the Wild Atlantic Way, km zero. Currency and speed flip to € and km/h; home of the Muff Liquor Co. Photo at the marker.
- **Moville → Greencastle & Warren Point**: The first miles of the Way proper up Lough Foyle — Moville, then Greencastle with the square-towered Warren Point lighthouse at the harbour mouth.
- **Stroove & Inishowen Head**: Shrove beach, the Stroove lighthouse and the Inishowen Head corner — the first Discovery Points fall inside the opening hour.
- **Kinnagoe Bay**: Steep drop to a huge empty beach — an Armada wreck site (La Trinidad Valencera, 1588).
- **Culdaff**: Beach village on the north shore — the road west from here runs straight for the head.
- **Farren's Bar**: Ireland's most northerly pub, on the approach road to the head — you pass it BEFORE Banba's Crown. Sticker and photo on the way up; the pint on the way back down if the light allows.
- **MALIN HEAD**: Ireland's most northerly point. Banba's Crown Napoleonic tower, the “EIRE 80” WW2 sign, a Star Wars: The Last Jedi filming site — Signature Point number one, bagged on day one.
- **Doagh → Pollan Bay → camp**: Down the west shoulder through Doagh Isle and Ballyliffin to Binion — tent up in the last of the light, everything east of you already done.

**NIGHT: Binion Bay Camping, Clonmany** (Inishowen) — Beachside at Binnion strand, just round from Tullagh Bay. Cash (€) from here on.
- Route impact: deviation +0.5 mi · ✓ forward progression
- Backup: Tullagh Bay Camping (the next bay over)

**Official Discovery Points in this window (6, of which ★1 Signature):** Inishowen Head (km 9) · Magilligan Point View (km 38) · Kinnagoe Bay (km 48) · Culdaff Beach (km 61) · ★Malin Head (km 101) · Pollan Bay (km 116)

### DAY 02 · TUE 11 AUG — Mamore Gap → Fanad → Rosguill
*Three peninsulas, one easy day — the recovery after the dash*

**Official window:** km 120 → 279 (98.8 mi locked) · **Camp ±:** 1.4 mi
**Planned:** 100 mi (max with all extras 104) · **Est:** riding 3h 20m + stops 1h 45m = 5h 05m (max 5h 42m) · **WAW after today: 11.1%**

| # | Stop | Type | Time/impact |
|---|---|---|---|
| 1 | **Gap of Mamore** | 📍 ON ROUTE (road locked, stop optional) | ~10min stop |
| 2 | **Fort Dunree** | 🏍 OPTIONAL EXTRA (Keep/Maybe/Cut) | +4mi est · +12min ride · ~25min stop |
| 3 | **Round the Swilly** | 🔒 OFFICIAL WAW (locked road) | — |
| 4 | **Knockalla coast road** | 🔒 OFFICIAL WAW (locked road) | — |
| 5 | **Ballymastocker Bay / Portsalon** | 📍 ON ROUTE (road locked, stop optional) | ~15min stop |
| 6 | **FANAD HEAD** | 📍 ON ROUTE (road locked, stop optional) | ~25min stop |
| 7 | **Harry Blaney Bridge** | 🔒 OFFICIAL WAW (locked road) | — |
| 8 | **Atlantic Drive, Rosguill** | 🔒 OFFICIAL WAW (locked road) | ~10min stop |
| 9 | **Dunfanaghy** | 📍 ON ROUTE (road locked, stop optional) | ~45min stop |

Stop detail:
- **Gap of Mamore**: Straight from the tent up the switchback gap between Mamore Hill and Urris — 1-in-4 gradients and the whole of Lough Swilly below.
- **Fort Dunree**: Coastal defence fort on a headland over the Swilly — military museum, sea views, usually empty.
- **Round the Swilly**: Buncrana, Lisfannon beach, Inch Island — then the one inland dip of the whole Way: no bridge over Lough Swilly, so the OFFICIAL line rounds it through Letterkenny to Rathmullan. (A summer Buncrana–Rathmullan ferry sometimes runs — ⚠️ taking it BREAKS 100% completion: 25mi of official Way unridden.)
- **Knockalla coast road**: From Rathmullan the road climbs onto the Knockalla shoulder — riding right on the sea, the Swilly on your right, down to Portsalon.
- **Ballymastocker Bay / Portsalon**: Regularly voted among the world’s best beaches — the view arriving from Knockalla is the one on the postcards.
- **FANAD HEAD**: One of the world’s most beautiful lighthouses, at the mouth of the Swilly. Signature Point two.
- **Harry Blaney Bridge**: Exit Fanad across Mulroy Bay on the Blaney bridge — straight onto the Rosguill peninsula.
- **Atlantic Drive, Rosguill**: A short, stunning loop — Downings, Tranarossan, the lot. Unmissable and only 20 minutes.
- **Dunfanaghy**: Good food town under Horn Head — the headland itself is 100 metres from tonight’s campsite gate, saved for first thing tomorrow.

**NIGHT: Corcreggan Mill, Dunfanaghy** (NW Donegal) — Quirky and biker-friendly, in an old mill.
- Route impact: deviation +1.4 mi · ✓ forward progression
- Backup: Wild Atlantic Camp, Creeslough (pods = storm insurance)

**Official Discovery Points in this window (11, of which ★1 Signature):** Gap of Mamore (km 129) · Dunree Head (km 146) · Lisfannon Beach (km 152) · Inch Island (km 178) · Manorcunningham View (km 203) · Ballymastocker Strand (km 229) · ★Cionn Fhánada
 (km 242) · Cionn Fhánada (km 242) · Bá Bhaile Uí Thiarnáin (km 251) · Island Roy View (km 261) · Ros Goill (km 274)

### DAY 03 · WED 12 AUG — Horn Head → Slieve League → Sligo
*The long one — Donegal's whole west face in a day*

**Official window:** km 279 → 661 (237.4 mi locked) · **Camp ±:** 0.1 mi
**Planned:** 237 mi (max with all extras 257) · **Est:** riding 7h 55m + stops 3h 05m = 11h 00m (max 12h 35m) · **WAW after today: 26.4%**

> ⚠ Longest riding day. The official line is locked — the levers are stop time, not road: shorten Slieve League / Killybegs / Malin Beg visits if behind. Nothing official gets skipped.

| # | Stop | Type | Time/impact |
|---|---|---|---|
| 1 | **Horn Head loop** | 🔒 OFFICIAL WAW (locked road) | ~15min stop |
| 2 | **Bloody Foreland** | 📍 ON ROUTE (road locked, stop optional) | ~5min stop |
| 3 | **Glenveagh / Errigal** | 🏍 OPTIONAL EXTRA (Keep/Maybe/Cut) | +20mi est · +50min ride · ~45min stop |
| 4 | **The Rosses** | 🔒 OFFICIAL WAW (locked road) | — |
| 5 | **Maghera & Assaranca** | 📍 ON ROUTE (road locked, stop optional) | ~15min stop |
| 6 | **Glengesh Pass** | 📍 ON ROUTE (road locked, stop optional) | ~10min stop |
| 7 | **Glencolmcille & Malin Beg** | 📍 ON ROUTE (road locked, stop optional) | ~20min stop |
| 8 | **SLIEVE LEAGUE / SLIABH LIAG** | 📍 ON ROUTE (road locked, stop optional) | ~45min stop |
| 9 | **Killybegs** | 📍 ON ROUTE (road locked, stop optional) | ~40min stop |
| 10 | **Donegal Bay run** | 🔒 OFFICIAL WAW (locked road) | — |
| 11 | **MULLAGHMORE HEAD** | 📍 ON ROUTE (road locked, stop optional) | ~20min stop |
| 12 | **Drumcliffe → Strandhill** | 📍 ON ROUTE (road locked, stop optional) | ~15min stop |

Stop detail:
- **Horn Head loop**: First 30 minutes of the day: the loop above 180m sea cliffs, straight from the campsite. Empty at 08:00.
- **Bloody Foreland**: Headland named for the red glow of the setting sun on the rock — rounding it, the road turns south for the first time and stays south for a week.
- **Glenveagh / Errigal**: OPTIONAL EXTRA (inland): from Gweedore up the R251 under Errigal to Glenveagh — ridden as an OUT-AND-BACK so not a metre of official line is skipped. Road impact: +20mi / +50min est, plus castle time. (Riding it through Dunfanaghy→Gweedore would bypass Horn Head and Bloody Foreland — never that.)
- **The Rosses**: Granite, lakes and pier lanes through Gweedore and Dungloe, then Narin/Portnoo strand — every lane of it official line, every lane locked.
- **Maghera & Assaranca**: West of Ardara: Assaranca waterfall right beside the road, then the caves and dunes at Maghera.
- **Glengesh Pass**: Hairpins over the hills between Ardara and Glencolmcille — one of Donegal’s great biking roads.
- **Glencolmcille & Malin Beg**: Out to the Silver Strand — a perfect horseshoe of sand at the end of the road. The road is official line; the 170 steps down to the beach are the optional bit.
- **SLIEVE LEAGUE / SLIABH LIAG**: Among the highest sea cliffs in Europe — nearly three times Moher. Ride the spur up to Bunglass. Signature Point three.
- **Killybegs**: Ireland’s biggest fishing port — diesel and the best chips of the trip.
- **Donegal Bay run**: Donegal Town, Rossnowlagh, Tullan Strand and Bundoran — surf country, faster roads, all on the line.
- **MULLAGHMORE HEAD**: The harbour, Classiebawn castle against Benbulben, and the big-wave reef offshore. Signature Point four.
- **Drumcliffe → Strandhill**: Yeats’ grave under bare Benbulben’s head at Drumcliffe, Rosses Point, then into Strandhill for the night — surf town, seaweed baths if the legs are done. (Carrowmore megalithic cemetery — among the oldest in Ireland — is 5 min inland from camp: an evening leg-stretch, not a riding stop.)

**NIGHT: Strandhill Caravan & Camping** (Sligo) — On the beach, pubs walkable.
- Route impact: deviation +0.1 mi · ✓ forward progression
- Backup: Greenlands, Rosses Point

**Official Discovery Points in this window (27, of which ★2 Signature):** Doe Castle View (km 289) · Marblehill (km 307) · Horn Head (km 312) · Cé Mhachaire Uí Rabhartaigh (km 337) · Inis Bó Finne (km 337) · Cnoc Fola (km 346) · Gabhla (km 370) · Cé an Bhuna Bhig (km 370) · Trá na Carraige Finne (km 370) · Cé Ailt an Chorráin (km 383) · Árainn Mhór (km 383) · Inis Fraoigh (km 385) · Narin-Portnoo Strand (km 399) · Malaidh Ghleann Gheis (km 432) · Málainn Bhig (km 454) · ★Sliabh Liag (km 476) · Cionn Mhucrois (km 483) · Bá Fhionntrá (km 491) · Mountcharles Pier (km 513) · Murvagh Beach (km 528) · Rossnowlagh Beach (km 547) · Tullan Strand (km 579) · ★Mullaghmore Head (km 586) · Streedagh Beach (km 595) · Rosses Point Beach (km 628) · Strandhill Beach (km 660) · Aughris Head (km 661)

### DAY 04 · THU 13 AUG — Downpatrick → Céide → Erris → Achill
*Into the emptiest, wildest corner of the whole Way*

**Official window:** km 661 → 1045 (238.6 mi locked) · **Camp ±:** 0.1 mi
**Planned:** 239 mi (max with all extras 239) · **Est:** riding 7h 57m + stops 1h 20m = 9h 17m (max 9h 17m) · **WAW after today: 41.7%**

> ⚠ Big day with the full Mullet loop restored — ~200mi, all of it official. Levers are stop lengths (Céide, Downpatrick), never the road.

| # | Stop | Type | Time/impact |
|---|---|---|---|
| 1 | **The Sligo surf coast** | 🔒 OFFICIAL WAW (locked road) | — |
| 2 | **Ballina & Killala** | 📍 ON ROUTE (road locked, stop optional) | — |
| 3 | **DOWNPATRICK HEAD** | 📍 ON ROUTE (road locked, stop optional) | ~25min stop |
| 4 | **Céide Fields** | 📍 ON ROUTE (road locked, stop optional) | ~30min stop |
| 5 | **North Mayo cliff road** | 🔒 OFFICIAL WAW (locked road) | — |
| 6 | **The Mullet & Blacksod** | 🔒 OFFICIAL WAW (locked road) | ~15min stop |
| 7 | **Ballycroy / Wild Nephin** | 🔒 OFFICIAL WAW (locked road) | — |
| 8 | **Mulranny → Achill Sound** | 🔒 OFFICIAL WAW (locked road) | — |
| 9 | **Achill Atlantic Drive** | 🔒 OFFICIAL WAW (locked road) | ~10min stop |
| 10 | **Keel** | 📍 ON ROUTE (road locked, stop optional) | — |

Stop detail:
- **The Sligo surf coast**: Aughris Head, Easkey and Enniscrone — reef breaks and empty strands, quick miles.
- **Ballina & Killala**: Across the Moy at Ballina, then the round tower and quay at Killala — 1798 French landing country.
- **DOWNPATRICK HEAD**: Dún Briste — the sea stack standing off the headland with its layers exposed like a cut cake. Blowhole, WW2 EIRE sign. Signature Point five.
- **Céide Fields**: The oldest known field systems on Earth, under the bog for 5,500 years — and the cliff viewpoint is free.
- **North Mayo cliff road**: Belderrig to Belmullet — the loneliest tarmac in Ireland. Fuel at Belmullet.
- **The Mullet & Blacksod**: The full official loop of the Mullet — down the west side past Annagh Head and Fál Mór to Blacksod lighthouse (whose weather report delayed D-Day by 24 hours), back up to Belmullet. All official line, all locked.
- **Ballycroy / Wild Nephin**: Along the edge of Ireland’s only wilderness national park — bog, the Nephin Beg range, and not much else. Glorious.
- **Mulranny → Achill Sound**: The causeway viewpoint over Clew Bay’s drumlins, then over the bridge onto Achill.
- **Achill Atlantic Drive**: The cliff road round the south of the island — Cloughmore, the Minaun cliffs across the bay.
- **Keel**: The strand, the pubs, the tent. Keem Bay is 5 miles on — saved for 08:00 tomorrow when the car park is empty and the light is on the cliffs.

**NIGHT: Keel Sandybanks Caravan & Camping** (Achill Island) — On Keel beach.
- Route impact: deviation +0.1 mi · ✓ forward progression
- Backup: Seal Caves, Dugort

**Official Discovery Points in this window (24, of which ★1 Signature):** Easky Pier (km 677) · Inishcrone Pier (km 692) · Ballina Quay (km 703) · Killala Quay (km 719) · Lackan Strand (km 739) · ★Downpatrick Head (km 741) · Céide (km 753) · An Bhinn Bhuí (km 797) · Ceann Iorrais (km 813) · Dún na mBó (km 830) · Ceann an Eanaigh (km 836) · Trá Oilí (km 847) · An Fál Mór (km 861) · An Fód Dubh (km 862) · Oileán Chloigeann (km 875) · An Ceann Ramhar (km 920) · ? (km 933) · Inis Bigil (km 933) · Claggan (km 941) · Spanish Armada Viewpoint (km 989) · Dumhach Bheag (km 995) · An Chéibh Beag (km 1004) · Cuan na hAisléime (km 1009) · Trá Dhumha Goirt (km 1034)

### DAY 05 · FRI 14 AUG — Keem → Westport → Doolough → Killary
*The recovery day — and somehow still the prettiest*

**Official window:** km 1045 → 1197 (94.4 mi locked) · **Camp ±:** 0.8 mi
**Planned:** 95 mi (max with all extras 95) · **Est:** riding 3h 10m + stops 2h 45m = 5h 55m (max 5h 55m) · **WAW after today: 47.8%**

| # | Stop | Type | Time/impact |
|---|---|---|---|
| 1 | **KEEM BAY at dawn** | 📍 ON ROUTE (road locked, stop optional) | ~25min stop |
| 2 | **Mulranny → Newport** | 🔒 OFFICIAL WAW (locked road) | — |
| 3 | **Westport** | 📍 ON ROUTE (road locked, stop optional) | ~75min stop |
| 4 | **Croagh Patrick** | 📍 ON ROUTE (road locked, stop optional) | ~10min stop |
| 5 | **Doolough Valley** | 📍 ON ROUTE (road locked, stop optional) | ~10min stop |
| 6 | **Aasleagh Falls → Leenane** | 📍 ON ROUTE (road locked, stop optional) | — |
| 7 | **KILLARY HARBOUR** | 📍 ON ROUTE (road locked, stop optional) | ~15min stop |
| 8 | **Letterfrack & Connemara NP** | 🔒 OFFICIAL WAW (locked road) | — |
| 9 | **Cleggan → Omey Island** | 📍 ON ROUTE (road locked, stop optional) | ~30min stop |

Stop detail:
- **KEEM BAY at dawn**: The amphitheatre beach at the end of Achill’s cliff road — Signature Point six, to yourselves at 08:00. (Spur: 10mi there-and-back from Keel.)
- **Mulranny → Newport**: Back across the island and along Clew Bay — 365 islands, one for every day of the year, allegedly.
- **Westport**: The town of the trip — long lunch, Matt Molloy’s for one (of the Chieftains; sessions from lunchtime).
- **Croagh Patrick**: The Reek — Ireland’s holy mountain, pilgrim path visible from the road viewpoint at Murrisk.
- **Doolough Valley**: The famine road between the mountains and the black lake — a memorial marks the 1849 tragedy. One of the great sombre roads of Ireland, and officially on the Way.
- **Aasleagh Falls → Leenane**: The falls at the head of the fjord, then the village from The Field.
- **KILLARY HARBOUR**: Ireland’s only true fjord — 16km of dark water between the Mweelrea and Maumturk walls. Signature Point seven.
- **Letterfrack & Connemara NP**: Under Diamond Hill through Letterfrack, then the Renvyle/Tully Cross shore.
- **Cleggan → Omey Island**: To Claddaghduff, where tonight’s tent faces Omey strand — walk (or ride, carefully) across the sand to the island if the tide’s out.

**NIGHT: Clifden Eco Beach, Claddaghduff** (Connemara) — Tent on the machair facing Omey — one of the great pitches of Ireland.
- Route impact: deviation +0.8 mi · ✓ forward progression
- Backup: Clifden Camping & Caravan Park

**Official Discovery Points in this window (14, of which ★2 Signature):** ★Keem Bay (km 1053) · Keel Strand (km 1054) · Croagh Patrick View (km 1065) · Old Head (km 1088) · Roonagh Pier (km 1099) · Clare Island (km 1099) · Carrownisky Strand (km 1105) · Silver Strand (km 1117) · Doolough Valley (km 1127) · Aasleagh Falls (km 1141) · ★Killary Harbour (km 1150) · Island’s View (km 1188) · Cleggan Harbour (km 1188) · Omey Island (km 1196)

### DAY 06 · SAT 15 AUG — Sky Road → Connemara shore → Burren → Doolin
*Bog, granite and limestone — three worlds in one day*

**Official window:** km 1197 → 1483 (177.7 mi locked) · **Camp ±:** 0.2 mi
**Planned:** 178 mi (max with all extras 188) · **Est:** riding 5h 56m + stops 1h 55m = 7h 51m (max 8h 36m) · **WAW after today: 59.2%**

| # | Stop | Type | Time/impact |
|---|---|---|---|
| 1 | **Sky Road** | 📍 ON ROUTE (road locked, stop optional) | ~15min stop |
| 2 | **DERRIGIMLAGH** | 📍 ON ROUTE (road locked, stop optional) | ~45min stop |
| 3 | **Roundstone** | 📍 ON ROUTE (road locked, stop optional) | ~20min stop |
| 4 | **South Connemara shore** | 🔒 OFFICIAL WAW (locked road) | — |
| 5 | **Spiddal → Galway** | 🔒 OFFICIAL WAW (locked road) | ~20min stop |
| 6 | **Kinvara** | 📍 ON ROUTE (road locked, stop optional) | ~10min stop |
| 7 | **Poulnabrone dolmen** | 🏍 OPTIONAL EXTRA (Keep/Maybe/Cut) | +10mi est · +25min ride · ~20min stop |
| 8 | **Black Head R477** | 🔒 OFFICIAL WAW (locked road) | ~5min stop |
| 9 | **Fanore → Doolin** | 🔒 OFFICIAL WAW (locked road) | — |

Stop detail:
- **Sky Road**: The loop above Clifden bay — take the upper fork, obviously. Coffee in Clifden after.
- **DERRIGIMLAGH**: The bog where the modern world arrived twice: Marconi’s first transatlantic radio station and the spot Alcock & Brown crash-landed the first transatlantic flight, 1919. Boardwalk loop ~45 min. Signature Point eight.
- **Roundstone**: Harbour village under Errisbeg — Dog’s Bay and Gurteen back-to-back beaches just south.
- **South Connemara shore**: R340/R336 through the granite-and-seaweed country — Pearse’s Cottage, Rosmuc, the Carna loop. All official line, all locked.
- **Spiddal → Galway**: Into the city with the Burren rising across the bay. Ride through — coffee at most; Saturday Galway will eat the afternoon whole.
- **Kinvara**: Dunguaire Castle on its tidal rock — the classic photo.
- **Poulnabrone dolmen**: OPTIONAL EXTRA (inland Burren): the 5,800-year-old dolmen on the R480 — out-and-back from Ballyvaughan. Road impact: +10mi / +25min riding.
- **Black Head R477**: The limestone shore road under Gleninagh — grey pavement into grey sea, Aran across the sound. One of the Way’s best riding stretches.
- **Fanore → Doolin**: Down the coast to the trad capital of Ireland. Session in McDermott’s or Gus O’Connor’s tonight — the Cliffs are 10 minutes south, saved for 08:00.

**NIGHT: O'Connors Riverside, Doolin** (Doolin) — Riverside in the village — the Cliffs are still 10 minutes south at 08:00, and the trad session still happens.
- Route impact: deviation +0.2 mi · ✓ forward progression
- Backup: Nagle's Doolin — ❌ no availability (full)

**Official Discovery Points in this window (22, of which ★1 Signature):** Sky Road (km 1213) · Derrigimlagh (km 1218) · ★Derrigmlagh Bog (km 1218) · Bunowen Bay (km 1234) · Port na Feadóige (km 1246) · Glinsce (km 1273) · Teach an Phiarsaigh (km 1304) · Droichead Charraig an Logáin (km 1321) · Trá an Dóilín (km 1328) · Calafort Ros an Mhíl (km 1334) · Céibh Bhaile nahAbhann (km 1354) · Aerfort Réigiúnach Chonamara (km 1356) · Seanchéibh an Spidéil (km 1369) · Trá na gCeann (km 1382) · Salthill Promenade (km 1386) · Rinville Park (km 1403) · Traught (km 1431) · Flaggy Shore (km 1434) · Ballyvaughan Pier (km 1447) · Murrooghtoohy (km 1458) · Fanore Beach (km 1461) · Doolin Pier (km 1477)

### DAY 07 · SUN 16 AUG — Cliffs → Loop Head → Conor Pass → Slea Head
*The monster Sunday — two counties, one ferry, one pass, one perfect evening loop*

**Official window:** km 1483 → 1868 (239.2 mi locked) · **Camp ±:** 0.4 mi
**Planned:** 240 mi (max with all extras 240) · **Est:** riding 7h 59m + stops 3h 55m = 11h 54m (max 11h 54m) · **WAW after today: 74.5%**

> ⚠ Biggest official-mileage day. Cliffs at 08:00 sharp, Shannon ferry is hourly on the half-hour, and the Slea Head Drive comes at golden hour with the buses gone. Levers are stop lengths only — the line is locked end to end.

| # | Stop | Type | Time/impact |
|---|---|---|---|
| 1 | **CLIFFS OF MOHER, 08:00** | 📍 ON ROUTE (road locked, stop optional) | ~60min stop |
| 2 | **Lahinch → Spanish Point** | 📍 ON ROUTE (road locked, stop optional) | ~5min stop |
| 3 | **Kilkee Cliffs** | 📍 ON ROUTE (road locked, stop optional) | ~15min stop |
| 4 | **LOOP HEAD** | 📍 ON ROUTE (road locked, stop optional) | ~25min stop |
| 5 | **Killimer → Tarbert ferry** | 🔒 OFFICIAL WAW (locked road) | ~30min stop |
| 6 | **Ballybunion** | 📍 ON ROUTE (road locked, stop optional) | ~15min stop |
| 7 | **Camp → Castlegregory** | 🔒 OFFICIAL WAW (locked road) | — |
| 8 | **CONOR PASS** | 📍 ON ROUTE (road locked, stop optional) | ~15min stop |
| 9 | **Dingle town** | 📍 ON ROUTE (road locked, stop optional) | ~45min stop |
| 10 | **SLEA HEAD DRIVE — evening** | 🔒 OFFICIAL WAW (locked road) | ~20min stop |
| 11 | **Dunquin → Ballyferriter → Gallarus** | 🔒 OFFICIAL WAW (locked road) | ~5min stop |

Stop detail:
- **CLIFFS OF MOHER, 08:00**: At the gates when they open, before the coach army lands — O’Brien’s Tower, 214m straight down, puffins below in August. Signature Point nine.
- **Lahinch → Spanish Point**: Surf town, then the point named for the Armada dead of 1588.
- **Kilkee Cliffs**: The Duggerna cliffs and Pollock Holes on the west end of the horseshoe bay — Clare’s underrated answer to Moher.
- **LOOP HEAD**: Out the north side, lighthouse at the tip, back along the south shore via Carrigaholt — a natural loop, no retracing. Signature Point ten.
- **Killimer → Tarbert ferry**: Across the Shannon mouth — hourly on the half-hour from Killimer, ~20min crossing, bikes board first. An OFFICIAL leg of the Way (the line crosses here) — and the perfect lunch stop.
- **Ballybunion**: Castle ruin between the two strands — quick leg-stretch, then the miles across north Kerry.
- **Camp → Castlegregory**: Onto the Dingle peninsula’s north shore under the Slieve Mish, out around the Castlegregory/Maharees spit — official line, locked.
- **CONOR PASS**: Ireland’s highest paved pass, ridden INBOUND — the official direction — from Cloghane over the top and the great descent into Dingle with the harbour laid out below.
- **Dingle town**: Into Dingle ~17:00 off the Conor Pass descent — quick fuel and food before the evening loop. (The proper pint comes after Gallarus.)
- **SLEA HEAD DRIVE — evening**: The loop at golden hour, buses gone, sun over the water: Ventry, the beehive huts, Slea Head itself — then DUNMORE HEAD, mainland Ireland's westernmost point and the Blasket Islands view. Signature Point eleven, in the best light of the day.
- **Dunquin → Ballyferriter → Gallarus**: Round the loop's west side — Kruger's (Ireland's westernmost pub) at Dunquin — to the tent beside the 1,200-year-old Gallarus Oratory. The official line continues FORWARD from here through Dingle tomorrow: zero repeated road.

**NIGHT: Campáil Teach an Aragail, Gallarus** (West Dingle) — Beside the Gallarus Oratory, at the END of today's window — the Way exits forward through Dingle tomorrow. Zero repeated road.
- Route impact: deviation +0.4 mi · ✓ forward progression
- Backup: Dingle town campsite

**Official Discovery Points in this window (31, of which ★3 Signature):** ★Cliffs of Moher (km 1485) · Cliffs of Moher (km 1488) · Clehane (km 1495) · Lehinch Beach (km 1501) · Spanish Point (km 1515) · Doughmore Bay (km 1532) · Kilkee Cliffs (km 1552) · Bridges of Ross (km 1556) · ★Loop Head (km 1577) · Carrigaholt Bay (km 1577) · Kilrush Marina (km 1578) · Cappagh Pier (km 1580) · Scattery Island (km 1580) · Killimer Port (km 1590) · Tarbert Port (km 1616) · Foynes Island Viewpoint (km 1638) · Carrigafoyle Castle (km 1647) · Beale Strand (km 1660) · Ballybunion Beach (km 1671) · Ballyheige Beach (km 1712) · Banna Strand (km 1722) · Samphire Island (km 1733) · Fenit Harbour (km 1733) · Castlegregory Beach (km 1776) · Srón Bhroin (km 1788) · An Chonair (km 1803) · An Blascaod Mor (km 1836) · Radharc na mBlascaodaí (km 1837) · Ceann Sléibhe (km 1839) · Cé Dhún Chaoin (km 1853) · ★Ionad an Bhlascaoid Mhóir (km 1856)

### DAY 08 · MON 17 AUG — Ring of Kerry + Skellig Ring → Beara north
*The queen stage — two peninsulas before dark*

**Official window:** km 1868 → 2198 (205.1 mi locked) · **Camp ±:** 0.2 mi
**Planned:** 205 mi (max with all extras 205) · **Est:** riding 6h 51m + stops 3h 00m = 9h 51m (max 9h 51m) · **WAW after today: 87.7%**

> ⚠ Dawn start. The whole line is locked, Valentia included. Levers: stop lengths; the Dursey cable-car crossing stays out (2h). ~205mi of official road.

| # | Stop | Type | Time/impact |
|---|---|---|---|
| 1 | **Gallarus → Dingle, forward** | 🔒 OFFICIAL WAW (locked road) | ~10min stop |
| 2 | **South Pole Inn, Annascaul** | 📍 ON ROUTE (road locked, stop optional) | ~10min stop |
| 3 | **Inch Strand** | 📍 ON ROUTE (road locked, stop optional) | ~5min stop |
| 4 | **Killorglin → the N70 coast** | 🔒 OFFICIAL WAW (locked road) | — |
| 5 | **Portmagee & Kerry Cliffs** | 📍 ON ROUTE (road locked, stop optional) | ~30min stop |
| 6 | **Coomanaspig Pass** | 📍 ON ROUTE (road locked, stop optional) | ~10min stop |
| 7 | **Waterville → Coomakista** | 📍 ON ROUTE (road locked, stop optional) | ~10min stop |
| 8 | **Derrynane, Caherdaniel** | 📍 ON ROUTE (road locked, stop optional) | ~15min stop |
| 9 | **Kenmare** | 📍 ON ROUTE (road locked, stop optional) | ~45min stop |
| 10 | **DURSEY SOUND** | 📍 ON ROUTE (road locked, stop optional) | ~20min stop |
| 11 | **Castletownbere & McCarthy's Bar** | 📍 ON ROUTE (road locked, stop optional) | ~25min stop |

Stop detail:
- **Gallarus → Dingle, forward**: The line itself runs from Gallarus back through Dingle harbour — forward official kilometres, not a retrace. Coffee in Dingle at 07:30 before the town wakes.
- **South Pole Inn, Annascaul**: Tom Crean's own pub, directly on the exit road east — the Antarctic legend's statue outside. Shut at this hour (the pint was last night in Dingle), but the photo is free and costs zero miles.
- **Inch Strand**: Three miles of dune-backed sand — dead on the exit road east. Zero detour, one photo.
- **Killorglin → the N70 coast**: Onto the Ring of Kerry proper, ridden ONCE, anticlockwise with the flow: Glenbeigh, Rossbeigh strand, Kells, Cahersiveen.
- **Portmagee & Kerry Cliffs**: Over the bridge onto VALENTIA ISLAND — Bray Head and Geokaun are on the official line — back through Portmagee to the Kerry Cliffs: Skellig Michael and Little Skellig off the cliffs. (Landing boats sell out months ahead; the cliffs are the 9-day version.) Signature Point twelve.
- **Coomanaspig Pass**: Up and over from Portmagee to St Finian’s Bay — one of the highest public roads in Ireland, savage gradients, monastery views.
- **Waterville → Coomakista**: Charlie Chaplin’s seafront, then the Coomakista pass viewpoint over Ballinskelligs Bay and the Skelligs again.
- **Derrynane, Caherdaniel**: Daniel O’Connell’s house and one of Ireland’s finest small beaches, then Sneem’s coloured houses.
- **Kenmare**: Fuel and food, ~17:00 — then leave the crowds behind: the Way turns down Beara’s empty north side. R571 through Tuosist, Ardgroom, Eyeries.
- **DURSEY SOUND**: The cable-car station at the end of Beara — Ireland’s only cable car, six people and the odd sheep. (Crossing eats 2 hours — the sound and the island from the viewpoint is the bag.) Signature Point thirteen.
- **Castletownbere & McCarthy's Bar**: The pint at McCarthy’s — of the book cover — in Ireland’s biggest whitefish port. Twenty easy minutes to the tent after.

**NIGHT: Hungry Hill Lodge & Camping, Adrigole** (Beara — Adrigole) — At the literal foot of the Healy Pass. Phone ahead — confirm tents and a ~20:30 arrival.
- Route impact: deviation +0.2 mi · ✓ forward progression
- Backup: Berehaven Camping, Castletownbere — anywhere on the Adrigole–Glengarriff road works

**Official Discovery Points in this window (22, of which ★1 Signature):** Cuan an Daingain (km 1890) · Inch Strand (km 1910) · Rossbeigh Strand (km 1932) · Mountain Stage (km 1940) · Bray Head (km 1961) · Geokaun Mountain (km 1970) · Portmagee Harbour (km 1992) · Kerry Cliffs (km 1995) · Coomanaspic (km 1997) · Cé Bhaile an Sceilg (km 2008) · Bá na Scealg (km 2009) · Com an Chiste (km 2031) · Cé Bhun an Bhaile (km 2040) · Derrynane House (km 2044) · Kilmakilloge (km 2131) · Dooneen (km 2142) · Dursey Sound (km 2164) · ★Dursey Island (km 2164) · Gour (km 2172) · Castletownbere Harbour (km 2187) · Pontoon Pier (km 2187) · Bere Island (km 2189)

### DAY 09 · TUE 18 AUG — Beara → Sheep’s Head → Mizen → Baltimore → KINSALE → Rosslare
*Every last official mile, the finish line, then the run for the boat*

**Official window:** km 2198 → 2506.8 (191.9 mi locked) · **Transfer:** 130 mi
**Planned:** 322 mi (max with all extras 331) · **Est:** riding 9h 13m + stops 2h 50m = 12h 03m (max 12h 43m) · **WAW after today: 100%**

> ⚠ 06:00 start — the price of 100.0%. Every remaining official mile is ridden: Sheep’s Head, the Mizen, the Baltimore coast, Old Head, Kinsale. Levers are stop lengths and the optional Healy Pass dawn spur — the road itself is locked. ~13–14h door to door; it ends at a boat, not another riding day.

| # | Stop | Type | Time/impact |
|---|---|---|---|
| 1 | **Healy Pass at sunrise** | 🏍 OPTIONAL EXTRA (Keep/Maybe/Cut) | +9mi est · +30min ride · ~10min stop |
| 2 | **Glengarriff → Bantry** | 📍 ON ROUTE (road locked, stop optional) | ~10min stop |
| 3 | **SHEEP'S HEAD loop** | 🔒 OFFICIAL WAW (locked road) | ~10min stop |
| 4 | **MIZEN HEAD** | 📍 ON ROUTE (road locked, stop optional) | ~30min stop |
| 5 | **Barleycove → Schull** | 🔒 OFFICIAL WAW (locked road) | ~10min stop |
| 6 | **Lough Hyne → BALTIMORE** | 🔒 OFFICIAL WAW (locked road) | ~15min stop |
| 7 | **Toe Head → Galley Head coast** | 🔒 OFFICIAL WAW (locked road) | ~5min stop |
| 8 | **Drombeg Stone Circle** | 📍 ON ROUTE (road locked, stop optional) | ~15min stop |
| 9 | **Clonakilty → Timoleague** | 🔒 OFFICIAL WAW (locked road) | ~10min stop |
| 10 | **OLD HEAD OF KINSALE** | 📍 ON ROUTE (road locked, stop optional) | ~20min stop |
| 11 | **KINSALE** | 📍 ON ROUTE (road locked, stop optional) | ~45min stop |
| 12 | **N25 run to Rosslare** | ⛴ TRANSFER (non-WAW) | — |

Stop detail:
- **Healy Pass at sunrise**: OPTIONAL EXTRA (the R574 is not official line): the tent sits at its southern foot — switchbacks up to the saddle for sunrise over Glanmore Lake and back down. Road impact: +9mi / +30min. The best half-hour of road in Ireland, if today can afford it.
- **Glengarriff → Bantry**: Out of Beara along the harbour, Garnish Island offshore, into Bantry under Whiddy.
- **SHEEP'S HEAD loop**: The quiet peninsula — Durrus out the north side to the tip at Tooreen (Seefin viewpoint), back the south side. Official line, restored and locked: ~35mi of the emptiest riding in Cork.
- **MIZEN HEAD**: Ireland’s south-westernmost point — the footbridge over the gorge, the signal station, the Fastnet out to sea. Signature Point fourteen.
- **Barleycove → Schull**: The tsunami-built dunes at Barleycove, then coffee at Schull under Mount Gabriel.
- **Lough Hyne → BALTIMORE**: RESTORED official line: past Lough Hyne (Ireland’s only saltwater lake) down to the Baltimore beacon, then back up through Skibbereen. TIME CHECK at Skibbereen: 14:30 or better keeps everything live.
- **Toe Head → Galley Head coast**: RESTORED official line: the coastal wiggle by Castletownshend, Toe Head and the Galley Head view — not the N71 shortcut.
- **Drombeg Stone Circle**: Bronze-age circle five minutes off the road — free, atmospheric, aligned on the winter solstice sunset.
- **Clonakilty → Timoleague**: Through Clon (Michael Collins country) past the abbey ruin on the estuary at Timoleague.
- **OLD HEAD OF KINSALE**: The spur to the signal tower viewpoint — official line to the gate; the Lusitania sank 11 miles off this head. Signature Point fifteen — the set, complete.
- **KINSALE**: THE OFFICIAL END OF THE WILD ATLANTIC WAY — every metre of the line from Muff behind you. WAW completion: 100.0%. Finish-line photo at the marker, Charles Fort if the clock allows, fuel for the run.
- **N25 run to Rosslare**: Kinsale → Cork → N25 east — ~130mi of main road, ~2h45. Tent by ~20:00. The price of the morning boat — but the Way is 100.0% won. ⚠ Long transfer after the biggest day — fuel at Cork, heads down.

**NIGHT: IOAC, Tagoat** (Tagoat (for the boat)) — Minutes from Rosslare Harbour. Sets up the 08:15 sailing.
- Route impact: deviation +0 mi · ✓ forward progression
- Backup: St Margaret's Beach (superseded)

**Official Discovery Points in this window (25, of which ★2 Signature):** Whiddy Island View (km 2210) · Garnish Island (km 2215) · Blue Pool (km 2216) · Bantry Harbour (km 2217) · Whiddy Island (km 2218) · Seefin Viewpoint (km 2238) · Glengarriff Harbour (km 2241) · ? (km 2300) · Barley Cove (km 2303) · ★Mizen Head (km 2310) · Altar (km 2323) · Colla Pier (km 2331) · Long Island (km 2331) · Schull Harbour (km 2334) · Cunnamore Pier (km 2334) · Heir Island (km 2334) · Lough Hyne (km 2344) · Inishbeg (km 2374) · Baltimore Harbour (km 2383) · Sherkin Island (km 2383) · Toe Head Bay (km 2392) · Galley Head View (km 2416) · Inchydoney Beach (km 2446) · Timoleague Abbey (km 2465) · ★? (km 2484)

### DAY 10 · WED 19 AUG — Rosslare → home
*Morning boat, long road north*


| # | Stop | Type | Time/impact |
|---|---|---|---|
| 1 | **Rosslare → Fishguard** | ⛴ TRANSFER (non-WAW) | — |
| 2 | **Fishguard → Preston** | ⛴ TRANSFER (non-WAW) | — |

Stop detail:
- **Rosslare → Fishguard**: At the port by 07:15 for the 08:15 Stena Nordica sailing (3h30). Into Fishguard 11:45.
- **Fishguard → Preston**: ~250mi / ~5h up the M4 → M5 → M6. Home for the evening.

---

## PART 4 — THE 15 SIGNATURE DISCOVERY POINTS (official km marks)

| ★ | km | Day | How |
|---|---|---|---|
| Malin Head | 101 | 1 | full visit + Farren's, evening |
| Cionn Fhánada
 | 242 | ? |  |
| Sliabh Liag | 476 | 3 | Bunglass viewpoint |
| Mullaghmore Head | 586 | 3 | full visit |
| Downpatrick Head | 741 | 4 | full visit |
| Keem Bay | 1053 | 5 | dawn visit |
| Killary Harbour | 1150 | 5 | full visit |
| Derrigmlagh Bog | 1218 | 6 | boardwalk |
| Cliffs of Moher | 1485 | 7 | 08:00 visit |
| Loop Head | 1577 | 7 | full visit |
| Ionad an Bhlascaoid Mhóir | 1856 | 7 | Slea Head Drive, evening (Blasket view) |
| Sceilg Mhichíl | 1998 | 8 | Kerry Cliffs viewpoint (landing sold out) |
| Dursey Island | 2164 | 8 | Sound + cable-car station (crossing = 2h, excluded) |
| Mizen Head | 2310 | 9 | footbridge visit |
| ? | 2484 | 9 | signal tower viewpoint (Old Head) |

## PART 5 — CAMPSITE DOSSIER (verification honesty)

| Night | Site | km | Status | Price (unverified unless noted) | Route impact |
|---|---|---|---|---|---|
| Mon 10 | Binion Bay Camping, Clonmany | — | **BOOKED ✓** (tents+bikes confirmed) | unknown — ask | +0.5 mi / forward ✓ |
| Tue 11 | Corcreggan Mill, Dunfanaghy | — | **BOOKED ✓** (tents+bikes confirmed) | ~€24 total / ~€12pp | +1.4 mi / forward ✓ |
| Wed 12 | Strandhill Caravan & Camping | — | phone to book | ~€40 total / ~€20pp | +0.1 mi / forward ✓ |
| Thu 13 | Keel Sandybanks | — | **BOOKED ✓** (tents+bikes confirmed) | ~€36 total / ~€18pp | +0.1 mi / forward ✓ |
| Fri 14 | Clifden Eco Beach Camping | — | advance booking only — no walk-ins | ~€40 total / ~€20pp | +0.8 mi / forward ✓ |
| Sat 15 | O'Connors Riverside, Doolin | — | book now — peak Saturday, most contested pitch of the trip | unknown — ask | +0.2 mi / forward ✓ |
| Sun 16 | Campáil Teach an Aragail, Gallarus | — | **BOOKED ✓** (tents+bikes confirmed) | ~€30 total / ~€15pp | +0.4 mi / forward ✓ |
| Mon 17 | Hungry Hill Lodge & Camping | — | **BOOKED ✓** (tents+bikes confirmed) | unknown — ask | +0.2 mi / forward ✓ |
| Tue 18 | IOAC, Tagoat | — | **BOOKED ✓** (tents+bikes confirmed) | unknown — ask | +0 mi / forward ✓ |

Sources: night 1 = booked by riders; prices = previous trip research, UNVERIFIED — confirm on the phone. **Call order: 1) Hungry Hill Adrigole (nothing verified, endgame depends on it), 2) Nagle's Doolin (peak Saturday), 3) Clifden Eco (advance-only), 4) Strandhill & Keel (sell out).**

## PART 6 — OPTIONAL EXTRAS LEDGER (the only cuttable things)

| Extra | Day | Exit / rejoin | Base vs via | Impact | Method |
|---|---|---|---|---|---|
| Fort Dunree | 02 | Urris road (post-Mamore) → same (out-and-back) | 0 vs 4 mi | +4 mi / +12 min | manual road est · verify pre-trip |
| Glenveagh / Errigal | 03 | Gweedore (R251) → same (out-and-back) | 0 vs 20 mi | +20 mi / +50 min | manual road est · verify pre-trip |
| Poulnabrone dolmen | 06 | Ballyvaughan (R480) → same (out-and-back) | 0 vs 10 mi | +10 mi / +25 min | manual road est · verify pre-trip |
| Healy Pass at sunrise | 09 | Adrigole (R574) → same (out-and-back to the saddle) | 0 vs 9 mi | +9 mi / +30 min | manual road est · verify pre-trip |

Also excluded outright (time physics, not preference): Skellig Michael landing (~5h), Dursey cable-car crossing (~2h), Aran Islands (full day), Killarney NP + Ballaghbeama + Corkscrew Hill (not on the Way; Black Head R477 IS the Way and is ridden).

## PART 7 — ASSUMPTIONS & OPEN VERIFICATIONS
1. Speed model: 30 mph average on coastal WAW (includes short photo halts), 46 mph on N-road transfers. Cross-check welcome.
2. Extra-impact figures are estimates from road knowledge, flagged "est" — 5 minutes in Google Maps confirms each; none are crow-flies.
3. Killimer–Tarbert ferry: hourly on the half-hour, ~20 min — verify August timetable.
4. Sliabh Liag Bunglass road: August shuttle management may apply to cars; bikes usually reach the upper gate — verify current rules.
5. Omey Island: crossable ~3h either side of low water — pull the tide table for Fri 14 Aug.
6. Steam Packet lands 14:15 — Day 1 assumes wheels rolling ~14:30–14:45.
7. August light: ridable ~06:15–21:00 (NW) / ~06:25–20:50 (SW).
8. Campsite prices/tents/check-ins: previous research only — UNVERIFIED, phone list above.
9. The 2.8 km spine tail beyond Kinsale town (to the exact terminus marker) is inside Day 9's window.

## PART 8 — THE HONEST RISK REGISTER
- **Day 9 is the price of 100.0%**: ~320 mi planned (130 of it fast transfer), 06:00 start, ~12h door-to-door before any Maybes. It ends at a boat with a 7h sleep buffer, not another riding day. If it must shrink on the day, the ONLY legitimate lever inside 100% mode is stop time — cutting road = abandoning 100%, and the app will say so.
- **Days 3, 4, 7, 8 are all 180–240 official miles.** The finale is not an outlier; this is a hard trip throughout. The Day-5 recovery is load-bearing — don't fill it.
- **Hungry Hill (Adrigole) is a single point of failure** for the endgame — verify it FIRST; three fallbacks listed.
- **Weather insurance**: several sites offer pods (~€60/night) — a named Atlantic storm means one phone call, not a plan change.
- **Nagle's on a peak-season Saturday** is the most contested pitch — book now.

## PART 9 — CROSS-CHECK BRIEF (paste to any other planner)
Challenge this plan on: (1) any leg where stop order fights real road geography or one-way/bus flow; (2) the 30/46 mph speed model against your own routing engine, day by day; (3) the claim that no campsite boundary shift reduces the Day 7–9 workload without deleting official miles (anchors: Doolin/Gallarus/Adrigole/Rosslare); (4) the five extras' road impacts (Torr +3/35, Dunree +4/12, Glenveagh +15/40, Poulnabrone +10/25, Healy +9/30); (5) the Day-9 timeline 06:00 Adrigole → ~16:30 Kinsale → ~19:30 Rosslare in mid-August traffic; (6) whether any official WAW section is missing from the nine windows (they are contiguous km 0→2506.8 against the Fáilte Ireland KML). Do NOT accept any proposal that removes official mileage while claiming 100% completion.
