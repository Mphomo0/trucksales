import { logChatbotErrorSafe } from '@/lib/services/chatbot-errors'
import type { ChatbotErrorType } from '@/lib/services/chatbot-errors'

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1'

const FALLBACK_MODELS = [
  'google/gemma-4-26b-a4b-it:free',
  'liquid/lfm-2.5-1.2b-instruct:free',
  'nvidia/nemotron-nano-9b-v2:free',
  'openai/gpt-oss-20b:free',
]

const RATE_LIMIT_COOLDOWN_MS = 60_000
const UPSTREAM_RETRY_DELAY_MS = 1500
const NETWORK_RETRY_DELAY_MS = 1500

interface OpenRouterResponse {
  choices?: {
    message?: {
      content?: string
    }
  }[]
  error?: {
    message: string
    code?: number
  }
}

export interface ModelResult {
  content: string
  model: string
}

type AttemptSuccess = { kind: 'success'; content: string }
type AttemptError = {
  kind: 'error'
  type: ChatbotErrorType
  message: string
  statusCode: number | null
}
type AttemptResult = AttemptSuccess | AttemptError

const cooldowns = new Map<string, number>()

function isModelCoolingDown(model: string): boolean {
  const until = cooldowns.get(model)
  if (!until) return false
  if (Date.now() >= until) {
    cooldowns.delete(model)
    return false
  }
  return true
}

function setCooldown(model: string) {
  cooldowns.set(model, Date.now() + RATE_LIMIT_COOLDOWN_MS)
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function classify(
  response: Response,
  data: OpenRouterResponse,
): { type: ChatbotErrorType; message: string; statusCode: number | null } {
  const status = response.status
  const apiError = data.error
  const apiCode = apiError?.code

  if (status === 429 || apiCode === 429 || response.headers.get('retry-after')) {
    return {
      type: 'RATE_LIMIT',
      message: apiError?.message || `Rate limited (HTTP ${status})`,
      statusCode: status || apiCode || 429,
    }
  }

  if (status >= 500 || (apiCode !== undefined && apiCode >= 500)) {
    return {
      type: 'UPSTREAM_ERROR',
      message: apiError?.message || `Upstream error (HTTP ${status})`,
      statusCode: status || (apiCode ?? null),
    }
  }

  if (apiError) {
    return {
      type: 'UPSTREAM_ERROR',
      message: apiError.message,
      statusCode: status || (apiCode ?? null),
    }
  }

  if (!data.choices || data.choices.length === 0) {
    return {
      type: 'PARSE',
      message: 'Empty choices in response',
      statusCode: status || null,
    }
  }

  return {
    type: 'PARSE',
    message: 'Unexpected response shape',
    statusCode: status || null,
  }
}

async function tryModel(
  model: string,
  systemPrompt: string,
  userMessage: string,
  apiKey: string,
  sessionId?: string | null,
): Promise<AttemptResult> {
  let response: Response
  try {
    response = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer':
          process.env.SITE_URL || 'https://www.a-ztrucksales.com',
        'X-Title': 'A-Z Truck Sales Chatbot',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 1024,
        temperature: 0.3,
      }),
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown network error'
    logChatbotErrorSafe({
      model,
      errorType: 'NETWORK',
      message,
      sessionId,
    })
    return { kind: 'error', type: 'NETWORK', message, statusCode: null }
  }

  let data: OpenRouterResponse
  try {
    data = (await response.json()) as OpenRouterResponse
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to parse response'
    logChatbotErrorSafe({
      model,
      errorType: 'PARSE',
      message,
      statusCode: response.status,
      sessionId,
    })
    return {
      kind: 'error',
      type: 'PARSE',
      message,
      statusCode: response.status,
    }
  }

  if (data.choices && data.choices.length > 0) {
    const content = data.choices[0]?.message?.content
    if (content && content.trim().length > 0) {
      return { kind: 'success', content }
    }
  }

  const classification = classify(response, data)
  logChatbotErrorSafe({
    model,
    errorType: classification.type,
    message: classification.message,
    statusCode: classification.statusCode,
    sessionId,
  })
  return {
    kind: 'error',
    type: classification.type,
    message: classification.message,
    statusCode: classification.statusCode,
  }
}

export async function queryOpenRouter(
  systemPrompt: string,
  userMessage: string,
  context: { sessionId?: string | null } = {},
): Promise<ModelResult> {
  const apiKey = process.env.OPENROUTER_API_KEY
  const preferredModel = process.env.OPENROUTER_MODEL

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

  const baseList = preferredModel
    ? [preferredModel, ...FALLBACK_MODELS.filter((m) => m !== preferredModel)]
    : FALLBACK_MODELS

  const modelsToTry = baseList.filter((m) => !isModelCoolingDown(m))

  if (modelsToTry.length === 0) {
    throw new Error('All models are currently rate-limited. Please try again shortly.')
  }

  let lastError: { message: string; type: ChatbotErrorType; statusCode: number | null } | null =
    null

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i]

    let result = await tryModel(
      model,
      systemPrompt,
      userMessage,
      apiKey,
      context.sessionId,
    )

    if (
      result.kind === 'error' &&
      (result.type === 'UPSTREAM_ERROR' || result.type === 'NETWORK') &&
      i < modelsToTry.length - 1
    ) {
      await sleep(
        result.type === 'UPSTREAM_ERROR' ? UPSTREAM_RETRY_DELAY_MS : NETWORK_RETRY_DELAY_MS,
      )
      result = await tryModel(
        model,
        systemPrompt,
        userMessage,
        apiKey,
        context.sessionId,
      )
    }

    if (result.kind === 'success') {
      return { content: result.content, model }
    }

    lastError = {
      message: result.message,
      type: result.type,
      statusCode: result.statusCode,
    }

    if (result.type === 'RATE_LIMIT') {
      setCooldown(model)
    }

    if (i < modelsToTry.length - 1) {
      await sleep(1500)
    }
  }

  logChatbotErrorSafe({
    model: 'all',
    errorType: 'ALL_FAILED',
    message: lastError?.message || 'All models failed',
    statusCode: lastError?.statusCode ?? null,
    sessionId: context.sessionId,
  })

  throw new Error(
    `All OpenRouter models failed. Last error: ${lastError?.message || 'unknown'}`,
  )
}
