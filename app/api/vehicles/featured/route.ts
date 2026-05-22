import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 1. Force the standard Serverless runtime (higher memory limits, avoids Prisma edge binary bloat)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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
        slug: true,
        specialPrice: true,
        specialValidFrom: true,
        specialValidTo: true,
        // We fetch images to extract a thumbnail, but we DROPPED description completely
        images: true,
      },
    })

    // 2. Data trimming: Map through records to strip out massive arrays
    const optimizedVehicles = vehicles.map((vehicle) => {
      const imgArray = Array.isArray(vehicle.images) ? vehicle.images : []

      return {
        id: vehicle.id,
        name: vehicle.name,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        vatPrice: vehicle.vatPrice,
        mileage: vehicle.mileage,
        fuelType: vehicle.fuelType,
        condition: vehicle.condition,
        transmission: vehicle.transmission,
        slug: vehicle.slug,
        specialPrice: vehicle.specialPrice,
        specialValidFrom: vehicle.specialValidFrom,
        specialValidTo: vehicle.specialValidTo,
        // Extract ONLY the first image object to act as a thumbnail card
        thumbnail: imgArray[0] || null,
      }
    })

    return NextResponse.json(optimizedVehicles, {
      status: 200,
      headers: {
        'Cache-Control':
          'public, s-maxage=86400, stale-while-revalidate=604800',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Featured vehicle fetch error:', error)

    // 3. Drop massive error objects from the response to prevent payload leakage
    return NextResponse.json(
      { error: 'Unavailable', fallback: true },
      { status: 200 },
    )
  }
}
