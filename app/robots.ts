import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://www.a-ztrucksales.com'

  return {
    rules: [
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/login/',
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
        ],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/login/',
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
        ],
      },
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/login/',
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
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
