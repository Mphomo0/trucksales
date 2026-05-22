import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
// Force Next.js to cache this endpoint aggressively at the CDN level
export const revalidate = 86400

export const GET = async (req: NextRequest) => {
  try {
    // 1. Leverage native SQL SELECT DISTINCT. This happens instantly at the DB layer
    // instead of wasting memory/CPU cycles mapping through thousands of rows in Vercel.
    const [makes, models, bodyTypes, truckSizes] = await Promise.all([
      prisma.$queryRaw<{ make: string | null }[]>`
        SELECT DISTINCT make FROM "Inventory" WHERE make IS NOT NULL ORDER BY make ASC
      `,
      prisma.$queryRaw<{ model: string | null }[]>`
        SELECT DISTINCT model FROM "Inventory" WHERE model IS NOT NULL ORDER BY model ASC
      `,
      prisma.$queryRaw<{ bodyType: string | null }[]>`
        SELECT DISTINCT "bodyType" FROM "Inventory" WHERE "bodyType" IS NOT NULL
      `,
      prisma.$queryRaw<{ truckSize: string | null }[]>`
        SELECT DISTINCT "truckSize" FROM "Inventory" WHERE "truckSize" IS NOT NULL
      `,
    ])

    // 2. Clean arrays directly from the flat query output
    const filterOptions = {
      makes: makes.map((item) => item.make),
      models: models.map((item) => item.model),
      bodyTypes: bodyTypes.map((item) => item.bodyType),
      truckSizes: truckSizes.map((item) => item.truckSize),
    }

    return NextResponse.json(filterOptions, {
      status: 200,
      headers: {
        // Cache globally for 24 hours (s-maxage).
        // If a request hits after 24 hours, serve the stale data instantly in milliseconds
        // while revalidating the database background safely for up to 7 days.
        'Cache-Control':
          'public, s-maxage=86400, stale-while-revalidate=604800',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Filter options fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 },
    )
  }
}
