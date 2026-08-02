/* Offline photo queue.
 *
 * A picked photo is resized then, if it can't be uploaded right now (no signal),
 * stashed here in IndexedDB (localStorage is far too small for image blobs). The
 * row it belongs to carries a `local:<id>` token instead of a public URL; the
 * outbox uploads the blob and rewrites the token the moment the connection is
 * back. PhotoView resolves `local:` tokens to an in-memory object URL so the
 * brother sees their photo immediately — even offline, even after a reload.
 */

const DB_NAME = 'waw-photos'
const STORE = 'pending'
const TOKEN = 'local:'

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1)
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

function tx<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const t = db.transaction(STORE, mode)
        const req = fn(t.objectStore(STORE))
        let result: T
        req.onsuccess = () => {
          result = req.result
        }
        req.onerror = () => reject(req.error)
        // Resolve on transaction COMPLETE, not request success — quota aborts
        // fire at commit time, after the request already "succeeded".
        t.oncomplete = () => resolve(result)
        t.onabort = () => reject(t.error || new Error('idb abort'))
      }),
  )
}

export function isLocalPhoto(token: string | undefined | null): token is string {
  return !!token && token.startsWith(TOKEN)
}

export function localId(token: string): string {
  return token.slice(TOKEN.length)
}

/** Stash a processed blob; returns the `local:<id>` token to store on the row,
 * or null when the write genuinely failed (quota / private mode) — a dangling
 * token would show "uploading soon" forever for a photo that never existed. */
export async function queuePhoto(blob: Blob, presetId?: string): Promise<string | null> {
  const id = presetId || 'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
  try {
    await tx('readwrite', (s) => s.put(blob, id))
  } catch {
    return null // caller drops the photo with its normal couldn't-process path
  }
  return TOKEN + id
}

export async function loadPhoto(id: string): Promise<Blob | null> {
  try {
    return (await tx<Blob | undefined>('readonly', (s) => s.get(id))) || null
  } catch {
    return null
  }
}

export async function removePhoto(id: string): Promise<void> {
  try {
    await tx('readwrite', (s) => s.delete(id))
  } catch {
    /* noop */
  }
  const cached = urlCache.get(id)
  if (cached) {
    URL.revokeObjectURL(cached)
    urlCache.delete(id)
  }
}

/** Wipe every queued photo blob (used by "clear gallery" / reset everything). */
export async function clearAllPending(): Promise<void> {
  try {
    await tx('readwrite', (s) => s.clear())
  } catch {
    /* noop */
  }
  urlCache.forEach((url) => URL.revokeObjectURL(url))
  urlCache.clear()
}

// Object-URL cache so a given local photo resolves to a stable URL for the
// lifetime of the page (created once, reused across renders).
const urlCache = new Map<string, string>()

/** Resolve a `local:<id>` token to a displayable object URL (or null if gone). */
export async function localObjectURL(id: string): Promise<string | null> {
  const hit = urlCache.get(id)
  if (hit) return hit
  const blob = await loadPhoto(id)
  if (!blob) return null
  const url = URL.createObjectURL(blob)
  urlCache.set(id, url)
  return url
}
