import { prisma } from '@/lib/prisma'

export async function cleanupExpiredData() {
  const now = new Date()

  const messagesDeleted = await prisma.chatMessage.deleteMany({
    where: { expiresAt: { lt: now } },
  })

  const sessionsDeleted = await prisma.chatSession.deleteMany({
    where: { expiresAt: { lt: now } },
  })

  const leadsDeleted = await prisma.chatLead.deleteMany({
    where: {
      expiresAt: { lt: now },
      emailSent: true,
      emailError: null,
    },
  })

  const ninetyDaysAgo = new Date(
    Date.now() - 90 * 24 * 60 * 60 * 1000,
  )

  const logsDeleted = await prisma.indexingLog.deleteMany({
    where: { startedAt: { lt: ninetyDaysAgo } },
  })

  return {
    messagesDeleted: messagesDeleted.count,
    sessionsDeleted: sessionsDeleted.count,
    leadsDeleted: leadsDeleted.count,
    logsDeleted: logsDeleted.count,
  }
}
