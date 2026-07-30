import { NextRequest } from 'next/server'
import { getClientIp, rateLimit, rateLimitResponse } from '@/lib/rate-limit'
import { prisma } from '@/lib/prisma'
import { queryOpenRouter } from '@/lib/ai/openrouter'
import {
  getOrCreateSession,
  saveMessage,
  getChatHistory,
  canSendMessage,
  validateMessage,
} from '@/lib/services/chat-session'
import {
  createLead,
} from '@/lib/services/lead-management'
import { attributionSchema } from '@/lib/schemas'
import { detectLead } from '@/lib/chatbot/lead-detection'

const SYSTEM_PROMPT_BASE = `You are the official AI assistant for A-Z Truck Sales.

You must answer only using the inventory and website content provided below.

Do not invent vehicles.
Do not invent prices.
Do not invent mileage.
Do not invent availability.
Do not answer from general knowledge.

If inventory information cannot be found, reply:

"I could not find that vehicle in the current A-Z Truck Sales inventory. Please contact A-Z Truck Sales directly for the latest stock availability."

Keep answers short, professional and sales-focused.

Context:
{{CONTEXT}}

Question:
{{QUESTION}}`

export async function POST(req: NextRequest) {
  try {
    // Per-IP throttle: the per-session cap alone is bypassable by minting new
    // sessions, and every message costs an OpenRouter call.
    const ip = getClientIp(req)
    const limit = rateLimit(`chatbot-send:${ip}`, 10, 60 * 1000)
    if (!limit.ok) {
      return rateLimitResponse(limit.retryAfterSeconds)
    }

    const body = await req.json()
    const { message, sessionId } = body

    const validationError = validateMessage(message)
    if (validationError) {
      return Response.json({ error: validationError }, { status: 400 })
    }

    let session
    try {
      session = await getOrCreateSession(sessionId)
    } catch {
      return Response.json(
        { error: 'Could not create session' },
        { status: 500 },
      )
    }

    const limitError = await canSendMessage(session.sessionId)
    if (limitError) {
      return Response.json({ error: limitError }, { status: 429 })
    }

    const [, chunks] = await Promise.all([
      saveMessage(session.sessionId, 'user', message.trim()),
      searchContent(message),
    ])

    const context =
      chunks.length > 0
        ? chunks.map((c) => `[${c.pageType}] ${c.content}`).join('\n\n')
        : 'No relevant content found.'

    const systemPrompt = SYSTEM_PROMPT_BASE
      .replace('{{CONTEXT}}', context)
      .replace('{{QUESTION}}', message)

    let aiResponse: string
    let usedModel: string | null = null
    try {
      const result = await queryOpenRouter(systemPrompt, message, {
        sessionId: session.sessionId,
      })
      aiResponse = result.content
      usedModel = result.model
    } catch (err) {
      console.error('OpenRouter error:', err)
      aiResponse =
        "I'm having trouble connecting to my knowledge base right now. Please contact A-Z Truck Sales directly at +27 11 902 6071 for assistance."
    }

    // Run the assistant-message save and lead creation in parallel — neither
    // depends on the other, and only leadCaptured is needed in the response.
    const leadPromise = (async () => {
      const leadInfo = detectLead(message)
      if (!leadInfo) return null
      try {
        return await createLead({
          // Someone who gives a number without a name is still worth calling.
          name: leadInfo.name ?? 'Chatbot enquiry',
          phone: leadInfo.phone,
          email: leadInfo.email,
          message: leadInfo.message,
          interestedVehicle: extractVehicleInterest(message, chunks),
          source: 'chatbot',
          attribution: attributionSchema.parse(body.attribution ?? {}),
        })
      } catch (error) {
        // Don't block the user's reply, but never swallow this silently again:
        // a mute catch here is why zero-capture went unnoticed for weeks.
        console.error('Chatbot lead creation failed:', error)
        return null
      }
    })()

    const [, lead] = await Promise.all([
      saveMessage(session.sessionId, 'assistant', aiResponse),
      leadPromise,
    ])

    return Response.json({
      response: aiResponse,
      sessionId: session.sessionId,
      leadCaptured: lead !== null,
      model: usedModel,
    })
  } catch {
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 },
    )
  }
}

function extractVehicleInterest(
  message: string,
  chunks: { title?: string | null; content: string }[],
): string | undefined {
  const vehicleChunk = chunks.find((c) => c.content.startsWith('Vehicle:'))
  if (vehicleChunk) {
    const titleLine = vehicleChunk.content.split('\n')[0]
    return titleLine.replace('Vehicle: ', '')
  }

  const modelMatch = chunks
    .map((c) => {
      const match = c.content.match(/Model:\s*(.+)/)
      return match ? match[1] : null
    })
    .find(Boolean)

  return modelMatch || undefined
}

