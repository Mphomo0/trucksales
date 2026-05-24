import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'
export const revalidate = 86400

export const GET = async (req: NextRequest) => {
  try {
    const [makesResult, modelsResult, bodyTypesResult, truckSizesResult] = await Promise.all([
      prisma.inventory.findMany({
        distinct: ['make'],
        select: { make: true },
        orderBy: { make: 'asc' },
      }),
      prisma.inventory.findMany({
        distinct: ['model'],
        select: { model: true },
        orderBy: { model: 'asc' },
      }),
      prisma.inventory.findMany({
        distinct: ['bodyType'],
        select: { bodyType: true },
        where: { bodyType: { not: null } },
      }),
      prisma.inventory.findMany({
        distinct: ['truckSize'],
        select: { truckSize: true },
        where: { truckSize: { not: null } },
      }),
    ])

    const filterOptions = {
      makes: makesResult.map((item) => item.make).filter(Boolean),
      models: modelsResult.map((item) => item.model).filter(Boolean),
      bodyTypes: bodyTypesResult.map((item) => item.bodyType).filter(Boolean),
      truckSizes: truckSizesResult.map((item) => item.truckSize).filter(Boolean),
    }

    return NextResponse.json(filterOptions, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.error('Filter options fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch filter options' },
      { status: 500 },
    )
  }
}
