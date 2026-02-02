import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get all vehicles
export const GET = async (req: NextRequest) => {
  try {
    // Fetching vehicles from the inventory table with performance optimizations
    const vehicles = await prisma.inventory.findMany({
      take: 500, // Safety limit even for unfiltered
      select: {
        id: true,
        name: true,
        make: true,
        model: true,
        year: true,
        registrationNo: true,
        vatPrice: true,
        pricenoVat: true,
        mileage: true,
        fuelType: true,
        condition: true,
        transmission: true,
        images: true,
        videoLink: true,
        bodyType: true,
        truckSize: true,
        slug: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Return vehicles with a 200 OK response
    return NextResponse.json(vehicles, { status: 200 })
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    // Handle the error and return a 500 Internal Server Error response
    return NextResponse.json(
      {
        error: 'Failed to fetch vehicles',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
