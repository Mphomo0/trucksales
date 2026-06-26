import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export const revalidate = 86400

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.a-ztrucksales.com'

const STATIC_PAGES: { route: string; lastModified: string }[] = [
  { route: '',                                                            lastModified: '2026-06-21' },
  { route: '/inventory',                                                  lastModified: '2026-06-22' },
  { route: '/spares',                                                     lastModified: '2026-06-22' },
  { route: '/specials',                                                   lastModified: '2026-06-22' },
  { route: '/sell-your-truck',                                            lastModified: '2026-06-21' },
  { route: '/contact',                                                    lastModified: '2026-06-21' },
  { route: '/about',                                                      lastModified: '2026-06-21' },
  { route: '/locations',                                                  lastModified: '2026-06-17' },
  { route: '/locations/alberton',                                         lastModified: '2026-06-21' },
  { route: '/locations/boksburg',                                         lastModified: '2026-06-21' },
  { route: '/brands',                                                     lastModified: '2026-06-21' },
  { route: '/brands/isuzu',                                               lastModified: '2026-06-20' },
  { route: '/brands/hino',                                                lastModified: '2026-06-20' },
  { route: '/brands/fuso',                                                lastModified: '2026-06-20' },
  { route: '/brands/ud-trucks',                                           lastModified: '2026-06-20' },
  { route: '/brands/man',                                                 lastModified: '2026-06-20' },
  { route: '/brands/mercedes-benz',                                       lastModified: '2026-06-20' },
  { route: '/brands/tata',                                                lastModified: '2026-06-20' },
  { route: '/brands/toyota',                                              lastModified: '2026-06-20' },
  { route: '/brands/hyundai',                                             lastModified: '2026-06-20' },
  { route: '/guides',                                                     lastModified: '2026-06-21' },
  { route: '/guides/buying-guide',                                        lastModified: '2026-06-20' },
  { route: '/guides/truck-body-types',                                    lastModified: '2026-06-16' },
  { route: '/guides/cof-ready-trucks',                                    lastModified: '2026-06-21' },
  { route: '/guides/isuzu-vs-hino-vs-fuso',                              lastModified: '2026-06-21' },
  { route: '/guides/choose-truck-for-construction-delivery-cold-storage', lastModified: '2026-06-21' },
  { route: '/guides/what-to-check-before-buying',                         lastModified: '2026-06-21' },
  { route: '/guides/finance-trade-ins-export',                            lastModified: '2026-06-21' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls = STATIC_PAGES.map(({ route, lastModified }) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(lastModified),
  }))

  try {
    const [vehicles, spareParts] = await Promise.all([
      prisma.inventory.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.spares.findMany({ select: { slug: true, updatedAt: true } }),
    ])

    return [
      ...staticUrls,
      ...vehicles.map((v) => ({
        url: `${baseUrl}/inventory/${v.slug}`,
        lastModified: v.updatedAt,
      })),
      ...spareParts.map((s) => ({
        url: `${baseUrl}/spares/${s.slug}`,
        lastModified: s.updatedAt,
      })),
    ]
  } catch {
    return staticUrls
  }
}
