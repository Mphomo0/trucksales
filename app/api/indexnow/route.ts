import { NextRequest, NextResponse } from 'next/server'

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
