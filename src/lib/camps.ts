/** Remove '~€X' price clauses from a campsite note.
 *
 * Campsites are shown as confirmed stops now — no prices, no backups — for both
 * guests and brothers. Prices are baked into the free-text notes, so we strip
 * the price token (and its leading separator) while leaving the rest intact.
 * Budget figures still live on the Kit / costs page.
 */
export function stripPrice(s: string | undefined | null): string {
  if (!s) return ''
  return s
    .replace(/\s*[,;—–-]?\s*\(?~?€[\d.,–—-]+\s*(?:pp)?\)?/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,])/g, '$1')
    .replace(/[\s,;—–-]+$/, '')
    .trim()
}
