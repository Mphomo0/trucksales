import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const revalidate = 86400

export const GET = async (req: NextRequest) => {
  try {
    const [makesResult, categoriesResult] = await Promise.all([
      prisma.spares.findMany({
        distinct: ['make'],
        select: { make: true },
        orderBy: { make: 'asc' },
      }),
      prisma.spares.findMany({
        distinct: ['category'],
        select: { category: true },
        orderBy: { category: 'asc' },
      }),
    ])

    const filterOptions = {
      makes: makesResult.map((item) => item.make).filter(Boolean),
      categories: categoriesResult.map((item) => item.category).filter(Boolean),
    }

    return NextResponse.json(filterOptions, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
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
