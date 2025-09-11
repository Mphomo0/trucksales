import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const GET = async (req: NextRequest) => {
  try {
    const [makesResult, categoriesResult] = await Promise.all([
      prisma.spares.findMany({
        select: { make: true },
        distinct: ['make'],
        orderBy: { make: 'asc' },
      }),
      prisma.spares.findMany({
        select: { category: true },
        distinct: ['category'],
        orderBy: { category: 'asc' },
      }),
    ])

    // Format the response
    const filterOptions = {
      makes: makesResult.map((item) => item.make).filter(Boolean),
      categories: categoriesResult.map((item) => item.category).filter(Boolean),
    }

    return NextResponse.json(filterOptions, { status: 200 })
  } catch (error) {
    console.error('Filter options fetch error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch filter options',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
