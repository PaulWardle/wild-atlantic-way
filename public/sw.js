/* Wild Atlantic Way — service worker.
 *
 * Goal: the app opens and works with no signal (a bothy in Donegal, a ferry in
 * the middle of the Irish Sea). We cache the app shell and every hashed build
 * asset so the whole UI loads offline; the brothers' data still comes from
 * Supabase when there's a connection, and the app's own offline outbox handles
 * the rest.
 *
 * Bump CACHE when the caching logic itself changes — old caches are cleared on
 * activate. Build assets are content-hashed, so they never go stale.
 */

const CACHE = 'waw-shell-v2'

// The bits with stable URLs that make up the shell. Hashed /assets/* files are
// cached on demand (cache-first) the first time they're requested.
const SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icon-192.png', '/icon-512.png', '/apple-touch-icon.png']

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      // addAll is atomic — if one 404s the whole install fails, so add the
      // must-haves atomically and the fonts best-effort.
      .then((cache) => cache.addAll(['/', '/index.html']).then(() => cache.addAll(SHELL).catch(() => {})))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => caches.open(CACHE))
      .then((cache) => pruneAssets(cache))
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
    const html = await doc.clone().text()
    const referenced = new Set(html.match(/\/assets\/[^"' )]+/g) || [])
    const keys = await cache.keys()
    await Promise.all(
      keys.map((k) => {
        const p = new URL(k.url).pathname
        if (p.startsWith('/assets/') && !referenced.has(p)) return cache.delete(k)
      }),
    )
  } catch {}
}

async function cacheFirst(request, allowOpaque) {
  const cache = await caches.open(CACHE)
  const hit = await cache.match(request)
  if (hit) return hit
  const res = await fetch(request)
  // Google Fonts CSS arrives opaque (no-cors <link>) — status is unreadable, but
  // caching it is the only way type survives offline, so allow it for fonts.
  if (res && (res.ok || (allowOpaque && res.type === 'opaque'))) cache.put(request, res.clone())
  return res
}

async function networkFirstDoc(request, event) {
  const cache = await caches.open(CACHE)
  // Lie-fi guard: one bar of phantom signal must not hang the app shell. If the
  // network hasn't answered in 3.5s and we have a cached shell, boot from cache —
  // the fetch carries on in the background and refreshes the cache for next time.
  const netP = fetch(request).then((res) => {
    if (res && res.ok) {
      const put = cache.put('/index.html', res.clone()).then(() => pruneAssets(cache))
      if (event) event.waitUntil(put)
    }
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
    const hit = (await cache.match('/index.html')) || (await cache.match('/'))
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
    event.respondWith(cacheFirst(req, true))
    return
  }

  // Same-origin static (hashed build assets, icons, manifest): cache-first.
  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(req))
    return
  }

  // Everything else (Supabase REST/storage, reverse-geocode, weather): straight
  // to the network — this data is live and must never be served stale.
})
