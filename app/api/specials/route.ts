import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import slugify from 'slugify'

// POST - Create a new special
export const POST = auth(async (req) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { inventoryId, amount, validFrom, validTo } = body

    // Validation
    if (!inventoryId || !amount || !validFrom || !validTo) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if inventory exists
    const inventoryExists = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    })

    if (!inventoryExists) {
      return NextResponse.json(
        { success: false, error: 'Inventory item not found' },
        { status: 404 }
      )
    }

    // Destructure values from inventory
    const { make, model, year } = inventoryExists

    // Generate unique slug with optimized collision check (1 DB roundtrip)
    const baseSlug = slugify(`${make}-${model}-${year}`, { lower: true })
    const existingSlugs = await prisma.specials.findMany({
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

    // Check if special already exists for this inventory
    const existingSpecial = await prisma.specials.findUnique({
      where: { inventoryId },
    })

    if (existingSpecial) {
      return NextResponse.json(
        {
          success: false,
          error: 'Special already exists for this inventory item',
        },
        { status: 409 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    // Validate dates
    const fromDate = new Date(validFrom)
    const toDate = new Date(validTo)

    if (fromDate >= toDate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Valid from date must be before valid to date',
        },
        { status: 400 }
      )
    }

    const special = await prisma.specials.create({
      data: {
        inventoryId,
        amount: parseFloat(amount),
        slug,
        validFrom: fromDate,
        validTo: toDate,
      },
      include: {
        inventory: {
          select: {
            id: true,
            name: true,
            make: true,
            model: true,
            year: true,
            vatPrice: true,
            pricenoVat: true,
            slug: true,
          },
        },
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Special created successfully',
        data: special,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating special:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create special' },
      { status: 500 }
    )
  }
})

// GET - Get all specials or filter by query params
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)
    const page = Number.parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(
      Number.parseInt(searchParams.get('limit') || '10', 10),
      500
    )
    const skip = (page - 1) * limit

    // Execute count and findMany in parallel
    const [total, specials] = await Promise.all([
      prisma.specials.count(),
      prisma.specials.findMany({
        skip,
        take: limit,
        include: {
          inventory: {
            select: {
              id: true,
              name: true,
              make: true,
              model: true,
              year: true,
              vatPrice: true,
              pricenoVat: true,
              mileage: true,
              fuelType: true,
              condition: true,
              transmission: true,
              slug: true,
              images: true, // List view still needs images, but we can exclude description if needed.
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ])

    // Return a successful response with data and count
    return NextResponse.json({
      data: specials,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    // Log the error and return a failure response
    console.error('Error fetching specials:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch specials' },
      { status: 500 }
    )
  }
}
