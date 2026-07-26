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
    "totalMiles": "~1,650–1,900",
    "sigCount": 15,
    "intro": "The official Wild Atlantic Way, Malin Head to Kinsale — plus the best biker roads on the island: Healy Pass, Conor Pass, Slea Head, Ballaghbeama and more. Nine hard riding days off the Monday ferry, finishing at Kinsale then a dash to the Rosslare boat. The coach-clogged tourist bits are cut."
  },
  "days": [
    {
      "n": "01",
      "dow": "MON",
      "date": "10 AUG",
      "title": "Ferry to Ireland → Antrim → Inishowen",
      "tagline": "Off the boat, the coast road and over the border",
      "miles": "~110–130mi + ferry",
      "phase": "lead",
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
          "d": "Steep, narrow single-track loop off the A2 — Scotland only 12mi across the water. The one lead-in road worth the detour.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Muff",
          "d": "Skirt Derry and cross into Donegal (the Republic) at Muff on Lough Foyle — your must-visit. Currency and speed flip to € and km/h; home of the Muff Liquor Co.",
          "tags": [
            "town",
            "attraction"
          ]
        },
        {
          "n": "Into Inishowen",
          "d": "Push up the peninsula to camp — banking miles for an early run at Malin Head tomorrow.",
          "tags": [
            "b"
          ]
        }
      ],
      "night": {
        "area": "Inishowen",
        "primary": "Tullagh Bay Camping, Clonmany",
        "note": "Beachside, ~€12pp. Currency is € (cash) from here on.",
        "backup": "Inishowen Caravan Park, Buncrana (~€10pp)",
        "sellout": false
      }
    },
    {
      "n": "02",
      "dow": "TUE",
      "date": "11 AUG",
      "title": "Malin Head → Fanad → NW Donegal",
      "tagline": "The top of Ireland — the WAW starts here",
      "miles": "~160–185mi",
      "phase": "waw",
      "wawStart": true,
      "stops": [
        {
          "n": "Malin Head",
          "d": "Ireland's most northerly point and the official WAW start/end. Banba's Crown Napoleonic tower, the “EIRE 80” WW2 sign, a Star Wars: The Last Jedi filming site.",
          "tags": [
            "s",
            "w",
            "view",
            "history"
          ]
        },
        {
          "n": "Farren's Bar",
          "d": "Ireland's most northerly pub — a sticker-and-photo stop.",
          "tags": [
            "pub"
          ]
        },
        {
          "n": "Culdaff & Kinnagoe Bay",
          "d": "Optional Inishowen extras — beach, then an Armada wreck site.",
          "tags": [
            "beach",
            "history"
          ]
        },
        {
          "n": "Fanad Head lighthouse",
          "d": "One of the world's most beautiful lighthouses. Reach it across Lough Swilly via the Harry Blaney Bridge.",
          "tags": [
            "s",
            "w",
            "history"
          ]
        },
        {
          "n": "Knockalla coast road",
          "d": "Riding right on the sea, down to Portsalon.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Ballymastocker Bay / Portsalon",
          "d": "Regularly voted among the world's best beaches.",
          "tags": [
            "beach"
          ]
        },
        {
          "n": "Atlantic Drive, Rosguill",
          "d": "A short, stunning loop — unmissable.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Horn Head & Dunfanaghy",
          "d": "Headland viewpoint (detour), then Dunfanaghy village for a good food stop.",
          "tags": [
            "view",
            "town"
          ]
        },
        {
          "n": "Glenveagh / Errigal (optional)",
          "d": "Inland detour: castle and gardens, or Errigal mountain views and the Poisoned Glen on the R251.",
          "tags": [
            "b",
            "nature"
          ]
        },
        {
          "n": "Bloody Foreland",
          "d": "Headland named for the red glow of the setting sun, into the Rosses.",
          "tags": [
            "view"
          ]
        }
      ],
      "night": {
        "area": "NW Donegal",
        "primary": "Corcreggan Mill, Dunfanaghy",
        "note": "Quirky and biker-friendly, ~€12pp.",
        "backup": "Wild Atlantic Camp, Creeslough (pods = storm insurance)",
        "sellout": false
      }
    },
    {
      "n": "03",
      "dow": "WED",
      "date": "12 AUG",
      "title": "SW Donegal → Sligo → North Mayo",
      "tagline": "The big one — Donegal to Mayo",
      "miles": "~180–210mi",
      "phase": "waw",
      "warnBanner": "Biggest stop-density day of the trip. Keep moving — the miles add up.",
      "stops": [
        {
          "n": "Dungloe → Narin/Portnoo",
          "d": "Maghery sea arches, then the huge beach at Narin.",
          "tags": [
            "beach"
          ]
        },
        {
          "n": "Glengesh Pass",
          "d": "Hairpin descent into Ardara (tweed town, Nancy's Bar).",
          "tags": [
            "b"
          ]
        },
        {
          "n": "Assaranca & Maghera Caves",
          "d": "Waterfall, then tide-dependent caves and beach.",
          "tags": [
            "nature",
            "beach"
          ]
        },
        {
          "n": "Silver Strand, Malin Beg",
          "d": "Perfect horseshoe beach — 170 steps down.",
          "tags": [
            "beach"
          ]
        },
        {
          "n": "Slieve League / Sliabh Liag",
          "d": "Among Europe's highest sea cliffs (600m). Ride up to the UPPER Bunglass car park — open the gate, close it behind you — rather than walking from the lower one.",
          "tags": [
            "s",
            "w",
            "view"
          ]
        },
        {
          "n": "Killybegs",
          "d": "Ireland's biggest fishing port — chowder and fish & chips.",
          "tags": [
            "town",
            "food"
          ]
        },
        {
          "n": "Donegal Town → Bundoran",
          "d": "Castle, then Rossnowlagh surf beach, Ballyshannon (Rory Gallagher statue) and Bundoran's Tullan Strand.",
          "tags": [
            "town",
            "beach"
          ]
        },
        {
          "n": "Mullaghmore Head",
          "d": "Big-wave surf spot with Classiebawn Castle set against Ben Bulben — one of THE Wild Atlantic Way photos.",
          "tags": [
            "s",
            "w",
            "view"
          ]
        },
        {
          "n": "Drumcliffe & Strandhill",
          "d": "W.B. Yeats' grave under Ben Bulben, then Strandhill: Shell's Café, VOYA seaweed baths, Mammy Johnston's ice cream.",
          "tags": [
            "history",
            "cafe"
          ]
        },
        {
          "n": "Carrowmore",
          "d": "Megalithic cemetery older than the pyramids. Optional Knocknarea hike (45min) to Queen Maeve's cairn.",
          "tags": [
            "history"
          ]
        },
        {
          "n": "Aughris Head",
          "d": "The Beach Bar — a thatched pub on the sand — then Easkey and Enniscrone.",
          "tags": [
            "pub",
            "beach"
          ]
        },
        {
          "n": "Downpatrick Head",
          "d": "The Dún Briste sea stack and a blowhole. Céide Fields nearby: a 5,500-year-old Neolithic field system.",
          "tags": [
            "s",
            "w",
            "view",
            "history"
          ]
        }
      ],
      "night": {
        "area": "Sligo",
        "primary": "Strandhill Caravan & Camping",
        "note": "On the beach, pubs walkable, ~€20pp.",
        "backup": "Belleek Park, Ballina (30min further = shorter Thursday)",
        "sellout": true
      }
    },
    {
      "n": "04",
      "dow": "THU",
      "date": "13 AUG",
      "title": "Erris → Belmullet → Achill Island",
      "tagline": "Wildest Ireland — Erris & Achill",
      "miles": "~150–180mi",
      "phase": "waw",
      "stops": [
        {
          "n": "Erris / Mullet Peninsula",
          "d": "Voted the wildest place in Ireland: Belmullet, Erris Head, Annagh Head, the Deirbhile's Twist sculpture, Elly Bay.",
          "tags": [
            "nature",
            "beach"
          ]
        },
        {
          "n": "Blacksod lighthouse",
          "d": "Sent the weather report that delayed D-Day by 24 hours.",
          "tags": [
            "history"
          ]
        },
        {
          "n": "Ballycroy / Wild Nephin",
          "d": "National park and dark-sky reserve — a bog road runs right across the middle.",
          "tags": [
            "b",
            "nature"
          ]
        },
        {
          "n": "Achill Atlantic Drive",
          "d": "Cross the Michael Davitt bridge onto Achill, then the south-coast drive with the Ashleam Bay hairpins.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Keel & Slievemore",
          "d": "Keel Beach and Cathedral Rocks, Minaun Heights viewpoint, and the Slievemore Deserted Village.",
          "tags": [
            "beach",
            "history"
          ]
        },
        {
          "n": "Keem Bay",
          "d": "The horseshoe. Banshees of Inisherin country — the cliff road out to it is the money shot of Mayo. Basking sharks in season.",
          "tags": [
            "s",
            "w",
            "beach",
            "view"
          ]
        }
      ],
      "night": {
        "area": "Achill Island",
        "primary": "Keel Sandybanks Caravan & Camping",
        "note": "On Keel beach, ~€18pp.",
        "backup": "Seal Caves Campsite, Dugort (quieter, north side)",
        "sellout": true
      }
    },
    {
      "n": "05",
      "dow": "FRI",
      "date": "14 AUG",
      "title": "Achill → Doolough → Connemara → Clifden",
      "tagline": "Fjord, famine road & Sky Road",
      "miles": "~150–170mi",
      "phase": "waw",
      "stops": [
        {
          "n": "Mulranny → Westport",
          "d": "Causeway viewpoint, Newport, then the best town in Mayo: Matt Molloy's pub (owner is The Chieftains' flute player), Croagh Patrick looming over Clew Bay.",
          "tags": [
            "town",
            "pub"
          ]
        },
        {
          "n": "Doolough Valley",
          "d": "The R335 famine road — black lake, bare mountains, empty and haunting. One of Ireland's finest roads.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Killary Harbour",
          "d": "Via Aasleagh Falls and Leenane — Ireland's only fjord, 16km long.",
          "tags": [
            "s",
            "w",
            "view"
          ]
        },
        {
          "n": "Connemara",
          "d": "Kylemore Abbey (the photo from across the lake is free), Connemara National Park at Letterfrack, the Inagh Valley through the Twelve Bens.",
          "tags": [
            "b",
            "nature",
            "attraction"
          ]
        },
        {
          "n": "Omey Island",
          "d": "At Claddaghduff — ride across the SAND at low tide to a tidal island.",
          "warn": "Check the tide times. Genuinely — people get caught.",
          "tags": [
            "beach"
          ]
        },
        {
          "n": "Sky Road",
          "d": "Ridden north-to-south for the best reveal, into Clifden.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Derrigimlagh",
          "d": "A bog-loop walk: Alcock & Brown's 1919 transatlantic crash-landing site and Marconi's first transatlantic radio station.",
          "tags": [
            "s",
            "w",
            "history"
          ]
        }
      ],
      "night": {
        "area": "Clifden",
        "primary": "Clifden Eco Beach Camping",
        "note": "Pitch practically on the water — the famous one, ~€20pp.",
        "backup": "Clifden Camping & Caravan Park",
        "sellout": true
      }
    },
    {
      "n": "06",
      "dow": "SAT",
      "date": "15 AUG",
      "title": "Connemara → Galway → Burren → Doolin",
      "tagline": "The Burren & the Cliffs",
      "miles": "~140–160mi",
      "phase": "waw",
      "stops": [
        {
          "n": "Roundstone",
          "d": "Gurteen Bay and Dog's Bay — back-to-back white-shell beaches.",
          "tags": [
            "beach"
          ]
        },
        {
          "n": "R336 coast to Spiddal",
          "d": "Through the Connemara Gaeltacht along the water.",
          "tags": [
            "b"
          ]
        },
        {
          "n": "Galway City",
          "d": "Lunch stop: the Latin Quarter, Quay Street, the Spanish Arch, buskers.",
          "warn": "Park sensibly and keep an eye on the bikes.",
          "tags": [
            "town",
            "pub"
          ]
        },
        {
          "n": "Kinvara & Flaggy Shore",
          "d": "Dunguaire Castle photo, then the Flaggy Shore.",
          "tags": [
            "history",
            "view"
          ]
        },
        {
          "n": "Corkscrew Hill",
          "d": "The N67 switchbacks up into the Burren with Galway Bay behind you.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Poulnabrone & Caherconnell",
          "d": "5,800-year-old portal tomb (free), then a stone fort with sheepdog demos.",
          "tags": [
            "history"
          ]
        },
        {
          "n": "Black Head coast road",
          "d": "The R477 around the point to Fanore Beach — superb swim/photo stop.",
          "tags": [
            "b",
            "beach"
          ]
        },
        {
          "n": "Cliffs of Moher",
          "d": "Arrive before 8am or after 6pm to have them without coaches. Or walk the Doolin Cliff Walk from the north (free, arguably better views); Hag's Head at the south end is quietest.",
          "tags": [
            "s",
            "w",
            "view"
          ],
          "warn": "Official centre charges ~€7–12pp — check the bike parking rate."
        },
        {
          "n": "Doolin",
          "d": "Trad-music capital: Gus O'Connor's, McGann's, McDermott's — sessions nightly in August.",
          "tags": [
            "town",
            "pub"
          ]
        },
        {
          "n": "Aran Islands (optional)",
          "d": "Ferry from Doolin (Inisheer, 15min). Skip it this trip — it needs its own day.",
          "tags": [
            "attraction"
          ]
        }
      ],
      "night": {
        "area": "Doolin",
        "primary": "Nagle's Doolin",
        "note": "Cliffs of Moher view from the tent, ~€18pp.",
        "backup": "O'Connors Riverside, Doolin",
        "sellout": true
      }
    },
    {
      "n": "07",
      "dow": "SUN",
      "date": "16 AUG",
      "title": "Clare → Loop Head → Shannon → Dingle",
      "tagline": "Loop Head, the Shannon & Dingle",
      "miles": "~170–190mi",
      "phase": "waw",
      "stops": [
        {
          "n": "Lahinch → Kilkee",
          "d": "Surf town, Spanish Point, Quilty.",
          "tags": [
            "town",
            "beach"
          ]
        },
        {
          "n": "Kilkee Cliffs",
          "d": "Locals say they rival Moher without a single coach. The Pollock Holes and Bridges of Ross nearby.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Loop Head",
          "d": "Lighthouse with an end-of-the-world feel.",
          "tags": [
            "s",
            "w",
            "view"
          ]
        },
        {
          "n": "Killimer → Tarbert ferry",
          "skip": true,
          "d": "Across the Shannon — hourly on the half-hour, ~20min, ~€10–12/bike. Saves 85mi via Limerick.",
          "warn": "Runs on the half-hour — time your arrival.",
          "tags": [
            "logistics"
          ]
        },
        {
          "n": "Ballybunion → Inch Beach",
          "d": "Cliff walk, Banna Strand, then the Camp junction onto Dingle and 3mi of Inch Beach you can ride onto (Ryan's Daughter).",
          "tags": [
            "beach"
          ]
        },
        {
          "n": "Annascaul: South Pole Inn",
          "d": "Antarctic hero Tom Crean's own pub. Mandatory pint / lunch.",
          "tags": [
            "pub",
            "history"
          ]
        },
        {
          "n": "Dingle town",
          "d": "Murphy's Ice Cream (rare Kerry-cow milk, sea salt), Dick Mack's (pub / leather shop), Foxy John's (pub / hardware shop).",
          "tags": [
            "town",
            "cafe",
            "pub"
          ]
        },
        {
          "n": "Slea Head Drive",
          "d": "Ventry, Dunbeg Fort, famine cottages, the beehive huts, the Slea Head crucifix, Coumeenoole Beach and Dunquin Pier's winding sheep path.",
          "tags": [
            "b",
            "view"
          ],
          "warn": "Ride CLOCKWISE — it's the mandatory direction for buses. Don't fight it."
        },
        {
          "n": "Blasket Sound",
          "d": "The Great Blasket Centre, Gallarus Oratory (a 1,300-year-old dry-stone church) and Kilmalkedar Church.",
          "tags": [
            "s",
            "w",
            "history"
          ]
        },
        {
          "n": "Conor Pass",
          "d": "Ireland's highest. Narrow, with a cliff wall on one side. Ride it this evening for golden light, or first thing tomorrow.",
          "tags": [
            "b",
            "view"
          ]
        }
      ],
      "night": {
        "area": "West Dingle",
        "primary": "Campáil Teach an Aragail, Gallarus",
        "note": "In the heart of Slea Head, ~€15pp.",
        "backup": "Dingle town campsite (dinglecamping.ie)",
        "sellout": false
      }
    },
    {
      "n": "08",
      "dow": "MON",
      "date": "17 AUG",
      "title": "Ring of Kerry + Skellig Ring",
      "tagline": "The Ring & the Skelligs, clockwise",
      "miles": "~150–190mi",
      "phase": "waw",
      "warnBanner": "Ride the Ring CLOCKWISE (Killarney → Kenmare → Sneem). Coaches go anticlockwise — you meet them at pinch points but never crawl behind one.",
      "stops": [
        {
          "n": "Killarney National Park",
          "d": "Muckross House and Abbey, Torc Waterfall (5min walk), Ladies View, and Molls Gap on the N71.",
          "tags": [
            "b",
            "nature"
          ]
        },
        {
          "n": "Ballaghbeama Gap",
          "d": "The empty Kerry nobody sees — Black Valley and the gap, zero coaches, no pony-trap politics. The biker's alternative to the coach-clogged main Ring.",
          "tags": [
            "b"
          ]
        },
        {
          "n": "Kenmare → Waterville",
          "d": "Loveliest town on the Ring, then Sneem, Staigue Fort (2,500 years old), Derrynane House & beach, the Coomakista Pass viewpoint, and Waterville (Charlie Chaplin holidayed here).",
          "tags": [
            "town",
            "history"
          ]
        },
        {
          "n": "Skellig Ring",
          "d": "Peel off at Waterville where coaches physically can't fit: Ballinskelligs, St Finian's Bay (Skelligs chocolate factory).",
          "tags": [
            "b"
          ]
        },
        {
          "n": "Coomanaspig Pass",
          "d": "One of Ireland's highest paved roads — brutally steep, sensational — down to Portmagee.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Valentia Island: Bray Head",
          "d": "25min walk to the tower. Geokaun Mountain viewpoint (small toll) and the tetrapod trackway — the oldest footprints on Earth, 385 million years.",
          "tags": [
            "s",
            "w",
            "view",
            "history"
          ]
        },
        {
          "n": "Skellig Michael",
          "d": "The Star Wars island monastery. Landing boats sell out months ahead — almost certainly gone for August. Eco-cruises (no landing) sometimes have space; or the Skellig Experience Centre on Valentia.",
          "warn": "Don't build the day around a boat you can't get.",
          "tags": [
            "attraction",
            "history"
          ]
        },
        {
          "n": "Cahersiveen → Kenmare",
          "d": "Cahergall & Leacanabuaile stone forts, then back over the Ballaghbeama or Ballaghisheen for the night near Kenmare — sets up Beara in the morning.",
          "tags": [
            "b",
            "history"
          ]
        }
      ],
      "night": {
        "area": "Kenmare / Beara gateway",
        "primary": "Ring of Kerry Camping, Kenmare",
        "note": "Sets up an early Healy Pass, ~€18pp.",
        "backup": "Mannix Point, Cahersiveen (award-winning, campfires)",
        "sellout": true
      }
    },
    {
      "n": "09",
      "dow": "TUE",
      "date": "18 AUG",
      "title": "Beara → Mizen → Kinsale → Rosslare",
      "tagline": "The finish line, then the dash to the boat",
      "miles": "~240–270mi",
      "phase": "waw",
      "warnBanner": "The big one — dawn start. Finish the WAW at Kinsale, then run the Copper Coast east to camp within 30 min of Rosslare for the 08:15 boat home.",
      "stops": [
        {
          "n": "Healy Pass",
          "d": "Adrigole to Lauragh — the single best pass in Ireland. Switchbacks over the Caha mountains; its “dangerous” reputation is hugely exaggerated.",
          "tags": [
            "b",
            "view"
          ]
        },
        {
          "n": "Castletownbere",
          "d": "McCarthy's Bar, of the book cover — coffee stop.",
          "tags": [
            "town",
            "pub"
          ]
        },
        {
          "n": "Dursey Island cable car",
          "d": "Ireland's only cable car — six people and the odd sheep — across to the island. Quick look; the clock's ticking today.",
          "tags": [
            "s",
            "attraction"
          ]
        },
        {
          "n": "Caha Pass tunnels",
          "d": "Rock tunnels blasted through the mountain on the N71, into Glengarriff and Bantry.",
          "tags": [
            "b"
          ]
        },
        {
          "n": "Mizen Head",
          "d": "Ireland's south-westernmost point — a footbridge over the gorge (~€7.50). Barleycove Beach and Schull after.",
          "tags": [
            "s",
            "w",
            "view"
          ]
        },
        {
          "n": "Baltimore → Drombeg",
          "d": "The Baltimore beacon, Skibbereen, Lough Hyne, then Drombeg Stone Circle (free, atmospheric).",
          "tags": [
            "history"
          ]
        },
        {
          "n": "Old Head of Kinsale",
          "d": "Viewpoint over the headland (a private golf course); the Lusitania sank offshore.",
          "tags": [
            "s",
            "view",
            "history"
          ]
        },
        {
          "n": "KINSALE",
          "d": "THE OFFICIAL END OF THE WILD ATLANTIC WAY. Colourful streets, Charles Fort, gourmet capital. Finish-line photo at the WAW marker.",
          "finish": true,
          "tags": [
            "town",
            "pub"
          ]
        },
        {
          "n": "Copper Coast run to Rosslare",
          "skip": true,
          "d": "From Kinsale, east past Cork, then the R675 Copper Coast (Ardmore, Dungarvan, Tramore) to camp near Rosslare. ~150mi — the price of the morning boat. Keep it moving.",
          "warn": "Long slog after a big day; fuel up and push on.",
          "tags": [
            "logistics"
          ]
        }
      ],
      "night": {
        "area": "Rosslare (for the boat)",
        "primary": "St Margaret's Beach Camping, Rosslare",
        "note": "~30 min from Rosslare Harbour, ~€12pp. Sets up the 08:15 sailing.",
        "backup": "Morriscastle Strand, Kilmuckridge (~€15pp)",
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
      "day": "02",
      "date": "Tue 11"
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
      "day": "03",
      "date": "Wed 12"
    },
    {
      "id": "s6",
      "name": "Keem Bay (Achill)",
      "county": "Mayo",
      "day": "04",
      "date": "Thu 13"
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
      "day": "05",
      "date": "Fri 14"
    },
    {
      "id": "s9",
      "name": "Cliffs of Moher",
      "county": "Clare",
      "day": "06",
      "date": "Sat 15"
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
      "name": "Dursey Island",
      "county": "Cork",
      "day": "09",
      "date": "Tue 18"
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
      "primary": "Tullagh Bay Camping, Clonmany",
      "primaryNote": "Beachside, ~€12",
      "backup": "Inishowen Caravan Park, Buncrana (~€10)",
      "sellout": false
    },
    {
      "night": "Tue 11",
      "base": "NW Donegal",
      "primary": "Corcreggan Mill, Dunfanaghy",
      "primaryNote": "Biker-friendly, ~€12",
      "backup": "Wild Atlantic Camp (pods = storm insurance)",
      "sellout": false
    },
    {
      "night": "Wed 12",
      "base": "Sligo",
      "primary": "Strandhill Caravan & Camping",
      "primaryNote": "On the beach, ~€20",
      "backup": "Belleek Park, Ballina",
      "sellout": true
    },
    {
      "night": "Thu 13",
      "base": "Achill Island",
      "primary": "Keel Sandybanks",
      "primaryNote": "On Keel beach, ~€18",
      "backup": "Seal Caves, Dugort",
      "sellout": true
    },
    {
      "night": "Fri 14",
      "base": "Clifden",
      "primary": "Clifden Eco Beach Camping",
      "primaryNote": "Pitch on the water, ~€20",
      "backup": "Clifden Camping & Caravan Park",
      "sellout": true
    },
    {
      "night": "Sat 15",
      "base": "Doolin",
      "primary": "Nagle's Doolin",
      "primaryNote": "Cliffs view from the tent, ~€18",
      "backup": "O'Connors Riverside",
      "sellout": true
    },
    {
      "night": "Sun 16",
      "base": "West Dingle",
      "primary": "Campáil Teach an Aragail, Gallarus",
      "primaryNote": "Mid-Slea Head, ~€15",
      "backup": "Dingle town campsite",
      "sellout": false
    },
    {
      "night": "Mon 17",
      "base": "Kenmare / Beara",
      "primary": "Ring of Kerry Camping, Kenmare",
      "primaryNote": "Sets up Healy Pass, ~€18",
      "backup": "Mannix Point, Cahersiveen",
      "sellout": true
    },
    {
      "night": "Tue 18",
      "base": "Rosslare (for the boat)",
      "primary": "St Margaret's Beach, Rosslare",
      "primaryNote": "~30 min from the port, ~€12",
      "backup": "Morriscastle Strand, Kilmuckridge (~€15)",
      "sellout": false
    }
  ],
  "campNotes": {
    "intro": "Every night is an established, bookable campsite — zero wild camping, no turning up hoping. All €10–20pp. Book the primary; if it's full, book the listed backup on the same call.",
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
      "lat": 55.21,
      "lon": -6.24,
      "area": "Antrim Coast",
      "phase": "lead"
    },
    {
      "n": "02",
      "lat": 55.27,
      "lon": -7.42,
      "area": "Inishowen",
      "phase": "lead"
    },
    {
      "n": "03",
      "lat": 55.18,
      "lon": -7.98,
      "area": "NW Donegal",
      "phase": "waw"
    },
    {
      "n": "04",
      "lat": 54.27,
      "lon": -8.62,
      "area": "Sligo",
      "phase": "waw"
    },
    {
      "n": "05",
      "lat": 53.98,
      "lon": -10.05,
      "area": "Achill Island",
      "phase": "waw"
    },
    {
      "n": "06",
      "lat": 53.49,
      "lon": -10.02,
      "area": "Clifden",
      "phase": "waw"
    },
    {
      "n": "07",
      "lat": 53.01,
      "lon": -9.38,
      "area": "Doolin",
      "phase": "waw"
    },
    {
      "n": "08",
      "lat": 52.18,
      "lon": -10.28,
      "area": "Dingle",
      "phase": "waw"
    },
    {
      "n": "09",
      "lat": 51.95,
      "lon": -10.22,
      "area": "Ring of Kerry",
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
