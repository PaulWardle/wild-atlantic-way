import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/* Shared Supabase backend — KEEP AS-IS.
 *
 * Row-Level Security is intentionally open (anyone with the private F&F link can
 * read/write). The anon key is a publishable client key and is expected to ship in
 * the client — that's how Supabase anon access works. If the link ever spreads,
 * lock writes behind a passphrase gate or Supabase Auth (a future task).
 *
 * Five tables, all keyed/sorted by `ts` = JS epoch milliseconds (Date.now()):
 *   posts     (name, reason, msg, ts)        — postbox messages from F&F
 *   locations (si, note, ts)                 — "we are here" pings (si = trackStop index)
 *   notes     (body, author, tag, day, ts)   — brother journal notes
 *   marks     (stop, mark)                    — keep/maybe/cut per stop (upsert on stop)
 *   sig       (sid, ts)                       — Signature 15 bagged, with time bagged
 */
export const SUPABASE_URL = 'https://qvirtvvwjthahwcfbjnz.supabase.co'
export const SUPABASE_ANON_KEY = 'sb_publishable_0dS27e4IOvMI1ZjzeQ8RpQ_A_abzXON'

let client: SupabaseClient | null = null

/** Lazily create (and reuse) the shared anon client. */
export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    })
  }
  return client
}
