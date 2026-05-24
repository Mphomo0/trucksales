import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath } from 'next/cache' // 🔥 NATIVE REVALIDATION (Zero HTTP Overhead)

export const runtime = 'nodejs'

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
  deletedFileIds?: string[]
}

// GET /api/spares/[slug]
export const GET = async (
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) => {
  const { slug } = await params

  try {
    const data = await prisma.spares.findUnique({
      where: { slug },
    })

    if (!data) {
      return NextResponse.json(
        { error: 'Spares Item not found' },
        { status: 404 },
      )
    }

    return NextResponse.json(
      { sparesItem: data },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// DELETE /api/spares/[slug]
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await params

  try {
    await prisma.spares.delete({
      where: { slug },
    })

    // 1. Instantly drop cache structures from memory with zero outbound calls
    revalidatePath('/spares')
    revalidatePath('/specials')
    revalidatePath(`/spares/${slug}`)

    return NextResponse.json(
      { message: 'Spares Item deleted successfully' },
      { status: 200 },
    )
  } catch (error) {
    console.error('Delete failed:', error)
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}

// PATCH /api/spares/[slug]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { slug } = await params

  try {
    const body: UpdateSparesBody = await req.json()

    if (body.deletedFileIds && body.deletedFileIds.length > 0) {
      const { deleteImageKitFiles } = await import('@/lib/imagekit')
      await deleteImageKitFiles(body.deletedFileIds)
    }

    // 2. Light select for existential check to drop compute footprint
    const existingSpares = await prisma.spares.findUnique({
      where: { slug },
      select: { id: true, slug: true },
    })

    if (!existingSpares) {
      return NextResponse.json(
        { error: 'Spare part not found' },
        { status: 404 },
      )
    }

    if (slug !== body.slug) {
      const slugExists = await prisma.spares.findUnique({
        where: { slug: body.slug },
        select: { id: true },
      })
      if (slugExists) {
        return NextResponse.json(
          { error: 'Slug already in use' },
          { status: 400 },
        )
      }
    }

    const updatedVehicle = await prisma.spares.update({
      where: { slug },
      data: {
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
        specialPrice:
          body.specialPrice !== undefined
            ? body.specialPrice
              ? Number(body.specialPrice)
              : null
            : undefined,
        specialPriceNoVat:
          body.specialPriceNoVat !== undefined
            ? body.specialPriceNoVat
              ? Number(body.specialPriceNoVat)
              : null
            : undefined,
        specialValidFrom: body.specialValidFrom
          ? new Date(body.specialValidFrom)
          : null,
        specialValidTo: body.specialValidTo
          ? new Date(body.specialValidTo)
          : null,
      },
    })

    // 3. Purge public endpoints contextually
    revalidatePath('/spares')
    revalidatePath('/specials')
    revalidatePath(`/spares/${slug}`)
    if (slug !== updatedVehicle.slug) {
      revalidatePath(`/spares/${updatedVehicle.slug}`)
    }

    return NextResponse.json({ updatedVehicle }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
