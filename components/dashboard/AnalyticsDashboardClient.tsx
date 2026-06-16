'use client'

import dynamic from 'next/dynamic'

const AnalyticsDashboard = dynamic(
  () => import('@/components/global/AnalyticsDashboard').then((m) => ({ default: m.AnalyticsDashboard })),
  {
    ssr: false,
    loading: () => <div className="p-8 text-center text-gray-500">Loading analytics...</div>,
  }
)

export function AnalyticsDashboardClient() {
  return <AnalyticsDashboard />
}
