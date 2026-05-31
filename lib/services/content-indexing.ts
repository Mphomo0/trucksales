import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

const SITE_URL = process.env.SITE_URL || 'https://www.a-ztrucksales.com'

function hashContent(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex')
}

async function fetchWithTimeout(
  url: string,
  timeoutMs = 8000,
): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'A-Z-Truck-Sales-Chatbot/1.0' },
    })
    return response
  } finally {
    clearTimeout(timeout)
  }
}

export async function indexWebsiteContent() {
  const log = await prisma.indexingLog.create({
    data: { status: 'running' },
  })

  try {
    const pagesToIndex = [
      { url: `${SITE_URL}/`, pageType: 'homepage' },
      { url: `${SITE_URL}/inventory`, pageType: 'inventory' },
      { url: `${SITE_URL}/contact`, pageType: 'contact' },
      { url: `${SITE_URL}/sell-your-truck`, pageType: 'sell-your-truck' },
    ]

    let chunksCreated = 0
    let chunksUpdated = 0
    let chunksDeleted = 0
    let chunksSkipped = 0

    const results = await Promise.allSettled(
      pagesToIndex.map(async (page) => {
        try {
          const response = await fetchWithTimeout(page.url)

          if (!response.ok) {
            await deleteExistingChunks(page.url)
            return 'deleted'
          }

          const html = await response.text()
          const title = extractTitle(html)
          const content = extractTextContent(html)

          if (!content.trim()) {
            await deleteExistingChunks(page.url)
            return 'deleted'
          }

          const contentHash = hashContent(content)

          const existing = await prisma.websiteContentChunk.findFirst({
            where: { url: page.url },
          })

          if (existing) {
            if (existing.contentHash === contentHash) {
              return 'skipped'
            }

            await prisma.websiteContentChunk.deleteMany({
              where: { url: page.url },
            })
          }

          await prisma.websiteContentChunk.create({
            data: {
              url: page.url,
              title,
              content,
              contentHash,
              pageType: page.pageType,
            },
          })
          return 'created'
        } catch {
          await deleteExistingChunks(page.url).catch(() => {})
          return 'deleted'
        }
      }),
    )

    for (const result of results) {
      if (result.status === 'fulfilled') {
        if (result.value === 'created') chunksCreated++
        else if (result.value === 'deleted') chunksDeleted++
        else if (result.value === 'skipped') chunksSkipped++
      } else {
        chunksDeleted++
      }
    }

    const pagesIndexed = pagesToIndex.length

    await prisma.indexingLog.update({
      where: { id: log.id },
      data: {
        status: 'completed',
        finishedAt: new Date(),
        pagesIndexed,
        chunksCreated,
        chunksUpdated,
        chunksDeleted,
        chunksSkipped,
      },
    })

    return { pagesIndexed, chunksCreated, chunksUpdated, chunksDeleted, chunksSkipped }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    await prisma.indexingLog.update({
      where: { id: log.id },
      data: {
        status: 'failed',
        finishedAt: new Date(),
        error: errorMessage,
      },
    })

    throw error
  }
}

async function deleteExistingChunks(url: string) {
  await prisma.websiteContentChunk.deleteMany({ where: { url } })
}

function extractTitle(html: string): string {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  return match ? match[1].trim() : ''
}

function extractTextContent(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function indexInventoryFromDatabase() {
  const log = await prisma.indexingLog.create({
    data: { status: 'running' },
  })

  try {
    const vehicles = await prisma.inventory.findMany()

    const existingVehicleChunks = await prisma.websiteContentChunk.findMany({
      where: { pageType: 'inventory' },
    })
    const existingSlugs = new Set(
      existingVehicleChunks.map((c) => c.url.split('/').pop()),
    )

    let chunksCreated = 0
    let chunksUpdated = 0
    let chunksDeleted = 0
    let chunksSkipped = 0

    for (const vehicle of vehicles) {
      const content = buildVehicleContent(vehicle)
      const contentHash = hashContent(content)
      const url = `${SITE_URL}/inventory/${vehicle.slug}`

      const existing = await prisma.websiteContentChunk.findFirst({
        where: { url },
      })

      if (existing) {
        if (existing.contentHash === contentHash) {
          chunksSkipped++
          existingSlugs.delete(vehicle.slug)
          continue
        }

        await prisma.websiteContentChunk.deleteMany({ where: { url } })
        chunksDeleted++
      }

      await prisma.websiteContentChunk.create({
        data: {
          url,
          title: vehicle.name,
          content,
          contentHash,
          pageType: 'inventory',
        },
      })
      chunksCreated++
      existingSlugs.delete(vehicle.slug)
    }

    for (const staleSlug of existingSlugs) {
      const staleUrl = `${SITE_URL}/inventory/${staleSlug}`
      await prisma.websiteContentChunk.deleteMany({
        where: { url: staleUrl },
      })
      chunksDeleted++
    }

    const pagesIndexed = vehicles.length

    await prisma.indexingLog.update({
      where: { id: log.id },
      data: {
        status: 'completed',
        finishedAt: new Date(),
        pagesIndexed,
        chunksCreated,
        chunksUpdated,
        chunksDeleted,
        chunksSkipped,
      },
    })

    return { pagesIndexed, chunksCreated, chunksUpdated, chunksDeleted, chunksSkipped }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    await prisma.indexingLog.update({
      where: { id: log.id },
      data: {
        status: 'failed',
        finishedAt: new Date(),
        error: errorMessage,
      },
    })

    throw error
  }
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
    `URL: ${SITE_URL}/inventory/${vehicle.slug}`,
    `Description: ${vehicle.description}`,
  ].join('\n')
}

export async function getIndexingStatus() {
  const lastLog = await prisma.indexingLog.findFirst({
    orderBy: { startedAt: 'desc' },
  })

  return lastLog
}

export async function getStoredContentStats() {
  const [totalChunks, inventoryChunks, websiteChunks] = await Promise.all([
    prisma.websiteContentChunk.count(),
    prisma.websiteContentChunk.count({
      where: { pageType: 'inventory' },
    }),
    prisma.websiteContentChunk.count({
      where: { pageType: { not: 'inventory' } },
    }),
  ])

  return { totalChunks, inventoryChunks, websiteChunks }
}
