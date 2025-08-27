import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const total = await prisma.inventory.count()

    const numToFetch = 30

    // If nothing to fetch, return early
    if (total === 0) {
      return NextResponse.json([], { status: 200 })
    }

    const randomIndexes = new Set<number>()
    while (randomIndexes.size < Math.min(numToFetch, total)) {
      randomIndexes.add(Math.floor(Math.random() * total))
    }

    const randomVehicles = await Promise.all(
      Array.from(randomIndexes).map((skip) =>
        prisma.inventory.findFirst({ skip })
      )
    )

    // Filter out any potential nulls
    const filteredVehicles = randomVehicles.filter(Boolean)

    return NextResponse.json(filteredVehicles, { status: 200 })
  } catch (error) {
    console.error('Random vehicle fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch random vehicles' },
      { status: 500 }
    )
  }
}
