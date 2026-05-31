import { auth } from '@/auth'
import { cleanupExpiredData } from '@/lib/services/cleanup'

export async function POST() {
  try {
    const session = await auth()
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results = await cleanupExpiredData()
    return Response.json({ success: true, ...results })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cleanup failed'
    return Response.json({ error: message }, { status: 500 })
  }
}
