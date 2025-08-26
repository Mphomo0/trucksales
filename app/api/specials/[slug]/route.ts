import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

interface UpdateSpecialsBody {
  amount: number
  validFrom: string
  validTo: string
  inventoryId: string
  slug: string
}

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) => {
  const { slug } = await params

  try {
    const special = await prisma.specials.findUnique({
      where: { slug },
      include: {
        inventory: true,
      },
    })

    if (!special) {
      return NextResponse.json({ error: 'Special not found' }, { status: 404 })
    }

    return NextResponse.json({ special }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export const DELETE = auth(async (req, ctx) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = await ctx.params // Get id from the URL params

  try {
    // Attempt to delete the special by ID
    const special = await prisma.specials.delete({
      where: { slug },
    })

    // If the special is not found, this will throw and be caught below
    if (!special) {
      return NextResponse.json({ error: 'Special not found' }, { status: 404 })
    }

    // If successful, return a success response
    return NextResponse.json(
      { message: 'Special deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    // Handle errors (e.g., invalid ID, database errors, etc.)
    return NextResponse.json(
      { error: 'Server error or invalid ID' },
      { status: 500 }
    )
  }
})

// PATCH /api/specials/slug to update a special by ID
export const PATCH = auth(async (req, ctx) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const slug = await ctx.params

  try {
    const body: UpdateSpecialsBody = await req.json()

    if (!body.amount || !body.validFrom || !body.validTo || !body.inventoryId) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: amount, validFrom, validTo, inventoryId',
        },
        { status: 400 }
      )
    }

    const existingSpecial = await prisma.specials.findUnique({
      where: { slug },
    })

    if (!existingSpecial) {
      return NextResponse.json({ error: 'Special not found' }, { status: 404 })
    }

    const inventoryExists = await prisma.inventory.findUnique({
      where: { id: body.inventoryId },
    })

    if (!inventoryExists) {
      return NextResponse.json(
        { error: 'Inventory item not found' },
        { status: 404 }
      )
    }

    const validFromDate = new Date(body.validFrom)
    const validToDate = new Date(body.validTo)

    if (isNaN(validFromDate.getTime()) || isNaN(validToDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    if (validFromDate >= validToDate) {
      return NextResponse.json(
        { error: 'validFrom must be before validTo' },
        { status: 400 }
      )
    }

    if (body.amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than 0' },
        { status: 400 }
      )
    }

    const overlappingSpecials = await prisma.specials.findMany({
      where: {
        inventoryId: body.inventoryId,
        slug: {
          not: slug,
        },
        OR: [
          {
            validFrom: {
              lte: validToDate,
            },
            validTo: {
              gte: validFromDate,
            },
          },
        ],
      },
    })

    if (overlappingSpecials.length > 0) {
      return NextResponse.json(
        {
          error:
            'Special dates overlap with existing specials for this inventory item',
        },
        { status: 409 }
      )
    }

    const updatedSpecial = await prisma.specials.update({
      where: { slug },
      data: {
        amount: body.amount,
        validFrom: validFromDate,
        validTo: validToDate,
        inventoryId: body.inventoryId,
        updatedAt: new Date(),
      },
      include: {
        inventory: true,
      },
    })

    return NextResponse.json({
      message: 'Special updated successfully',
      special: updatedSpecial,
    })
  } catch (error) {
    console.error('Error updating special:', error)

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
})
