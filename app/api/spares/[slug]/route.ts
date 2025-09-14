import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { Condition, Category } from '@/lib/generated/prisma/client'

interface UpdateSparesBody {
  id: string
  name: string
  make: string
  price: number
  noVatPrice: number
  condition: string
  category: string
  images: string[]
  description: string
  slug: string
  videoLink?: string
}

// Get /api/spares/slug to fetch a spares by slug
export const GET = async (
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await params

  try {
    const data = await prisma.spares.findUnique({
      where: { slug },
    })

    if (!data) {
      return NextResponse.json(
        { error: 'Spares Item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/spares/slug to delete a vehicle by slug
export const DELETE = auth(async (req, { params }) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const slug = (await params).slug

  try {
    const deletedItem = await prisma.spares.delete({
      where: { slug },
    })

    console.log('Deleted item:', deletedItem)

    return NextResponse.json(
      { message: 'Spares Item deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete failed:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
})

// PATCH /api/spares/slug to update a vehicle by ID
export const PATCH = auth(async (req, { params }) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const slug = (await params).slug

  try {
    const body: UpdateSparesBody = await req.json()

    // Ensure the vehicle exists first (for checking old name/slug)
    const existingSpares = await prisma.spares.findUnique({
      where: { slug },
    })

    if (!existingSpares) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    // Optional: check if new slug is already taken
    if (slug !== body.slug) {
      const slugExists = await prisma.spares.findUnique({
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
      category: body.category as Category,
      price: Number(body.price),
      noVatPrice: body.noVatPrice ? Number(body.noVatPrice) : null,
      condition: body.condition as Condition,
      images: body.images,
      slug: body.slug,
      description: body.description,
      videoLink: body.videoLink || null,
    }

    // Update the vehicle
    const updatedVehicle = await prisma.spares.update({
      where: { slug },
      data: updateData,
    })

    return NextResponse.json({ updatedVehicle }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
})
