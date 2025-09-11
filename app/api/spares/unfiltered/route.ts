import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

// Get all vehicles
export const GET = async (req: NextRequest) => {
  try {
    // Fetching vehicles from the inventory table
    const vehicles = await prisma.inventory.findMany()

    // If no vehicles found, could return a 200 or an empty array
    if (vehicles.length === 0) {
      return NextResponse.json([], { status: 200 })
    }

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
