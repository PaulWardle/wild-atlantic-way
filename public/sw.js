/* Wild Atlantic Way — service worker.
 *
 * Goal: the app opens and works with no signal (a bothy in Donegal, a ferry in
 * the middle of the Irish Sea). We cache the app shell and every hashed build
 * asset so the whole UI loads offline; the brothers' data still comes from
 * Supabase when there's a connection, and the app's own offline outbox handles
 * the rest.
 *
 * The shell upgrade is ATOMIC: we never store an index.html whose hashed
 * assets we don't also hold — a deploy on one bar of signal must not leave a
 * cache that white-screens offline. Assets are precached at INSTALL, so one
 * online visit makes the app fully offline-capable.
 *
 * Bump CACHE when the caching logic itself changes — old caches are cleared on
 * activate. Build assets are content-hashed, so they never go stale.
 */

const CACHE = 'waw-shell-v4'

// Stable-URL extras (icons, manifest) — best-effort, not shell-critical.
const EXTRAS = ['/manifest.webmanifest', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png']

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com']

const assetsIn = (html) => html.match(/\/assets\/[^"' )]+/g) || []

/* Strict asset caching. The host's SPA fallback answers 200-with-HTML for a
 * MISSING asset (deploy race), which would poison the cache with HTML stored
 * under script URLs and hard-fail module MIME checks — brick, online and off.
 * So: reject redirects and any HTML masquerading as an asset. */
async function addAssets(cache, urls) {
  await Promise.all(
    urls.map(async (u) => {
      const r = await fetch(u)
      const ct = r.headers.get('content-type') || ''
      if (!r.ok || r.redirected || ct.includes('text/html')) throw new Error('asset unavailable: ' + u)
      await cache.put(u, r)
    }),
  )
}

/* All shell mutations run through one chain — two overlapping navigations
 * around a deploy must never interleave their put/prune steps. */
let shellChain = Promise.resolve()
const serialize = (fn) => {
  const run = () => fn().catch(() => {})
  shellChain = shellChain.then(run, run)
  return shellChain
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE)
      // Fetch the CANONICAL URL ('/'): '/index.html' 307-redirects on this
      // host, and a redirected response is spec-ILLEGAL for a navigation —
      // serving it offline produced a network error, breaking offline boot
      // entirely. Assets cached FIRST so a failed download fails the install
      // and the previous worker (with its intact cache) stays in charge.
      const res = await Promise.race([
        fetch(new Request('/', { cache: 'reload' })),
        new Promise((_, reject) => setTimeout(() => reject(new Error('install timeout')), 15000)),
      ])
      if (!res.ok) throw new Error('install: shell ' + res.status)
      const html = await res.clone().text()
      await addAssets(cache, assetsIn(html))
      // Re-wrap so the stored response can never carry a redirect flag.
      await cache.put('/index.html', new Response(html, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } }))
      await Promise.all(EXTRAS.map((u) => cache.add(u).catch(() => {})))
      await self.skipWaiting()
    })(),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      // Carry cached fonts across the version bump — deleting them meant the
      // first offline launch after an upgrade rendered in system fonts.
      .then(async (keys) => {
        const cache = await caches.open(CACHE)
        for (const k of keys.filter((k2) => k2 !== CACHE)) {
          try {
            const oldCache = await caches.open(k)
            for (const req of await oldCache.keys()) {
              if (FONT_HOSTS.includes(new URL(req.url).hostname) && !(await cache.match(req))) {
                const res = await oldCache.match(req)
                if (res) await cache.put(req, res)
              }
            }
          } catch {
            /* best-effort */
          }
        }
        return keys
      })
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => caches.open(CACHE))
      .then((cache) => serialize(() => pruneAssets(cache)))
      .then(() => self.clients.claim()),
  )
})

/* Hashed /assets/ files accumulate forever otherwise (every deploy adds a new
 * set). The current index.html references everything the running build needs,
 * so anything under /assets/ it doesn't mention is a dead old version. */
