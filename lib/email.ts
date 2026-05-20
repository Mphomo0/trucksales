import nodemailer from 'nodemailer'
import { Attachment } from 'nodemailer/lib/mailer'

// Define the expected input for sending an email
interface SendMailParams {
  subject: string
  html: string
  to?: string
  attachments?: Attachment[]
}

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// Send the email
export async function sendMail({
  subject,
  html,
  to = process.env.SMTP_USER, // default recipient
  attachments = [],
}: SendMailParams) {
  // Validate credentials are provided
  if (
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    !process.env.SMTP_HOST ||
    !process.env.SMTP_PORT
  ) {
    throw new Error('Missing SMTP configuration in environment variables')
  }

  try {
    const info = await transporter.sendMail({
      from: `"Website Form" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      attachments,
    })

    
    return info
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
