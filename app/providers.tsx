/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

// app/providers.tsx
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

import { captureFirstTouch } from '@/lib/attribution-client'
import { afterLoadIdle } from '@/lib/after-load'
import { getPostHog, loadPostHog } from '@/lib/posthog-client'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(() => getPostHog() !== null)

  useEffect(() => {
    // Runs on the landing page load, before any client-side navigation can
    // replace the URL or referrer we need. localStorage only, so it stays eager.
    captureFirstTouch()

    if (getPostHog()) return

    // posthog-js and its recorder/survey scripts are ~250KB of JS; fetch and start
    // them once the page has loaded and the browser is idle so they don't
    // compete with LCP.
    return afterLoadIdle(() => {
      void loadPostHog().then((posthog) => {
        if (posthog) setReady(true)
      })
    })
  }, [])

  return (
    <>
      <SuspendedPostHogPageView ready={ready} />
      {children}
    </>
  )
}

function PostHogPageView({ ready }: { ready: boolean }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track pageviews
  useEffect(() => {
    const posthog = getPostHog()
    if (ready && pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + '?' + searchParams.toString()
      }

      posthog.capture('$pageview', { $current_url: url })
    }
  }, [ready, pathname, searchParams])

  return null
}

// Wrap PostHogPageView in Suspense to avoid the useSearchParams usage above
// from de-opting the whole app into client-side rendering
// See: https://nextjs.org/docs/messages/deopted-into-client-rendering
function SuspendedPostHogPageView({ ready }: { ready: boolean }) {
  return (
    <Suspense fallback={null}>
      <PostHogPageView ready={ready} />
    </Suspense>
  )
}
