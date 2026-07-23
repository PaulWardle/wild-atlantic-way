import { getSupabase } from './supabase'

/**
 * Downscale + re-orient a picked/taken photo to a reasonable size and re-encode
 * as JPEG. Keeps uploads small (F&F on mobile data) and normalises iPhone HEIC /
 * EXIF rotation into something every browser can display. Falls back to the raw
 * file if anything about the canvas path fails.
 */
export async function processImage(file: File, maxDim = 1600, quality = 0.82): Promise<Blob> {
  try {
    let bmp: ImageBitmap | HTMLImageElement
    try {
      bmp = await createImageBitmap(file, { imageOrientation: 'from-image' })
    } catch {
      bmp = await new Promise<HTMLImageElement>((res, rej) => {
        const img = new Image()
        img.onload = () => res(img)
        img.onerror = rej
        img.src = URL.createObjectURL(file)
      })
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
    if (!ctx) return file
    ctx.drawImage(bmp as CanvasImageSource, 0, 0, cw, ch)
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', quality))
    return blob || file
  } catch {
    return file
  }
}

/** Process + upload a photo to the public `photos` bucket; returns its public URL. */
export async function uploadPhoto(file: File): Promise<string | null> {
  try {
    const blob = await processImage(file)
    const sb = getSupabase()
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`
    const { error } = await sb.storage.from('photos').upload(path, blob, { contentType: 'image/jpeg', upsert: false })
    if (error) return null
    return sb.storage.from('photos').getPublicUrl(path).data.publicUrl
  } catch {
    return null
  }
}
