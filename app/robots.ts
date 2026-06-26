import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://www.a-ztrucksales.com'

  return {
    rules: [
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login/'],
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login/'],
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login/'],
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login/'],
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
    sitemap: [
      `${baseUrl}/sitemap/core.xml`,
      `${baseUrl}/sitemap/inventory.xml`,
      `${baseUrl}/sitemap/spares.xml`,
    ],
  }
}
