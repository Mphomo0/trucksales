// Marketing attribution: shared types and channel classification.
// Pure — safe to import from both server routes and client components.

export interface AttributionTouch {
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  utmTerm?: string | null
  utmContent?: string | null
  gclid?: string | null
  fbclid?: string | null
  referrer?: string | null
  referrerDomain?: string | null
  landingPath?: string | null
  timestamp?: string | null
}

export interface AttributionPayload extends AttributionTouch {
  distinctId?: string | null
}

// Referrers that must never be treated as a marketing touch. A visitor bouncing
// through our own pages, a preview deploy, or a local dev host is not a channel —
// counting them overwrites the real first touch with noise.
const EXCLUDED_REFERRER_HOSTS = [
  'a-ztrucksales.com',
  'localhost',
  '127.0.0.1',
  'vercel.app',
]

const SEARCH_ENGINE_HOSTS = [
  'google.',
  'bing.com',
  'yahoo.',
  'duckduckgo.com',
  'ecosia.org',
  'baidu.com',
  'yandex.',
  'brave.com',
]

// AI assistants send buyers on to branded search or direct, so the assistant
// touch is normally invisible. Classifying it keeps it out of "referral".
const AI_ASSISTANT_HOSTS = [
  'chatgpt.com',
  'chat.openai.com',
  'perplexity.ai',
  'claude.ai',
  'gemini.google.com',
  'copilot.microsoft.com',
  'you.com',
]

const SOCIAL_HOSTS = [
  'facebook.com',
  'fb.com',
  'instagram.com',
  'linkedin.com',
  'twitter.com',
  'x.com',
  'tiktok.com',
  'youtube.com',
  'pinterest.',
  'whatsapp.com',
  'reddit.com',
]

export type Channel =
  | 'paid_search'
  | 'paid_social'
  | 'organic_search'
  | 'organic_social'
  | 'ai_assistant'
  | 'email'
  | 'referral'
  | 'direct'

export const CHANNEL_LABELS: Record<Channel, string> = {
  paid_search: 'Paid search',
  paid_social: 'Paid social',
  organic_search: 'Organic search',
  organic_social: 'Organic social',
  ai_assistant: 'AI assistant',
  email: 'Email',
  referral: 'Referral',
  direct: 'Direct / unknown',
}

export function formatChannel(channel?: string | null): string | null {
  if (!channel) return null
  return CHANNEL_LABELS[channel as Channel] ?? channel
}

function hostMatches(host: string, needles: string[]): boolean {
  return needles.some((needle) => host.includes(needle))
}

export function isExcludedReferrerHost(host: string): boolean {
  return hostMatches(host.toLowerCase(), EXCLUDED_REFERRER_HOSTS)
}

/**
 * Best-effort marketing channel for a touch.
 *
 * UTM tags win over referrer because they are explicit intent from whoever
 * built the link. Click ids (gclid/fbclid) are checked next: Google and Meta
 * auto-tagging frequently arrives with no UTMs at all, and without this those
 * paid clicks would be misread as organic.
 */
export function classifyChannel(touch: AttributionTouch): Channel {
  const medium = (touch.utmMedium || '').toLowerCase()
  const source = (touch.utmSource || '').toLowerCase()

  if (medium) {
    if (/cpc|ppc|paid.?search|sem/.test(medium)) return 'paid_search'
    if (/paid.?social|cpm|display|social.?paid/.test(medium)) return 'paid_social'
    if (/email|newsletter/.test(medium)) return 'email'
    if (/social/.test(medium)) return 'organic_social'
    if (/organic/.test(medium)) return 'organic_search'
    if (/referral/.test(medium)) return 'referral'
  }

  if (touch.gclid) return 'paid_search'
  if (touch.fbclid) return 'paid_social'

  if (source) {
    if (hostMatches(source, SEARCH_ENGINE_HOSTS) || source === 'google')
      return 'organic_search'
    if (hostMatches(source, SOCIAL_HOSTS)) return 'organic_social'
    return 'referral'
  }

  const host = (touch.referrerDomain || '').toLowerCase()
  if (host && !isExcludedReferrerHost(host)) {
    if (hostMatches(host, AI_ASSISTANT_HOSTS)) return 'ai_assistant'
    if (hostMatches(host, SEARCH_ENGINE_HOSTS)) return 'organic_search'
    if (hostMatches(host, SOCIAL_HOSTS)) return 'organic_social'
    return 'referral'
  }

  return 'direct'
}
