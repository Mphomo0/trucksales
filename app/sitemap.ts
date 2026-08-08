import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { CONTENT_DATES } from '@/lib/content-dates'
import { BRAND_ROUTES } from '@/lib/brands'
import { TONNAGE_BUCKETS, getTonnageBucketBySize } from '@/lib/tonnage'

export const revalidate = 86400

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://www.a-ztrucksales.com'

/**
 * Editorial pages carry hand-maintained dates from lib/content-dates.ts.
 * Everything else is database-backed and takes its lastModified from the most
 * recent record behind it, so the sitemap reflects real content changes
 * instead of dates frozen at whenever someone last edited this file.
 */
const EDITORIAL_ROUTES = Object.keys(CONTENT_DATES) as (keyof typeof CONTENT_DATES)[]

const latest = (dates: (Date | null | undefined)[]): Date | undefined => {
  const valid = dates.filter((d): d is Date => d instanceof Date)
  return valid.length > 0
    ? new Date(Math.max(...valid.map((d) => d.getTime())))
    : undefined
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const editorialUrls = EDITORIAL_ROUTES.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(CONTENT_DATES[route].modified),
  }))

  try {
    const [vehicles, spareParts, byMake, bySize] = await Promise.all([
      prisma.inventory.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.spares.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.inventory.groupBy({
        by: ['make'],
        _max: { updatedAt: true },
      }),
      prisma.inventory.groupBy({
        by: ['truckSize'],
        _max: { updatedAt: true },
      }),
    ])

    const inventoryUpdated = latest(vehicles.map((v) => v.updatedAt))
    const sparesUpdated = latest(spareParts.map((s) => s.updatedAt))
    const siteUpdated = latest([inventoryUpdated, sparesUpdated])

    /** Most recent update across every make matching a brand page's search term. */
    const brandUpdated = (match: string) =>
      latest(
        byMake
          .filter((m) => m.make?.toLowerCase().includes(match.toLowerCase()))
          .map((m) => m._max.updatedAt),
      )

    /** Most recent update across every stored truckSize falling in a bucket. */
    const tonnageUpdated = (slug: string) =>
      latest(
        bySize
          .filter((s) => getTonnageBucketBySize(s.truckSize)?.slug === slug)
          .map((s) => s._max.updatedAt),
      )

    const dbBackedUrls: MetadataRoute.Sitemap = [
      { url: `${baseUrl}`, lastModified: siteUpdated },
      { url: `${baseUrl}/inventory`, lastModified: inventoryUpdated },
      { url: `${baseUrl}/specials`, lastModified: inventoryUpdated },
      { url: `${baseUrl}/spares`, lastModified: sparesUpdated },
      { url: `${baseUrl}/brands`, lastModified: inventoryUpdated },
      ...BRAND_ROUTES.map((b) => ({
        url: `${baseUrl}/brands/${b.slug}`,
        lastModified: brandUpdated(b.match) ?? inventoryUpdated,
      })),
      { url: `${baseUrl}/tonnage`, lastModified: inventoryUpdated },
      ...TONNAGE_BUCKETS.map((b) => ({
        url: `${baseUrl}/tonnage/${b.slug}`,
        lastModified: tonnageUpdated(b.slug) ?? inventoryUpdated,
      })),
    ]

    return [
      ...dbBackedUrls,
      ...editorialUrls,
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
    // Database unreachable: still list the routes, but omit lastModified on the
    // db-backed ones rather than inventing a date for them.
    const staticRoutes = [
      '',
      '/inventory',
      '/specials',
      '/spares',
      '/brands',
      ...BRAND_ROUTES.map((b) => `/brands/${b.slug}`),
      '/tonnage',
      ...TONNAGE_BUCKETS.map((b) => `/tonnage/${b.slug}`),
    ]
    return [
      ...staticRoutes.map((route) => ({ url: `${baseUrl}${route}` })),
      ...editorialUrls,
    ]
  }
}
