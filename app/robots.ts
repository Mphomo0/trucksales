import { MetadataRoute } from 'next'

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
// visibility without anyone noticing.
const AI_USER_AGENTS = ['ClaudeBot', 'PerplexityBot', 'GPTBot', 'OAI-SearchBot']

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://www.a-ztrucksales.com'

  return {
    rules: [
      ...AI_USER_AGENTS.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: DISALLOW,
      })),
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
