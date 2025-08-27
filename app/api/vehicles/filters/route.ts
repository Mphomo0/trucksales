import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const GET = async (req: NextRequest) => {
  try {
    const [makes, models, bodyTypes, truckSizes] = await Promise.all([
      prisma.inventory.findMany({
        select: { make: true },
        distinct: ['make'],
        orderBy: { make: 'asc' },
      }),
      prisma.inventory.findMany({
        select: { model: true },
        distinct: ['model'],
        orderBy: { model: 'asc' },
      }),
      prisma.inventory.findMany({
        select: { bodyType: true },
        distinct: ['bodyType'],
      }),
      prisma.inventory.findMany({
        select: { truckSize: true },
        distinct: ['truckSize'],
      }),
    ])

    const filterOptions = {
      makes: makes.map((item) => item.make).filter(Boolean),
      models: models.map((item) => item.model).filter(Boolean),
      bodyTypes: bodyTypes.map((item) => item.bodyType).filter(Boolean),
      truckSizes: truckSizes.map((item) => item.truckSize).filter(Boolean),
    }

    return NextResponse.json(filterOptions, { status: 200 })
  } catch (error) {
    console.error('Filter options fetch error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch filter options',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
