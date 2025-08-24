import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import {
  Condition,
  FuelType,
  Transmission,
} from '@/lib/generated/prisma/client'

interface UpdateVehicleBody {
  name: string
  make: string
  model: string
  year: number
  vatPrice: number
  mileage?: number | null
  fuelType?: FuelType
  condition: Condition
  transmission?: Transmission | null
  images: string[]
  slug: string
  description: string
  bodyType: string
  truckSize: string
}

// Get /api/vehicles/slug to fetch a vehicle by ID
export const GET = async (
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await params

  try {
    const vehicle = await prisma.inventory.findUnique({
      where: { slug: slug },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json({ vehicle }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/vehicles/slug to delete a vehicle by slug
export const DELETE = auth(async (req, ctx) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await ctx.params

  try {
    await prisma.inventory.delete({
      where: { slug },
    })

    return NextResponse.json(
      { message: 'Vehicle deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
})

// PATCH /api/vehicles/slug to update a vehicle by ID
export const PATCH = auth(async (req, ctx) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { slug } = await ctx.params

  try {
    const body: UpdateVehicleBody = await req.json()

    // Ensure the vehicle exists first (for checking old name/slug)
    const existingVehicle = await prisma.inventory.findUnique({
      where: { slug },
    })

    if (!existingVehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Build the update payload
    const updateData = {
      name: body.name,
      make: body.make,
      model: body.model,
      year: body.year,
      vatPrice: body.vatPrice,
      mileage: body.mileage ?? null,
      fuelType: body.fuelType ?? null,
      condition: body.condition,
      transmission: body.transmission ?? null,
      images: body.images,
      slug: body.slug,
      description: body.description,
      bodyType: body.bodyType,
      truckSize: body.truckSize,
    }

    // Include optional fields if defined
    if (body.mileage != null) {
      updateData.mileage = body.mileage
    }

    if (body.fuelType != null) {
      updateData.fuelType = body.fuelType
    }

    if (body.transmission != null) {
      updateData.transmission = body.transmission
    }

    // Update the vehicle
    const updatedVehicle = await prisma.inventory.update({
      where: { slug },
      data: updateData,
    })

    return NextResponse.json({ updatedVehicle }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
})
