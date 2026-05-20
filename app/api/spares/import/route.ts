import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import slugify from 'slugify'

export async function POST(req: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { records } = body

    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: 'No records to import' }, { status: 400 })
    }

    const imported: string[] = []
    const errors: string[] = []

    for (const record of records) {
      try {
        const {
          name,
          description,
          make,
          price,
          noVatPrice,
          condition,
          category,
          images,
          videoLink,
          slug,
          specialPrice,
          specialPriceNoVat,
          specialValidFrom,
          specialValidTo,
        } = record

        if (!name || !make) {
          errors.push(`Missing required fields for: ${name || 'unnamed'}`)
          continue
        }

        const parsedPrice = parseFloat(price) || 0
        const parsedVatPrice = parseFloat(noVatPrice) || parsedPrice
        const upperCondition = String(condition || 'USED').toUpperCase()
        const upperCategory = String(category || 'OTHER').toUpperCase()
        const lowerMake = String(make).toLowerCase()

        let finalSlug = slug || slugify(`${make}-${price || '0'}-${category || 'other'}`, { lower: true })

        const existing = await prisma.spares.findFirst({
          where: { slug: { startsWith: finalSlug } },
          select: { slug: true },
          orderBy: { slug: 'desc' },
        })

        if (existing) {
          const match = existing.slug.match(/-(\d+)$/)
          const counter = match ? parseInt(match[1]) + 1 : 1
          finalSlug = `${finalSlug}-${counter}`
        }

        let parsedImages: { url: string; fileId: string }[] = []
        if (images) {
          if (typeof images === 'string') {
            parsedImages = String(images)
              .split('|')
              .filter(url => url.trim())
              .map((url, index) => ({
                url: url.trim(),
                fileId: `import-${Date.now()}-${index}`,
              }))
          } else if (Array.isArray(images)) {
            parsedImages = images
          }
        }

        await prisma.spares.create({
          data: {
            name: String(name),
            make: lowerMake,
            price: parsedPrice,
            noVatPrice: parsedVatPrice || null,
            condition: upperCondition,
            category: upperCategory,
            description: description ? String(description) : '',
            images: parsedImages as any,
            videoLink: videoLink ? String(videoLink) : null,
            slug: finalSlug,
            specialPrice: specialPrice ? parseFloat(specialPrice) : null,
            specialPriceNoVat: specialPriceNoVat ? parseFloat(specialPriceNoVat) : null,
            specialValidFrom: specialValidFrom ? new Date(specialValidFrom) : null,
            specialValidTo: specialValidTo ? new Date(specialValidTo) : null,
          },
        })

        imported.push(finalSlug)
      } catch (recordError) {
        console.error('Record import error:', recordError)
        errors.push(`Error importing: ${record.name || 'unknown'}`)
      }
    }

    return NextResponse.json({
      success: true,
      imported: imported.length,
      errors: errors.length,
      errorDetails: errors.slice(0, 50),
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Failed to import spares', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}