'use client'

import posthog from 'posthog-js'
import type { AttributionPayload, AttributionTouch } from './attribution'
import { isExcludedReferrerHost } from './attribution'

const FIRST_TOUCH_KEY = 'az_first_touch'
const MAX_LEN = 255
const MAX_REFERRER_LEN = 500

// Keep the stored touch useful for a realistic truck-buying consideration
// window. Beyond this the visit that brought someone here is no longer the
// visit that produced the lead.
const FIRST_TOUCH_TTL_DAYS = 90

function clamp(value: string | null | undefined, max = MAX_LEN) {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed ? trimmed.slice(0, max) : null
}

function readReferrer(): { referrer: string | null; referrerDomain: string | null } {
  const raw = document.referrer
  if (!raw) return { referrer: null, referrerDomain: null }

  try {
    const host = new URL(raw).hostname
    // Self-referrals and preview/dev hosts would otherwise overwrite the real
    // first touch on every internal navigation.
    if (isExcludedReferrerHost(host)) return { referrer: null, referrerDomain: null }
    return { referrer: clamp(raw, MAX_REFERRER_LEN), referrerDomain: clamp(host) }
  } catch {
    return { referrer: null, referrerDomain: null }
  }
}

function readCurrentTouch(): AttributionTouch {
  const params = new URLSearchParams(window.location.search)
  const { referrer, referrerDomain } = readReferrer()

  return {
    utmSource: clamp(params.get('utm_source')),
    utmMedium: clamp(params.get('utm_medium')),
    utmCampaign: clamp(params.get('utm_campaign')),
    utmTerm: clamp(params.get('utm_term')),
    utmContent: clamp(params.get('utm_content')),
    gclid: clamp(params.get('gclid')),
    fbclid: clamp(params.get('fbclid')),
    referrer,
    referrerDomain,
    landingPath: clamp(window.location.pathname),
    timestamp: new Date().toISOString(),
  }
}

function hasSignal(touch: AttributionTouch): boolean {
  return Boolean(
    touch.utmSource ||
      touch.utmMedium ||
      touch.utmCampaign ||
      touch.gclid ||
      touch.fbclid ||
      touch.referrerDomain
  )
}

function readStored(): AttributionTouch | null {
  try {
    const raw = window.localStorage.getItem(FIRST_TOUCH_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as AttributionTouch
    if (parsed.timestamp) {
      const ageMs = Date.now() - new Date(parsed.timestamp).getTime()
      if (ageMs > FIRST_TOUCH_TTL_DAYS * 24 * 60 * 60 * 1000) {
        window.localStorage.removeItem(FIRST_TOUCH_KEY)
        return null
      }
    }
    return parsed
  } catch {
    // Private browsing, disabled storage, or corrupt JSON — attribution is a
    // nice-to-have, never a reason to break the page.
    return null
  }
}

/**
 * Record the first touch for this visitor, once.
 *
 * Deliberately never overwrites an existing entry: the whole point of
 * first-touch is that the *original* discovery channel survives the later
 * branded-search or direct visit that actually converts.
 */
export function captureFirstTouch(): void {
  if (typeof window === 'undefined') return

  try {
    if (readStored()) return

    const touch = readCurrentTouch()
    // A landing with no campaign tags and no external referrer is "direct",
    // which tells us nothing. Don't burn the first-touch slot on it — a later
    // identifiable visit is far more informative.
    if (!hasSignal(touch)) return

    window.localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(touch))
  } catch {
    // Storage unavailable — fall back to last-touch only at submit time.
  }
}

/**
 * The anonymous PostHog id, used to join this lead back to its browsing history.
 *
 * Fails closed: after identify() the active distinct id becomes the visitor's
 * email, and writing that into an id column both duplicates PII and breaks the
 * join. Prefer $device_id, which stays anonymous for the life of the device.
 */
function getAnonymousId(): string | null {
  try {
    const deviceId = posthog.get_property('$device_id')
    if (typeof deviceId === 'string' && deviceId) return clamp(deviceId)

    const distinctId = posthog.get_distinct_id()
    if (typeof distinctId === 'string' && distinctId && !distinctId.includes('@')) {
      return clamp(distinctId)
    }
    return null
  } catch {
    return null
  }
}

/**
 * Attribution to send with a lead submission: stored first touch when we have
 * one, otherwise the current visit as a last-touch fallback.
 */
export function getAttributionPayload(): AttributionPayload {
  if (typeof window === 'undefined') return {}

  const touch = readStored() ?? readCurrentTouch()
  return { ...touch, distinctId: getAnonymousId() }
}
