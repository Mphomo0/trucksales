import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import {
  indexWebsiteContent,
  indexInventoryFromDatabase,
  indexSparesFromDatabase,
} from '@/lib/services/content-indexing'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json().catch(() => ({}))
    const type = body.type || 'all'

    const results: Record<string, unknown> = {}

    if (type === 'website' || type === 'all') {
      results.website = await indexWebsiteContent()
    }

    if (type === 'inventory' || type === 'all') {
      results.inventory = await indexInventoryFromDatabase()
    }

    if (type === 'spares' || type === 'all') {
      results.spares = await indexSparesFromDatabase()
    }

    return Response.json({ success: true, results })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Indexing failed'
    return Response.json({ error: message }, { status: 500 })
  }
}
