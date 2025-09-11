import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import slugify from 'slugify'

interface Filters {
  make?: string
  engine?: string
  gearbox?: string
  diff?: string
  other?: string
  OR?: Array<
    | { make: { contains: string; mode: 'insensitive' } }
    | { engine: { contains: string; mode: 'insensitive' } }
    | { gearbox: { contains: string; mode: 'insensitive' } }
    | { diff: { contains: string; mode: 'insensitive' } }
    | { other: { contains: string; mode: 'insensitive' } }
  >
}

// POST /api/spares to create a new vehicle spares
export const POST = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    const {
      name,
      description,
      make,
      price,
      condition,
      category,
      images,
      videoLink,
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

    // Normalize enum values
    const upperCondition = condition.toUpperCase()
    const upperCategory = category.toUpperCase()

    // Convert make to lowercase before saving
    const lowerMake = make.toLowerCase()

    // Generate unique slug
    const baseSlug = slugify(`${make}-${price}-${category}`, { lower: true })
    let slug = baseSlug
    let counter = 1
    while (await prisma.inventory.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`
    }

    // Create vehicle in the database
    const newVehicle = await prisma.spares.create({
      data: {
        name,
        make: lowerMake,
        price: parsedPrice,
        condition: upperCondition,
        category: upperCategory,
        description,
        videoLink,
        slug,
        images,
      },
    })

    return NextResponse.json(newVehicle, { status: 201 })
  } catch (error) {
    console.error('Vehicle creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 }
    )
  }
})

// GET /api/spares to fetch all vehicles
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)

    const page = Number.parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(
      Number.parseInt(searchParams.get('limit') || '100', 10),
      100
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
      filters.make = { contains: make, mode: 'insensitive' }
    }

    if (category && category !== 'all') {
      filters.category = category.toUpperCase()
    }

    if (search) {
      filters.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { make: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const total = await prisma.spares.count({ where: filters })

    const spares = await prisma.spares.findMany({
      skip,
      take: limit,
      where: filters,
      orderBy: {
        [sortBy]: sortOrder,
      },
    })

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
