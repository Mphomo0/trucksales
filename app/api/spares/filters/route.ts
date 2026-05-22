import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
// Allow Next.js CDN to hold onto this static structure aggressively
export const revalidate = 86400

export const GET = async (req: NextRequest) => {
  try {
    // 1. Drop heavy JS-side processing. Let the database handle deduplication instantly.
    const [makesResult, categoriesResult] = await Promise.all([
      prisma.$queryRaw<{ make: string | null }[]>`
        SELECT DISTINCT make FROM "Spares" WHERE make IS NOT NULL ORDER BY make ASC
      `,
      prisma.$queryRaw<{ category: string | null }[]>`
        SELECT DISTINCT category FROM "Spares" WHERE category IS NOT NULL ORDER BY category ASC
      `,
    ])

    // 2. Direct mapping from predictable database outputs
    const filterOptions = {
      makes: makesResult.map((item) => item.make),
      categories: categoriesResult.map((item) => item.category),
    }

    return NextResponse.json(filterOptions, {
      status: 200,
      headers: {
        // 3. Extend stale cache delivery to shield your compute budget.
        // Once cached at the edge, Vercel will answer traffic globally in < 50ms
        // without waking up your database or executing server code.
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
