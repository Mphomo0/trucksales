import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import {
  getIndexingStatus,
  getStoredContentStats,
} from '@/lib/services/content-indexing'
import { cleanupExpiredData } from '@/lib/services/cleanup'

const MS_15M = 15 * 60 * 1000
const MS_1H = 60 * 60 * 1000
const MS_24H = 24 * 60 * 60 * 1000

export async function GET() {
  try {
    const session = await auth()
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const now = new Date()
    const since15m = new Date(now.getTime() - MS_15M)
    const since1h = new Date(now.getTime() - MS_1H)
    const since24h = new Date(now.getTime() - MS_24H)

    const [
      indexingStatus,
      contentStats,
      totalSessions,
      totalMessages,
      totalLeads,
      errorsLast15m,
      errorsLast1h,
      errorsLast24h,
      rateLimitCount24h,
      allFailedLast1h,
      errorGroups,
      lastErrorRow,
      lastAssistantMessage,
    ] = await Promise.all([
      getIndexingStatus(),
      getStoredContentStats(),
      prisma.chatSession.count(),
      prisma.chatMessage.count(),
      prisma.chatLead.count(),
      prisma.chatbotErrorLog.count({ where: { createdAt: { gte: since15m } } }),
      prisma.chatbotErrorLog.count({ where: { createdAt: { gte: since1h } } }),
      prisma.chatbotErrorLog.count({ where: { createdAt: { gte: since24h } } }),
      prisma.chatbotErrorLog.count({
        where: { errorType: 'RATE_LIMIT', createdAt: { gte: since24h } },
      }),
      prisma.chatbotErrorLog.count({
        where: { errorType: 'ALL_FAILED', createdAt: { gte: since1h } },
      }),
      prisma.chatbotErrorLog.groupBy({
        by: ['model'],
        where: { createdAt: { gte: since24h } },
        _count: { _all: true },
        _max: { createdAt: true },
      }),
      prisma.chatbotErrorLog.findFirst({
        orderBy: { createdAt: 'desc' },
        select: { model: true, errorType: true, message: true, createdAt: true },
      }),
      prisma.chatMessage.findFirst({
        where: { role: 'assistant' },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true },
      }),
    ])

    let status: 'healthy' | 'degraded' | 'down' = 'healthy'
    if (allFailedLast1h > 0 || errorsLast15m > 10) {
      status = 'down'
    } else if (errorsLast15m > 0) {
      status = 'degraded'
    }

    const errorsByModel = errorGroups
      .map((g) => ({
        model: g.model,
        count24h: g._count._all,
        lastErrorAt: g._max.createdAt ? g._max.createdAt.toISOString() : null,
      }))
      .sort((a, b) => b.count24h - a.count24h)

    const aiHealth = {
      status,
      configuredModel: process.env.OPENROUTER_MODEL || null,
      fallbackModels: [
        'google/gemma-4-26b-a4b-it:free',
        'liquid/lfm-2.5-1.2b-instruct:free',
        'nvidia/nemotron-nano-9b-v2:free',
        'openai/gpt-oss-20b:free',
      ],
      errorsLast15m,
      errorsLast1h,
      errorsLast24h,
      rateLimitCount24h,
      errorsByModel,
      lastError: lastErrorRow
        ? {
            model: lastErrorRow.model,
            errorType: lastErrorRow.errorType,
            message: lastErrorRow.message,
            createdAt: lastErrorRow.createdAt.toISOString(),
          }
        : null,
      lastSuccessfulAt: lastAssistantMessage
        ? lastAssistantMessage.createdAt.toISOString()
        : null,
    }

    return Response.json({
      indexingStatus,
      contentStats,
      totalSessions,
      totalMessages,
      totalLeads,
      aiHealth,
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
