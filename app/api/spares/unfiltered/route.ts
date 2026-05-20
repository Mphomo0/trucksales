import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get all vehicles
export const GET = async (req: NextRequest) => {
  try {
    // Fetching spares from the database with performance optimizations
    const spares = await prisma.spares.findMany({
      take: 1000,
      select: {
        id: true,
        name: true,
        description: true,
        make: true,
        price: true,
        noVatPrice: true,
        condition: true,
        category: true,
        images: true,
        videoLink: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Return spares with a 200 OK response
    return NextResponse.json(spares, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error fetching spares:', error)
    // Handle the error and return a 500 Internal Server Error response
    return NextResponse.json(
      {
        error: 'Failed to fetch spares',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
