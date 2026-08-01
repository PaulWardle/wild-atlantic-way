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
      "title": "Ferry → Larne → Muff → Inishowen",
      "tagline": "Off the boat, straight to the start line at Muff",
      "miles": "~135mi + ferry",
      "phase": "lead",
      "wawStart": true,
      "warnBanner": "Locked day: Larne → Derry → Muff, then the official line up Lough Foyle — Greencastle/Warren Point, Stroove — round to Culdaff, past Farren's to Malin Head, and the tent at Binion. Late boat? Muff → R238 direct to camp, Malin as a 25-mile dawn spur.",
      "stops": [
        {
          "n": "Douglas → Larne",
          "skip": true,
          "d": "Steam Packet 09:30, into Larne 14:15 (~4h45). Then the transfer: Larne → Derry → Muff, ~75mi of main road, ~1h45 — no sightseeing, the trip starts at the Muff marker.",
          "warn": "Vehicle check-in closes 45 min before — be at Douglas for 08:45.",
          "tags": [
            "logistics"
          ],
          "kind": "transfer"
        },
        {
          "n": "Muff — the Way begins",
          "d": "Skirt Derry and cross into Donegal at Muff on Lough Foyle — the official start/end point of the Wild Atlantic Way, km zero. Currency and speed flip to € and km/h; home of the Muff Liquor Co. Photo at the marker.",
          "tags": [
            "w",
            "town",
            "attraction"
          ],
          "kind": "waw",
          "stopMin": 10,
          "lat": 55.067,
          "lon": -7.269
        },
        {
          "n": "Moville → Greencastle & Warren Point",
          "kind": "waw",
          "stopMin": 5,
          "tags": [
            "b",
            "view",
            "history"
          ],
          "d": "The first miles of the Way proper up Lough Foyle — Moville, then Greencastle with the square-towered Warren Point lighthouse at the harbour mouth.",
          "lat": 55.202,
          "lon": -6.987
        },
        {
          "n": "Stroove & Inishowen Head",
          "kind": "onroute",
          "stopMin": 5,
          "tags": [
            "view",
            "beach"
          ],
          "d": "Shrove beach, the Stroove lighthouse and the Inishowen Head corner — the first Discovery Points fall inside the opening hour.",
          "lat": 55.226,
          "lon": -6.929
        },
        {
          "n": "Kinnagoe Bay",
          "d": "Steep drop to a huge empty beach — an Armada wreck site (La Trinidad Valencera, 1588).",
          "tags": [
            "beach",
            "history"
          ],
          "kind": "onroute",
          "stopMin": 10,
          "lat": 55.259,
          "lon": -7.01
        },
        {
          "n": "Culdaff",
          "d": "Beach village on the north shore — the road west from here runs straight for the head.",
          "tags": [
            "beach",
            "town"
          ],
          "kind": "onroute",
          "stopMin": 0,
          "lat": 55.289,
          "lon": -7.164
        },
        {
          "n": "Farren's Bar",
          "d": "Ireland's most northerly pub, on the approach road to the head — you pass it BEFORE Banba's Crown. Sticker and photo on the way up; the pint on the way back down if the light allows.",
          "tags": [
            "pub"
          ],
          "kind": "onroute",
          "stopMin": 15,
          "lat": 55.371,
          "lon": -7.376
        },
        {
          "n": "MALIN HEAD",
          "d": "Ireland's most northerly point. Banba's Crown Napoleonic tower, the “EIRE 80” WW2 sign, a Star Wars: The Last Jedi filming site — Signature Point number one, bagged on day one.",
          "tags": [
            "s",
            "w",
            "view"
          ],
          "kind": "onroute",
          "stopMin": 25,
          "lat": 55.381,
          "lon": -7.373
        },
        {
          "n": "Doagh → Pollan Bay → camp",
          "d": "Down the west shoulder through Doagh Isle and Ballyliffin to Binion — tent up in the last of the light, everything east of you already done.",
          "tags": [
            "b",
            "beach"
          ],
          "kind": "waw",
          "stopMin": 0,
          "lat": 55.278,
          "lon": -7.39
        }
      ],
      "night": {
        "area": "Inishowen",
        "primary": "Binion Bay Camping",
        "note": "Beachside at Binnion strand, just round from Tullagh Bay. Cash (€) from here on.",
        "backup": "Tullagh Bay Camping (the next bay over)",
        "sellout": false,
        "deviationMi": 0.5,
        "retraceMi": 0
      },
      "wawKm": [
        0,
        120
      ],
      "transferMi": 75
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
          ],
          "kind": "onroute",
          "stopMin": 10,
          "lat": 55.243,
          "lon": -7.457
        },
        {
          "n": "Fort Dunree",
          "d": "Coastal defence fort on a headland over the Swilly — military museum, sea views, usually empty.",
          "tags": [
            "history",
            "view"
          ],
          "kind": "extra",
          "impactMi": 4,
          "impactMin": 12,
          "stopMin": 25,
          "exit": "Urris road (post-Mamore)",
          "rejoin": "same (out-and-back)",
          "baseMi": 0,
          "viaMi": 4,
          "impactSrc": "manual road estimate · verify in Google Maps before the trip · checked 26 Jul 2026",
          "lat": 55.1946,
          "lon": -7.5546
        },
        {
          "n": "Round the Swilly",
          "d": "Buncrana, Lisfannon beach, Inch Island — then the one inland dip of the whole Way: no bridge over Lough Swilly, so the OFFICIAL line rounds it through Letterkenny to Rathmullan. (A summer Buncrana–Rathmullan ferry sometimes runs — ⚠️ taking it BREAKS 100% completion: 25mi of official Way unridden.)",
          "tags": [
            "b"
          ],
          "kind": "waw",
          "stopMin": 0,
          "lat": 55.12,
          "lon": -7.46
        },
        {
          "n": "Knockalla coast road",
          "d": "From Rathmullan the road climbs onto the Knockalla shoulder — riding right on the sea, the Swilly on your right, down to Portsalon.",
          "tags": [
            "b",
            "view"
          ],
          "kind": "waw",
          "lat": 55.225,
          "lon": -7.585
        },
        {
          "n": "Ballymastocker Bay / Portsalon",
          "d": "Regularly voted among the world’s best beaches — the view arriving from Knockalla is the one on the postcards.",
          "tags": [
            "beach",
            "view"
          ],
          "kind": "onroute",
          "stopMin": 15,
          "lat": 55.205,
          "lon": -7.62
        },
        {
          "n": "FANAD HEAD",
          "d": "One of the world’s most beautiful lighthouses, at the mouth of the Swilly. Signature Point two.",
          "tags": [
            "s",
            "w",
            "view"
          ],
          "kind": "onroute",
          "stopMin": 25,
          "lat": 55.276,
          "lon": -7.632
        },
        {
          "n": "Harry Blaney Bridge",
          "d": "Exit Fanad across Mulroy Bay on the Blaney bridge — straight onto the Rosguill peninsula.",
          "tags": [
            "b"
          ],
          "kind": "waw",
          "lat": 55.185,
          "lon": -7.7
        },
        {
          "n": "Atlantic Drive, Rosguill",
          "d": "A short, stunning loop — Downings, Tranarossan, the lot. Unmissable and only 20 minutes.",
          "tags": [
            "b",
            "view"
          ],
          "kind": "waw",
          "stopMin": 10,
          "lat": 55.207,
          "lon": -7.835
        },
        {
          "n": "Dunfanaghy",
          "d": "Good food town under Horn Head — the headland itself is 100 metres from tonight’s campsite gate, saved for first thing tomorrow.",
          "tags": [
            "town",
            "food"
          ],
          "kind": "onroute",
          "stopMin": 45,
          "lat": 55.184,
          "lon": -7.885
        }
      ],
      "night": {
        "area": "NW Donegal",
        "primary": "Corcreggan Mill",
        "note": "Quirky and biker-friendly, in an old mill.",
        "backup": "Wild Atlantic Camp, Creeslough (pods = storm insurance)",
        "sellout": false,
        "deviationMi": 1.4,
        "retraceMi": 0
      },
      "wawKm": [
        120,
        279
      ]
    },
    {
      "n": "03",
      "dow": "WED",
      "date": "12 AUG",
      "title": "Horn Head → Slieve League → Sligo",
      "tagline": "The long one — Donegal's whole west face in a day",
      "miles": "~190mi",
      "phase": "waw",
      "warnBanner": "Longest riding day. The official line is locked — the levers are stop time, not road: shorten Slieve League / Killybegs / Malin Beg visits if behind. Nothing official gets skipped.",
      "stops": [
        {
          "n": "Horn Head loop",
          "d": "First 30 minutes of the day: the loop above 180m sea cliffs, straight from the campsite. Empty at 08:00.",
          "tags": [
            "view",
            "b"
          ],
          "kind": "waw",
          "stopMin": 15,
          "lat": 55.22,
          "lon": -7.99
        },
        {
          "n": "Bloody Foreland",
          "d": "Headland named for the red glow of the setting sun on the rock — rounding it, the road turns south for the first time and stays south for a week.",
          "tags": [
            "w",
            "view"
          ],
          "kind": "onroute",
          "stopMin": 5,
          "lat": 55.138,
          "lon": -8.287
        },
        {
          "n": "Glenveagh / Errigal",
          "d": "OPTIONAL EXTRA (inland): from Gweedore up the R251 under Errigal to Glenveagh — ridden as an OUT-AND-BACK so not a metre of official line is skipped. Road impact: +20mi / +50min est, plus castle time. (Riding it through Dunfanaghy→Gweedore would bypass Horn Head and Bloody Foreland — never that.)",
          "tags": [
            "attraction",
            "nature"
          ],
          "kind": "extra",
          "impactMi": 20,
          "impactMin": 50,
          "stopMin": 45,
          "exit": "Gweedore (R251)",
          "rejoin": "same (out-and-back)",
          "baseMi": 0,
          "viaMi": 20,
          "impactSrc": "manual road estimate · verify in Google Maps before the trip · checked 26 Jul 2026",
          "lat": 55.0331,
          "lon": -7.9557
        },
        {
          "n": "The Rosses",
          "d": "Granite, lakes and pier lanes through Gweedore and Dungloe, then Narin/Portnoo strand — every lane of it official line, every lane locked.",
          "tags": [
            "b",
            "beach"
          ],
          "kind": "waw",
          "stopMin": 0,
          "lat": 54.951,
          "lon": -8.359
        },
        {
          "n": "Maghera & Assaranca",
          "d": "West of Ardara: Assaranca waterfall right beside the road, then the caves and dunes at Maghera.",
          "tags": [
            "nature",
            "beach"
          ],
          "kind": "onroute",
          "stopMin": 15,
          "lat": 54.752,
          "lon": -8.56
        },
        {
          "n": "Glengesh Pass",
          "d": "Hairpins over the hills between Ardara and Glencolmcille — one of Donegal’s great biking roads.",
          "tags": [
            "b",
            "view"
          ],
          "kind": "onroute",
          "stopMin": 10,
          "lat": 54.714,
          "lon": -8.463
        },
        {
          "n": "Glencolmcille & Malin Beg",
          "d": "Out to the Silver Strand — a perfect horseshoe of sand at the end of the road. The road is official line; the 170 steps down to the beach are the optional bit.",
          "tags": [
            "beach",
            "view"
          ],
          "kind": "onroute",
          "stopMin": 20,
          "lat": 54.703,
          "lon": -8.724
        },
        {
          "n": "SLIEVE LEAGUE / SLIABH LIAG",
          "d": "Among the highest sea cliffs in Europe — nearly three times Moher. Ride the spur up to Bunglass. Signature Point three.",
          "tags": [
            "s",
            "w",
            "view"
          ],
          "kind": "onroute",
          "stopMin": 45,
          "lat": 54.627,
          "lon": -8.681
        },
        {
          "n": "Killybegs",
          "d": "Ireland’s biggest fishing port — diesel and the best chips of the trip.",
          "tags": [
            "town",
            "food"
          ],
          "kind": "onroute",
          "stopMin": 40,
          "lat": 54.634,
          "lon": -8.448
        },
        {
          "n": "Donegal Bay run",
          "d": "Donegal Town, Rossnowlagh, Tullan Strand and Bundoran — surf country, faster roads, all on the line.",
          "tags": [
            "b",
            "beach"
          ],
          "kind": "waw",
          "stopMin": 0,
          "lat": 54.478,
          "lon": -8.28
        },
        {
          "n": "MULLAGHMORE HEAD",
          "d": "The harbour, Classiebawn castle against Benbulben, and the big-wave reef offshore. Signature Point four.",
          "tags": [
            "s",
            "w",
            "view"
          ],
          "kind": "onroute",
          "stopMin": 20,
          "lat": 54.47,
          "lon": -8.452
        },
        {
          "n": "Drumcliffe → Strandhill",
          "d": "Yeats’ grave under bare Benbulben’s head at Drumcliffe, Rosses Point, then into Strandhill for the night — surf town, seaweed baths if the legs are done. (Carrowmore megalithic cemetery — among the oldest in Ireland — is 5 min inland from camp: an evening leg-stretch, not a riding stop.)",
          "tags": [
            "history",
            "town"
          ],
          "kind": "onroute",
          "stopMin": 15,
          "lat": 54.27,
          "lon": -8.596
        }
      ],
      "night": {
        "area": "Sligo",
        "primary": "Strandhill Caravan & Camping Park",
        "note": "On the beach, pubs walkable.",
        "backup": "Greenlands, Rosses Point",
        "sellout": false,
        "deviationMi": 0.1,
        "retraceMi": 0
      },
      "wawKm": [
        279,
        661
      ]
    },
    {
      "n": "04",
      "dow": "THU",
      "date": "13 AUG",
      "title": "Downpatrick → Céide → Erris → Achill",
      "tagline": "Into the emptiest, wildest corner of the whole Way",
      "miles": "~200mi",
      "phase": "waw",
      "warnBanner": "Big day with the full Mullet loop restored — ~200mi, all of it official. Levers are stop lengths (Céide, Downpatrick), never the road.",
      "stops": [
        {
          "n": "The Sligo surf coast",
          "d": "Aughris Head, Easkey and Enniscrone — reef breaks and empty strands, quick miles.",
          "tags": [
            "beach",
            "b"
          ],
          "kind": "waw",
          "lat": 54.213,
          "lon": -9.093
        },
        {
          "n": "Ballina & Killala",
          "d": "Across the Moy at Ballina, then the round tower and quay at Killala — 1798 French landing country.",
          "tags": [
            "town",
            "history"
          ],
          "kind": "onroute",
          "lat": 54.213,
          "lon": -9.22
        },
        {
          "n": "DOWNPATRICK HEAD",
          "d": "Dún Briste — the sea stack standing off the headland with its layers exposed like a cut cake. Blowhole, WW2 EIRE sign. Signature Point five.",
          "tags": [
            "s",
            "w",
            "view"
          ],
          "kind": "onroute",
          "stopMin": 25,
          "lat": 54.326,
          "lon": -9.349
        },
        {
          "n": "Céide Fields",
          "d": "The oldest known field systems on Earth, under the bog for 5,500 years — and the cliff viewpoint is free.",
          "tags": [
            "attraction",
            "history"
          ],
          "kind": "onroute",
          "stopMin": 30,
          "lat": 54.309,
          "lon": -9.456
        },
        {
          "n": "North Mayo cliff road",
          "d": "Belderrig to Belmullet — the loneliest tarmac in Ireland. Fuel at Belmullet.",
          "tags": [
            "b",
            "view"
          ],
          "kind": "waw",
          "lat": 54.3,
          "lon": -9.58
        },
        {
          "n": "The Mullet & Blacksod",
          "d": "The full official loop of the Mullet — down the west side past Annagh Head and Fál Mór to Blacksod lighthouse (whose weather report delayed D-Day by 24 hours), back up to Belmullet. All official line, all locked.",
          "tags": [
            "attraction",
            "history"
          ],
          "kind": "waw",
          "stopMin": 15,
          "lat": 54.1,
          "lon": -10.06
        },
        {
          "n": "Ballycroy / Wild Nephin",
          "d": "Along the edge of Ireland’s only wilderness national park — bog, the Nephin Beg range, and not much else. Glorious.",
          "tags": [
            "nature",
            "b"
          ],
          "kind": "waw",
          "lat": 54.03,
          "lon": -9.83
        },
        {
          "n": "Mulranny → Achill Sound",
          "d": "The causeway viewpoint over Clew Bay’s drumlins, then over the bridge onto Achill.",
          "tags": [
            "view",
            "b"
          ],
          "kind": "waw",
          "lat": 53.93,
          "lon": -9.92
        },
        {
          "n": "Achill Atlantic Drive",
          "d": "The cliff road round the south of the island — Cloughmore, the Minaun cliffs across the bay.",
          "tags": [
            "b",
            "view"
          ],
          "kind": "waw",
          "stopMin": 10,
          "lat": 53.9,
          "lon": -9.98
        },
        {
          "n": "Keel",
          "d": "The strand, the pubs, the tent. Keem Bay is 5 miles on — saved for 08:00 tomorrow when the car park is empty and the light is on the cliffs.",
          "tags": [
            "town",
            "beach"
          ],
          "kind": "onroute",
          "stopMin": 0,
          "lat": 53.973,
          "lon": -10.08
        }
      ],
      "night": {
        "area": "Achill Island",
        "primary": "Keel Sandybanks",
        "note": "On Keel beach.",
        "backup": "Seal Caves, Dugort",
        "sellout": false,
        "deviationMi": 0.1,
        "retraceMi": 0
      },
      "wawKm": [
        661,
        1045
      ]
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
          ],
          "kind": "onroute",
          "stopMin": 25,
          "lat": 53.968,
          "lon": -10.194
        },
        {
          "n": "Mulranny → Newport",
          "d": "Back across the island and along Clew Bay — 365 islands, one for every day of the year, allegedly.",
          "tags": [
            "b",
            "view"
          ],
          "kind": "waw",
          "lat": 53.884,
          "lon": -9.55
        },
        {
          "n": "Westport",
          "d": "The town of the trip — long lunch, Matt Molloy’s for one (of the Chieftains; sessions from lunchtime).",
          "tags": [
            "town",
            "food",
            "pub"
          ],
          "kind": "onroute",
          "stopMin": 75,
          "lat": 53.801,
          "lon": -9.52
        },
        {
          "n": "Croagh Patrick",
          "d": "The Reek — Ireland’s holy mountain, pilgrim path visible from the road viewpoint at Murrisk.",
          "tags": [
            "view",
            "history"
          ],
          "kind": "onroute",
          "stopMin": 10,
          "lat": 53.78,
          "lon": -9.64
        },
        {
          "n": "Doolough Valley",
          "d": "The famine road between the mountains and the black lake — a memorial marks the 1849 tragedy. One of the great sombre roads of Ireland, and officially on the Way.",
          "tags": [
            "w",
            "view",
            "history"
          ],
          "kind": "onroute",
          "stopMin": 10,
          "lat": 53.658,
          "lon": -9.77
        },
        {
          "n": "Aasleagh Falls → Leenane",
          "d": "The falls at the head of the fjord, then the village from The Field.",
          "tags": [
            "nature",
            "view"
          ],
          "kind": "onroute",
          "lat": 53.595,
          "lon": -9.685
        },
        {
          "n": "KILLARY HARBOUR",
          "d": "Ireland’s only true fjord — 16km of dark water between the Mweelrea and Maumturk walls. Signature Point seven.",
          "tags": [
            "s",
            "w",
            "view"
          ],
          "kind": "onroute",
          "stopMin": 15,
          "lat": 53.61,
          "lon": -9.78
        },
        {
          "n": "Letterfrack & Connemara NP",
          "d": "Under Diamond Hill through Letterfrack, then the Renvyle/Tully Cross shore.",
          "tags": [
            "nature",
            "view"
          ],
          "kind": "waw",
          "lat": 53.55,
          "lon": -9.95
        },
        {
          "n": "Cleggan → Omey Island",
          "d": "To Claddaghduff, where tonight’s tent faces Omey strand — walk (or ride, carefully) across the sand to the island if the tide’s out.",
          "tags": [
            "beach",
            "attraction"
          ],
          "kind": "onroute",
          "stopMin": 30,
          "lat": 53.545,
          "lon": -10.12
        }
      ],
      "night": {
        "area": "Connemara",
        "primary": "Clifden Camping & Caravan Park",
        "note": "Sheltered park on the Westport Road, 2 km from Clifden town.",
        "backup": "",
        "sellout": false,
        "deviationMi": 1,
        "retraceMi": 0
      },
      "wawKm": [
        1045,
        1197
      ]
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
          ],
          "kind": "onroute",
          "stopMin": 15,
          "lat": 53.494,
          "lon": -10.08
        },
        {
          "n": "DERRIGIMLAGH",
          "d": "The bog where the modern world arrived twice: Marconi’s first transatlantic radio station and the spot Alcock & Brown crash-landed the first transatlantic flight, 1919. Boardwalk loop ~45 min. Signature Point eight.",
          "tags": [
            "s",
            "w",
            "history"
          ],
          "kind": "onroute",
          "stopMin": 45,
          "lat": 53.459,
          "lon": -10.02
        },
        {
          "n": "Roundstone",
          "d": "Harbour village under Errisbeg — Dog’s Bay and Gurteen back-to-back beaches just south.",
          "tags": [
            "town",
            "view",
            "beach"
          ],
          "kind": "onroute",
          "stopMin": 20,
          "lat": 53.385,
          "lon": -9.92
        },
        {
          "n": "South Connemara shore",
          "d": "R340/R336 through the granite-and-seaweed country — Pearse’s Cottage, Rosmuc, the Carna loop. All official line, all locked.",
          "tags": [
            "b"
          ],
          "kind": "waw",
          "stopMin": 0,
          "lat": 53.32,
          "lon": -9.84
        },
        {
          "n": "Spiddal → Galway",
          "d": "Into the city with the Burren rising across the bay. Ride through — coffee at most; Saturday Galway will eat the afternoon whole.",
          "tags": [
            "town"
          ],
          "kind": "waw",
          "stopMin": 20,
          "lat": 53.272,
          "lon": -9.05
        },
        {
          "n": "Kinvara",
          "d": "Dunguaire Castle on its tidal rock — the classic photo.",
          "tags": [
            "view",
            "history"
          ],
          "kind": "onroute",
          "stopMin": 10,
          "lat": 53.139,
          "lon": -8.936
        },
        {
          "n": "Poulnabrone dolmen",
          "d": "OPTIONAL EXTRA (inland Burren): the 5,800-year-old dolmen on the R480 — out-and-back from Ballyvaughan. Road impact: +10mi / +25min riding.",
          "tags": [
            "history",
            "attraction"
          ],
          "kind": "extra",
          "impactMi": 10,
          "impactMin": 25,
          "stopMin": 20,
          "exit": "Ballyvaughan (R480)",
          "rejoin": "same (out-and-back)",
          "baseMi": 0,
          "viaMi": 10,
          "impactSrc": "manual road estimate · verify in Google Maps before the trip · checked 26 Jul 2026",
          "lat": 53.0489,
          "lon": -9.14
        },
        {
          "n": "Black Head R477",
          "d": "The limestone shore road under Gleninagh — grey pavement into grey sea, Aran across the sound. One of the Way’s best riding stretches.",
          "tags": [
            "b",
            "w",
            "view"
          ],
          "kind": "waw",
          "stopMin": 5,
          "lat": 53.152,
          "lon": -9.266
        },
        {
          "n": "Fanore → Doolin",
          "d": "Down the coast to the trad capital of Ireland. Session in McDermott’s or Gus O’Connor’s tonight — the Cliffs are 10 minutes south, saved for 08:00.",
          "tags": [
            "town",
            "pub"
          ],
          "kind": "waw",
          "stopMin": 0,
          "lat": 53.014,
          "lon": -9.38
        }
      ],
      "night": {
        "area": "Doolin",
        "primary": "Aille River Tourist Hostel & Campsite",
        "note": "Riverside in the village on the Aille — the Cliffs are still 10 minutes south at 08:00, and the trad session still happens.",
        "backup": "Nagle's — ❌ full",
        "sellout": false,
        "deviationMi": 0.2,
        "retraceMi": 0
      },
      "wawKm": [
        1197,
        1483
      ]
    },
    {
      "n": "07",
      "dow": "SUN",
      "date": "16 AUG",
      "title": "Cliffs → Loop Head → Conor Pass → Slea Head",
      "tagline": "The monster Sunday — two counties, one ferry, one pass, one perfect evening loop",
      "miles": "~200mi",
      "phase": "waw",
      "warnBanner": "Biggest official-mileage day. Cliffs at 08:00 sharp, Shannon ferry is hourly on the half-hour, and the Slea Head Drive comes at golden hour with the buses gone. Levers are stop lengths only — the line is locked end to end.",
      "stops": [
        {
          "n": "CLIFFS OF MOHER, 08:00",
          "d": "At the gates when they open, before the coach army lands — O’Brien’s Tower, 214m straight down, puffins below in August. Signature Point nine.",
          "tags": [
            "s",
            "w",
            "view"
          ],
          "kind": "onroute",
          "stopMin": 60,
          "lat": 52.972,
          "lon": -9.426
        },
        {
          "n": "Lahinch → Spanish Point",
          "d": "Surf town, then the point named for the Armada dead of 1588.",
          "tags": [
            "beach",
            "history"
          ],
          "kind": "onroute",
          "stopMin": 5,
          "lat": 52.847,
          "lon": -9.437
        },
        {
          "n": "Kilkee Cliffs",
          "d": "The Duggerna cliffs and Pollock Holes on the west end of the horseshoe bay — Clare’s underrated answer to Moher.",
          "tags": [
            "view",
            "b"
          ],
          "kind": "onroute",
          "stopMin": 15,
          "lat": 52.677,
          "lon": -9.66
        },
        {
          "n": "LOOP HEAD",
          "d": "Out the north side, lighthouse at the tip, back along the south shore via Carrigaholt — a natural loop, no retracing. Signature Point ten.",
          "tags": [
            "s",
            "w",
            "view"
          ],
          "kind": "onroute",
          "stopMin": 25,
          "lat": 52.56,
          "lon": -9.93
        },
        {
          "n": "Killimer → Tarbert ferry",
          "d": "Across the Shannon mouth — hourly on the half-hour from Killimer, ~20min crossing, bikes board first. An OFFICIAL leg of the Way (the line crosses here) — and the perfect lunch stop.",
          "tags": [
            "logistics",
            "b"
          ],
          "kind": "waw",
          "stopMin": 30,
          "lat": 52.617,
          "lon": -9.375
        },
        {
          "n": "Ballybunion",
          "d": "Castle ruin between the two strands — quick leg-stretch, then the miles across north Kerry.",
          "tags": [
            "beach",
            "view"
          ],
          "kind": "onroute",
          "stopMin": 15,
          "lat": 52.511,
          "lon": -9.67
        },
        {
          "n": "Camp → Castlegregory",
          "d": "Onto the Dingle peninsula’s north shore under the Slieve Mish, out around the Castlegregory/Maharees spit — official line, locked.",
          "tags": [
            "b",
            "beach"
          ],
          "kind": "waw",
          "stopMin": 0,
          "lat": 52.254,
          "lon": -10.017
        },
        {
          "n": "CONOR PASS",
          "d": "Ireland’s highest paved pass, ridden INBOUND — the official direction — from Cloghane over the top and the great descent into Dingle with the harbour laid out below.",
          "tags": [
            "b",
            "view"
          ],
          "kind": "onroute",
          "stopMin": 15,
          "lat": 52.19,
          "lon": -10.202
        },
        {
          "n": "Dingle town",
          "d": "Into Dingle ~17:00 off the Conor Pass descent — quick fuel and food before the evening loop. (The proper pint comes after Gallarus.)",
          "tags": [
            "town",
            "pub",
            "food"
          ],
          "kind": "onroute",
          "stopMin": 45,
          "lat": 52.141,
          "lon": -10.269
        },
        {
          "n": "SLEA HEAD DRIVE — evening",
          "kind": "waw",
          "stopMin": 20,
          "tags": [
            "s",
            "b",
            "w",
            "view"
          ],
          "d": "The loop at golden hour, buses gone, sun over the water: Ventry, the beehive huts, Slea Head itself — then DUNMORE HEAD, mainland Ireland's westernmost point and the Blasket Islands view. Signature Point eleven, in the best light of the day.",
          "lat": 52.097,
          "lon": -10.45
        },
        {
          "n": "Dunquin → Ballyferriter → Gallarus",
          "kind": "waw",
          "stopMin": 5,
          "tags": [
            "view",
            "history"
          ],
          "d": "Round the loop's west side — Kruger's (Ireland's westernmost pub) at Dunquin — to the tent beside the 1,200-year-old Gallarus Oratory. The official line continues FORWARD from here through Dingle tomorrow: zero repeated road.",
          "lat": 52.173,
          "lon": -10.348
        }
      ],
      "night": {
        "area": "West Dingle",
        "primary": "Campáil Teach an Aragail",
        "note": "Beside the Gallarus Oratory, at the END of today's window — the Way exits forward through Dingle tomorrow. Zero repeated road.",
        "backup": "Dingle town campsite",
        "sellout": false,
        "deviationMi": 0.4
      },
      "wawKm": [
        1483,
        1868
      ]
    },
    {
      "n": "08",
      "dow": "MON",
      "date": "17 AUG",
      "title": "Ring of Kerry + Skellig Ring → Beara north",
      "tagline": "The queen stage — two peninsulas before dark",
      "miles": "~205mi",
      "phase": "waw",
      "warnBanner": "Dawn start. The whole line is locked, Valentia included. Levers: stop lengths; the Dursey cable-car crossing stays out (2h). ~205mi of official road.",
      "stops": [
        {
          "n": "Gallarus → Dingle, forward",
          "kind": "waw",
          "stopMin": 10,
          "tags": [
            "b",
            "town"
          ],
          "d": "The line itself runs from Gallarus back through Dingle harbour — forward official kilometres, not a retrace. Coffee in Dingle at 07:30 before the town wakes.",
          "lat": 52.141,
          "lon": -10.269
        },
        {
          "n": "South Pole Inn, Annascaul",
          "d": "Tom Crean's own pub, directly on the exit road east — the Antarctic legend's statue outside. Shut at this hour (the pint was last night in Dingle), but the photo is free and costs zero miles.",
          "tags": [
            "pub",
            "history"
          ],
          "kind": "onroute",
          "stopMin": 10,
          "lat": 52.152,
          "lon": -10.062
        },
        {
          "n": "Inch Strand",
          "d": "Three miles of dune-backed sand — dead on the exit road east. Zero detour, one photo.",
          "tags": [
            "beach"
          ],
          "kind": "onroute",
          "stopMin": 5,
          "lat": 52.139,
          "lon": -9.985
        },
        {
          "n": "Killorglin → the N70 coast",
          "d": "Onto the Ring of Kerry proper, ridden ONCE, anticlockwise with the flow: Glenbeigh, Rossbeigh strand, Kells, Cahersiveen.",
          "tags": [
            "b",
            "view"
          ],
          "kind": "waw",
          "lat": 51.947,
          "lon": -10.22
        },
        {
          "n": "Portmagee & Kerry Cliffs",
          "d": "Over the bridge onto VALENTIA ISLAND — Bray Head and Geokaun are on the official line — back through Portmagee to the Kerry Cliffs: Skellig Michael and Little Skellig off the cliffs. (Landing boats sell out months ahead; the cliffs are the 9-day version.) Signature Point twelve.",
          "tags": [
            "s",
            "w",
            "view"
          ],
          "kind": "onroute",
          "stopMin": 30,
          "lat": 51.886,
          "lon": -10.36
        },
        {
          "n": "Coomanaspig Pass",
          "d": "Up and over from Portmagee to St Finian’s Bay — one of the highest public roads in Ireland, savage gradients, monastery views.",
          "tags": [
            "b",
            "view"
          ],
          "kind": "onroute",
          "stopMin": 10,
          "lat": 51.865,
          "lon": -10.355
        },
        {
          "n": "Waterville → Coomakista",
          "d": "Charlie Chaplin’s seafront, then the Coomakista pass viewpoint over Ballinskelligs Bay and the Skelligs again.",
          "tags": [
            "view",
            "town"
          ],
          "kind": "onroute",
          "stopMin": 10,
          "lat": 51.772,
          "lon": -10.143
        },
        {
          "n": "Derrynane, Caherdaniel",
          "d": "Daniel O’Connell’s house and one of Ireland’s finest small beaches, then Sneem’s coloured houses.",
          "tags": [
            "beach",
            "history"
          ],
          "kind": "onroute",
          "stopMin": 15,
          "lat": 51.762,
          "lon": -10.11
        },
        {
          "n": "Kenmare",
          "d": "Fuel and food, ~17:00 — then leave the crowds behind: the Way turns down Beara’s empty north side. R571 through Tuosist, Ardgroom, Eyeries.",
          "tags": [
            "town",
            "food",
            "b"
          ],
          "kind": "onroute",
          "stopMin": 45,
          "lat": 51.88,
          "lon": -9.583
        },
        {
          "n": "DURSEY SOUND",
          "d": "The cable-car station at the end of Beara — Ireland’s only cable car, six people and the odd sheep. (Crossing eats 2 hours — the sound and the island from the viewpoint is the bag.) Signature Point thirteen.",
          "tags": [
            "s",
            "w",
            "view"
          ],
          "kind": "onroute",
          "stopMin": 20,
          "lat": 51.612,
          "lon": -10.141
        },
        {
          "n": "Castletownbere & McCarthy's Bar",
          "d": "The pint at McCarthy’s — of the book cover — in Ireland’s biggest whitefish port. Twenty easy minutes to the tent after.",
          "tags": [
            "town",
            "pub"
          ],
          "kind": "onroute",
          "stopMin": 25,
          "lat": 51.65,
          "lon": -9.91
        }
      ],
      "night": {
        "area": "Beara — Adrigole",
        "primary": "Hungry Hill Lodge & Camping",
        "note": "At the literal foot of the Healy Pass. Phone ahead — confirm tents and a ~20:30 arrival.",
        "backup": "Berehaven Camping, Castletownbere — anywhere on the Adrigole–Glengarriff road works",
        "sellout": false,
        "deviationMi": 0.2,
        "retraceMi": 0
      },
      "wawKm": [
        1868,
        2198
      ]
    },
    {
      "n": "09",
      "dow": "TUE",
      "date": "18 AUG",
      "title": "Beara → Sheep’s Head → Mizen → Baltimore → KINSALE → Rosslare",
      "tagline": "Every last official mile, the finish line, then the run for the boat",
      "miles": "~320mi (~130 transfer)",
      "phase": "waw",
      "warnBanner": "06:00 start — the price of 100.0%. Every remaining official mile is ridden: Sheep’s Head, the Mizen, the Baltimore coast, Old Head, Kinsale. Levers are stop lengths and the optional Healy Pass dawn spur — the road itself is locked. ~13–14h door to door; it ends at a boat, not another riding day.",
      "stops": [
        {
          "n": "Healy Pass at sunrise",
          "kind": "extra",
          "impactMi": 9,
          "impactMin": 30,
          "stopMin": 10,
          "tags": [
            "b",
            "view"
          ],
          "d": "OPTIONAL EXTRA (the R574 is not official line): the tent sits at its southern foot — switchbacks up to the saddle for sunrise over Glanmore Lake and back down. Road impact: +9mi / +30min. The best half-hour of road in Ireland, if today can afford it.",
          "exit": "Adrigole (R574)",
          "rejoin": "same (out-and-back to the saddle)",
          "baseMi": 0,
          "viaMi": 9,
          "impactSrc": "manual road estimate · verify in Google Maps before the trip · checked 26 Jul 2026",
          "lat": 51.7268,
          "lon": -9.7466
        },
        {
          "n": "Glengarriff → Bantry",
          "kind": "onroute",
          "stopMin": 10,
          "tags": [
            "town",
            "view"
          ],
          "d": "Out of Beara along the harbour, Garnish Island offshore, into Bantry under Whiddy.",
          "lat": 51.68,
          "lon": -9.454
        },
        {
          "n": "SHEEP'S HEAD loop",
          "kind": "waw",
          "stopMin": 10,
          "tags": [
            "w",
            "b",
            "view"
          ],
          "d": "The quiet peninsula — Durrus out the north side to the tip at Tooreen (Seefin viewpoint), back the south side. Official line, restored and locked: ~35mi of the emptiest riding in Cork.",
          "lat": 51.543,
          "lon": -9.86
        },
        {
          "n": "MIZEN HEAD",
          "kind": "onroute",
          "stopMin": 30,
          "tags": [
            "s",
            "w",
            "view"
          ],
          "d": "Ireland’s south-westernmost point — the footbridge over the gorge, the signal station, the Fastnet out to sea. Signature Point fourteen.",
          "lat": 51.45,
          "lon": -9.811
        },
        {
          "n": "Barleycove → Schull",
          "kind": "waw",
          "stopMin": 10,
          "tags": [
            "beach",
            "town"
          ],
          "d": "The tsunami-built dunes at Barleycove, then coffee at Schull under Mount Gabriel.",
          "lat": 51.526,
          "lon": -9.547
        },
        {
          "n": "Lough Hyne → BALTIMORE",
          "kind": "waw",
          "stopMin": 15,
          "tags": [
            "w",
            "nature",
            "town"
          ],
          "d": "RESTORED official line: past Lough Hyne (Ireland’s only saltwater lake) down to the Baltimore beacon, then back up through Skibbereen. TIME CHECK at Skibbereen: 14:30 or better keeps everything live.",
          "lat": 51.484,
          "lon": -9.373
        },
        {
          "n": "Toe Head → Galley Head coast",
          "kind": "waw",
          "stopMin": 5,
          "tags": [
            "view",
            "b"
          ],
          "d": "RESTORED official line: the coastal wiggle by Castletownshend, Toe Head and the Galley Head view — not the N71 shortcut.",
          "lat": 51.532,
          "lon": -8.954
        },
        {
          "n": "Drombeg Stone Circle",
          "kind": "onroute",
          "stopMin": 15,
          "tags": [
            "history"
          ],
          "d": "Bronze-age circle five minutes off the road — free, atmospheric, aligned on the winter solstice sunset.",
          "lat": 51.564,
          "lon": -9.087
        },
        {
          "n": "Clonakilty → Timoleague",
          "kind": "waw",
          "stopMin": 10,
          "tags": [
            "town",
            "history"
          ],
          "d": "Through Clon (Michael Collins country) past the abbey ruin on the estuary at Timoleague.",
          "lat": 51.643,
          "lon": -8.766
        },
        {
          "n": "OLD HEAD OF KINSALE",
          "kind": "onroute",
          "stopMin": 20,
          "tags": [
            "s",
            "w",
            "view",
            "history"
          ],
          "d": "The spur to the signal tower viewpoint — official line to the gate; the Lusitania sank 11 miles off this head. Signature Point fifteen — the set, complete.",
          "lat": 51.607,
          "lon": -8.538
        },
        {
          "n": "KINSALE",
          "kind": "onroute",
          "finish": true,
          "stopMin": 45,
          "tags": [
            "town",
            "pub",
            "finish"
          ],
          "d": "THE OFFICIAL END OF THE WILD ATLANTIC WAY — every metre of the line from Muff behind you. WAW completion: 100.0%. Finish-line photo at the marker, Charles Fort if the clock allows, fuel for the run.",
          "lat": 51.706,
          "lon": -8.523
        },
        {
          "n": "N25 run to Rosslare",
          "kind": "transfer",
          "skip": true,
          "stopMin": 0,
          "tags": [
            "logistics"
          ],
          "warn": "Long transfer after the biggest day — fuel at Cork, heads down.",
          "d": "Kinsale → Cork → N25 east — ~130mi of main road, ~2h45. Tent by ~20:00. The price of the morning boat — but the Way is 100.0% won."
        }
      ],
      "night": {
        "area": "Tagoat (for the boat)",
        "primary": "IOAC",
        "note": "Minutes from Rosslare Harbour. Sets up the 08:15 sailing.",
        "backup": "St Margaret's Beach (superseded)",
        "sellout": false,
        "deviationMi": 0,
        "retraceMi": 0
      },
      "wawKm": [
        2198,
        2506.8
      ],
      "transferMi": 130
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
          ],
          "kind": "transfer"
        },
        {
          "n": "Fishguard → Preston",
          "d": "~250mi / ~5h up the M4 → M5 → M6. Home for the evening.",
          "tags": [
            "logistics"
          ],
          "kind": "transfer"
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
      "day": "07",
      "date": "Sun 16"
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
      "base": "Clonmany, Inishowen",
      "primary": "Binion Bay Camping",
      "primaryNote": "beachside at Binnion strand",
      "backup": "Tullagh Bay Camping (next bay over)",
      "sellout": false,
      "deviationMi": 0.5,
      "retraceMi": 0,
      "bookingStatus": "booked",
      "lat": 55.2571,
      "lon": -7.4258
    },
    {
      "night": "Tue 11",
      "base": "Dunfanaghy, Co. Donegal",
      "primary": "Corcreggan Mill",
      "primaryNote": "Biker-friendly old mill",
      "backup": "Wild Atlantic Camp (pods = storm insurance)",
      "sellout": false,
      "deviationMi": 1.4,
      "retraceMi": 0,
      "bookingStatus": "booked",
      "lat": 55.174,
      "lon": -7.863
    },
    {
      "night": "Wed 12",
      "base": "Strandhill, Co. Sligo",
      "primary": "Strandhill Caravan & Camping Park",
      "primaryNote": "On the beach",
      "backup": "Greenlands, Rosses Point",
      "sellout": false,
      "deviationMi": 0.1,
      "retraceMi": 0,
      "bookingStatus": "booked",
      "lat": 54.2699,
      "lon": -8.596
    },
    {
      "night": "Thu 13",
      "base": "Keel, Achill Island",
      "primary": "Keel Sandybanks",
      "primaryNote": "On Keel beach",
      "backup": "Seal Caves, Dugort",
      "sellout": false,
      "deviationMi": 0.1,
      "retraceMi": 0,
      "bookingStatus": "booked",
      "lat": 53.9737,
      "lon": -10.0855
    },
    {
      "night": "Fri 14",
      "base": "Clifden, Co. Galway",
      "primary": "Clifden Camping & Caravan Park",
      "primaryNote": "Sheltered park on the Westport Road, 2 km from Clifden town",
      "backup": "",
      "sellout": false,
      "deviationMi": 1,
      "retraceMi": 0,
      "bookingStatus": "booked",
      "lat": 53.5011,
      "lon": -10.0183
    },
    {
      "night": "Sat 15",
      "base": "Doolin, Co. Clare",
      "primary": "Aille River Tourist Hostel & Campsite",
      "primaryNote": "Riverside in Doolin village — Cliffs still 10 min south at 08:00, session still walkable",
      "backup": "Nagle's — ❌ full · O'Connors Riverside — not needed",
      "sellout": false,
      "deviationMi": 0.2,
      "retraceMi": 0,
      "bookingStatus": "booked",
      "lat": 53.013,
      "lon": -9.377
    },
    {
      "night": "Sun 16",
      "base": "Gallarus, Ballydavid, Dingle Peninsula",
      "primary": "Campáil Teach an Aragail",
      "primaryNote": "Beside the Gallarus Oratory — at the end of the day's window, line exits forward",
      "backup": "Dingle town campsite",
      "sellout": false,
      "deviationMi": 0.4,
      "bookingStatus": "booked",
      "lat": 52.174,
      "lon": -10.348
    },
    {
      "night": "Mon 17",
      "base": "Adrigole, Beara Peninsula",
      "primary": "Hungry Hill Lodge & Camping",
      "primaryNote": "Foot of the Healy Pass — phone ahead, late arrival",
      "backup": "Berehaven Camping, Castletownbere",
      "sellout": false,
      "deviationMi": 0.2,
      "retraceMi": 0,
      "bookingStatus": "booked",
      "lat": 51.689,
      "lon": -9.728
    },
    {
      "night": "Tue 18",
      "base": "Tagoat, near Rosslare",
      "primary": "IOAC",
      "primaryNote": "Minutes from Rosslare Harbour — sets up the 08:15 sailing",
      "backup": "St Margaret's Beach, Rosslare (previous plan, superseded)",
      "sellout": false,
      "deviationMi": 0,
      "retraceMi": 0,
      "bookingStatus": "booked",
      "lat": 52.196,
      "lon": -6.386
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
      "label": "Book the ferries",
      "note": "Outbound and homeward crossings, both directions locked to the trip dates.",
      "urgent": false
    },
    {
      "id": "bk2",
      "label": "Book the campsites",
      "note": "One site per night, nine nights — the list and live status are on the Campsites page.",
      "urgent": true
    },
    {
      "id": "bk3",
      "label": "Confirm bike cover for Ireland",
      "note": "Insurance and breakdown cover valid in the Republic, more than third-party.",
      "urgent": false
    },
    {
      "id": "bk4",
      "label": "Skellig boat trip (optional)",
      "note": "If fancied — availability is tight in August; check early.",
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
