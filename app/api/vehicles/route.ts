import { NextResponse, NextRequest } from 'next/server'
import { revalidatePath, revalidateTag } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import slugify from 'slugify'

export const runtime = 'nodejs'

// POST /api/vehicles — create a new vehicle
export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()

    const {
      name,
      make,
      model,
      year,
      vatPrice,
      pricenoVat,
      mileage,
      fuelType,
      condition,
      transmission,
      images,
      description,
      bodyType,
      truckSize,
      registrationNo,
      videoLink,
      specialPrice,
      specialValidFrom,
      specialValidTo,
    } = body

    const requiredFields = [
      name,
      make,
      model,
      year,
      vatPrice,
      pricenoVat,
      condition,
      description,
      bodyType,
      truckSize,
    ]

    if (requiredFields.some((field) => !field)) {
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

    const parsedYear = parseInt(year)
    const parsedVatPrice = parseFloat(vatPrice)
    const parsedPricenoVat = parseFloat(pricenoVat)
    const parsedMileage =
      mileage !== undefined && mileage !== null ? parseFloat(mileage) : null

    if (
      isNaN(parsedYear) ||
      isNaN(parsedVatPrice) ||
      isNaN(parsedPricenoVat) ||
      (parsedMileage !== null && isNaN(parsedMileage))
    ) {
      return NextResponse.json(
        { error: 'Year, price, and mileage must be valid numbers' },
        { status: 400 },
      )
    }

    const upperFuelType =
      fuelType !== undefined && fuelType !== null
        ? fuelType.toUpperCase()
        : null

    const upperTransmission =
      transmission !== undefined && transmission !== null
        ? transmission.toUpperCase()
        : null

    const upperCondition = condition.toUpperCase()
    const lowerMake = make.toLowerCase()
    const lowerModel = model.toLowerCase()

    const baseSlug = slugify(`${make}-${model}-${year}`, { lower: true })
    const existingSlugs = await prisma.inventory.findMany({
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

    const newVehicle = await prisma.inventory.create({
      data: {
        name,
        make: lowerMake,
        model: lowerModel,
        year: parsedYear,
        vatPrice: parsedVatPrice,
        pricenoVat: parsedPricenoVat,
        mileage: parsedMileage,
        fuelType: upperFuelType,
        condition: upperCondition,
        transmission: upperTransmission,
        description,
        bodyType,
        truckSize,
        registrationNo,
        videoLink,
        slug,
        images,
        specialPrice: specialPrice ? parseFloat(specialPrice) : null,
        specialValidFrom: specialValidFrom ? new Date(specialValidFrom) : null,
        specialValidTo: specialValidTo ? new Date(specialValidTo) : null,
      },
    })

    revalidatePath('/')
    revalidatePath('/inventory')
    revalidatePath('/specials')
    revalidatePath(`/inventory/${newVehicle.slug}`)
    revalidateTag('inventory', 'default')

    return NextResponse.json(newVehicle, { status: 201 })
  } catch (error) {
    console.error('Vehicle creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create vehicle' },
      { status: 500 },
    )
  }
}

// GET /api/vehicles — fetch vehicles with pagination and filters
export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url)

    const page = Number.parseInt(searchParams.get('page') || '1', 10)
    const limit = Math.min(
      Number.parseInt(searchParams.get('limit') || '10', 10),
      100, // lowered from 500 — reduces DB load per request
    )
    const skip = (page - 1) * limit

    const make = searchParams.get('make')
    const model = searchParams.get('model')
    const bodyType = searchParams.get('bodyType')
    const truckSize = searchParams.get('truckSize')
    const search = searchParams.get('search')
    const sort = searchParams.get('sort') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    const validSortFields = ['createdAt', 'vatPrice', 'year', 'mileage']
    const validOrder = ['asc', 'desc']

    const sortBy = validSortFields.includes(sort) ? sort : 'createdAt'
    const sortOrder = validOrder.includes(order) ? order : 'desc'

    const filters: any = {}

    if (make && make !== 'all') filters.make = { equals: make, mode: 'insensitive' }
    if (model && model !== 'all') filters.model = { equals: model, mode: 'insensitive' }
    if (bodyType && bodyType !== 'all') filters.bodyType = { equals: bodyType, mode: 'insensitive' }
    if (truckSize && truckSize !== 'all')
      filters.truckSize = { equals: truckSize, mode: 'insensitive' }

    if (search) {
      filters.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { make: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { registrationNo: { contains: search, mode: 'insensitive' } },
        { bodyType: { contains: search, mode: 'insensitive' } },
        { truckSize: { contains: search, mode: 'insensitive' } },
      ]
      delete filters.make
      delete filters.model
      delete filters.bodyType
      delete filters.truckSize
    }

    const [total, vehicles] = await Promise.all([
      prisma.inventory.count({ where: filters }),
      prisma.inventory.findMany({
        skip,
        take: limit,
        where: filters,
        orderBy: { [sortBy]: sortOrder },
        select: {
          id: true,
          name: true,
          make: true,
          model: true,
          year: true,
          registrationNo: true,
          vatPrice: true,
          pricenoVat: true,
          mileage: true,
          fuelType: true,
          condition: true,
          transmission: true,
          images: true,
          videoLink: true,
          description: true,
          bodyType: true,
          truckSize: true,
          slug: true,
          specialPrice: true,
          specialValidFrom: true,
          specialValidTo: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ])

    return NextResponse.json(
      {
        vehicles,
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
          // s-maxage: CDN caches per unique URL for 1h; max-age: browser caches 5min
          'Cache-Control':
            'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
        },
      },
    )
  } catch (error) {
    console.error('Vehicle fetch error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch vehicles',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
