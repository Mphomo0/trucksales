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
  AlertCircle,
  Cpu,
  ChevronDown,
  ChevronUp,
  Activity,
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
  aiHealth: {
    status: 'healthy' | 'degraded' | 'down'
    configuredModel: string | null
    fallbackModels: string[]
    errorsLast15m: number
    errorsLast1h: number
    errorsLast24h: number
    rateLimitCount24h: number
    errorsByModel: { model: string; count24h: number; lastErrorAt: string | null }[]
    lastError: {
      model: string
      errorType: string
      message: string
      createdAt: string
    } | null
    lastSuccessfulAt: string | null
  }
}

const STATUS_STYLES: Record<
  'healthy' | 'degraded' | 'down',
  { dot: string; pill: string; label: string }
> = {
  healthy: {
    dot: 'bg-green-500',
    pill: 'bg-green-100 text-green-700',
    label: 'Healthy',
  },
  degraded: {
    dot: 'bg-amber-500',
    pill: 'bg-amber-100 text-amber-700',
    label: 'Degraded',
  },
  down: {
    dot: 'bg-red-500',
    pill: 'bg-red-100 text-red-700',
    label: 'Down',
  },
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleString('en-ZA', {
    timeZone: 'Africa/Johannesburg',
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export default function ChatbotDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isIndexing, setIsIndexing] = useState(false)
  const [isCleaning, setIsCleaning] = useState(false)
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false)
  const [showFallbacks, setShowFallbacks] = useState(false)
  const [lastFetchedAt, setLastFetchedAt] = useState<Date | null>(null)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const fetchStats = useCallback(async (showSpinner = false) => {
    if (showSpinner) setIsRefreshingHealth(true)
    try {
      const res = await fetch('/api/chatbot/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
        setLastFetchedAt(new Date())
      }
    } catch {
      // ignore
    }
    setIsLoading(false)
    setIsRefreshingHealth(false)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStats()
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') fetchStats()
    }, 60_000)
    return () => clearInterval(id)
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
          text: `Cleanup done: ${data.messagesDeleted} messages, ${data.sessionsDeleted} sessions, ${data.leadsDeleted} leads, ${data.logsDeleted} indexing logs, ${data.errorsDeleted} AI errors deleted`,
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

  const health = stats?.aiHealth
  const healthStyle = health ? STATUS_STYLES[health.status] : null

  return (
    <div className="dashboard-main">
      <div className="dash-page-header">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="dash-page-title">
              Chatbot <span>Dashboard</span>
            </h1>
            {healthStyle && health && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-xs font-semibold shadow-sm ring-1 ring-gray-200"
                title={
                  health.lastError
                    ? `Last error: ${health.lastError.errorType} on ${health.lastError.model} — ${health.lastError.message}`
                    : 'No recent errors'
                }
              >
                <span
                  className={`inline-block h-2 w-2 rounded-full ${healthStyle.dot} ${health.status === 'degraded' || health.status === 'down' ? 'animate-pulse' : ''}`}
                />
                <span className="text-gray-700">AI: {healthStyle.label}</span>
              </span>
            )}
          </div>
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
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-gray-700" />
                  <h3 className="dash-card-title">AI Model Health</h3>
                  {healthStyle && health && (
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${healthStyle.pill}`}
                    >
                      {healthStyle.label}
                    </span>
                  )}
                </div>
                <p className="dash-card-desc">
                  Rate limits, upstream errors, and fallback usage
                  {lastFetchedAt && (
                    <span className="ml-2 text-gray-400">
                      · updated {lastFetchedAt.toLocaleTimeString('en-ZA')}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => fetchStats(true)}
                disabled={isRefreshingHealth}
                className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-gray-300 px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
              >
                <RefreshCw
                  size={12}
                  className={isRefreshingHealth ? 'animate-spin' : ''}
                />
                Refresh
              </button>
            </div>

            {!health ? null : (
              <div className="mt-4 space-y-5">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <div className="text-xs font-medium text-gray-500">Errors (15m)</div>
                    <div className="mt-1 text-xl font-semibold text-gray-900">
                      {health.errorsLast15m}
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <div className="text-xs font-medium text-gray-500">Errors (1h)</div>
                    <div className="mt-1 text-xl font-semibold text-gray-900">
                      {health.errorsLast1h}
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <div className="text-xs font-medium text-gray-500">Errors (24h)</div>
                    <div className="mt-1 text-xl font-semibold text-gray-900">
                      {health.errorsLast24h}
                    </div>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <div className="text-xs font-medium text-gray-500">Rate Limits (24h)</div>
                    <div
                      className={`mt-1 text-xl font-semibold ${health.rateLimitCount24h > 0 ? 'text-amber-600' : 'text-gray-900'}`}
                    >
                      {health.rateLimitCount24h}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                      <Cpu size={13} /> Configured Model
                    </div>
                    <div className="mt-1 text-sm font-mono text-gray-900">
                      {health.configuredModel || '—'}
                    </div>
                    <button
                      onClick={() => setShowFallbacks((v) => !v)}
                      className="mt-2 inline-flex cursor-pointer items-center gap-1 text-xs font-semibold text-gray-600 hover:text-gray-900"
                    >
                      {showFallbacks ? (
                        <>
                          <ChevronUp size={12} /> Hide fallbacks
                        </>
                      ) : (
                        <>
                          <ChevronDown size={12} /> Show {health.fallbackModels.length} fallbacks
                        </>
                      )}
                    </button>
                    {showFallbacks && (
                      <ul className="mt-2 space-y-1 rounded-md bg-gray-50 p-2 text-xs font-mono text-gray-700">
                        {health.fallbackModels.map((m) => (
                          <li key={m}>{m}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="rounded-lg border border-gray-200 bg-white p-3">
                    <div className="text-xs font-medium text-gray-500">Last successful reply</div>
                    <div className="mt-1 text-sm font-semibold text-gray-900">
                      {health.lastSuccessfulAt ? formatDate(health.lastSuccessfulAt) : 'No replies yet'}
                    </div>
                    {health.lastError && (
                      <div className="mt-3 rounded-md border border-red-200 bg-red-50 p-2">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-red-700">
                          <AlertCircle size={12} />
                          Last error · {health.lastError.errorType}
                        </div>
                        <div className="mt-0.5 text-xs text-red-700">
                          {health.lastError.model} · {formatDate(health.lastError.createdAt)}
                        </div>
                        <div
                          className="mt-1 truncate text-xs text-red-600"
                          title={health.lastError.message}
                        >
                          {health.lastError.message}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div className="mb-2 text-xs font-medium text-gray-500">
                    Errors by model (24h)
                  </div>
                  {health.errorsByModel.length === 0 ? (
                    <p className="rounded-md border border-dashed border-gray-200 bg-gray-50 px-3 py-3 text-xs text-gray-500">
                      No errors in the last 24 hours.
                    </p>
                  ) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                              Model
                            </th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">
                              Errors
                            </th>
                            <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">
                              Last error
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {health.errorsByModel.map((row) => (
                            <tr key={row.model}>
                              <td className="px-3 py-2 font-mono text-xs text-gray-800">
                                {row.model}
                              </td>
                              <td className="px-3 py-2 text-right text-xs font-semibold text-gray-900">
                                {row.count24h}
                              </td>
                              <td className="px-3 py-2 text-right text-xs text-gray-500">
                                {row.lastErrorAt ? formatDate(row.lastErrorAt) : '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
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
                  Remove expired chat sessions, messages, leads, indexing logs (90d), and AI error logs (30d). Runs daily.
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
