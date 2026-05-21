import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const vehicles = await prisma.inventory.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        make: true,
        model: true,
        year: true,
        vatPrice: true,
        mileage: true,
        fuelType: true,
        condition: true,
        transmission: true,
        images: true,
        description: true,
        slug: true,
        specialPrice: true,
        specialValidFrom: true,
        specialValidTo: true,
      },
    })

    return NextResponse.json(vehicles, {
      status: 200,
      headers: {
        // Cache featured vehicles for 24 h; serve stale for up to 7 days
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
    })
  } catch (error) {
    console.error('Featured vehicle fetch error:', error)
    return NextResponse.json(
      { 
        error: 'Database unavailable', 
        details: error instanceof Error ? error.message : 'Unknown error',
        fallback: true 
      },
      { status: 200 }
    )
  }
}