import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.a-ztrucksales.com'

  // Fetch all slugs for dynamic pages
  const [vehicles, spareParts, activeSpecials] = await Promise.all([
    prisma.inventory.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.spares.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.specials.findMany({ select: { slug: true, updatedAt: true } }),
  ])

  const staticPages = [
    '',
    '/inventory',
    '/spares',
    '/specials',
    '/sell-your-truck',
    '/contact',
    '/login',
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
