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
    const { name, email, phone, subject, branch, message, captchaAnswer, captchaExpected } = body

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
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
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Contact Form Submission</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; }
            .message-box { background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>New Contact Form Submission</h2>
              <p>You have received a new message through your website contact form.</p>
            </div>
            
            <div class="field">
              <div class="label">Name:</div>
              <div class="value">${name}</div>
            </div>
            
            <div class="field">
              <div class="label">Email:</div>
              <div class="value"><a href="mailto:${email}">${email}</a></div>
            </div>
            
            ${
              phone
                ? `
            <div class="field">
              <div class="label">Phone:</div>
              <div class="value">${phone}</div>
            </div>
            `
                : ''
            }
            
            <div class="field">
              <div class="label">Subject:</div>
              <div class="value">${subject}</div>
            </div>
            
            ${
              branch
                ? `
            <div class="field">
              <div class="label">Selected Branch:</div>
              <div class="value">${branch}</div>
            </div>
            `
                : ''
            }
            
            <div class="field">
              <div class="label">Message:</div>
              <div class="message-box">${message.replace(/\n/g, '<br>')}</div>
            </div>
            
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
              This email was sent from your website contact form on ${new Date().toLocaleString()}.
            </p>
          </div>
        </body>
      </html>
    `

    await sendMail({
      subject: `Contact Form: ${subject}`,
      html,
    })

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
