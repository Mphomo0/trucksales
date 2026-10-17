/* author: A-Z Truck Sales */
/* datePublished: 2026-04-27 */
/* application/ld+json */

// app/providers.tsx
'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { usePostHog } from 'posthog-js/react'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'

import { captureFirstTouch } from '@/lib/attribution-client'
import { afterLoadIdle } from '@/lib/after-load'

let posthogInitialized = false

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(posthogInitialized)

  useEffect(() => {
    // Runs on the landing page load, before any client-side navigation can
    // replace the URL or referrer we need. localStorage only, so it stays eager.
    captureFirstTouch()

    if (posthogInitialized) return

    // PostHog and its recorder/survey scripts are ~250KB of JS; start them once the
    // page has loaded and the browser is idle so they don't compete with LCP.
    return afterLoadIdle(() => {
      if (posthogInitialized) return
      posthogInitialized = true
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false,
        capture_pageleave: true,
      })
      setReady(true)
    })
  }, [])

  return (
    <PHProvider client={posthog}>
      <SuspendedPostHogPageView ready={ready} />
      {children}
    </PHProvider>
  )
}

function PostHogPageView({ ready }: { ready: boolean }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const posthog = usePostHog()

  // Track pageviews
  useEffect(() => {
    if (ready && pathname && posthog) {
      let url = window.origin + pathname
      if (searchParams.toString()) {
        url = url + '?' + searchParams.toString()
      }

      posthog.capture('$pageview', { $current_url: url })
    }
  }, [ready, pathname, searchParams, posthog])

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
