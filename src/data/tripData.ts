/* Wild Atlantic Way — trip content.
   Ported verbatim from the original handoff's trip-data.js (window.TRIP). This is
   clean, portable data: route coordinates, days, campsites, the Signature 15,
   packing lists, ferries and the hand-authored Ireland map geometry.

   Isle of Man is ridden first (planned elsewhere); here it is only the ferry INTO
   Ireland (Mon 10, Douglas→Larne) and the ferry HOME (Wed 19, Rosslare→Fishguard).
   Stop tags: s=Signature b=Biker road w=WAW point view beach pub cafe food history
   nature attraction town finish logistics */

import type { Trip } from '../types'

export const tripData: Trip = {
  "meta": {
    "title": "Wild Atlantic Way",
    "kicker": "Bald(ing) Brothers",
    "subtitle": "Two up · two bikes · under canvas",
    "route": "Malin Head → Kinsale",
    "dates": "Mon 10 – Wed 19 Aug 2026",
    "depart": "2026-08-10",
    "countdownTo": "the Wild Atlantic Way",
    "nights": 9,
    "dayCount": 10,
    "totalMiles": "~1,700",
    "sigCount": 15,
    "intro": "The official Wild Atlantic Way — every mile of the signed route, Muff to Kinsale, rebuilt against Fáilte Ireland’s own map so the road only ever runs forward. Plus the best biker roads on the island: Mamore, Glengesh, Conor Pass, Coomanaspig and the Healy Pass at sunrise. Nine hard days off the Monday ferry; all fifteen Signature Points; finish at Kinsale then the run to the Rosslare boat."
  },
  "days": [
    {
      "n": "01",
      "dow": "MON",
      "date": "10 AUG",
      "title": "Ferry → Antrim Coast → Inishowen",
      "tagline": "Off the boat, the coast road, and the Way begins at Muff",
      "miles": "~150mi + ferry",
      "phase": "lead",
      "wawStart": true,
      "warnBanner": "Boat runs late? Call it at Derry (~17:30): skip Torr Head, or run Muff → R238 straight to camp and take Malin Head as a 25-mile spur at dawn — tomorrow is the short day.",
      "stops": [
        {
          "n": "Douglas → Larne",
          "skip": true,
          "d": "Steam Packet 09:30, into Larne 14:15 (~4h45). The ONLY Isle of Man→Ireland sailing — nothing runs Sunday, so the riding starts this afternoon.",
          "warn": "Vehicle check-in closes 45 min before — be at Douglas for 08:45.",
          "tags": [
            "logistics"
          ]
        },
        {
          "n": "A2 Antrim Coast Road",
          "d": "Straight off the boat onto one of Europe's great coast roads — built 1832, hugging the sea wall past Glenarm, Carnlough, Glenariff and Cushendun.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Torr Head",
          "d": "Steep, narrow single-track loop off the A2 — Scotland only 12mi across the water. The one lead-in road worth the detour (and the first thing to drop if the boat ran late).",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Muff — the Way begins",
          "d": "Skirt Derry and cross into Donegal at Muff on Lough Foyle — the official start/end point of the Wild Atlantic Way, km zero. Currency and speed flip to € and km/h; home of the Muff Liquor Co. Photo at the marker.",
          "tags": [
            "w",
            "town",
            "attraction"
          ]
        },
        {
          "n": "East Inishowen shore",
          "d": "The first miles of the Way proper: Moville, Greencastle and out to Inishowen Head — the first Discovery Points fall inside the opening hour.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Kinnagoe Bay",
          "d": "Steep drop to a huge empty beach — an Armada wreck site (La Trinidad Valencera, 1588).",
          "tags": [
            "beach",
            "history"
          ]
        },
        {
          "n": "Culdaff",
          "d": "Beach village on the north shore — the road west from here runs straight for the head.",
          "tags": [
            "beach",
            "town"
          ]
        },
        {
          "n": "MALIN HEAD",
          "d": "Ireland's most northerly point. Banba's Crown Napoleonic tower, the “EIRE 80” WW2 sign, a Star Wars: The Last Jedi filming site — Signature Point number one, bagged on day one.",
          "tags": [
            "s",
            "w",
            "view"
          ]
        },
        {
          "n": "Farren's Bar",
          "d": "Ireland's most northerly pub — a sticker-and-photo stop, 5 minutes off the head.",
          "tags": [
            "pub"
          ]
        },
        {
          "n": "Doagh → Pollan Bay → camp",
          "d": "Down the west shoulder through Doagh Isle and Ballyliffin to Binion — tent up in the last of the light, everything east of you already done.",
          "tags": [
            "b",
            "beach"
          ]
        }
      ],
      "night": {
        "area": "Inishowen",
        "primary": "Binion Bay Camping, Clonmany",
        "note": "BOOKED ✓ — beachside at Binnion strand, just round from Tullagh Bay. Cash (€) from here on.",
        "backup": "Tullagh Bay Camping (the next bay over)",
        "sellout": false
      }
    },
    {
      "n": "02",
      "dow": "TUE",
      "date": "11 AUG",
      "title": "Mamore Gap → Fanad → Rosguill",
      "tagline": "Three peninsulas, one easy day — the recovery after the dash",
      "miles": "~120mi",
      "phase": "waw",
      "stops": [
        {
          "n": "Gap of Mamore",
          "d": "Straight from the tent up the switchback gap between Mamore Hill and Urris — 1-in-4 gradients and the whole of Lough Swilly below.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Fort Dunree",
          "d": "Coastal defence fort on a headland over the Swilly — military museum, sea views, usually empty.",
          "tags": [
            "history",
            "view"
          ]
        },
        {
          "n": "Round the Swilly",
          "d": "Buncrana, Lisfannon beach, Inch Island — then the one inland dip of the whole Way: there is no bridge over Lough Swilly, so the line rounds it through Letterkenny and back out to Rathmullan. (A summer Buncrana–Rathmullan foot-and-bike ferry sometimes runs — worth checking; it saves ~25mi.)",
          "tags": [
            "b"
          ]
        },
        {
          "n": "Knockalla coast road",
          "d": "From Rathmullan the road climbs onto the Knockalla shoulder — riding right on the sea, the Swilly on your right, down to Portsalon.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Ballymastocker Bay / Portsalon",
          "d": "Regularly voted among the world’s best beaches — the view arriving from Knockalla is the one on the postcards.",
          "tags": [
            "beach",
            "view"
          ]
        },
        {
          "n": "FANAD HEAD",
          "d": "One of the world’s most beautiful lighthouses, at the mouth of the Swilly. Signature Point two.",
          "tags": [
            "s",
            "w",
            "view"
          ]
        },
        {
          "n": "Harry Blaney Bridge",
          "d": "Exit Fanad across Mulroy Bay on the Blaney bridge — straight onto the Rosguill peninsula.",
          "tags": [
            "b"
          ]
        },
        {
          "n": "Atlantic Drive, Rosguill",
          "d": "A short, stunning loop — Downings, Tranarossan, the lot. Unmissable and only 20 minutes.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Glenveagh / Errigal (optional)",
          "d": "Inland detour if the day is flying (+30mi): castle and gardens, or Errigal and the Poisoned Glen on the R251. Not on the Way — your call.",
          "tags": [
            "attraction",
            "nature"
          ]
        },
        {
          "n": "Dunfanaghy",
          "d": "Good food town under Horn Head — the headland itself is 100 metres from tonight’s campsite gate, saved for first thing tomorrow.",
          "tags": [
            "town",
            "food"
          ]
        }
      ],
      "night": {
        "area": "NW Donegal",
        "primary": "Corcreggan Mill, Dunfanaghy",
        "note": "Quirky and biker-friendly, in an old mill.",
        "backup": "Wild Atlantic Camp, Creeslough (pods = storm insurance)",
        "sellout": false
      }
    },
    {
      "n": "03",
      "dow": "WED",
      "date": "12 AUG",
      "title": "Horn Head → Slieve League → Sligo",
      "tagline": "The long one — Donegal's whole west face in a day",
      "miles": "~190mi",
      "phase": "waw",
      "warnBanner": "Longest riding day of the trip. Release valves, in order: N56 mainline through the Rosses (−25mi), skip Glencolmcille & Malin Beg (−18mi), skip Rossnowlagh (−8mi). Call each one AT the junction, not after it.",
      "stops": [
        {
          "n": "Horn Head loop",
          "d": "First 30 minutes of the day: the loop above 180m sea cliffs, straight from the campsite. Empty at 08:00.",
          "tags": [
            "view",
            "b"
          ]
        },
        {
          "n": "Bloody Foreland",
          "d": "Headland named for the red glow of the setting sun on the rock — rounding it, the road turns south for the first time and stays south for a week.",
          "tags": [
            "w",
            "view"
          ]
        },
        {
          "n": "The Rosses",
          "d": "Granite, lakes and pier lanes through Gweedore and Dungloe, then Narin/Portnoo strand. (This stretch is valve #1 if time is tight — the N56 runs straight through.)",
          "tags": [
            "b",
            "beach"
          ]
        },
        {
          "n": "Maghera & Assaranca",
          "d": "West of Ardara: Assaranca waterfall right beside the road, then the caves and dunes at Maghera.",
          "tags": [
            "nature",
            "beach"
          ]
        },
        {
          "n": "Glengesh Pass",
          "d": "Hairpins over the hills between Ardara and Glencolmcille — one of Donegal’s great biking roads.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Glencolmcille & Malin Beg",
          "d": "Out to the Silver Strand — a perfect horseshoe of sand at the end of the road. (Valve #2 — skipping saves ~18mi.)",
          "tags": [
            "beach",
            "view"
          ]
        },
        {
          "n": "SLIEVE LEAGUE / SLIABH LIAG",
          "d": "Among the highest sea cliffs in Europe — nearly three times Moher. Ride the spur up to Bunglass. Signature Point three.",
          "tags": [
            "s",
            "w",
            "view"
          ]
        },
        {
          "n": "Killybegs",
          "d": "Ireland’s biggest fishing port — diesel and the best chips of the trip.",
          "tags": [
            "town",
            "food"
          ]
        },
        {
          "n": "Donegal Bay run",
          "d": "Donegal Town, Rossnowlagh (valve #3), Tullan Strand and Bundoran — surf country, faster roads.",
          "tags": [
            "b",
            "beach"
          ]
        },
        {
          "n": "MULLAGHMORE HEAD",
          "d": "The harbour, Classiebawn castle against Benbulben, and the big-wave reef offshore. Signature Point four.",
          "tags": [
            "s",
            "w",
            "view"
          ]
        },
        {
          "n": "Drumcliffe → Strandhill",
          "d": "Yeats’ grave under bare Benbulben’s head at Drumcliffe, Rosses Point, then into Strandhill for the night — surf town, seaweed baths if the legs are done. (Carrowmore megalithic cemetery — among the oldest in Ireland — is 5 min inland from camp: an evening leg-stretch, not a riding stop.)",
          "tags": [
            "history",
            "town"
          ]
        }
      ],
      "night": {
        "area": "Sligo",
        "primary": "Strandhill Caravan & Camping",
        "note": "On the beach, pubs walkable.",
        "backup": "Greenlands, Rosses Point",
        "sellout": true
      }
    },
    {
      "n": "04",
      "dow": "THU",
      "date": "13 AUG",
      "title": "Downpatrick → Céide → Erris → Achill",
      "tagline": "Into the emptiest, wildest corner of the whole Way",
      "miles": "~185mi",
      "phase": "waw",
      "warnBanner": "Decision point at Céide Fields ~13:30: the full Mullet/Blacksod run is the day’s big optional block — skipping it saves ~45mi and Achill still gets its full evening.",
      "stops": [
        {
          "n": "The Sligo surf coast",
          "d": "Aughris Head, Easkey and Enniscrone — reef breaks and empty strands, quick miles.",
          "tags": [
            "beach",
            "b"
          ]
        },
        {
          "n": "Ballina & Killala",
          "d": "Across the Moy at Ballina, then the round tower and quay at Killala — 1798 French landing country.",
          "tags": [
            "town",
            "history"
          ]
        },
        {
          "n": "DOWNPATRICK HEAD",
          "d": "Dún Briste — the sea stack standing off the headland with its layers exposed like a cut cake. Blowhole, WW2 EIRE sign. Signature Point five.",
          "tags": [
            "s",
            "w",
            "view"
          ]
        },
        {
          "n": "Céide Fields",
          "d": "The oldest known field systems on Earth, under the bog for 5,500 years — and the cliff viewpoint is free.",
          "tags": [
            "attraction",
            "history"
          ]
        },
        {
          "n": "North Mayo cliff road",
          "d": "Belderrig to Belmullet — the loneliest tarmac in Ireland. Fuel at Belmullet.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Blacksod lighthouse (optional)",
          "d": "Down the Mullet to Blacksod — the lighthouse whose weather report delayed D-Day by 24 hours. The peninsula run is ~40mi there-and-back: the day’s named valve.",
          "tags": [
            "attraction",
            "history"
          ]
        },
        {
          "n": "Ballycroy / Wild Nephin",
          "d": "Along the edge of Ireland’s only wilderness national park — bog, the Nephin Beg range, and not much else. Glorious.",
          "tags": [
            "nature",
            "b"
          ]
        },
        {
          "n": "Mulranny → Achill Sound",
          "d": "The causeway viewpoint over Clew Bay’s drumlins, then over the bridge onto Achill.",
          "tags": [
            "view",
            "b"
          ]
        },
        {
          "n": "Achill Atlantic Drive",
          "d": "The cliff road round the south of the island — Cloughmore, the Minaun cliffs across the bay.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Keel",
          "d": "The strand, the pubs, the tent. Keem Bay is 5 miles on — saved for 08:00 tomorrow when the car park is empty and the light is on the cliffs.",
          "tags": [
            "town",
            "beach"
          ]
        }
      ],
      "night": {
        "area": "Achill Island",
        "primary": "Keel Sandybanks Caravan & Camping",
        "note": "On Keel beach.",
        "backup": "Seal Caves, Dugort",
        "sellout": true
      }
    },
    {
      "n": "05",
      "dow": "FRI",
      "date": "14 AUG",
      "title": "Keem → Westport → Doolough → Killary",
      "tagline": "The recovery day — and somehow still the prettiest",
      "miles": "~110mi",
      "phase": "waw",
      "stops": [
        {
          "n": "KEEM BAY at dawn",
          "d": "The amphitheatre beach at the end of Achill’s cliff road — Signature Point six, to yourselves at 08:00. (Spur: 10mi there-and-back from Keel.)",
          "tags": [
            "s",
            "w",
            "beach",
            "view"
          ]
        },
        {
          "n": "Mulranny → Newport",
          "d": "Back across the island and along Clew Bay — 365 islands, one for every day of the year, allegedly.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Westport",
          "d": "The town of the trip — long lunch, Matt Molloy’s for one (of the Chieftains; sessions from lunchtime).",
          "tags": [
            "town",
            "food",
            "pub"
          ]
        },
        {
          "n": "Croagh Patrick",
          "d": "The Reek — Ireland’s holy mountain, pilgrim path visible from the road viewpoint at Murrisk.",
          "tags": [
            "view",
            "history"
          ]
        },
        {
          "n": "Doolough Valley",
          "d": "The famine road between the mountains and the black lake — a memorial marks the 1849 tragedy. One of the great sombre roads of Ireland, and officially on the Way.",
          "tags": [
            "w",
            "view",
            "history"
          ]
        },
        {
          "n": "Aasleagh Falls → Leenane",
          "d": "The falls at the head of the fjord, then the village from The Field.",
          "tags": [
            "nature",
            "view"
          ]
        },
        {
          "n": "KILLARY HARBOUR",
          "d": "Ireland’s only true fjord — 16km of dark water between the Mweelrea and Maumturk walls. Signature Point seven.",
          "tags": [
            "s",
            "w",
            "view"
          ]
        },
        {
          "n": "Letterfrack & Connemara NP",
          "d": "Under Diamond Hill through Letterfrack, then the Renvyle/Tully Cross shore.",
          "tags": [
            "nature",
            "view"
          ]
        },
        {
          "n": "Cleggan → Omey Island",
          "d": "To Claddaghduff, where tonight’s tent faces Omey strand — walk (or ride, carefully) across the sand to the island if the tide’s out.",
          "tags": [
            "beach",
            "attraction"
          ]
        }
      ],
      "night": {
        "area": "Connemara",
        "primary": "Clifden Eco Beach, Claddaghduff",
        "note": "Tent on the machair facing Omey — one of the great pitches of Ireland.",
        "backup": "Clifden Camping & Caravan Park",
        "sellout": true
      }
    },
    {
      "n": "06",
      "dow": "SAT",
      "date": "15 AUG",
      "title": "Sky Road → Connemara shore → Burren → Doolin",
      "tagline": "Bog, granite and limestone — three worlds in one day",
      "miles": "~170mi",
      "phase": "waw",
      "stops": [
        {
          "n": "Sky Road",
          "d": "The loop above Clifden bay — take the upper fork, obviously. Coffee in Clifden after.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "DERRIGIMLAGH",
          "d": "The bog where the modern world arrived twice: Marconi’s first transatlantic radio station and the spot Alcock & Brown crash-landed the first transatlantic flight, 1919. Boardwalk loop ~45 min. Signature Point eight.",
          "tags": [
            "s",
            "w",
            "history"
          ]
        },
        {
          "n": "Roundstone",
          "d": "Harbour village under Errisbeg — Dog’s Bay and Gurteen back-to-back beaches just south.",
          "tags": [
            "town",
            "view",
            "beach"
          ]
        },
        {
          "n": "South Connemara shore",
          "d": "R340/R336 through the granite-and-seaweed country — Pearse’s Cottage, Rosmuc, and the Carna loop (the day’s valve: −22mi via the N59 if the morning ran long).",
          "tags": [
            "b"
          ]
        },
        {
          "n": "Spiddal → Galway",
          "d": "Into the city with the Burren rising across the bay. Ride through — coffee at most; Saturday Galway will eat the afternoon whole.",
          "tags": [
            "town"
          ]
        },
        {
          "n": "Kinvara",
          "d": "Dunguaire Castle on its tidal rock — the classic photo.",
          "tags": [
            "view",
            "history"
          ]
        },
        {
          "n": "Ballyvaughan & Poulnabrone (optional)",
          "d": "The Burren proper. Poulnabrone dolmen is +8mi inland on the R480 — 5,800 years old and worth it if there’s an hour spare.",
          "tags": [
            "history",
            "attraction"
          ]
        },
        {
          "n": "Black Head R477",
          "d": "The limestone shore road under Gleninagh — grey pavement into grey sea, Aran across the sound. One of the Way’s best riding stretches.",
          "tags": [
            "b",
            "w",
            "view"
          ]
        },
        {
          "n": "Fanore → Doolin",
          "d": "Down the coast to the trad capital of Ireland. Session in McDermott’s or Gus O’Connor’s tonight — the Cliffs are 10 minutes south, saved for 08:00.",
          "tags": [
            "town",
            "pub"
          ]
        }
      ],
      "night": {
        "area": "Doolin",
        "primary": "Nagle's Doolin",
        "note": "Cliffs of Moher view from the tent.",
        "backup": "O'Connors Riverside",
        "sellout": true
      }
    },
    {
      "n": "07",
      "dow": "SUN",
      "date": "16 AUG",
      "title": "Cliffs → Loop Head → Shannon → Conor Pass",
      "tagline": "Two counties, one ferry, one mighty pass",
      "miles": "~195mi",
      "phase": "waw",
      "warnBanner": "Shannon ferry is hourly, on the half-hour from Killimer (~20 min crossing) — perfect lunch stop. Valves: N69 direct after Ballybunion (−15mi), skip the Maharees (−12mi). Loop Head is NOT a valve — it’s a Signature Point and the emptiest one on the Way.",
      "stops": [
        {
          "n": "CLIFFS OF MOHER, 08:00",
          "d": "At the gates when they open, before the coach army lands — O’Brien’s Tower, 214m straight down, puffins below in August. Signature Point nine.",
          "tags": [
            "s",
            "w",
            "view"
          ]
        },
        {
          "n": "Lahinch → Spanish Point",
          "d": "Surf town, then the point named for the Armada dead of 1588.",
          "tags": [
            "beach",
            "history"
          ]
        },
        {
          "n": "Kilkee Cliffs",
          "d": "The Duggerna cliffs and Pollock Holes on the west end of the horseshoe bay — Clare’s underrated answer to Moher.",
          "tags": [
            "view",
            "b"
          ]
        },
        {
          "n": "LOOP HEAD",
          "d": "Out the north side, lighthouse at the tip, back along the south shore via Carrigaholt — a natural loop, no retracing. Signature Point ten.",
          "tags": [
            "s",
            "w",
            "view"
          ]
        },
        {
          "n": "Killimer → Tarbert ferry",
          "d": "Across the Shannon mouth — bikes board first. Saves 85mi via Limerick.",
          "tags": [
            "logistics",
            "b"
          ]
        },
        {
          "n": "Ballybunion",
          "d": "Castle ruin between the two strands — quick leg-stretch, then the miles across north Kerry.",
          "tags": [
            "beach",
            "view"
          ]
        },
        {
          "n": "Camp → Castlegregory",
          "d": "Onto the Dingle peninsula’s north shore under the Slieve Mish — the Maharees spit is the day’s optional detour.",
          "tags": [
            "b",
            "beach"
          ]
        },
        {
          "n": "CONOR PASS",
          "d": "Ireland’s highest paved pass, ridden INBOUND — the official direction — from Cloghane over the top and the great descent into Dingle with the harbour laid out below.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Dingle town",
          "d": "Early dinner and one pint — Foxy John’s (hardware shop + bar) or Dick Mack’s. Ten minutes north to the tent after.",
          "tags": [
            "town",
            "pub",
            "food"
          ]
        },
        {
          "n": "Gallarus",
          "d": "Camp beside the 1,200-year-old Gallarus Oratory — dry-stone, still watertight. Tomorrow starts with Slea Head at dawn.",
          "tags": [
            "history"
          ]
        }
      ],
      "night": {
        "area": "West Dingle",
        "primary": "Campáil Teach an Aragail, Gallarus",
        "note": "Mid-Slea Head loop — sets up the dawn drive.",
        "backup": "Dingle town campsite",
        "sellout": false
      }
    },
    {
      "n": "08",
      "dow": "MON",
      "date": "17 AUG",
      "title": "Slea Head dawn → Ring of Kerry → Beara north",
      "tagline": "The queen stage — three peninsulas before dark",
      "miles": "~210mi",
      "phase": "waw",
      "warnBanner": "Dawn start, luggage on: Slea Head clockwise at 07:00 is empty and world-class. Valves, in order: skip Valentia Island (Kerry Cliffs covers the Skelligs, −14mi), skip Ballinskelligs (−8mi). Emergency only: N70 straight Cahersiveen → Waterville (−28mi — loses the Skellig Ring).",
      "stops": [
        {
          "n": "SLEA HEAD DRIVE at dawn",
          "d": "Clockwise (the official/bus direction): Ventry, the beehive huts, Slea Head itself — then DUNMORE HEAD, mainland Ireland’s westernmost point and the Blasket Islands view. Signature Point eleven, before breakfast.",
          "tags": [
            "s",
            "b",
            "w",
            "view"
          ]
        },
        {
          "n": "Dunquin → Ballyferriter",
          "d": "The Blasket Centre, Kruger’s (Ireland’s westernmost pub — too early, note it for next time), round to Ballyferriter and past the tent to Dingle for coffee.",
          "tags": [
            "view",
            "history"
          ]
        },
        {
          "n": "South Pole Inn, Annascaul",
          "d": "Tom Crean's own pub, directly on the exit road east — the Antarctic legend's statue outside. Shut at this hour (the pint was last night in Dingle), but the photo is free and costs zero miles.",
          "tags": [
            "pub",
            "history"
          ]
        },
        {
          "n": "Inch Strand",
          "d": "Three miles of dune-backed sand — dead on the exit road east. Zero detour, one photo.",
          "tags": [
            "beach"
          ]
        },
        {
          "n": "Killorglin → the N70 coast",
          "d": "Onto the Ring of Kerry proper, ridden ONCE, anticlockwise with the flow: Glenbeigh, Rossbeigh strand, Kells, Cahersiveen.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Portmagee & Kerry Cliffs",
          "d": "The Skellig viewpoint — Skellig Michael and Little Skellig off the cliffs. (Landing boats sell out months ahead and eat 5 hours; the cliffs are the honest 9-day version.) Signature Point twelve.",
          "tags": [
            "s",
            "w",
            "view"
          ]
        },
        {
          "n": "Coomanaspig Pass",
          "d": "Up and over from Portmagee to St Finian’s Bay — one of the highest public roads in Ireland, savage gradients, monastery views.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Waterville → Coomakista",
          "d": "Charlie Chaplin’s seafront, then the Coomakista pass viewpoint over Ballinskelligs Bay and the Skelligs again.",
          "tags": [
            "view",
            "town"
          ]
        },
        {
          "n": "Derrynane, Caherdaniel",
          "d": "Daniel O’Connell’s house and one of Ireland’s finest small beaches, then Sneem’s coloured houses.",
          "tags": [
            "beach",
            "history"
          ]
        },
        {
          "n": "Kenmare",
          "d": "Fuel and food, ~17:00 — then leave the crowds behind: the Way turns down Beara’s empty north side. R571 through Tuosist, Ardgroom, Eyeries.",
          "tags": [
            "town",
            "food",
            "b"
          ]
        },
        {
          "n": "DURSEY SOUND",
          "d": "The cable-car station at the end of Beara — Ireland’s only cable car, six people and the odd sheep. (Crossing eats 2 hours — the sound and the island from the viewpoint is the bag.) Signature Point thirteen.",
          "tags": [
            "s",
            "w",
            "view"
          ]
        },
        {
          "n": "Castletownbere & McCarthy's Bar",
          "d": "The pint at McCarthy’s — of the book cover — in Ireland’s biggest whitefish port. Twenty easy minutes to the tent after.",
          "tags": [
            "town",
            "pub"
          ]
        }
      ],
      "night": {
        "area": "Beara — Adrigole",
        "primary": "Hungry Hill Lodge & Camping, Adrigole",
        "note": "At the literal foot of the Healy Pass. Phone ahead — confirm tents and a ~20:30 arrival.",
        "backup": "Berehaven Camping, Castletownbere — anywhere on the Adrigole–Glengarriff road works",
        "sellout": false
      }
    },
    {
      "n": "09",
      "dow": "TUE",
      "date": "18 AUG",
      "title": "Healy Pass sunrise → Mizen → KINSALE → Rosslare",
      "tagline": "Finish it, then run for the boat",
      "miles": "~290mi (~130 fast transfer)",
      "phase": "waw",
      "warnBanner": "06:30 start — Healy Pass empty at sunrise is the payoff for yesterday. Hard valves if you leave Skibbereen after 14:00: drop the Old Head spur (−10mi/−40min) and Drombeg (−3mi) and go finish. The boat does not wait.",
      "stops": [
        {
          "n": "HEALY PASS at sunrise",
          "d": "The tent is at its southern foot: ride the switchbacks up to the saddle for sunrise over Glanmore Lake and back down for breakfast — 16 miles, 45 minutes, the single best road on the island, to yourselves. Its “dangerous” reputation is hugely exaggerated.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Glengarriff → Bantry",
          "d": "Out of Beara along the harbour, Garnish Island offshore, into Bantry under Whiddy.",
          "tags": [
            "town",
            "view"
          ]
        },
        {
          "n": "Durrus → Goleen",
          "d": "The lanes down the Mizen — last peninsula of the trip. (Sheep’s Head and Baltimore are the deliberate cuts that keep the boat safe — next time.)",
          "tags": [
            "b"
          ]
        },
        {
          "n": "MIZEN HEAD",
          "d": "Ireland’s south-westernmost point — the footbridge over the gorge, the signal station, the Fastnet out to sea. Signature Point fourteen.",
          "tags": [
            "s",
            "w",
            "view"
          ]
        },
        {
          "n": "Barleycove",
          "d": "The dune beach below the head — thrown up by the 1755 Lisbon-earthquake tsunami, allegedly.",
          "tags": [
            "beach"
          ]
        },
        {
          "n": "Schull → Skibbereen",
          "d": "Coffee harbour under Mount Gabriel, then the West Cork main drag. TIME CHECK at Skibbereen: 14:00 or better = all remaining stops live.",
          "tags": [
            "town",
            "food"
          ]
        },
        {
          "n": "Drombeg Stone Circle",
          "d": "Bronze-age circle five minutes off the road — free, atmospheric, aligned on the winter solstice sunset.",
          "tags": [
            "history"
          ]
        },
        {
          "n": "Clonakilty → Timoleague",
          "d": "Through Clon (Michael Collins country) past the abbey ruin on the estuary at Timoleague.",
          "tags": [
            "town",
            "history"
          ]
        },
        {
          "n": "OLD HEAD OF KINSALE",
          "d": "The spur to the signal tower viewpoint — the Lusitania sank 11 miles off this head in 1915. The tip itself is a private golf course; the viewpoint is the prize. Signature Point fifteen — the set, complete.",
          "tags": [
            "s",
            "w",
            "view",
            "history"
          ]
        },
        {
          "n": "KINSALE",
          "d": "THE OFFICIAL END OF THE WILD ATLANTIC WAY — 2,500km from Muff. Finish-line photo at the marker, Charles Fort if there’s half an hour, fuel for the run.",
          "finish": true,
          "tags": [
            "town",
            "pub",
            "finish"
          ]
        },
        {
          "n": "N25 run to Rosslare",
          "skip": true,
          "d": "Kinsale → Cork → N25 east — ~130mi of main road, ~2h45. Fuel at Cork, heads down, tent by ~19:30. The price of the morning boat — but the Way is already won.",
          "warn": "Long transfer after a big day — fuel up and push on.",
          "tags": [
            "logistics"
          ]
        }
      ],
      "night": {
        "area": "Rosslare (for the boat)",
        "primary": "St Margaret's Beach Camping, Rosslare",
        "note": "~30 min from Rosslare Harbour. Sets up the 08:15 sailing.",
        "backup": "Morriscastle Strand, Kilmuckridge",
        "sellout": false
      }
    },
    {
      "n": "10",
      "dow": "WED",
      "date": "19 AUG",
      "title": "Rosslare → home",
      "tagline": "Morning boat, long road north",
      "miles": "ferry + ~250mi",
      "phase": "home",
      "stops": [
        {
          "n": "Rosslare → Fishguard",
          "d": "At the port by 07:15 for the 08:15 Stena Nordica sailing (3h30). Into Fishguard 11:45.",
          "tags": [
            "logistics"
          ]
        },
        {
          "n": "Fishguard → Preston",
          "d": "~250mi / ~5h up the M4 → M5 → M6. Home for the evening.",
          "tags": [
            "logistics"
          ]
        }
      ],
      "night": null
    }
  ],
  "ferries": {
    "inbound": [
      {
        "id": "in1",
        "route": "Douglas → Larne",
        "op": "Steam Packet · Mon 10 Aug",
        "price": "09:30 → 14:15",
        "dur": "~4h45",
        "tag": "Booked",
        "note": "The ONLY Isle of Man → Ireland sailing — nothing runs on Sunday, so Day 1 starts with the 14:15 landing at Larne. Part of the £233 combined ticket."
      }
    ],
    "home": {
      "intro": "No boat to Liverpool — it's Wales or nothing. You're on the MORNING Rosslare→Fishguard, because Fishguard→Preston is ~250mi / 5h and an evening boat would land you home in the small hours.",
      "options": [
        {
          "id": "A",
          "name": "Rosslare → Fishguard",
          "tag": "Booked · morning",
          "routes": [
            "Wed 19 Aug — 08:15 → 11:45, Stena Nordica (3h30)",
            "Be at the port by 07:15"
          ],
          "hack": "Camp Tue 18 within 30 min of Rosslare (St Margaret's Beach) so the 08:15 is a short hop, not a panic.",
          "transit": "Kinsale → Rosslare done Tuesday evening via the Copper Coast, so Wednesday is just the boat and the run home.",
          "ukLeg": "Fishguard → Preston: ~250mi / ~5h on the M4 → M5 → M6.",
          "pros": [
            "Home the same evening",
            "Nearest Welsh port to the finish"
          ],
          "cons": [
            "Big Tuesday to be near Rosslare in time"
          ]
        },
        {
          "id": "B",
          "name": "Rosslare → Pembroke",
          "tag": "Back-up only",
          "routes": [
            "Irish Ferries, ~4h — fallback if the Stena morning is full"
          ],
          "hack": "Same plan, slightly longer crossing; only if the Fishguard boat sells out.",
          "transit": "Same Copper Coast transfer on the Tuesday evening.",
          "ukLeg": "Pembroke → Preston: ~260mi / ~5h.",
          "pros": [
            "Alternative Welsh crossing"
          ],
          "cons": [
            "Slightly longer sailing"
          ]
        }
      ],
      "checklist": [
        "Both ferries booked — £233 combined (Douglas→Larne + Rosslare→Fishguard).",
        "Be at each port 60 min before (07:15 for the 08:15 boat home).",
        "Bikes are strapped by crew or with supplied straps — nothing loose on the bike deck.",
        "Confirm your insurance covers the Republic of Ireland at more than third-party."
      ]
    }
  },
  "signature": [
    {
      "id": "s1",
      "name": "Malin Head",
      "county": "Donegal",
      "day": "01",
      "date": "Mon 10"
    },
    {
      "id": "s2",
      "name": "Fanad Head",
      "county": "Donegal",
      "day": "02",
      "date": "Tue 11"
    },
    {
      "id": "s3",
      "name": "Sliabh Liag (Slieve League)",
      "county": "Donegal",
      "day": "03",
      "date": "Wed 12"
    },
    {
      "id": "s4",
      "name": "Mullaghmore Head",
      "county": "Sligo",
      "day": "03",
      "date": "Wed 12"
    },
    {
      "id": "s5",
      "name": "Downpatrick Head",
      "county": "Mayo",
      "day": "04",
      "date": "Thu 13"
    },
    {
      "id": "s6",
      "name": "Keem Bay (Achill)",
      "county": "Mayo",
      "day": "05",
      "date": "Fri 14"
    },
    {
      "id": "s7",
      "name": "Killary Harbour",
      "county": "Galway",
      "day": "05",
      "date": "Fri 14"
    },
    {
      "id": "s8",
      "name": "Derrigimlagh",
      "county": "Galway",
      "day": "06",
      "date": "Sat 15"
    },
    {
      "id": "s9",
      "name": "Cliffs of Moher",
      "county": "Clare",
      "day": "07",
      "date": "Sun 16"
    },
    {
      "id": "s10",
      "name": "Loop Head",
      "county": "Clare",
      "day": "07",
      "date": "Sun 16"
    },
    {
      "id": "s11",
      "name": "Blasket Sound (Dingle)",
      "county": "Kerry",
      "day": "08",
      "date": "Mon 17"
    },
    {
      "id": "s12",
      "name": "Bray Head (Valentia)",
      "county": "Kerry",
      "day": "08",
      "date": "Mon 17"
    },
    {
      "id": "s13",
      "name": "Dursey Sound",
      "county": "Cork",
      "day": "08",
      "date": "Mon 17"
    },
    {
      "id": "s14",
      "name": "Mizen Head",
      "county": "Cork",
      "day": "09",
      "date": "Tue 18"
    },
    {
      "id": "s15",
      "name": "Old Head of Kinsale",
      "county": "Cork",
      "day": "09",
      "date": "Tue 18"
    }
  ],
  "passes": [
    {
      "name": "Torr Head Road",
      "area": "Antrim",
      "d": "Steep single-track off the A2, spectacular, Scotland views."
    },
    {
      "name": "Mamore Gap",
      "area": "Inishowen",
      "d": "Steep switchback gap, holy well at the top."
    },
    {
      "name": "Knockalla / Fanad Drive",
      "area": "Donegal",
      "d": "Riding right on the sea."
    },
    {
      "name": "Atlantic Drive, Rosguill",
      "area": "Donegal",
      "d": "Short, stunning loop."
    },
    {
      "name": "Glengesh Pass",
      "area": "Donegal",
      "d": "Hairpins down into Ardara."
    },
    {
      "name": "Doolough Valley",
      "area": "Mayo",
      "d": "Famine road, haunting, empty."
    },
    {
      "name": "Sky Road",
      "area": "Clifden",
      "d": "Best ridden north → south."
    },
    {
      "name": "Corkscrew Hill",
      "area": "Burren, Clare",
      "d": "Switchbacks with Galway Bay views."
    },
    {
      "name": "Conor Pass",
      "area": "Dingle",
      "d": "Ireland's highest; narrow; ride early or at golden hour."
    },
    {
      "name": "Slea Head Drive",
      "area": "Dingle",
      "d": "One-way for coaches clockwise — ride clockwise with the flow."
    },
    {
      "name": "Ballaghbeama Gap",
      "area": "Kerry interior",
      "d": "Utterly empty, brilliant riding, no coaches ever."
    },
    {
      "name": "Ballaghisheen Pass",
      "area": "Kerry interior",
      "d": "Same story — empty and brilliant."
    },
    {
      "name": "Gap of Dunloe",
      "area": "Killarney",
      "d": "Discouraged 10:00–16:00 (pony traps); ride early morning or evening."
    },
    {
      "name": "Molls Gap + Ladies View",
      "area": "Killarney NP",
      "d": "The classic N71 viewpoints."
    },
    {
      "name": "Coomanaspig Pass",
      "area": "Skellig Ring",
      "d": "One of Ireland's highest paved roads, very steep."
    },
    {
      "name": "Healy Pass",
      "area": "Beara",
      "d": "THE pass. Switchbacks over the Cahas — a joy on a bike.",
      "star": true
    },
    {
      "name": "Caha Pass tunnels",
      "area": "N71 Glengarriff–Kenmare",
      "d": "Rock tunnels blasted through the mountain."
    },
    {
      "name": "Priest's Leap",
      "area": "Kenmare–Bantry",
      "d": "Hardcore optional: extremely narrow, remote, grass up the middle."
    }
  ],
  "campsites": [
    {
      "night": "Mon 10",
      "base": "Inishowen",
      "primary": "Binion Bay Camping, Clonmany",
      "primaryNote": "BOOKED ✓ — beachside at Binnion strand",
      "backup": "Tullagh Bay Camping (next bay over)",
      "sellout": false
    },
    {
      "night": "Tue 11",
      "base": "NW Donegal",
      "primary": "Corcreggan Mill, Dunfanaghy",
      "primaryNote": "Biker-friendly old mill",
      "backup": "Wild Atlantic Camp (pods = storm insurance)",
      "sellout": false
    },
    {
      "night": "Wed 12",
      "base": "Sligo",
      "primary": "Strandhill Caravan & Camping",
      "primaryNote": "On the beach",
      "backup": "Greenlands, Rosses Point",
      "sellout": true
    },
    {
      "night": "Thu 13",
      "base": "Achill Island",
      "primary": "Keel Sandybanks",
      "primaryNote": "On Keel beach",
      "backup": "Seal Caves, Dugort",
      "sellout": true
    },
    {
      "night": "Fri 14",
      "base": "Connemara",
      "primary": "Clifden Eco Beach Camping",
      "primaryNote": "On the machair facing Omey",
      "backup": "Clifden Camping & Caravan Park",
      "sellout": true
    },
    {
      "night": "Sat 15",
      "base": "Doolin",
      "primary": "Nagle's Doolin",
      "primaryNote": "Cliffs view from the tent",
      "backup": "O'Connors Riverside",
      "sellout": true
    },
    {
      "night": "Sun 16",
      "base": "West Dingle",
      "primary": "Campáil Teach an Aragail, Gallarus",
      "primaryNote": "Mid-Slea Head loop",
      "backup": "Dingle town campsite",
      "sellout": false
    },
    {
      "night": "Mon 17",
      "base": "Beara — Adrigole",
      "primary": "Hungry Hill Lodge & Camping",
      "primaryNote": "Foot of the Healy Pass — phone ahead, late arrival",
      "backup": "Berehaven Camping, Castletownbere",
      "sellout": false
    },
    {
      "night": "Tue 18",
      "base": "Rosslare (for the boat)",
      "primary": "St Margaret's Beach, Rosslare",
      "primaryNote": "~30 min from the port",
      "backup": "Morriscastle Strand, Kilmuckridge",
      "sellout": false
    }
  ],
  "campNotes": {
    "intro": "Every night is an established, pre-booked campsite — zero wild camping, no turning up hoping. Each one's the confirmed spot for that night.",
    "weather": "Weather insurance: Wild Atlantic Camp (Creeslough) and several others have pods / glamping from ~€60/night. If a named Atlantic storm appears on the forecast, one phone call upgrades you out of canvas without changing the plan.",
    "late": "Small Irish sites often have short reception hours. If you'll arrive after ~19:00, phone ahead with an ETA so your pitch is held."
  },
  "packing": [
    {
      "group": "Riding gear",
      "items": [
        "Waterproof textile / ADV suit (it WILL rain)",
        "Thermal base layers",
        "Mid-layer fleece (essential even in August)",
        "Waterproof + summer gloves",
        "Spare visor / pinlock",
        "Neck tube ×2",
        "Earplugs (multi-day = non-negotiable)",
        "Waterproof boots",
        "Waterproof liner socks"
      ]
    },
    {
      "group": "Camping",
      "items": [
        "Lightweight 2–3 man tent (or split a 3-man)",
        "3-season sleeping bag",
        "Inflatable mat",
        "Compact pillow",
        "Headtorch + spare batteries",
        "Stove + gas (buy screw-on canisters after the ferry if challenged)",
        "Pot / mug / spork",
        "Lighter ×2",
        "Dry bags for EVERYTHING",
        "Small tarp",
        "Travel towel",
        "Camp sandals",
        "20m paracord (drying line)"
      ]
    },
    {
      "group": "Bike kit",
      "items": [
        "Puncture repair kit + mini compressor / CO₂",
        "Chain lube + rag (rain + 2,000mi)",
        "Cable ties",
        "Gaffer tape",
        "Spare bulbs & fuses",
        "Tool roll",
        "Disc lock + reminder cable",
        "Bungees / cargo net",
        "Phone mount + USB power",
        "Spare key (carried by the OTHER brother)",
        "Ratchet strap for ferry decks"
      ]
    },
    {
      "group": "Docs & admin",
      "items": [
        "Licence, V5C, insurance certificate",
        "Confirm policy covers Republic of Ireland (not just third-party)",
        "European breakdown cover",
        "All ferry bookings saved offline + printed",
        "GHIC cards",
        "Passports / photo ID (checked on Irish Sea ferries)",
        "Both € and £ cash (NI = £, ROI = €)",
        "UK identifier on plates"
      ]
    },
    {
      "group": "Personal",
      "items": [
        "Quick-dry clothing ×3 rotations",
        "Swim shorts (Keem Bay, seaweed baths)",
        "Midge repellent (Smidge)",
        "Suncream (yes, actually)",
        "First-aid kit",
        "Power bank 20,000mAh",
        "Painkillers / ibuprofen",
        "Sewing kit",
        "Small padlocks"
      ]
    },
    {
      "group": "Phone & tech",
      "items": [
        "Offline Google Maps for ALL of Ireland (real signal gaps)",
        "Ferry apps",
        "park4night app",
        "Booking.com / campsite numbers saved offline"
      ]
    }
  ],
  "costs": {
    "rows": [
      {
        "item": "Ferries — booked (IoM→Larne + Rosslare→Fishguard)",
        "est": "£233"
      },
      {
        "item": "Camping ~9 nights @ €12–20",
        "est": "£90–160"
      },
      {
        "item": "Fuel (~1,750mi @ 50–55mpg)",
        "est": "£200–250"
      },
      {
        "item": "Food & the craic (€30–50/day incl. pub dinners + pints)",
        "est": "£220–360"
      },
      {
        "item": "Attractions (Cliffs, Mizen, Dursey, Skellig cruise…)",
        "est": "£30–70"
      },
      {
        "item": "Shannon ferry + misc tolls",
        "est": "£10–15"
      },
      {
        "item": "Contingency (a B&B night if a storm flattens the tent, spares)",
        "est": "£50–100"
      }
    ],
    "total": "≈ £800–1,200",
    "note": "The Wild Atlantic Way leg only — your Isle of Man days are budgeted separately."
  },
  "bookings": [
    {
      "id": "bk1",
      "label": "Both ferries",
      "note": "Booked — £233 (Douglas→Larne Mon 10 + Rosslare→Fishguard Wed 19).",
      "urgent": true
    },
    {
      "id": "bk3",
      "label": "Strandhill Caravan & Camping",
      "note": "Sell-out site for mid-August.",
      "urgent": true
    },
    {
      "id": "bk4",
      "label": "Keel Sandybanks",
      "note": "Sell-out site — on Keel beach.",
      "urgent": true
    },
    {
      "id": "bk5",
      "label": "Clifden Eco Beach Camping",
      "note": "Sell-out site — the famous one.",
      "urgent": true
    },
    {
      "id": "bk6",
      "label": "Nagle's Doolin",
      "note": "Sell-out site — Cliffs view.",
      "urgent": true
    },
    {
      "id": "bk7",
      "label": "Ring of Kerry Camping / Mannix Point",
      "note": "Sell-out for mid-August — book the Kenmare/Cahersiveen night.",
      "urgent": true
    },
    {
      "id": "bk10",
      "label": "Skellig eco-cruise (optional)",
      "note": "Landing boats gone for August; the no-landing cruise sometimes has space.",
      "urgent": false
    }
  ],
  "intel": [
    {
      "title": "August reality check",
      "body": "Peak season. Coaches and campervans at maximum. Hotels / B&Bs in Dingle & Killarney book out ~a year ahead — camping is genuinely your superpower here. Your weather flex isn't location, it's the pod upgrades."
    },
    {
      "title": "Real speeds",
      "body": "N-roads are fine; R-roads average 20–30mph actual. Satnav ETAs on the WAW are fiction — add 40–60%. Speed limits in ROI are km/h (80 on an R-road is NOT 80mph)."
    },
    {
      "title": "The big Tuesday",
      "body": "Day 9 is ~250mi: the whole SW plus the Copper Coast dash to Rosslare. Leave at dawn, keep stops short, fuel at every chance. Camp within 30 min of the port so the 08:15 boat is a doddle."
    },
    {
      "title": "Coach warfare",
      "body": "Slea Head and the Ring of Kerry — ride clockwise so you meet coaches instead of following them. Foreign-registered coaches / RVs on narrow roads are the #1 hazard: assume they're on your side of the road at every blind bend."
    },
    {
      "title": "Fuel",
      "body": "Irish motorways have NO services — fill before joining. Connemara, the Kerry mountain roads and inland Donegal are sparse: fill at every town when below half."
    },
    {
      "title": "Weather",
      "body": "Pack for four seasons daily. If an Atlantic blow comes overnight, park the bikes behind a wall — gusts knock loaded bikes over and salt spray gets in the electrics. Storm = don't walk exposed cliff paths."
    },
    {
      "title": "Money & border",
      "body": "You cross the UK↔Ireland border once at Muff — currency (£ / €), speed units and phone roaming all flip. Check your network's EU roaming policy."
    },
    {
      "title": "Pub protocol",
      "body": "Sit at the BAR for chat, at a table to be left alone. Don't sit in the musicians' corner. Trad sessions most nights in Doolin, Dingle, Westport and Ardara. Budget for the craic — a “quiet pint” has a known failure mode."
    }
  ],
  "resources": [
    {
      "name": "WAW4Bikers (Facebook)",
      "note": "Active rider community; a paid Google map with the full route, 360 POIs and 30 biker campsites."
    },
    {
      "name": "Roadtrooper.com",
      "note": "Free GPX/GDB downloads of coastal + mountain alternative routes, county by county."
    },
    {
      "name": "ABR forum — WAW threads",
      "note": "Trip reports and wild-camp intel."
    },
    {
      "name": "campingireland.ie",
      "note": "Official campsite directory, filterable by the WAW."
    },
    {
      "name": "park4night",
      "note": "Campsite finder with rider reviews — a useful backup."
    }
  ],
  "negotiation": [
    {
      "id": "d1",
      "decision": "Ferries",
      "options": [
        "Booked"
      ],
      "lean": "DONE — Douglas→Larne Mon 10 (09:30→14:15) and Rosslare→Fishguard Wed 19 (08:15→11:45), £233 combined. Morning boat home for the 5h Wales→Preston run."
    },
    {
      "id": "d2",
      "decision": "Antrim lead-in",
      "options": [
        "A2 + Torr Head + Muff only"
      ],
      "lean": "Trimmed to the good bits — A2 coast road, Torr Head and Muff on the Monday afternoon. The coach-clogged Causeway/Derry tourist stops are cut; the WAW proper starts at Malin."
    },
    {
      "id": "d3",
      "decision": "Aran Islands (Sat 15)",
      "options": [
        "Half-day trip",
        "Skip"
      ],
      "lean": "Skip — it needs its own visit."
    },
    {
      "id": "d4",
      "decision": "Skellig boat",
      "options": [
        "Eco-cruise",
        "Skip"
      ],
      "lean": "Skip the landing (sold out); the Bray Head walk gives you the Skelligs view free."
    },
    {
      "id": "d5",
      "decision": "Gap of Dunloe vs Ballaghbeama",
      "options": [
        "Gap of Dunloe",
        "Ballaghbeama",
        "Both",
        "Neither"
      ],
      "lean": "Ballaghbeama — same drama, zero traffic, no pony-trap politics."
    },
    {
      "id": "d6",
      "decision": "Tue 18 — the big day",
      "options": [
        "Full-fat + dash",
        "Trim Beara"
      ],
      "lean": "Full-fat: Healy Pass, Beara, Mizen, Kinsale finish, then the Copper Coast to Rosslare. ~250mi — a dawn start, the price of keeping the whole south-west."
    },
    {
      "id": "d7",
      "decision": "Camping",
      "options": [
        "All nights pre-booked"
      ],
      "lean": "Book the sell-out sites this week; backups listed per night. All €10–20pp."
    }
  ],
  "geo": {
    "bounds": {
      "lonMin": -10.9,
      "lonMax": -4.9,
      "latMin": 51.2,
      "latMax": 55.6,
      "scale": 80,
      "pad": 14
    },
    "malin": {
      "lat": 55.38,
      "lon": -7.37
    },
    "ferryIn": {
      "lat": 54.85,
      "lon": -5.81
    },
    "homeFerry": {
      "lat": 52.25,
      "lon": -6.34
    },
    "wawLabel": {
      "lat": 53.72,
      "lon": -7.55
    },
    "landmarks": [
      {
        "t": "Malin Head",
        "lat": 55.38,
        "lon": -7.37,
        "side": "top"
      },
      {
        "t": "Giant's Causeway",
        "lat": 55.235,
        "lon": -6.51,
        "side": "right"
      },
      {
        "t": "Fanad Head",
        "lat": 55.28,
        "lon": -7.64,
        "side": "left"
      },
      {
        "t": "Slieve League",
        "lat": 54.63,
        "lon": -8.66,
        "side": "left"
      },
      {
        "t": "Downpatrick Head",
        "lat": 54.33,
        "lon": -9.35,
        "side": "left"
      },
      {
        "t": "Achill Island",
        "lat": 53.97,
        "lon": -10.2,
        "side": "left"
      },
      {
        "t": "Galway",
        "lat": 53.27,
        "lon": -9.05,
        "side": "right"
      },
      {
        "t": "Cliffs of Moher",
        "lat": 52.94,
        "lon": -9.44,
        "side": "left"
      },
      {
        "t": "Dingle",
        "lat": 52.14,
        "lon": -10.27,
        "side": "left"
      },
      {
        "t": "Caherdaniel",
        "lat": 51.77,
        "lon": -10.1,
        "side": "left"
      },
      {
        "t": "Mizen Head",
        "lat": 51.45,
        "lon": -9.8,
        "side": "bottom"
      },
      {
        "t": "Kinsale",
        "lat": 51.71,
        "lon": -8.52,
        "side": "br",
        "finish": true
      }
    ],
    "cities": [
      {
        "t": "Belfast",
        "lat": 54.6,
        "lon": -5.93,
        "side": "right"
      },
      {
        "t": "Derry",
        "lat": 54.997,
        "lon": -7.32,
        "side": "bottom"
      },
      {
        "t": "Muff",
        "lat": 55.07,
        "lon": -7.27,
        "side": "right"
      },
      {
        "t": "Sligo",
        "lat": 54.27,
        "lon": -8.49,
        "side": "right"
      },
      {
        "t": "Westport",
        "lat": 53.8,
        "lon": -9.52,
        "side": "left"
      },
      {
        "t": "Clifden",
        "lat": 53.49,
        "lon": -10.02,
        "side": "left"
      },
      {
        "t": "Dublin",
        "lat": 53.35,
        "lon": -6.26,
        "side": "right"
      },
      {
        "t": "Killarney",
        "lat": 52.06,
        "lon": -9.5,
        "side": "bottom"
      },
      {
        "t": "Cork",
        "lat": 51.9,
        "lon": -8.47,
        "side": "tr"
      }
    ],
    "ireland": [
      [
        55.38,
        -7.37
      ],
      [
        55.3,
        -7.06
      ],
      [
        55.2,
        -6.16
      ],
      [
        55.13,
        -6.03
      ],
      [
        54.98,
        -5.9
      ],
      [
        54.85,
        -5.81
      ],
      [
        54.66,
        -5.67
      ],
      [
        54.4,
        -5.5
      ],
      [
        54.23,
        -5.52
      ],
      [
        54.05,
        -5.9
      ],
      [
        53.85,
        -6.11
      ],
      [
        53.48,
        -6.1
      ],
      [
        53.15,
        -6.08
      ],
      [
        52.97,
        -6.02
      ],
      [
        52.79,
        -6.15
      ],
      [
        52.34,
        -6.24
      ],
      [
        52.17,
        -6.37
      ],
      [
        52.12,
        -6.93
      ],
      [
        52.09,
        -7.1
      ],
      [
        52.05,
        -7.62
      ],
      [
        51.93,
        -7.85
      ],
      [
        51.79,
        -8.25
      ],
      [
        51.59,
        -8.53
      ],
      [
        51.53,
        -8.94
      ],
      [
        51.45,
        -9.8
      ],
      [
        51.58,
        -9.5
      ],
      [
        51.65,
        -10.15
      ],
      [
        51.8,
        -9.6
      ],
      [
        51.92,
        -10.42
      ],
      [
        52.05,
        -9.8
      ],
      [
        52.15,
        -10.47
      ],
      [
        52.32,
        -10.1
      ],
      [
        52.45,
        -9.88
      ],
      [
        52.56,
        -9.93
      ],
      [
        52.68,
        -9.65
      ],
      [
        52.94,
        -9.44
      ],
      [
        53.15,
        -9.34
      ],
      [
        53.27,
        -9.05
      ],
      [
        53.32,
        -9.8
      ],
      [
        53.42,
        -10.2
      ],
      [
        53.55,
        -10.1
      ],
      [
        53.63,
        -9.86
      ],
      [
        53.8,
        -9.55
      ],
      [
        53.97,
        -10.25
      ],
      [
        54.32,
        -9.99
      ],
      [
        54.33,
        -9.35
      ],
      [
        54.28,
        -8.98
      ],
      [
        54.3,
        -8.58
      ],
      [
        54.47,
        -8.45
      ],
      [
        54.63,
        -8.66
      ],
      [
        54.68,
        -8.79
      ],
      [
        54.83,
        -8.44
      ],
      [
        54.99,
        -8.52
      ],
      [
        55.16,
        -8.29
      ],
      [
        55.23,
        -7.99
      ],
      [
        55.28,
        -7.64
      ],
      [
        55.3,
        -7.52
      ]
    ]
  },
  "route": [
    {
      "n": "01",
      "lat": 55.26,
      "lon": -7.41,
      "area": "Inishowen",
      "phase": "lead"
    },
    {
      "n": "02",
      "lat": 55.2,
      "lon": -7.7,
      "area": "Fanad & Rosguill",
      "phase": "waw"
    },
    {
      "n": "03",
      "lat": 54.63,
      "lon": -8.55,
      "area": "SW Donegal",
      "phase": "waw"
    },
    {
      "n": "04",
      "lat": 54.28,
      "lon": -9.4,
      "area": "North Mayo",
      "phase": "waw"
    },
    {
      "n": "05",
      "lat": 53.7,
      "lon": -9.75,
      "area": "Clew Bay & Killary",
      "phase": "waw"
    },
    {
      "n": "06",
      "lat": 53.3,
      "lon": -9.6,
      "area": "Connemara",
      "phase": "waw"
    },
    {
      "n": "07",
      "lat": 52.8,
      "lon": -9.45,
      "area": "The Clare coast",
      "phase": "waw"
    },
    {
      "n": "08",
      "lat": 51.95,
      "lon": -10.05,
      "area": "Kerry — the rings",
      "phase": "waw"
    },
    {
      "n": "09",
      "lat": 51.55,
      "lon": -9.3,
      "area": "West Cork",
      "phase": "waw"
    },
    {
      "n": "10",
      "lat": 51.71,
      "lon": -8.52,
      "area": "Kinsale — the finish",
      "phase": "waw",
      "finish": true
    }
  ]
}
