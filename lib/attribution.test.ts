import { describe, it, expect } from 'vitest'
import { classifyChannel, isExcludedReferrerHost } from './attribution'

describe('classifyChannel', () => {
  it('reads explicit paid-search tagging', () => {
    expect(classifyChannel({ utmSource: 'google', utmMedium: 'cpc' })).toBe(
      'paid_search',
    )
  })

  // A real lead arrived this way: a Google Ads click carrying a gclid and no
  // UTM tags at all. Classifying on referrer alone would call it organic and
  // quietly under-credit the ad spend that paid for it.
  it('treats a gclid with no UTM tags as paid search, not organic', () => {
    expect(
      classifyChannel({ gclid: 'abc123', referrerDomain: 'www.google.com' }),
    ).toBe('paid_search')
  })

  it('treats an fbclid with no UTM tags as paid social', () => {
    expect(classifyChannel({ fbclid: 'xyz' })).toBe('paid_social')
  })

  it('classifies an untagged search referrer as organic', () => {
    expect(classifyChannel({ referrerDomain: 'www.google.com' })).toBe(
      'organic_search',
    )
  })

  it('classifies a social referrer', () => {
    expect(classifyChannel({ referrerDomain: 'l.facebook.com' })).toBe(
      'organic_social',
    )
  })

  it('separates AI assistants from ordinary referrals', () => {
    expect(classifyChannel({ referrerDomain: 'chatgpt.com' })).toBe('ai_assistant')
    expect(classifyChannel({ referrerDomain: 'www.perplexity.ai' })).toBe(
      'ai_assistant',
    )
  })

  it('classifies email campaigns', () => {
    expect(
      classifyChannel({ utmMedium: 'email', utmSource: 'mailchimp' }),
    ).toBe('email')
  })

  it('classifies an unknown external site as referral', () => {
    expect(classifyChannel({ referrerDomain: 'trucktrader.co.za' })).toBe(
      'referral',
    )
  })

  // A visitor bouncing through our own pages is not a marketing channel.
  it('does not treat a self-referral as a channel', () => {
    expect(classifyChannel({ referrerDomain: 'www.a-ztrucksales.com' })).toBe(
      'direct',
    )
  })

  it('falls back to direct with no signal at all', () => {
    expect(classifyChannel({})).toBe('direct')
  })
})

describe('isExcludedReferrerHost', () => {
  it('excludes our own domain, previews and dev hosts', () => {
    expect(isExcludedReferrerHost('www.a-ztrucksales.com')).toBe(true)
    expect(isExcludedReferrerHost('trucksales-abc.vercel.app')).toBe(true)
    expect(isExcludedReferrerHost('localhost')).toBe(true)
  })

  it('does not exclude genuine referrers', () => {
    expect(isExcludedReferrerHost('www.google.com')).toBe(false)
  })
})
