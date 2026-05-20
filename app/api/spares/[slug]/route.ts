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
  specialPrice?: number | null
  specialPriceNoVat?: number | null
  specialValidFrom?: string | null
  specialValidTo?: string | null
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

    return NextResponse.json({ sparesItem: data }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/spares/slug to delete a vehicle by slug
export async function DELETE(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const slug = (await params).slug

  try {
    const deletedItem = await prisma.spares.delete({
      where: { slug },
    })

    

    await triggerRevalidation(['/spares', '/specials', `/spares/${slug}`])

    return NextResponse.json(
      { message: 'Spares Item deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete failed:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}

// PATCH /api/spares/slug to update a vehicle by ID
export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  if (!session) {
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
      return NextResponse.json(
        { error: 'Spare part not found' },
        { status: 404 }
      )
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
      category: String(body.category).toUpperCase(),
      price: Number(body.price),
      noVatPrice: body.noVatPrice ? Number(body.noVatPrice) : null,
      condition: String(body.condition).toUpperCase(),
      images: body.images,
      slug: body.slug,
      description: body.description,
      videoLink: body.videoLink || null,
      specialPrice: body.specialPrice !== undefined ? (body.specialPrice ? Number(body.specialPrice) : null) : undefined,
      specialPriceNoVat: body.specialPriceNoVat !== undefined ? (body.specialPriceNoVat ? Number(body.specialPriceNoVat) : null) : undefined,
      specialValidFrom: body.specialValidFrom ? new Date(body.specialValidFrom) : null,
      specialValidTo: body.specialValidTo ? new Date(body.specialValidTo) : null,
    }

    // Update the vehicle
    const updatedVehicle = await prisma.spares.update({
      where: { slug },
      data: updateData,
    })

    await triggerRevalidation(['/spares', '/specials', `/spares/${updatedVehicle.slug}`])

    return NextResponse.json({ updatedVehicle }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
