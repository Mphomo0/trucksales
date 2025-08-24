import { sendMail } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'
import { Readable } from 'stream'
import { ReadableStream } from 'stream/web'

// File size limit (10MB per file)
const MAX_FILE_SIZE = 10 * 1024 * 1024
// Total files limit
const MAX_FILES = 10

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // Extract all form fields
    const firstName = formData.get('firstName')?.toString() || ''
    const lastName = formData.get('lastName')?.toString() || ''
    const email = formData.get('email')?.toString() || ''
    const phone = formData.get('phone')?.toString() || ''
    const preferredContact = formData.get('preferredContact')?.toString() || ''
    const timeframe = formData.get('timeframe')?.toString() || ''
    const year = formData.get('year')?.toString() || ''
    const make = formData.get('make')?.toString() || ''
    const model = formData.get('model')?.toString() || ''
    const mileage = formData.get('mileage')?.toString() || ''
    const condition = formData.get('condition')?.toString() || ''
    const vin = formData.get('vin')?.toString() || ''
    const comments = formData.get('comments')?.toString() || ''

    // Validate required fields
    if (!firstName || !lastName || !email || !phone) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Multiple files (e.g. images)
    const tradeImages = formData.getAll('tradeImages') as File[]

    // Validate files
    if (tradeImages.length === 0) {
      return NextResponse.json(
        { message: 'At least one image is required' },
        { status: 400 }
      )
    }

    if (tradeImages.length > MAX_FILES) {
      return NextResponse.json(
        { message: `Maximum ${MAX_FILES} files allowed` },
        { status: 400 }
      )
    }

    // Validate file sizes and types
    for (const file of tradeImages) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { message: `File ${file.name} exceeds 10MB limit` },
          { status: 400 }
        )
      }

      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { message: `File ${file.name} is not an image` },
          { status: 400 }
        )
      }
    }

    // Convert each file stream to Buffer
    const attachments = await Promise.all(
      tradeImages.map(async (file) => {
        try {
          const stream = Readable.fromWeb(file.stream() as ReadableStream)
          const chunks: Uint8Array[] = []

          for await (const chunk of stream) {
            chunks.push(chunk)
          }

          return {
            filename: file.name,
            content: Buffer.concat(chunks),
            contentType: file.type,
          }
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error)
          throw new Error(`Failed to process file ${file.name}`)
        }
      })
    )

    // Send email
    try {
      await sendMail({
        subject: 'New Sell Your Truck/Trade-In Form Submission',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
              Trade-In Form Submission
            </h2>
            
            <h3 style="color: #555; margin-top: 30px;">Contact Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold;">Name:</td><td>${firstName} ${lastName}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${email}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>${phone}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Preferred Contact:</td><td>${preferredContact}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Purchase Timeframe:</td><td>${timeframe}</td></tr>
            </table>

            <h3 style="color: #555; margin-top: 30px;">Vehicle Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px 0; font-weight: bold;">Year:</td><td>${year}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Make:</td><td>${make}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Model:</td><td>${model}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Mileage:</td><td>${mileage}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">Condition:</td><td>${condition}</td></tr>
              <tr><td style="padding: 8px 0; font-weight: bold;">VIN:</td><td>${
                vin || 'Not provided'
              }</td></tr>
            </table>

            ${
              comments
                ? `
              <h3 style="color: #555; margin-top: 30px;">Additional Comments</h3>
              <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
                ${comments.replace(/\n/g, '<br>')}
              </div>
            `
                : ''
            }

            <div style="margin-top: 30px; padding: 15px; background: #e9ecef; border-radius: 5px;">
              <strong>Attached Images:</strong> ${tradeImages.length} file(s)
            </div>

            <div style="margin-top: 30px; font-size: 12px; color: #666; text-align: center;">
              This email was sent from the trade-in form on your website.
            </div>
          </div>
        `,
        attachments,
      })
    } catch (emailError) {
      console.error('Error sending email:', emailError)
      return NextResponse.json(
        { message: 'Failed to send email. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        message:
          'Trade-in form submitted successfully! We will contact you soon.',
        submittedAt: new Date().toISOString(),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error processing trade-in form:', error)
    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : 'Server error while processing form',
      },
      { status: 500 }
    )
  }
}
