// Served as a route handler instead of app/robots.ts because MetadataRoute.Robots
// cannot emit the Content-Signal directive.

const DISALLOW = [
  '/dashboard/',
  '/api/',
  '/login/',
  // Framework image-optimizer route — unused since next.config.ts switched to a
  // custom ImageKit loader. Left reachable by Next.js itself, but nothing on the
  // site links to it; crawlers were finding stale /_next/image URLs from before
  // the switch and getting 400s when their w/q params got stripped on revisit.
  '/_next/image',
  '/inventory?*',
  '/spares?*',
  '/specials?*',
  '/*?sort=',
  '/*?filter=',
  '/*?search=',
  '/*?page=',
  '/*?brand=',
  '/*?ref=',
  '/*?utm_',
]

// Explicit rules for AI search/answer crawlers, kept in sync with the
// wildcard rule below so a future edit to '*' can't silently narrow AI
// visibility without anyone noticing. User-triggered agents (ChatGPT-User,
// Claude-User) are listed so their access is an explicit policy, not an accident.
const AI_USER_AGENTS = [
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
]

// Content-Signal (contentsignals.org) states how content may be used. This matches
// the existing policy: everything above is allowed, so search, AI answers and AI
// training are all "yes". Change these values to change the declared policy.
const CONTENT_SIGNAL = 'search=yes, ai-input=yes, ai-train=yes'

function group(userAgent: string, withSignal: boolean): string {
  const lines = [`User-Agent: ${userAgent}`]
  if (withSignal) lines.push(`Content-Signal: ${CONTENT_SIGNAL}`)
  lines.push('Allow: /', ...DISALLOW.map((path) => `Disallow: ${path}`))
  return lines.join('\n')
}

export function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://www.a-ztrucksales.com'

  const body = [
    ...AI_USER_AGENTS.map((ua) => group(ua, false)),
    group('*', true),
    `Sitemap: ${baseUrl}/sitemap.xml`,
  ].join('\n\n')

  return new Response(`${body}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=86400',
    },
  })
}
