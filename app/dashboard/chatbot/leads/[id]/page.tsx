'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Mail, Trash2, RefreshCw, Phone, Mail as MailIcon, Calendar, Truck, MessageSquare } from 'lucide-react'

interface Lead {
  id: string
  name: string
  phone: string
  email: string | null
  interestedVehicle: string | null
  vehicleId: string | null
  message: string | null
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'CLOSED'
  source: string
  emailSent: boolean
  emailError: string | null
  createdAt: string
  updatedAt: string
}

const STATUS_OPTIONS = ['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED'] as const

export default function LeadDetail() {
  const params = useParams()
  const router = useRouter()
  const [lead, setLead] = useState<Lead | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const fetchLead = useCallback(async () => {
    try {
      const res = await fetch(`/api/chatbot/leads/${params.id}`)
      if (res.ok) {
        setLead(await res.json())
      } else {
        router.push('/dashboard/chatbot/leads')
      }
    } catch {
      router.push('/dashboard/chatbot/leads')
    }
    setIsLoading(false)
  }, [params.id, router])

  useEffect(() => {
    fetchLead()
  }, [fetchLead])

  const handleStatusUpdate = useCallback(
    async (status: string) => {
      setIsUpdating(true)
      setMessage(null)
      try {
        const res = await fetch(`/api/chatbot/leads/${params.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        })
        if (res.ok) {
          const data = await res.json()
          setLead(data.lead)
          setMessage({ type: 'success', text: `Status updated to ${status}` })
        } else {
          setMessage({ type: 'error', text: 'Failed to update status' })
        }
      } catch {
        setMessage({ type: 'error', text: 'Failed to update status' })
      }
      setIsUpdating(false)
    },
    [params.id],
  )

  const handleResendEmail = useCallback(async () => {
    setIsUpdating(true)
    setMessage(null)
    try {
      const res = await fetch(`/api/chatbot/leads/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'resend-email' }),
      })
      if (res.ok) {
        const data = await res.json()
        setLead(data.lead)
        setMessage({ type: 'success', text: 'Email resent successfully' })
      } else {
        setMessage({ type: 'error', text: 'Failed to resend email' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to resend email' })
    }
    setIsUpdating(false)
  }, [params.id])

  const handleDelete = useCallback(async () => {
    if (!confirm('Are you sure you want to delete this lead?')) return

    setIsUpdating(true)
    try {
      const res = await fetch(`/api/chatbot/leads/${params.id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        router.push('/dashboard/chatbot/leads')
      } else {
        setMessage({ type: 'error', text: 'Failed to delete lead' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to delete lead' })
    }
    setIsUpdating(false)
  }, [params.id, router])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-ZA', {
      timeZone: 'Africa/Johannesburg',
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  const STATUS_COLORS: Record<string, string> = {
    NEW: 'bg-blue-100 text-blue-700',
    CONTACTED: 'bg-yellow-100 text-yellow-700',
    QUALIFIED: 'bg-green-100 text-green-700',
    CLOSED: 'bg-gray-100 text-gray-600',
  }

  if (isLoading) {
    return (
      <div className="dashboard-main">
        <div className="flex items-center justify-center py-20 text-gray-400">
          <RefreshCw size={24} className="animate-spin" />
        </div>
      </div>
    )
  }

  if (!lead) return null

  return (
    <div className="dashboard-main">
      <button
        onClick={() => router.push('/dashboard/chatbot/leads')}
        className="mb-6 flex cursor-pointer items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
      >
        <ArrowLeft size={16} />
        Back to Leads
      </button>

      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">
            {lead.name} <span>Lead</span>
          </h1>
          <p className="dash-page-subtitle">
            Lead from {formatDate(lead.createdAt)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleResendEmail}
            disabled={isUpdating}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
          >
            <Mail size={15} />
            Resend Email
          </button>
          <button
            onClick={handleDelete}
            disabled={isUpdating}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
          >
            <Trash2 size={15} />
            Delete
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-xl px-5 py-3 text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-600'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lead Info */}
        <div className="dash-card lg:col-span-2">
          <h3 className="dash-card-title">Lead Information</h3>
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <Phone size={18} className="text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-medium text-gray-900">{lead.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                <Phone size={18} className="text-gray-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">{lead.phone}</p>
              </div>
            </div>
            {lead.email && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <MailIcon size={18} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{lead.email}</p>
                </div>
              </div>
            )}
            {lead.interestedVehicle && (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <Truck size={18} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Interested Vehicle</p>
                  <p className="font-medium text-gray-900">
                    {lead.interestedVehicle}
                  </p>
                </div>
              </div>
            )}
            {lead.message && (
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                  <MessageSquare size={18} className="text-gray-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Message</p>
                  <p className="text-gray-900">{lead.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status & Actions */}
        <div className="space-y-6">
          <div className="dash-card">
            <h3 className="dash-card-title">Status</h3>
            <div className="mt-3">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                  STATUS_COLORS[lead.status]
                }`}
              >
                {lead.status}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusUpdate(status)}
                  disabled={isUpdating || lead.status === status}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors disabled:opacity-50 ${
                    lead.status === status
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                  }`}
                >
                  {status === 'NEW' && 'Mark as New'}
                  {status === 'CONTACTED' && 'Mark Contacted'}
                  {status === 'QUALIFIED' && 'Mark Qualified'}
                  {status === 'CLOSED' && 'Mark Closed'}
                </button>
              ))}
            </div>
          </div>

          <div className="dash-card">
            <h3 className="dash-card-title">Email Status</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Sent</span>
                <span
                  className={
                    lead.emailSent ? 'text-green-600' : 'text-gray-400'
                  }
                >
                  {lead.emailSent ? 'Yes' : 'No'}
                </span>
              </div>
              {lead.emailError && (
                <div>
                  <span className="text-gray-500">Error:</span>
                  <p className="mt-1 text-red-600">{lead.emailError}</p>
                </div>
              )}
            </div>
          </div>

          <div className="dash-card">
            <h3 className="dash-card-title">Timeline</h3>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar size={14} />
                <span>Created: {formatDate(lead.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar size={14} />
                <span>Updated: {formatDate(lead.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
