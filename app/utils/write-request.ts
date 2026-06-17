/**
 * Helpers for quick write requests (create/delete) so a stuck request fails
 * visibly instead of spinning forever. Long-running scans/crawls are excluded —
 * they have their own progress UI.
 *
 * Usage: `$fetch(url, { method: 'POST', body, signal: AbortSignal.timeout(WRITE_TIMEOUT_MS) })`
 * then branch on `isTimeoutError(err)` in the catch.
 */

/** Timeout (ms) for a quick write before it's treated as failed. */
export const WRITE_TIMEOUT_MS = 15000

/** True when an error is an aborted/timed-out request (incl. ofetch-wrapped). */
export function isTimeoutError(err: unknown): boolean {
  if (!err || typeof err !== 'object')
    return false
  const e = err as { name?: string, cause?: { name?: string } }
  return e.name === 'TimeoutError' || e.name === 'AbortError'
    || e.cause?.name === 'TimeoutError' || e.cause?.name === 'AbortError'
}
