const OPENROUTER_BASE = 'https://openrouter.ai/api/v1'

const FALLBACK_MODELS = [
  'google/gemma-4-26b-a4b-it:free',
  'liquid/lfm-2.5-1.2b-instruct:free',
  'nvidia/nemotron-nano-9b-v2:free',
  'openai/gpt-oss-20b:free',
]

const SLEEP_MS = 1500

interface OpenRouterResponse {
  choices: {
    message: {
      content: string
    }
  }[]
  error?: {
    message: string
    code?: number
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function queryOpenRouter(
  systemPrompt: string,
  userMessage: string,
) {
  const apiKey = process.env.OPENROUTER_API_KEY
  const preferredModel = process.env.OPENROUTER_MODEL

  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured')
  }

  const modelsToTry = preferredModel
    ? [preferredModel, ...FALLBACK_MODELS.filter((m) => m !== preferredModel)]
    : FALLBACK_MODELS

  let lastError: string | null = null

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i]

    try {
      const response = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
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

      const data: OpenRouterResponse = await response.json()

      if (data.error) {
        lastError = data.error.message
        if (i < modelsToTry.length - 1) {
          await sleep(SLEEP_MS)
        }
        continue
      }

      const content =
        data.choices[0]?.message?.content ||
        'Sorry, I could not generate a response.'
      return content
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Unknown error'
      if (i < modelsToTry.length - 1) {
        await sleep(SLEEP_MS)
      }
    }
  }

  throw new Error(`All OpenRouter models failed. Last error: ${lastError}`)
}
