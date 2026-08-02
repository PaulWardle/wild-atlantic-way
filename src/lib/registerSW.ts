/* Registers the service worker that makes the app installable and offline-ready.
 * Only runs in a production build — in dev the cache-first worker would serve
 * stale modules and fight hot-reload. */

export function registerSW() {
  if (!import.meta.env.PROD) return
  if (!('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        // Long-lived foreground sessions (phone on the bar mount all day)
        // still pick up worker updates when the app returns to focus.
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible') reg.update().catch(() => {})
        })
      })
      .catch(() => {
        // A failed registration must never break the app — it just means no
        // offline shell this session.
      })
  })
}
