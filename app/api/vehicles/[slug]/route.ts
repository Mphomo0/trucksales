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
  const slug = (await params).slug

  try {
    const vehicle = await prisma.inventory.findUnique({
      where: { slug },
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
export const DELETE = auth(async (req, { params }) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const slug = (await params).slug

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
export const PATCH = auth(async (req, { params }) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const slug = (await params).slug

  try {
    const body: UpdateVehicleBody = await req.json()

    // Ensure the vehicle exists first (for checking old name/slug)
    const existingVehicle = await prisma.inventory.findUnique({
      where: { slug },
    })

    if (!existingVehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Optional: check if new slug is already taken
    if (slug !== body.slug) {
      const slugExists = await prisma.inventory.findUnique({
        where: { slug: body.slug },
      })
      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already in use' },
          { status: 400 }
        )
      }
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
