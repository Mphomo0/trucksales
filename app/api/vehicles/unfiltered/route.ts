import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export const GET = async (req: NextRequest) => {
  try {
    // 1. Enforce strict server-side pagination. Never deliver 1000 items at once.
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get('limit') || '20')),
    )
    const skip = (page - 1) * limit

    // 2. Fetch data without the heavy fields (description & full image array are stripped)
    const vehicles = await prisma.inventory.findMany({
      skip,
      take: limit,
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
        bodyType: true,
        truckSize: true,
        slug: true,
        createdAt: true,
        // We select images ONLY to extract a single thumbnail below
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 3. Flatten the heavy data arrays in-memory before serialization
    const optimizedVehicles = vehicles.map((vehicle) => {
      const imgArray = Array.isArray(vehicle.images) ? vehicle.images : []
      return {
        ...vehicle,
        thumbnail: imgArray[0] || null, // Give the UI a card image
        images: undefined, // Drop the rest of the array
      }
    })

    return NextResponse.json(
      {
        data: optimizedVehicles,
        page,
        limit,
      },
      {
        status: 200,
        headers: {
          // Cache individual pages for 1 hour at the CDN layer; allow stale-delivery for a day
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error fetching vehicles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicles' },
      { status: 500 },
    )
  }
}
