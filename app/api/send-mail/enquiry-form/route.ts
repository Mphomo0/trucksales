import { sendMail } from '@/lib/email'
import { NextRequest } from 'next/server'

function validateMessageQuality(message: string) {
  const trimmed = message?.trim() || ''
  if (trimmed.length === 0) {
    return { valid: false, message: 'Message is required' }
  }
  const wordCount = trimmed.split(/\s+/).filter(w => w.length > 0).length
  if (wordCount < 3) {
    return { valid: false, message: 'Message must contain at least 3 words' }
  }
  if (/^[0-9\s]+$/.test(trimmed)) {
    return { valid: false, message: 'Message cannot be only numbers' }
  }
  const nonWordChars = trimmed.replace(/[\w\s]/g, '').length
  if (trimmed.length > 0 && nonWordChars / trimmed.length > 0.3) {
    return { valid: false, message: 'Message contains too many special characters' }
  }
  return { valid: true }
}

const disposableDomains = [
  'tempmail.com', 'throwaway.email', '10minutemail.com', 'guerrillamail.com',
  'mailinator.com', 'getnada.com', 'fakeinbox.com', 'yopmail.com',
  'trashmail.com', 'dispostable.com', 'mintemail.com', 'sharklasers.com'
]

function validateEmailQuality(email: string) {
  const domain = email?.split('@')[1]?.toLowerCase()
  if (domain && disposableDomains.some(d => domain.includes(d))) {
    return { valid: false, message: 'Please use a permanent email address' }
  }
  return { valid: true }
}

// Handle POST requests (i.e., form submissions)
export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body as JSON
    const body = await req.json()

    // Destructure the expected contact form fields
    const { name, email, phone, message, captchaAnswer, captchaExpected } = body

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return new Response(
        JSON.stringify({ message: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Server-side CAPTCHA validation
    if (captchaAnswer !== captchaExpected) {
      return new Response(
        JSON.stringify({ message: 'Incorrect CAPTCHA answer. Please try again.' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Server-side message quality validation
    const messageQuality = validateMessageQuality(message)
    if (!messageQuality.valid) {
      return new Response(
        JSON.stringify({ message: messageQuality.message }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Server-side email quality validation
    const emailQuality = validateEmailQuality(email)
    if (!emailQuality.valid) {
      return new Response(
        JSON.stringify({ message: emailQuality.message }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Create professional HTML email template
    const subject = 'New Vehicle Enquiry Form Submission'
    const html = `
          <h3>Enquiry Form</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Contact Number:</strong> ${phone}</p>
          <p><strong>Message:</strong> ${message}</p>
        `

    // Ensure sendMail accepts the correct parameters
    await sendMail({ subject, html })

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Failed to send email:', error)
    return new Response(
      JSON.stringify({
        message: 'Failed to send email. Please try again later.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}

// Handle GET requests — not allowed for this endpoint
export function GET() {
  return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  })
}
