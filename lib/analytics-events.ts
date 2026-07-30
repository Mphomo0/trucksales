'use client'

import posthog from 'posthog-js'
import { classifyChannel, type AttributionPayload } from './attribution'

export interface TrackLeadParams {
  source: 'chatbot' | 'contact_form'
  name?: string | null
  email?: string | null
  phone?: string | null
  interestedVehicle?: string | null
  branch?: string | null
  subject?: string | null
  heardAboutUs?: string | null
  attribution: AttributionPayload
}

function normalizeEmail(email?: string | null): string | null {
  const value = email?.trim().toLowerCase()
  return value && value.includes('@') ? value : null
}

// Strip formatting only. Deliberately no country-code guessing: silently
// rewriting a number is how two different people end up merged into one person.
function normalizePhone(phone?: string | null): string | null {
  if (!phone) return null
  const digits = phone.replace(/[^\d+]/g, '')
  return digits.length >= 7 ? digits : null
}

/**
 * Join a submitted lead to its browsing history and record the conversion.
 *
 * identify() merges the anonymous journey into a known person, so the
 * first-touch channel survives all the way to the lead. Without this call the
 * conversion looks like it came from nowhere.
 */
export function trackLeadCreated(params: TrackLeadParams): void {
  const identifier = normalizeEmail(params.email) ?? normalizePhone(params.phone)
  const { attribution } = params
  const channel = classifyChannel(attribution)

  const conversionProps = {
    lead_source: params.source,
    channel,
    utm_source: attribution.utmSource ?? null,
    utm_medium: attribution.utmMedium ?? null,
    utm_campaign: attribution.utmCampaign ?? null,
    referrer_domain: attribution.referrerDomain ?? null,
    landing_path: attribution.landingPath ?? null,
    heard_about_us: params.heardAboutUs ?? null,
    interested_vehicle: params.interestedVehicle ?? null,
    branch: params.branch ?? null,
  }

  try {
    if (identifier) {
      posthog.identify(
        identifier,
        {
          name: params.name ?? undefined,
          email: normalizeEmail(params.email) ?? undefined,
          phone: normalizePhone(params.phone) ?? undefined,
          last_lead_source: params.source,
        },
        // $set_once: the first channel that ever brought this person in should
        // never be overwritten by a later branded-search or direct visit.
        {
          first_touch_channel: channel,
          first_touch_utm_source: attribution.utmSource ?? undefined,
          first_touch_utm_campaign: attribution.utmCampaign ?? undefined,
          first_touch_referrer_domain: attribution.referrerDomain ?? undefined,
          first_touch_landing_path: attribution.landingPath ?? undefined,
        }
      )
    }

    posthog.capture('lead_created', conversionProps)
  } catch {
    // Analytics must never break a lead submission.
  }
}
