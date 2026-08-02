import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App'
import { StoreProvider } from './store/StoreProvider'
import { ErrorBoundary } from './components/ErrorBoundary'
import { registerSW } from './lib/registerSW'

/* Errors outside React's render tree (async handlers, promise chains) never hit
 * the ErrorBoundary — keep the most recent one so the Info footer can surface it
 * when something feels off on the road. */
function noteError(msg: string) {
  try {
    localStorage.setItem('waw:lasterr', new Date().toISOString().slice(0, 16).replace('T', ' ') + ' — ' + String(msg).slice(0, 200))
  } catch {}
}
window.addEventListener('unhandledrejection', (e) => {
  noteError((e.reason && (e.reason.message || e.reason)) || 'unhandled rejection')
})
window.addEventListener('error', (e) => {
  if (e.message) noteError(e.message)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <StoreProvider>
        <App />
      </StoreProvider>
    </ErrorBoundary>
  </StrictMode>,
)

registerSW()
