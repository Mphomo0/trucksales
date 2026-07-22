import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import slugify from 'slugify'
import { revalidatePath, revalidateTag } from 'next/cache' // 🔥 NATIVE REVALIDATION (Zero HTTP Overhead)

export const runtime = 'nodejs'

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
        { status: 400 },
      )
    }

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json(
        { error: 'At least one image is required' },
        { status: 400 },
      )
    }

    if (
      !images.every(
        (img) => typeof img.url === 'string' && typeof img.fileId === 'string',
      )
    ) {
      return NextResponse.json(
        { error: 'Each image must have a valid url and fileId' },
        { status: 400 },
      )
    }

    const parsedPrice = Number.parseFloat(price)
    const parsedVatPrice = Number.parseFloat(noVatPrice)
    if (isNaN(parsedPrice) || isNaN(parsedVatPrice)) {
      return NextResponse.json(
        { error: 'Price must be valid numbers' },
        { status: 400 },
      )
    }

    const upperCondition = condition.toUpperCase()
    const upperCategory = category.toUpperCase()
    const lowerMake = make.toLowerCase()

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
        specialPriceNoVat: specialPriceNoVat
          ? Number.parseFloat(specialPriceNoVat)
          : null,
        specialValidFrom: specialValidFrom ? new Date(specialValidFrom) : null,
        specialValidTo: specialValidTo ? new Date(specialValidTo) : null,
      },
    })

    // 1. Pure native cache clearance without secondary HTTP calls
    revalidatePath('/spares')
    revalidatePath('/specials')
    revalidatePath(`/spares/${newVehicle.slug}`)
    revalidateTag('spares', 'default')

    return NextResponse.json(newVehicle, { status: 201 })
  } catch (error) {
    console.error('Vehicle creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 },
    )
  }
}

// GET /api/spares to fetch all vehicle spares
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)

    const page = Number.parseInt(searchParams.get('page') || '1', 10)

    // 2. Reduce upper ceiling bounds from 500 to a safe threshold (e.g., 40)
    // Pulling 500 items into a single serverless function triggers extreme compute weights.
    const limit = Math.min(
      Number.parseInt(searchParams.get('limit') || '12', 10),
      40,
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
      ]
    }

    const [total, spares] = await Promise.all([
      prisma.spares.count({ where: filters }),
      prisma.spares.findMany({
        skip,
        take: limit,
        where: filters,
        orderBy: { [sortBy]: sortOrder },
        // 3. Keep directory feeds light by dropping 'description' and extracting a primary thumbnail
        select: {
          id: true,
          name: true,
          make: true,
          price: true,
          noVatPrice: true,
          condition: true,
          category: true,
          videoLink: true,
          slug: true,
          specialPrice: true,
          specialPriceNoVat: true,
          specialValidFrom: true,
          specialValidTo: true,
          createdAt: true,
          images: true, // Used to extract a primary thumbnail mapping below
        },
      }),
    ])

    // Convert multi-image arrays to a unified single thumbnail string/object for card presentation
    const optimizedSpares = spares.map((item) => {
      const imgArray = Array.isArray(item.images) ? item.images : []
      return {
        ...item,
        thumbnail: imgArray[0] || null,
        images: undefined, // Erase the complex raw image collection array payload
      }
    })

    return NextResponse.json(
      {
        spares: optimizedSpares,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      {
        status: 200,
        headers: {
          'Cache-Control':
            'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Spares fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch vehicle spares' },
      { status: 500 },
    )
  }
}
