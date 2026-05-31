import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import {
  getIndexingStatus,
  getStoredContentStats,
} from '@/lib/services/content-indexing'
import { cleanupExpiredData } from '@/lib/services/cleanup'

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [indexingStatus, contentStats, totalSessions, totalMessages, totalLeads] =
      await Promise.all([
        getIndexingStatus(),
        getStoredContentStats(),
        prisma.chatSession.count(),
        prisma.chatMessage.count(),
        prisma.chatLead.count(),
      ])

    return Response.json({
      indexingStatus,
      contentStats,
      totalSessions,
      totalMessages,
      totalLeads,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch stats'
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function POST() {
  try {
    const session = await auth()
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session) {
      const cleanupResults = await cleanupExpiredData()
      return Response.json({ success: true, ...cleanupResults })
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Cleanup failed'
    return Response.json({ error: message }, { status: 500 })
  }
}
