export const PATCH = auth(async (req, { params }) => {
  if (!req.auth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { slug } = params

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
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
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
