'use client'

import { useEffect, useState } from 'react'
import { GoogleAnalytics } from '@next/third-parties/google'
import { afterLoadIdle } from '@/lib/after-load'

/** Loads GA after the page has loaded and gone idle, instead of right after hydration. */
export default function DeferredGoogleAnalytics({ gaId }: { gaId: string }) {
  const [ready, setReady] = useState(false)

  useEffect(() => afterLoadIdle(() => setReady(true)), [])

  return ready ? <GoogleAnalytics gaId={gaId} /> : null
}
