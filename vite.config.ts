import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'

// Build stamp shown in the Info footer and on the crash card, so "which version
// is on your phone?" is answerable from the roadside.
function buildId(): string {
  const date = new Date().toISOString().slice(0, 10)
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim() + ' · ' + date
  } catch {
    return date
  }
}

// Static SPA. All shared state lives in Supabase; all device state in localStorage.
// Build output (dist/) is a plain multi-file static bundle — deploy anywhere
// (Cloudflare Pages: build `npm run build`, output dir `dist`).
//
// Assets are content-hashed and vendor libraries are split into their own chunks,
// so a redeploy only busts the caches of files that actually changed — which avoids
// the aggressive-browser-cache problem the original single-file build hit.
export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD__: JSON.stringify(buildId()),
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@supabase')) return 'supabase'
            if (id.includes('react')) return 'react'
            return 'vendor'
          }
        },
      },
    },
  },
})
