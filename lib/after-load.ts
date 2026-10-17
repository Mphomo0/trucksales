/**
 * Runs `callback` once the page has finished loading and the browser is idle,
 * so third-party analytics stay out of the way of first paint and LCP.
 * `timeout` caps the idle wait, so analytics still start on busy pages.
 * Returns a cancel function for use in effect cleanup.
 */
export function afterLoadIdle(callback: () => void, timeout = 2000): () => void {
  if (typeof window === 'undefined') return () => {}

  let cancelled = false
  let idleHandle: number | undefined
  let timeoutHandle: ReturnType<typeof setTimeout> | undefined

  const run = () => {
    if (!cancelled) callback()
  }

  const scheduleIdle = () => {
    if (cancelled) return
    if ('requestIdleCallback' in window) {
      idleHandle = window.requestIdleCallback(run, { timeout })
    } else {
      timeoutHandle = setTimeout(run, 200)
    }
  }

  if (document.readyState === 'complete') {
    scheduleIdle()
  } else {
    window.addEventListener('load', scheduleIdle, { once: true })
  }

  return () => {
    cancelled = true
    window.removeEventListener('load', scheduleIdle)
    if (idleHandle !== undefined && 'cancelIdleCallback' in window) {
      window.cancelIdleCallback(idleHandle)
    }
    if (timeoutHandle !== undefined) clearTimeout(timeoutHandle)
  }
}
