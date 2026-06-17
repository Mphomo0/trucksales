import { NextRequest } from 'next/server'
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

const LEAD_TRIGGERS = [
  'please call me',
  'can someone contact me',
  'i am interested in',
  'i want a quote',
  'i want financing',
  'call me',
  'contact me',
  'interested in this truck',
  'give me a quote',
]

function isLeadRequest(message: string): boolean {
  const lower = message.toLowerCase().trim()
  return LEAD_TRIGGERS.some((trigger) => lower.includes(trigger))
}

function extractLeadInfo(message: string) {
  const nameMatch = message.match(/name\s+(?:is\s+)?(\w+(?:\s+\w+)?)/i)
  const phoneMatch = message.match(
    /(?:\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3}[-.\s]?\d{4}/,
  )
  const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/)

  return {
    name: nameMatch ? nameMatch[1].trim() : '',
    phone: phoneMatch ? phoneMatch[0].trim() : '',
    email: emailMatch ? emailMatch[0].trim() : null,
    message: message.trim(),
  }
}

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

    await saveMessage(session.sessionId, 'assistant', aiResponse)

    let lead = null
    if (isLeadRequest(message)) {
      const leadInfo = extractLeadInfo(message)
      if (leadInfo.name && leadInfo.phone) {
        try {
          lead = await createLead({
            name: leadInfo.name,
            phone: leadInfo.phone,
            email: leadInfo.email,
            message: leadInfo.message,
            interestedVehicle: extractVehicleInterest(message, chunks),
          })
        } catch {
          // Lead creation failed silently - don't block user
        }
      }
    }

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
