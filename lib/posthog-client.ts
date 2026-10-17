'use client'

import type { PostHog } from 'posthog-js'

/**
 * Lazy PostHog loader. posthog-js is ~100KB gzipped, so it is imported
 * dynamically (after the page has loaded and gone idle) instead of sitting in
 * every page's initial bundle. Everything that talks to PostHog goes through
 * here so there is a single instance and a single init.
 */
let instance: PostHog | null = null
let loading: Promise<PostHog | null> | null = null

/** The initialised instance, or null if PostHog has not loaded (yet). */
export function getPostHog(): PostHog | null {
  return instance
}

/** Loads and initialises PostHog once. Resolves null if loading fails. */
export function loadPostHog(): Promise<PostHog | null> {
  if (instance) return Promise.resolve(instance)

  loading ??= import('posthog-js')
    .then(({ default: posthog }) => {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false,
        capture_pageleave: true,
      })
      instance = posthog
      return posthog
    })
    .catch(() => {
      loading = null
      return null
    })

  return loading
}
