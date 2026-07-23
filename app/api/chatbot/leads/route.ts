import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import {
  getLeads,
  createLead,
} from '@/lib/services/lead-management'
import { getClientIp, rateLimit, rateLimitResponse } from '@/lib/rate-limit'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '20')

    const result = await getLeads({ search, status, page, pageSize })
    return Response.json(result)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch leads'
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)
    const limit = rateLimit(`chatbot-leads:${ip}`, 5, 60 * 1000)
    if (!limit.ok) {
      return rateLimitResponse(limit.retryAfterSeconds)
    }

    const body = await req.json()
    const { name, phone, email, interestedVehicle, vehicleId, message } = body

    if (!name || !phone) {
      return Response.json(
        { error: 'Name and phone are required' },
        { status: 400 },
      )
    }

    const lead = await createLead({
      name,
      phone,
      email,
      interestedVehicle,
      vehicleId,
      message,
    })

    return Response.json({ success: true, lead }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create lead'
    return Response.json({ error: message }, { status: 500 })
  }
}
