import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { unstable_cache } from 'next/cache'

export const revalidate = 86400

const getSitemapData = unstable_cache(
  async () => {
    const now = new Date()
    const [vehicles, spareParts, activeSpecials] = await Promise.all([
      prisma.inventory.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.spares.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.inventory.findMany({
        where: {
          specialValidTo: { gt: now },
          specialValidFrom: { lte: now },
        },
        select: { slug: true, updatedAt: true },
      }),
    ])
    return { vehicles, spareParts, activeSpecials }
  },
  ['sitemap-data'],
  { revalidate: 86400, tags: ['inventory', 'spares'] }
)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.a-ztrucksales.com'

  const { vehicles, spareParts, activeSpecials } = await getSitemapData()

  const staticPages = [
    '',
    '/inventory',
    '/spares',
    '/specials',
    '/sell-your-truck',
    '/contact',
    '/locations',
    '/locations/alberton',
    '/locations/boksburg',
    '/brands',
    '/brands/isuzu',
    '/brands/hino',
    '/brands/fuso',
    '/brands/ud-trucks',
    '/brands/man',
    '/brands/mercedes-benz',
    '/brands/tata',
    '/brands/toyota',
    '/brands/hyundai',
    '/guides',
    '/guides/buying-guide',
    '/guides/truck-body-types',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  const vehiclePages = vehicles.map((v) => ({
    url: `${baseUrl}/inventory/${v.slug}`,
    lastModified: v.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  const sparePages = spareParts.map((s) => ({
    url: `${baseUrl}/spares/${s.slug}`,
    lastModified: s.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const specialPages = activeSpecials.map((spec) => ({
    url: `${baseUrl}/specials/${spec.slug}`,
    lastModified: spec.updatedAt,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [...staticPages, ...vehiclePages, ...sparePages, ...specialPages]
}