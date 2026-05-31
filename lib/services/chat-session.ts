import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'

const SESSION_TTL_DAYS = 30
const MAX_MESSAGES_PER_SESSION = 30
const MAX_MESSAGE_LENGTH = 500

export function getExpiresAt() {
  return new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000)
}

export async function getOrCreateSession(sessionId?: string | null) {
  if (sessionId) {
    const existing = await prisma.chatSession.findUnique({
      where: { sessionId },
    })
    if (existing) {
      if (existing.expiresAt < new Date()) {
        return createSession()
      }
      return existing
    }
  }
  return createSession()
}

async function createSession() {
  const sessionId = uuidv4()
  return prisma.chatSession.create({
    data: {
      sessionId,
      expiresAt: getExpiresAt(),
    },
  })
}

export async function saveMessage(
  sessionId: string,
  role: 'user' | 'assistant',
  message: string,
) {
  return prisma.chatMessage.create({
    data: {
      sessionId,
      role,
      message,
      expiresAt: getExpiresAt(),
    },
  })
}

export async function getChatHistory(sessionId: string) {
  return prisma.chatMessage.findMany({
    where: { sessionId },
    orderBy: { createdAt: 'asc' },
    select: { role: true, message: true, createdAt: true },
  })
}

export async function getMessageCount(sessionId: string) {
  return prisma.chatMessage.count({
    where: { sessionId },
  })
}

export function validateMessage(message: string): string | null {
  const trimmed = message.trim()
  if (!trimmed) return 'Message is required'
  if (trimmed.length > MAX_MESSAGE_LENGTH) {
    return `Message must be ${MAX_MESSAGE_LENGTH} characters or less`
  }
  return null
}

export async function canSendMessage(sessionId: string): Promise<string | null> {
  const count = await getMessageCount(sessionId)
  if (count >= MAX_MESSAGES_PER_SESSION) {
    return 'You have reached the maximum number of messages per session'
  }
  return null
}

export { MAX_MESSAGES_PER_SESSION, MAX_MESSAGE_LENGTH }
