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

const CACHE = 'waw-shell-v1'

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
      .then(() => self.clients.claim()),
  )
})

async function cacheFirst(request) {
  const cache = await caches.open(CACHE)
  const hit = await cache.match(request)
  if (hit) return hit
  const res = await fetch(request)
  if (res && res.ok) cache.put(request, res.clone())
  return res
}

async function networkFirstDoc(request) {
  const cache = await caches.open(CACHE)
  try {
    const res = await fetch(request)
    if (res && res.ok) cache.put('/index.html', res.clone())
    return res
  } catch {
    // Offline: serve the cached shell so the SPA can boot and render from
    // localStorage / the outbox.
    return (await cache.match('/index.html')) || (await cache.match('/')) || Response.error()
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)

  // App navigations: network-first, fall back to the cached shell offline.
  if (req.mode === 'navigate') {
    event.respondWith(networkFirstDoc(req))
    return
  }

  // Google Fonts (cross-origin): cache-first so type still loads offline.
  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(req))
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
