import { getSupabase } from './supabase'
import { queuePhoto } from './photoQueue'

const isOffline = () => typeof navigator !== 'undefined' && navigator.onLine === false

/* Multiple photos share the single existing `photo` text column: one photo is
 * stored as a bare URL/token (as before), several as a JSON array string. This
 * keeps the shared backend unchanged and every old single-photo row valid. */

/** Decode a `photo` field into a list of URLs/tokens (0, 1 or many). */
/** Only URLs from our own storage (or queued local: tokens) may render —
 * the table is world-writable, so a crafted row must not point every
 * viewer's <img> at an arbitrary host. */
function safePhotoUrl(u: string): boolean {
  return u.startsWith('local:') || u.startsWith('https://qvirtvvwjthahwcfbjnz.supabase.co/')
}

export function photoList(photo: string | undefined | null): string[] {
  if (!photo) return []
  if (photo[0] === '[') {
    try {
      const a = JSON.parse(photo)
      if (Array.isArray(a)) return a.filter((x) => typeof x === 'string' && x && safePhotoUrl(x))
    } catch {
      /* not JSON — treat as a single URL */
    }
  }
  return safePhotoUrl(photo) ? [photo] : []
}

/** Encode a list of URLs/tokens back into the `photo` field (undefined if empty). */
export function photoField(list: string[]): string | undefined {
  const clean = list.filter(Boolean)
  if (!clean.length) return undefined
  return clean.length === 1 ? clean[0] : JSON.stringify(clean)
}

/**
 * Downscale + re-orient a picked/taken photo to a reasonable size and re-encode
 * as JPEG. Keeps uploads small (F&F on mobile data) and normalises iPhone HEIC /
 * EXIF rotation into something every browser can display. Falls back to the raw
 * file if anything about the canvas path fails.
 */
export async function processImage(file: File, maxDim = 1600, quality = 0.82): Promise<Blob | null> {
  try {
    let bmp: ImageBitmap | HTMLImageElement
    try {
      bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      const objUrl = URL.createObjectURL(file)
      try {
        bmp = await new Promise<HTMLImageElement>((res, rej) => {
          const img = new Image()
          img.onload = () => res(img)
          img.onerror = rej
          img.src = objUrl
        })
      } finally {
        URL.revokeObjectURL(objUrl)
      }
    }
    const w = (bmp as ImageBitmap).width || (bmp as HTMLImageElement).naturalWidth
    const h = (bmp as ImageBitmap).height || (bmp as HTMLImageElement).naturalHeight
    const scale = Math.min(1, maxDim / Math.max(w, h))
    const cw = Math.max(1, Math.round(w * scale))
    const ch = Math.max(1, Math.round(h * scale))
    const canvas = document.createElement('canvas')
    canvas.width = cw
    canvas.height = ch
    const ctx = canvas.getContext('2d')
    if (!ctx) return rawFallback(file)
    ctx.drawImage(bmp as CanvasImageSource, 0, 0, cw, ch)
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', quality))
    return blob || rawFallback(file)
  } catch {
    return rawFallback(file)
  }
}

/** When re-encoding fails, only pass the ORIGINAL file through if every
 * browser can already display it — an undecodable HEIC uploaded as ".jpg"
 * renders broken on every other device. null = drop with the normal
 * couldn't-process handling. */
function rawFallback(file: File): Blob | null {
  return /^image\/(jpeg|png|webp|gif)$/i.test(file.type) ? file : null
}

/** Upload an already-processed blob to the public `photos` bucket; returns its
 *  public URL, or null on failure. */
export async function uploadBlob(blob: Blob, path?: string): Promise<string | null> {
  try {
    const sb = getSupabase()
    // Deterministic path when the caller supplies one: retries then converge on
    // ONE object, and a slow upload that lands after our timeout becomes the
    // success on the next attempt (409 below) instead of an orphan.
    path = path || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
    if (blob.size > 8_000_000) return null // never burn 8MB+ of mobile data on one frame
    // A hung lie-fi upload must fail fast into the offline photo queue rather
    // than pin "Posting…" for minutes. null = the caller queues it locally.
    const up = sb.storage.from('photos').upload(path, blob, { contentType: 'image/jpeg', upsert: false })
    const res = await Promise.race([up, new Promise<null>((r) => setTimeout(() => r(null), 15000))])
    if (!res) return null
    if (res.error) {
      // "Already exists" = an earlier (timed-out) attempt landed — that's success.
      const dup = (res.error as { statusCode?: string | number; message?: string })
      if (String(dup.statusCode) === '409' || /exist/i.test(dup.message || '')) {
        return sb.storage.from('photos').getPublicUrl(path).data.publicUrl
      }
      return null
    }
    return sb.storage.from('photos').getPublicUrl(path).data.publicUrl
  } catch {
    return null
  }
}

/**
 * Attach a picked photo to a post/note/location. Resizes it, then:
 *  - online: uploads straight away and returns the public URL;
 *  - offline / upload failed: stashes the blob in the offline queue and returns
 *    a `local:<id>` token. The outbox uploads it and swaps in the real URL when
 *    the connection returns — the photo is never lost.
 * Returns undefined only if the image couldn't even be processed.
 */
export async function attachPhoto(file: File): Promise<string | undefined> {
  let blob: Blob | null
  try {
    blob = await processImage(file)
  } catch {
    return undefined
  }
  if (!blob) return undefined // undecodable format — dropping beats a broken upload
  // An oversized blob can never upload (8MB gate) — queueing it would wedge the
  // outbox behind a forever-failing op. Drop it like an unprocessable one.
  if (blob.size > 8_000_000) return undefined
  // One id up front: the direct upload and any queued retry share the same
  // storage path, so a timed-out-but-landed upload is found (409) not orphaned.
  const id = 'p-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
  if (!isOffline()) {
    const url = await uploadBlob(blob, id + '.jpg')
    if (url) return url
  }
  // No signal, or the upload failed — queue it locally for the outbox.
  return await queuePhoto(blob, id)
}

/** Attach several picked photos; returns the packed `photo` field (or undefined). */
export async function attachPhotos(files: File[]): Promise<string | undefined> {
  if (!files.length) return undefined
  const tokens = await Promise.all(files.map((f) => attachPhoto(f)))
  return photoField(tokens.filter((t): t is string => !!t))
}
