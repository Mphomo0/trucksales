import { sendMail } from '@/lib/email'
import { NextRequest } from 'next/server'

// Handle POST requests (i.e., form submissions)
export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body as JSON
    const body = await req.json()

    // Destructure the expected contact form fields
    const { name, email, phone, message } = body

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
