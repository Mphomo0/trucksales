import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

export const runtime = 'nodejs'

export const GET = async (req: NextRequest) => {
  try {
    // 1. Implement chunked pagination. Never dump 1,000 spare parts in one go.
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.min(
      40,
      Math.max(1, parseInt(searchParams.get('limit') || '20', 10)),
    )
    const skip = (page - 1) * limit

    // 2. Fetch only what's required for grid/list cards (Description stripped out)
    const spares = await prisma.spares.findMany({
      skip,
      take: limit,
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
        createdAt: true,
        // Grab images solely to extract the primary preview thumbnail below
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 3. Flatten the response objects to minimize transmission weight
    const optimizedSpares = spares.map((item) => {
      const imgArray = Array.isArray(item.images) ? item.images : []
      return {
        ...item,
        thumbnail: imgArray[0] || null, // Primary display image for the card
        images: undefined, // Erase the full multi-image payload
      }
    })

    return NextResponse.json(
      {
        data: optimizedSpares,
        page,
        limit,
      },
      {
        status: 200,
        headers: {
          // Cache individual feed segments safely at the edge layer
          'Cache-Control':
            'public, s-maxage=3600, stale-while-revalidate=86400',
          'Content-Type': 'application/json',
        },
      },
    )
  } catch (error) {
    console.error('Error fetching spares:', error)
    return NextResponse.json(
      { error: 'Failed to fetch spares' },
      { status: 500 },
    )
  }
}
