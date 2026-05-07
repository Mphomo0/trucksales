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

    // Get existing slugs once for duplicate checking
    const existingVehicles = await prisma.inventory.findMany({ select: { slug: true } })
    const existingSlugs = new Set(existingVehicles.map(v => v.slug))

    for (const record of records) {
      try {
const {
          name,
          make,
          model,
          year,
          registrationNo,
          vatPrice,
          pricenoVat,
          mileage,
          fuelType,
          condition,
          transmission,
          videoLink,
          description,
          bodyType,
          truckSize,
          slug,
        } = record

        const price = vatPrice ?? record.price
        const priceNoVat = pricenoVat ?? record.priceNoVat

        const imagesKey = Object.keys(record).find(k => k.toLowerCase() === 'images')
        const images = imagesKey ? record[imagesKey] : undefined
        const videoLinkKey = Object.keys(record).find(k => k.toLowerCase() === 'videolink')
        const video = videoLinkKey ? record[videoLinkKey] : undefined

        console.log('[IMPORT] Raw images field:', images, 'type:', typeof images)

        if (!name || !make) {
          errors.push(`Missing required fields for: ${name || 'unnamed'}`)
          continue
        }

        const parsedYear = parseInt(year) || 2020
        const parsedVatPrice = parseFloat(price) || 0
        const parsedPricenoVat = parseFloat(priceNoVat) || parsedVatPrice
        const parsedMileage = mileage ? parseFloat(mileage) : null
        const upperCondition = String(condition || 'USED').toUpperCase()
        const upperFuelType = fuelType ? String(fuelType).toUpperCase() : null
        const upperTransmission = transmission ? String(transmission).toUpperCase() : null
        const lowerMake = String(make).toLowerCase()
        const lowerModel = String(model || '').toLowerCase()
        const finalBodyType = String(bodyType || 'OTHER')
        const finalTruckSize = String(truckSize || 'OTHER')

        let finalSlug = slug || slugify(`${make}-${model || 'vehicle'}-${year || '2020'}`, { lower: true })
        
        // Check for duplicate slug
        if (existingSlugs.has(finalSlug)) {
          let counter = 1
          while (existingSlugs.has(`${finalSlug}-${counter}`)) {
            counter++
          }
          finalSlug = `${finalSlug}-${counter}`
        }
        existingSlugs.add(finalSlug)

        let parsedImages: { url: string; fileId: string }[] = []
        console.log('[IMPORT] images value:', JSON.stringify(images), 'type:', typeof images)
        if (images && typeof images === 'string' && images.trim().length > 0) {
          const urls = String(images).split(/\|/).filter(url => url.trim())
          console.log('[IMPORT] split URLs:', urls)
          parsedImages = urls.map((url, index) => ({
            url: url.trim(),
            fileId: `import-${Date.now()}-${index}`,
          }))
        } else if (Array.isArray(images) && images.length > 0) {
          parsedImages = images
        }

        console.log('[IMPORT] Parsed images:', parsedImages)

        await prisma.inventory.create({
          data: {
            name: String(name),
            make: lowerMake,
            model: lowerModel,
            year: parsedYear,
            registrationNo: registrationNo ? String(registrationNo) : null,
            vatPrice: parsedVatPrice,
            pricenoVat: parsedPricenoVat,
            mileage: parsedMileage,
            fuelType: upperFuelType,
            condition: upperCondition,
            transmission: upperTransmission,
            images: parsedImages as any,
            videoLink: video ? String(video) : null,
            description: description ? String(description) : '',
            bodyType: finalBodyType,
            truckSize: finalTruckSize,
            slug: finalSlug,
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
    const message = error instanceof Error ? error.message : String(error)
    return NextResponse.json(
      { error: 'Failed to import vehicles', details: message },
      { status: 500 }
    )
  }
}