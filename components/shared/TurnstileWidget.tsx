'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          'expired-callback': () => void
          'error-callback': () => void
        },
      ) => string
      reset: (widgetId?: string) => void
      remove: (widgetId: string) => void
    }
  }
}

const SCRIPT_SRC =
  'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'

let scriptPromise: Promise<void> | null = null

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script')
      script.src = SCRIPT_SRC
      script.async = true
      script.onload = () => resolve()
      script.onerror = () => {
        scriptPromise = null
        reject(new Error('Failed to load Turnstile'))
      }
      document.head.appendChild(script)
    })
  }
  return scriptPromise
}

interface TurnstileWidgetProps {
  onToken: (token: string | null) => void
  /** Increment to reset the widget (e.g. after a successful submit) */
  resetSignal?: number
}

export default function TurnstileWidget({
  onToken,
  resetSignal = 0,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const onTokenRef = useRef(onToken)
  useEffect(() => {
    onTokenRef.current = onToken
  }, [onToken])

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!siteKey || !containerRef.current) return
    let cancelled = false
    const container = containerRef.current

    const render = () => {
      loadScript()
        .then(() => {
          if (cancelled || !window.turnstile || widgetIdRef.current) return
          widgetIdRef.current = window.turnstile.render(container, {
            sitekey: siteKey,
            callback: (token) => onTokenRef.current(token),
            'expired-callback': () => onTokenRef.current(null),
            'error-callback': () => onTokenRef.current(null),
          })
        })
        .catch((err) => console.error(err))
    }

    // Defer the Cloudflare script until the widget is near the viewport so it
    // doesn't compete with hydration/LCP on pages where the form is below the fold.
    let observer: IntersectionObserver | null = null
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            observer?.disconnect()
            observer = null
            render()
          }
        },
        { rootMargin: '300px' },
      )
      observer.observe(container)
    } else {
      render()
    }

    return () => {
      cancelled = true
      observer?.disconnect()
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = null
      }
    }
  }, [siteKey])

  const prevResetSignal = useRef(resetSignal)
  useEffect(() => {
    if (resetSignal === prevResetSignal.current) return
    prevResetSignal.current = resetSignal
    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current)
      onTokenRef.current(null)
    }
  }, [resetSignal])

  // No site key configured — server skips verification too, so render nothing
  if (!siteKey) return null

  return <div ref={containerRef} className="mb-6" />
}
