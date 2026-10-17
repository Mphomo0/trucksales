import { beforeEach, describe, expect, it, vi } from 'vitest'

const posthog = { identify: vi.fn(), capture: vi.fn() }
const loadPostHog = vi.fn()

vi.mock('./posthog-client', () => ({
  loadPostHog: () => loadPostHog(),
  getPostHog: () => null,
}))

import { trackLeadCreated } from './analytics-events'

const attribution = {
  utmSource: 'google',
  utmMedium: 'cpc',
  utmCampaign: 'trucks',
  referrerDomain: 'google.com',
  landingPath: '/brands/isuzu',
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0))

describe('trackLeadCreated', () => {
  beforeEach(() => {
    posthog.identify.mockReset()
    posthog.capture.mockReset()
    loadPostHog.mockReset()
  })

  it('waits for PostHog, then identifies the lead and records lead_created', async () => {
    loadPostHog.mockResolvedValue(posthog)

    trackLeadCreated({
      source: 'contact_form',
      name: 'Test Buyer',
      email: ' Buyer@Example.com ',
      attribution,
    })
    await flush()

    expect(posthog.identify).toHaveBeenCalledWith(
      'buyer@example.com',
      expect.objectContaining({ last_lead_source: 'contact_form' }),
      expect.objectContaining({ first_touch_utm_source: 'google' }),
    )
    expect(posthog.capture).toHaveBeenCalledWith(
      'lead_created',
      expect.objectContaining({ lead_source: 'contact_form', utm_source: 'google' }),
    )
  })

  it('still records the conversion without identify when there is no contact detail', async () => {
    loadPostHog.mockResolvedValue(posthog)

    trackLeadCreated({ source: 'chatbot', attribution })
    await flush()

    expect(posthog.identify).not.toHaveBeenCalled()
    expect(posthog.capture).toHaveBeenCalledWith(
      'lead_created',
      expect.objectContaining({ lead_source: 'chatbot' }),
    )
  })

  it('does nothing and does not throw when PostHog fails to load', async () => {
    loadPostHog.mockResolvedValue(null)

    expect(() => trackLeadCreated({ source: 'chatbot', attribution })).not.toThrow()
    await flush()

    expect(posthog.capture).not.toHaveBeenCalled()
  })

  it('never breaks a submission when PostHog throws', async () => {
    loadPostHog.mockResolvedValue(posthog)
    posthog.capture.mockImplementation(() => {
      throw new Error('boom')
    })

    expect(() => trackLeadCreated({ source: 'chatbot', attribution })).not.toThrow()
    await flush()
  })
})
