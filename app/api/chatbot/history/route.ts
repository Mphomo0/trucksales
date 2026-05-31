import { NextRequest } from 'next/server'
import { getChatHistory } from '@/lib/services/chat-session'

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get('sessionId')

    if (!sessionId) {
      return Response.json({ error: 'sessionId is required' }, { status: 400 })
    }

    const history = await getChatHistory(sessionId)

    return Response.json({ history })
  } catch {
    return Response.json(
      { error: 'Could not retrieve chat history' },
      { status: 500 },
    )
  }
}
