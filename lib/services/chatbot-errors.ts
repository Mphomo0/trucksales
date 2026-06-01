import { after } from 'next/server'
import { prisma } from '@/lib/prisma'

export type ChatbotErrorType =
  | 'RATE_LIMIT'
  | 'UPSTREAM_ERROR'
  | 'NETWORK'
  | 'PARSE'
  | 'ALL_FAILED'

const MAX_MESSAGE_LENGTH = 1000

interface LogErrorInput {
  model: string
  errorType: ChatbotErrorType
  message: string
  statusCode?: number | null
  sessionId?: string | null
}

export async function logChatbotError(input: LogErrorInput): Promise<void> {
  try {
    const truncated = input.message.slice(0, MAX_MESSAGE_LENGTH)
    await prisma.chatbotErrorLog.create({
      data: {
        model: input.model,
        errorType: input.errorType,
        statusCode: input.statusCode ?? null,
        message: truncated,
        sessionId: input.sessionId ?? null,
      },
    })
  } catch (err) {
    console.error('Failed to log chatbot error:', err)
  }
}

export function logChatbotErrorSafe(input: LogErrorInput): void {
  after(() => logChatbotError(input))
}
