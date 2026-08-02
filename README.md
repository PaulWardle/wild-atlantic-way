# Wild Atlantic Way — Trip App

A private, mobile-first web app for a motorcycle trip around Ireland's Wild
Atlantic Way (Muff → Kinsale, Aug 2026), shared between the two riders
("brothers") and their friends & family ("guests").

It has a live countdown, a hand-drawn interactive route map with live position and
a green "completed" progress line, a day-by-day itinerary with keep/maybe/cut
decisions, campsites, the "Signature 15" highlights, a shared postbox (messages
from F&F), a day-by-day journal, and a printable Trip Book export. Shared state
lives in **Supabase** (near-real-time for everyone on the link); device state lives
in **localStorage**, with an **offline outbox** so nothing is lost when signal drops.

This is a **React + Vite + TypeScript** rebuild of an app that originally shipped as
a single bespoke `.dc.html` file. The original handoff — the definitive spec for
look and behaviour, plus full-screen reference screenshots — lives in
[`reference/`](./reference).

---

## Quick start

```bash
npm install
npm run dev        # dev server (Vite) with HMR
npm run build      # typecheck + production build → dist/
npm run preview    # serve the production build locally
npm run typecheck  # type-check only
```

Requires Node 18+.

---

## Architecture

A single-page app with **no server of its own**. All shared state is in Supabase;
all device state is in `localStorage`. That's what makes hosting trivial and offline
work — and it's preserved from the original.

```
src/
  main.tsx                 React root → <StoreProvider><App/></StoreProvider>
  App.tsx                  Phone frame, app bar, screen router, bottom nav, overlays
  theme.ts                 Design tokens (palette, type stack, phase colours)
  types.ts                 Trip content + local store types
  index.css                Reset, keyframes, print (Trip Book) styles

  store/StoreProvider.tsx  The heart: localStorage persistence, Supabase sync,
                           realtime, the offline outbox, navigation + history,
                           and every mutation. Exposed via useStore().

  data/
    tripData.ts            All trip content (ported verbatim from the handoff)
    derived.ts             Derived-once data (the north→south track-stops list)

  lib/
    supabase.ts            Shared anon client + backend docs
    geo.ts                 Map projection + splined coastline/route geometry
    tags.ts                Shared tag / reason / journal-kind vocabulary
    journal.ts             Builds the day-by-day journal record from all events
    time.ts                Relative + absolute time formatting
    countdown.ts           Countdown maths

  hooks/useMap.ts          Current map geometry from the latest ping
  components/              MapSVG, AppBar, BottomNav, Slider, SigRows, PassRows, ui
  screens/                 One file per screen (Home, Days, DayDetail, Today, Camp,
                           Signature, Sights, Passes, Kit, Postbox, Journal, Info,
                           Attractions, Decide, Gate, MapOverlay)
```

### Roles & access gate

On first load the app shows a **landing gate**. **Brother** requires a password
(`WAW`) and unlocks the full planner; **Guest** is a lighter, view-only follow-along
that can post to the postbox. The role is stored on the device and switchable from
the home header chip. See `reference/HANDOFF.md` for the full brother-vs-guest matrix.

### Offline outbox

Every write is optimistically applied to the local mirror and queued in an
`outbox`. A flush runs every 20s and on the `online` event, replaying queued ops to
Supabase and re-pulling. An amber "N waiting to send" banner and per-item "not sent"
tags show while anything is pending — so nobody thinks they posted when they hadn't.

---

## Backend — Supabase (kept as-is)

The backend already exists and is reused exactly. See `src/lib/supabase.ts` for the
URL, anon key, the five tables (`posts`, `locations`, `notes`, `marks`, `sig`) and
the access patterns. Row-Level Security is intentionally open for a private F&F link;
the anon key is a publishable client key and is expected to ship in the bundle.

> Note: the `locations` table uses columns `si` (index into the north→south
> track-stops list), `note`, `ts` — matching the original client code, which is the
> authority over the prose table in the handoff.

---

## Deploy (Cloudflare Pages)

1. Push to GitHub.
2. Cloudflare Pages → **Connect to Git** → pick the repo.
3. Build command `npm run build`, output directory `dist`, framework preset **Vite**.
4. Every push to the default branch auto-deploys.

Assets are content-hashed and vendor libraries are split into their own chunks, so a
redeploy only busts the caches of files that changed — avoiding the aggressive-cache
problem the original single-file build hit. Supabase needs no changes; the anon
client works from any origin under the current open policy.

---

## Notes on fidelity & improvements

The rebuild follows the original `.dc.html` as the spec for pixels and behaviour
(see `reference/`). A couple of things were improved along the way:

- **Natural coastline & routes** — the hand-authored Ireland outline and the route
  lines are drawn with a Catmull-Rom spline (still passing through every real
  coordinate) instead of straight segments, so the map reads naturally rather than
  angular.
- **Completed-route line fix** — the green "done" line now follows the route
  coastline up to the vertex *nearest* the live position, instead of splitting by
  latitude and drawing a straight jump to the exact (possibly inland) coordinates.
  This removes a stray diagonal that appeared when posting a southern/inland location.
