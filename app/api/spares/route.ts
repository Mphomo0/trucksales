import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import slugify from 'slugify'

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
    console.log('[Revalidate] Triggered for paths:', paths)
  } catch (error) {
    console.error('[Revalidate] Error:', error)
  }
}

interface Filters {
  make?: string
  engine?: string
  gearbox?: string
  diff?: string
  other?: string
  OR?: Array<
    | { make: { contains: string } }
    | { engine: { contains: string } }
    | { gearbox: { contains: string } }
    | { diff: { contains: string } }
    | { other: { contains: string } }
  >
}

// POST /api/spares to create a new vehicle spares
export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    const {
      name,
      description,
      make,
      price,
      noVatPrice,
      condition,
      category,
      images,
      videoLink,
      specialPrice,
      specialPriceNoVat,
      specialValidFrom,
      specialValidTo,
    } = body

    const requiredFields = [
      name,
      make,
      condition,
      description,
      category,
      price,
      images,
    ]

    if (requiredFields.some((field) => field === undefined || field === '')) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 }
      )
    }

    if (
      !images.every(
        (img) => typeof img.url === 'string' && typeof img.fileId === 'string'
      )
    ) {
      return NextResponse.json(
        { error: 'Each image must have a valid url and fileId' },
        { status: 400 }
      )
    }

    // Parse numeric values
    const parsedPrice = Number.parseFloat(price)

    if (isNaN(parsedPrice)) {
      return NextResponse.json(
        { error: 'Price must be valid numbers' },
        { status: 400 }
      )
    }

    // Parse numeric values
    const parsedVatPrice = Number.parseFloat(noVatPrice)

    if (isNaN(parsedVatPrice)) {
      return NextResponse.json(
        { error: 'Price must be valid numbers' },
        { status: 400 }
      )
    }

    // Normalize enum values
    const upperCondition = condition.toUpperCase()
    const upperCategory = category.toUpperCase()

    // Convert make to lowercase before saving
    const lowerMake = make.toLowerCase()

    // Generate unique slug with optimized collision check (1 DB roundtrip)
    const baseSlug = slugify(`${make}-${price}-${category}`, { lower: true })
    const existingSlugs = await prisma.spares.findMany({
      where: { slug: { startsWith: baseSlug } },
      select: { slug: true },
    })

    let slug = baseSlug
    if (existingSlugs.some((s) => s.slug === baseSlug)) {
      let counter = 1
      while (existingSlugs.some((s) => s.slug === `${baseSlug}-${counter}`)) {
        counter++
      }
      slug = `${baseSlug}-${counter}`
    }

    // Create vehicle in the database
    const newVehicle = await prisma.spares.create({
      data: {
        name,
        make: lowerMake,
        price: parsedPrice,
        noVatPrice: parsedVatPrice,
        condition: upperCondition,
        category: upperCategory,
        description,
        videoLink,
        slug,
        images,
        specialPrice: specialPrice ? Number.parseFloat(specialPrice) : null,
        specialPriceNoVat: specialPriceNoVat ? Number.parseFloat(specialPriceNoVat) : null,
        specialValidFrom: specialValidFrom ? new Date(specialValidFrom) : null,
        specialValidTo: specialValidTo ? new Date(specialValidTo) : null,
      },
    })

    await triggerRevalidation(['/spares', '/specials', `/spares/${newVehicle.slug}`])

    return NextResponse.json(newVehicle, { status: 201 })
  } catch (error) {
    console.error('Vehicle creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
}

// GET /api/spares to fetch all vehicle spares
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)

    const page = Number.parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(
      Number.parseInt(searchParams.get('limit') || '10', 10),
      500
    )
    const skip = (page - 1) * limit

    const make = searchParams.get('make')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    const validSortFields = ['createdAt', 'price', 'name']
    const validOrder = ['asc', 'desc']

    const sortBy = validSortFields.includes(sort) ? sort : 'createdAt'
    const sortOrder = validOrder.includes(order) ? order : 'desc'

    const filters: any = {}

    if (make && make !== 'all') {
      filters.make = { contains: make }
    }

    if (category && category !== 'all') {
      filters.category = category.toUpperCase()
    }

    if (search) {
      filters.OR = [
        { name: { contains: search } },
        { make: { contains: search } },
        { description: { contains: search } },
      ]
    }

    // Parallelize count and findMany for better performance
    const [total, spares] = await Promise.all([
      prisma.spares.count({ where: filters }),
      prisma.spares.findMany({
        skip,
        take: limit,
        where: filters,
        orderBy: {
          [sortBy]: sortOrder,
        },
        // Optimize CPU by selecting all fields
        select: {
          id: true,
          name: true,
          description: true,
          make: true,
          price: true,
          noVatPrice: true,
          condition: true,
          category: true,
          images: true,
          videoLink: true,
          slug: true,
          specialPrice: true,
          specialPriceNoVat: true,
          specialValidFrom: true,
          specialValidTo: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ])

    return NextResponse.json(
      {
        spares,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Spares fetch error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch vehicle spares',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