async function searchContent(message: string) {
  const lower = message.toLowerCase()
  const words = lower.split(/\s+/).filter((w) => w.length > 2)

  const searchFields = ['make', 'model', 'bodyType', 'truckSize'] as const

  const [vehicles, spares] = await Promise.all([
    prisma.inventory.findMany({
      where: {
        OR: searchFields.flatMap((field) =>
          words.map((word) => ({ [field]: { contains: word, mode: 'insensitive' as const } })),
        ),
      },
      select: {
        id: true, name: true, make: true, model: true, year: true, vatPrice: true,
        mileage: true, condition: true, bodyType: true, truckSize: true,
        transmission: true, fuelType: true, description: true, slug: true,
      },
      take: 10,
    }),
    prisma.spares.findMany({
      where: {
        OR: words.map((word) => ({
          OR: [
            { name: { contains: word, mode: 'insensitive' as const } },
            { make: { contains: word, mode: 'insensitive' as const } },
            { category: { contains: word, mode: 'insensitive' as const } },
          ],
        })),
      },
      select: { id: true, name: true, make: true, category: true, price: true, condition: true, description: true, slug: true },
      take: 5,
    }),
  ])

  if (vehicles.length > 0) {
    const seen = new Map<string, string>()
    for (const v of vehicles) {
      if (!seen.has(v.id)) seen.set(v.id, buildVehicleContent(v))
    }
    return [...seen.values()].slice(0, 5).map((content) => ({
      content,
      pageType: 'inventory',
      title: content.split('\n')[0]?.replace('Vehicle: ', '') || '',
    }))
  }

  if (spares.length > 0) {
    const seen = new Map<string, string>()
    for (const s of spares) {
      if (!seen.has(s.id)) {
        const price = s.price.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR', maximumFractionDigits: 0 })
        seen.set(s.id, [
          `Spare Part: ${s.name}`,
          `Make: ${s.make}`,
          `Category: ${s.category}`,
          `Price: ${price}`,
          `Condition: ${s.condition}`,
          `URL: https://www.a-ztrucksales.com/spares/${s.slug}`,
          `Description: ${s.description}`,
        ].join('\n'))
      }
    }
    return [...seen.values()].map((content) => ({
      content,
      pageType: 'spares',
      title: content.split('\n')[0]?.replace('Spare Part: ', '') || '',
    }))
  }

  const inventoryChunks = await prisma.websiteContentChunk.findMany({
    where: {
      pageType: 'inventory',
      OR: words.map((w) => ({
        content: { contains: w, mode: 'insensitive' },
      })),
    },
    take: 5,
  })

  if (inventoryChunks.length > 0) {
    return inventoryChunks
  }

  const websiteChunks = await prisma.websiteContentChunk.findMany({
    where: {
      NOT: { pageType: 'inventory' },
      OR: words.map((w) => ({
        content: { contains: w, mode: 'insensitive' },
      })),
    },
    take: 5,
  })

  if (websiteChunks.length > 0) {
    return websiteChunks
  }

  const contactChunks = await prisma.websiteContentChunk.findMany({
    where: { pageType: 'contact' },
    take: 3,
  })

  return contactChunks
}

function buildVehicleContent(vehicle: {
  name: string
  make: string
  model: string
  year: number
  vatPrice: number
  mileage: number | null
  condition: string
  bodyType: string | null
  truckSize: string | null
  transmission: string | null
  fuelType: string | null
  description: string
  slug: string
}) {
  const price = vehicle.vatPrice.toLocaleString('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  })
  const mileage = vehicle.mileage
    ? `${vehicle.mileage.toLocaleString()} km`
    : 'N/A'

  return [
    `Vehicle: ${vehicle.name}`,
    `Make: ${vehicle.make}`,
    `Model: ${vehicle.model}`,
    `Year: ${vehicle.year}`,
    `Price: ${price}`,
    `Mileage: ${mileage}`,
    `Condition: ${vehicle.condition}`,
    `Body Type: ${vehicle.bodyType || 'N/A'}`,
    `Truck Size: ${vehicle.truckSize || 'N/A'}`,
    `Transmission: ${vehicle.transmission || 'N/A'}`,
    `Fuel Type: ${vehicle.fuelType || 'N/A'}`,
    `URL: https://www.a-ztrucksales.com/inventory/${vehicle.slug}`,
  ].join('\n')
}
