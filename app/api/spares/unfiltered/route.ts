import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get all vehicles
export const GET = async (req: NextRequest) => {
  try {
    // Fetching spares from the database with performance optimizations
    const spares = await prisma.spares.findMany({
      take: 500, // Safety limit
      select: {
        id: true,
        name: true,
        make: true,
        price: true,
        noVatPrice: true,
        condition: true,
        category: true,
        images: true,
        slug: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Return spares with a 200 OK response
    return NextResponse.json(spares, { status: 200 })
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
