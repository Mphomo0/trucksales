import { prisma } from '@/lib/prisma'

const ERROR_LOG_RETENTION_DAYS = 30
const INDEXING_LOG_RETENTION_DAYS = 90

export async function cleanupExpiredData() {
  const now = new Date()
  const ninetyDaysAgo = new Date(Date.now() - INDEXING_LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(Date.now() - ERROR_LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000)

  const [messagesDeleted, sessionsDeleted, leadsDeleted, logsDeleted, errorsDeleted] =
    await Promise.all([
      prisma.chatMessage.deleteMany({ where: { expiresAt: { lt: now } } }),
      prisma.chatSession.deleteMany({ where: { expiresAt: { lt: now } } }),
      prisma.chatLead.deleteMany({
        where: { expiresAt: { lt: now }, emailSent: true, emailError: null },
      }),
      prisma.indexingLog.deleteMany({ where: { startedAt: { lt: ninetyDaysAgo } } }),
      prisma.chatbotErrorLog.deleteMany({ where: { createdAt: { lt: thirtyDaysAgo } } }),
    ])

  return {
    messagesDeleted: messagesDeleted.count,
    sessionsDeleted: sessionsDeleted.count,
    leadsDeleted: leadsDeleted.count,
    logsDeleted: logsDeleted.count,
    errorsDeleted: errorsDeleted.count,
  }
}
