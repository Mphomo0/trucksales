import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import {
  getLeadById,
  updateLeadStatus,
  deleteLead,
  resendLeadEmail,
} from '@/lib/services/lead-management'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth()
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const lead = await getLeadById(id)

    if (!lead) {
      return Response.json({ error: 'Lead not found' }, { status: 404 })
    }

    return Response.json(lead)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch lead'
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth()
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { status, action } = body

    if (action === 'resend-email') {
      const lead = await resendLeadEmail(id)
      return Response.json({ success: true, lead })
    }

    if (
      status &&
      ['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED'].includes(status)
    ) {
      const lead = await updateLeadStatus(id, status)
      return Response.json({ success: true, lead })
    }

    return Response.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update lead'
    return Response.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth()
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    await deleteLead(id)
    return Response.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete lead'
    return Response.json({ error: message }, { status: 500 })
  }
}