async function pruneAssets(cache) {
  try {
    const doc = await cache.match('/index.html')
    if (!doc) return
    const referenced = new Set(assetsIn(await doc.clone().text()))
    const keys = await cache.keys()
    await Promise.all(
      keys.map((k) => {
        const p = new URL(k.url).pathname
        if (p.startsWith('/assets/') && !referenced.has(p)) return cache.delete(k)
      }),
    )
  } catch {
    /* best-effort */
  }
}

/* Atomic shell refresh after a successful navigation fetch: cache any NEW
 * assets first; only if they all land does the new HTML replace the old one
 * (then stale assets are pruned). If asset caching fails mid-deploy, the old,
 * self-consistent shell stays — the live session still got the fresh page. */
async function refreshShell(cache, res) {
  // `res` must be a DEDICATED clone taken synchronously in the fetch handler —
  // cloning after the page consumed the navigation body throws and silently
  // killed every refresh (the v3 regression). Serialized so overlapping
  // navigations can't interleave put/prune.
  return serialize(async () => {
    const html = await res.text()
    const wanted = assetsIn(html)
    const missing = []
    for (const a of wanted) {
      if (!(await cache.match(a))) missing.push(a)
    }
    if (missing.length) await addAssets(cache, missing)
    await cache.put('/index.html', new Response(html, { status: 200, headers: { 'content-type': 'text/html; charset=utf-8' } }))
    await pruneAssets(cache)
  })
}

async function cacheFirst(request, event, allowOpaque) {
  const cache = await caches.open(CACHE)
  const hit = await cache.match(request)
  if (hit) return hit
  const res = await fetch(request)
  // Google Fonts CSS can arrive opaque (no-cors <link>) — status is unreadable,
  // but caching it is the only way type survives offline, so allow it for fonts.
  const ct = res ? res.headers.get('content-type') || '' : ''
  const assetPoison = new URL(request.url).pathname.startsWith('/assets/') && ct.includes('text/html')
  if (res && !assetPoison && (res.ok || (allowOpaque && res.type === 'opaque'))) {
    const put = cache.put(request, res.clone()).catch(() => {})
    if (event) event.waitUntil(put)
  }
  return res
}

async function networkFirstDoc(request, event) {
  const cache = await caches.open(CACHE)
  // Lie-fi guard: one bar of phantom signal must not hang the app shell. If the
  // network hasn't answered in 3.5s and we have a cached shell, boot from cache —
  // the fetch carries on in the background and (atomically) refreshes the cache.
  const netP = fetch(request).then((res) => {
    // Clone SYNCHRONOUSLY — the page consumes `res` the moment we return it.
    if (res && res.ok && event) event.waitUntil(refreshShell(cache, res.clone()))
    return res
  })
  try {
    return await Promise.race([
      netP,
      new Promise((_, reject) => setTimeout(() => reject(new Error('lie-fi timeout')), 3500)),
    ])
  } catch {
    // Offline or timed out: serve the cached shell so the SPA can boot and
    // render from localStorage / the outbox.
    const hit = await cache.match('/index.html')
    if (hit) {
      if (event) event.waitUntil(netP.catch(() => {}))
      return hit
    }
    // Nothing cached (first ever visit on bad signal): wait out the network.
    return netP.catch(() => Response.error())
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)

  // App navigations: network-first, fall back to the cached shell offline.
  if (req.mode === 'navigate') {
    event.respondWith(networkFirstDoc(req, event))
    return
  }

  // Google Fonts (cross-origin): cache-first so type still loads offline.
  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(req, event, true))
    return
  }

  // Same-origin static (hashed build assets, icons, manifest): cache-first.
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(req, event))
    return
  }

  // Everything else (Supabase REST/storage, reverse-geocode, weather): straight
  // to the network — this data is live and must never be served stale.
})
