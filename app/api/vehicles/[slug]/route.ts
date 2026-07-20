import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { revalidatePath, revalidateTag } from 'next/cache'
import { deleteChunk } from '@/lib/services/content-indexing'

export const runtime = 'nodejs'

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
  deletedFileIds?: string[]
}

// GET /api/vehicles/[slug]
export const GET = async (
  req: Request,
  { params }: { params: Promise<{ slug: string }> },
) => {
  const { slug } = await params

  try {
    const vehicle = await prisma.inventory.findUnique({
      where: { slug },
      // 1. Explicitly select fields. If you need everything, keep it,
      // but ensure you aren't grabbing hidden system fields needlessly.
    })

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    return NextResponse.json(
      { vehicle },
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

const SITE_URL = 'https://www.a-ztrucksales.com'
const INDEXNOW_KEY = 'er3xkhfkmsvhepnk36zgjy2jgwynv75n'
const INDEXNOW_ENGINES = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
]

async function notifyIndexNow(urls: string[]) {
  const payload = {
    host: 'www.a-ztrucksales.com',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  }
  await Promise.allSettled(
    INDEXNOW_ENGINES.map((endpoint) =>
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }),
    ),
  )
}

// DELETE /api/vehicles/[slug]
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
    await prisma.inventory.delete({
      where: { slug },
    })

    const vehicleUrl = `${SITE_URL}/inventory/${slug}`

    await deleteChunk(vehicleUrl)

    revalidatePath('/')
    revalidatePath('/inventory')
    revalidatePath('/specials')
    revalidatePath(`/inventory/${slug}`)
    revalidatePath('/api/vehicles')
    revalidatePath('/api/vehicles/unfiltered')
    revalidatePath('/api/vehicles/featured')
    revalidatePath('/api/vehicles/filters')
    revalidatePath(`/api/vehicles/${slug}`)
    revalidateTag('inventory', 'default')

    // Notify search engines so they re-crawl and deindex the sold vehicle promptly
    notifyIndexNow([vehicleUrl, `${SITE_URL}/sitemap.xml`]).catch(() => {})

    return NextResponse.json(
      { message: 'Vehicle deleted successfully' },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}

// PATCH /api/vehicles/[slug]
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
    const body: UpdateVehicleBody = await req.json()

    if (body.deletedFileIds && body.deletedFileIds.length > 0) {
      const { deleteImageKitFiles } = await import('@/lib/imagekit')
      await deleteImageKitFiles(body.deletedFileIds)
    }

    // Ensure the vehicle exists first
    const existingVehicle = await prisma.inventory.findUnique({
      where: { slug },
      select: { id: true, slug: true }, // Light select just to check existence
    })

    if (!existingVehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    }

    if (slug !== body.slug) {
      const slugExists = await prisma.inventory.findUnique({
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

    const updatedVehicle = await prisma.inventory.update({
      where: { slug },
      data: {
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
        specialValidFrom: body.specialValidFrom
          ? new Date(body.specialValidFrom)
          : null,
        specialValidTo: body.specialValidTo
          ? new Date(body.specialValidTo)
          : null,
      },
    })

    revalidatePath('/')
    revalidatePath('/inventory')
    revalidatePath('/specials')
    revalidatePath(`/inventory/${slug}`)
    if (slug !== updatedVehicle.slug) {
      revalidatePath(`/inventory/${updatedVehicle.slug}`)
    }
    revalidateTag('inventory', 'default')

    return NextResponse.json({ updatedVehicle }, { status: 200 })
  } catch (error) {
    console.error('Update failed:', error)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
