import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const INDEXNOW_KEY = 'er3xkhfkmsvhepnk36zgjy2jgwynv75n'
const SITE_URL = 'https://www.a-ztrucksales.com'

const SEARCH_ENGINES = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
]

async function submitToIndexNow(urls: string[]) {
  const payload = {
    host: 'www.a-ztrucksales.com',
    key: INDEXNOW_KEY,
    keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
    urlList: urls,
  }

  const results = await Promise.allSettled(
    SEARCH_ENGINES.map((endpoint) =>
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    )
  )

  return results.map((r, i) => ({
    engine: SEARCH_ENGINES[i],
    status: r.status === 'fulfilled' ? r.value.status : 'failed',
  }))
}

export async function GET(request: NextRequest) {
  try {
    const secret = request.nextUrl.searchParams.get('token')

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const [vehicles, spareParts, activeSpecials] = await Promise.all([
      prisma.inventory.findMany({ select: { slug: true } }),
      prisma.spares.findMany({ select: { slug: true } }),
      prisma.inventory.findMany({
        where: { specialValidTo: { gt: now }, specialValidFrom: { lte: now } },
        select: { slug: true },
      }),
    ])

    const staticUrls = ['', '/inventory', '/spares', '/specials', '/sell-your-truck', '/contact'].map(
      (r) => `${SITE_URL}${r}`
    )
    const vehicleUrls = vehicles.map((v) => `${SITE_URL}/inventory/${v.slug}`)
    const spareUrls = spareParts.map((s) => `${SITE_URL}/spares/${s.slug}`)
    const specialUrls = activeSpecials.map((s) => `${SITE_URL}/specials/${s.slug}`)

    const allUrls = [...staticUrls, ...vehicleUrls, ...spareUrls, ...specialUrls]

    // IndexNow supports up to 10,000 URLs per request; batch if needed
    const BATCH_SIZE = 10_000
    const batches: string[][] = []
    for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
      batches.push(allUrls.slice(i, i + BATCH_SIZE))
    }

    const batchResults = await Promise.all(batches.map((batch) => submitToIndexNow(batch)))

    return NextResponse.json({
      submitted: true,
      total: allUrls.length,
      batches: batchResults,
    })
  } catch (error) {
    console.error('[IndexNow] Bulk error:', error)
    return NextResponse.json({ error: 'Bulk submission failed' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get('x-revalidate-token')

    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { urls } = await request.json()

    if (!urls || !Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid urls array' }, { status: 400 })
    }

    const fullUrls = urls.map((u: string) =>
      u.startsWith('http') ? u : `${SITE_URL}${u.startsWith('/') ? u : `/${u}`}`
    )

    const results = await submitToIndexNow(fullUrls)

    return NextResponse.json({
      submitted: true,
      urls: fullUrls,
      results,
    })
  } catch (error) {
    console.error('[IndexNow] Error:', error)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
