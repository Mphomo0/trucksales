import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

async function triggerRevalidation(paths: string[]) {
  const secret = process.env.REVALIDATE_SECRET
  if (!secret) {
    console.error('[Revalidate] REVALIDATE_SECRET not configured')
    return
  }
  
  try {
    await Promise.all(
      paths.map(async (path) => {
        await fetch(new URL(path, process.env.NEXT_PUBLIC_APP_URL).toString(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-revalidate-token': secret,
          },
          body: JSON.stringify({ path }),
        })
      })
    )
    
  } catch (error) {
    console.error('[Revalidate] Error:', error)
  }
}

interface UpdateVehicleBody {
  name: string
  make: string
  model: string
  year: number
  vatPrice: number
  pricenoVat: number
  mileage?: number | null
  fuelType?: string
  condition: string
  transmission?: string | null
  images: string[]
  videoLink?: string | null
  slug: string
  description: string
  bodyType: string
  truckSize: string
  registrationNo: string
  specialPrice?: number | null
  specialValidFrom?: string | null
  specialValidTo?: string | null
}

// Get /api/vehicles/slug to fetch a vehicle by ID
export const GET = async (
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await params

  try {
    const vehicle = await prisma.inventory.findUnique({
      where: { slug },
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json({ vehicle }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/vehicles/slug to delete a vehicle by slug
export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const slug = (await params).slug

  try {
    await prisma.inventory.delete({
      where: { slug },
    })

    await triggerRevalidation(['/inventory', '/specials', `/inventory/${slug}`])

    return NextResponse.json(
      { message: 'Vehicle deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}

// PATCH /api/vehicles/slug to update a vehicle by ID
export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  if (!session) {
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
      pricenoVat: body.pricenoVat,
      mileage: body.mileage ?? null,
      fuelType: body.fuelType ?? null,
      condition: body.condition,
      transmission: body.transmission ?? null,
      images: body.images,
      videoLink: body.videoLink ?? null,
      slug: body.slug,
      description: body.description,
      bodyType: body.bodyType,
      truckSize: body.truckSize,
      registrationNo: body.registrationNo,
      specialPrice: body.specialPrice ?? null,
      specialValidFrom: body.specialValidFrom ? new Date(body.specialValidFrom) : null,
      specialValidTo: body.specialValidTo ? new Date(body.specialValidTo) : null,
    }

    // Update the vehicle
    const updatedVehicle = await prisma.inventory.update({
      where: { slug },
      data: updateData,
    })

    await triggerRevalidation(['/inventory', '/specials', `/inventory/${updatedVehicle.slug}`])

    return NextResponse.json({ updatedVehicle }, { status: 200 })
  } catch (error) {
    console.error('Update failed:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
