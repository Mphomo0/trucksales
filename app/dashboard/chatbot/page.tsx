'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Database,
  MessageSquare,
  Users,
  FileText,
  RefreshCw,
  Trash2,
  ExternalLink,
  Clock,
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Stats {
  indexingStatus: {
    status: string
    startedAt: string
    finishedAt: string | null
    pagesIndexed: number | null
    chunksCreated: number | null
    chunksUpdated: number | null
    chunksDeleted: number | null
    chunksSkipped: number | null
    error: string | null
  } | null
  contentStats: {
    totalChunks: number
    inventoryChunks: number
    websiteChunks: number
  }
  totalSessions: number
  totalMessages: number
  totalLeads: number
}

export default function ChatbotDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isIndexing, setIsIndexing] = useState(false)
  const [isCleaning, setIsCleaning] = useState(false)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/chatbot/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch {
      // ignore
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  const handleIndex = useCallback(
    async (type: 'website' | 'inventory' | 'all') => {
      setIsIndexing(true)
      setMessage(null)

      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 120000)

      try {
        const res = await fetch('/api/chatbot/index', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type }),
          signal: controller.signal,
        })
        const data = await res.json()
        if (res.ok) {
          setMessage({ type: 'success', text: 'Indexing completed successfully' })
          fetchStats()
        } else {
          setMessage({ type: 'error', text: data.error || 'Indexing failed' })
        }
      } catch {
        setMessage({ type: 'error', text: 'Indexing timed out or failed. Try re-indexing inventory only.' })
      } finally {
        clearTimeout(timeout)
        setIsIndexing(false)
      }
    },
    [fetchStats],
  )

  const handleCleanup = useCallback(async () => {
    setIsCleaning(true)
    setMessage(null)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 30000)

    try {
      const res = await fetch('/api/chatbot/cleanup', {
        method: 'POST',
        signal: controller.signal,
      })
      const data = await res.json()
      if (res.ok) {
        setMessage({
          type: 'success',
          text: `Cleanup done: ${data.messagesDeleted} messages, ${data.sessionsDeleted} sessions, ${data.leadsDeleted} leads, ${data.logsDeleted} logs deleted`,
        })
        fetchStats()
      } else {
        setMessage({ type: 'error', text: data.error || 'Cleanup failed' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Cleanup timed out or failed' })
    } finally {
      clearTimeout(timeout)
      setIsCleaning(false)
    }
  }, [fetchStats])

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleString('en-ZA', {
      timeZone: 'Africa/Johannesburg',
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  return (
    <div className="dashboard-main">
      <div className="dash-page-header">
        <div>
          <h1 className="dash-page-title">
            Chatbot <span>Dashboard</span>
          </h1>
          <p className="dash-page-subtitle">
            Manage your AI chatbot, content indexing, and leads
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleIndex('all')}
            disabled={isIndexing}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#0f1117] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
          >
            <RefreshCw size={15} className={isIndexing ? 'animate-spin' : ''} />
            {isIndexing ? 'Indexing...' : 'Re-index All'}
          </button>
          <button
            onClick={() => router.push('/dashboard/chatbot/leads')}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            <ExternalLink size={15} />
            View Leads
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

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <RefreshCw size={24} className="animate-spin" />
        </div>
      ) : (
        <>
          <div className="dash-stat-grid">
            <div className="dash-stat-card">
              <div
                className="dash-stat-icon-wrap"
                style={{ background: 'rgba(245,184,0,0.12)' }}
              >
                <Database size={20} style={{ color: '#f5b800' }} />
              </div>
              <span className="dash-stat-label">Total Content Chunks</span>
              <span className="dash-stat-value">
                {stats?.contentStats.totalChunks ?? 0}
              </span>
            </div>
            <div className="dash-stat-card">
              <div
                className="dash-stat-icon-wrap"
                style={{ background: 'rgba(59,130,246,0.12)' }}
              >
                <FileText size={20} style={{ color: '#3b82f6' }} />
              </div>
              <span className="dash-stat-label">Inventory Chunks</span>
              <span className="dash-stat-value">
                {stats?.contentStats.inventoryChunks ?? 0}
              </span>
            </div>
            <div className="dash-stat-card">
              <div
                className="dash-stat-icon-wrap"
                style={{ background: 'rgba(16,185,129,0.12)' }}
              >
                <MessageSquare size={20} style={{ color: '#10b981' }} />
              </div>
              <span className="dash-stat-label">Chat Sessions</span>
              <span className="dash-stat-value">
                {stats?.totalSessions ?? 0}
              </span>
            </div>
            <div className="dash-stat-card">
              <div
                className="dash-stat-icon-wrap"
                style={{ background: 'rgba(139,92,246,0.12)' }}
              >
                <MessageSquare size={20} style={{ color: '#8b5cf6' }} />
              </div>
              <span className="dash-stat-label">Total Messages</span>
              <span className="dash-stat-value">
                {stats?.totalMessages ?? 0}
              </span>
            </div>
            <div className="dash-stat-card">
              <div
                className="dash-stat-icon-wrap"
                style={{ background: 'rgba(245,184,0,0.12)' }}
              >
                <Users size={20} style={{ color: '#f5b800' }} />
              </div>
              <span className="dash-stat-label">Total Leads</span>
              <span className="dash-stat-value">
                {stats?.totalLeads ?? 0}
              </span>
            </div>
          </div>

          <div className="dash-card mb-6">
            <h3 className="dash-card-title">Indexing Status</h3>
            <p className="dash-card-desc">Last content indexing run</p>

            {stats?.indexingStatus ? (
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      stats.indexingStatus.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : stats.indexingStatus.status === 'running'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {stats.indexingStatus.status}
                  </span>
                  <span className="text-gray-500">
                    Started: {formatDate(stats.indexingStatus.startedAt)}
                  </span>
                  {stats.indexingStatus.finishedAt && (
                    <span className="text-gray-500">
                      Finished: {formatDate(stats.indexingStatus.finishedAt)}
                    </span>
                  )}
                </div>
                {stats.indexingStatus.pagesIndexed !== null && (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <span className="text-gray-500">Pages Indexed:</span>{' '}
                      <span className="font-semibold">
                        {stats.indexingStatus.pagesIndexed}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Created:</span>{' '}
                      <span className="font-semibold">
                        {stats.indexingStatus.chunksCreated ?? 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Deleted:</span>{' '}
                      <span className="font-semibold">
                        {stats.indexingStatus.chunksDeleted ?? 0}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">Skipped:</span>{' '}
                      <span className="font-semibold">
                        {stats.indexingStatus.chunksSkipped ?? 0}
                      </span>
                    </div>
                  </div>
                )}
                {stats.indexingStatus.error && (
                  <p className="text-red-600">
                    Error: {stats.indexingStatus.error}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                No indexing has been run yet
              </p>
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleIndex('website')}
                disabled={isIndexing}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw size={12} /> Re-index Website
              </button>
              <button
                onClick={() => handleIndex('inventory')}
                disabled={isIndexing}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw size={12} /> Re-index Inventory
              </button>
            </div>
          </div>

          <div className="dash-card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="dash-card-title">Data Cleanup</h3>
                <p className="dash-card-desc">
                  Remove expired chat sessions, messages, and leads (runs daily)
                </p>
              </div>
              <button
                onClick={handleCleanup}
                disabled={isCleaning}
                className="flex cursor-pointer items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
              >
                <Trash2 size={15} className={isCleaning ? 'animate-spin' : ''} />
                {isCleaning ? 'Cleaning...' : 'Run Cleanup'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
